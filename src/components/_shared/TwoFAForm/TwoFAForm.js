import React, { memo, useEffect, useRef, useState } from 'react';
import { isPast } from 'date-fns';
import { P12, P16, S14 } from '@components/_shared/text';
import TextInput from '@components/_shared/form/TextInput';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import enums from '@constants/enums';
import { schema } from './schema';
import FormWrapper from '@components/_shared/form/FormWrapper';
import PrimaryButton from '@components/_shared/buttons/PrimaryButton';
import { bool, func, number, string } from 'prop-types';
import { getTimer } from '@components/_shared/TwoFAForm/utils';
import { clearSessionStorage, getItemFromSessionStorage } from '@utils/sessionStorage';
import { useHistory } from 'react-router-dom';
import { Routes } from '@routes';

import './TwoFAForm.scss';

const errorText = 'The code has expired. Resend the code.';
const minuteTimeDiff = 60000;
const secondDelay = 1000;

function TwoFAForm({
	phoneNumber,
	closeAfterSubmit,
	sendTwoFaCodeToPhone,
	submitTwoFaCodeFromPhone,
	email,
	isLogin,
	submitCallback,
	userId,
	isPasswordRecovery,
	setSnackbar,
	check2Fa,
	password,
	isLoading,
	userPhoneNumberFromDB,
}) {
	const {
		register,
		handleSubmit,
		errors,
		control,
		setValue,
		setError,
	} = useForm({
		resolver: yupResolver(schema),
		mode: enums.validationMode.onTouched,
		defaultValues: schema.default(),
	});
	const intervalId = useRef(null);
	const [time, setTime] = useState(null);
	const [timer, setTimer] = useState({ minutes: 0, seconds: 0 });
	const [userPhoneNumber, setUserPhoneNumber] = useState(phoneNumber.trim());

	const [expiredAt, setExpiredAt] = useState(0);

	const isDisableSubmit = !timer.minutes && !timer.seconds;
	const isMinuteTimer = time === minuteTimeDiff;
	const history = useHistory();

	const activateTwoFa = async () => {
		try {
			setTime(null);

			const reqData = isLogin ? { email, password } : { phoneNumber: userPhoneNumberFromDB, userId };

			let availableAtTime;
			let createdAtTime;

			if (!isLogin) {
				const  { availableAt, createdAt, expiredAt } = await sendTwoFaCodeToPhone(reqData);

				setExpiredAt(expiredAt);

				availableAtTime = availableAt;
				createdAtTime = createdAt;
			} else {
				const  { availableAt, createdAt, phoneNumber, expiredAt } = getItemFromSessionStorage('twoFaData');

				setExpiredAt(expiredAt);

				const isExpired = isPast(expiredAt);

				if (isExpired) await check2Fa({ data: reqData });

				setUserPhoneNumber(phoneNumber.trim());

				availableAtTime = availableAt;
				createdAtTime = createdAt;
			}

			const timeDiff = availableAtTime - createdAtTime;
			const minuteDuration = timeDiff / 1000 / 60;

			if (timeDiff === minuteTimeDiff) {
				setTimer({ minutes: 0, seconds: 60 });
				setTime(timeDiff);
			} else {
				setTimer({ minutes: minuteDuration, seconds: 0 });
				setTime(timeDiff);
			}
		} catch (e) {
			setError('code', { message: e.message });
		}
	};

	useEffect(() => {
		activateTwoFa();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (!time) return;

		intervalId.current = setInterval(() => {
			setTimer(prevTimer => getTimer({ prevTimer, time, intervalId }));
		}, secondDelay);

		return () => {
			clearInterval(intervalId.current);
			intervalId.current = undefined;
		};
	}, [time]);

	const trimValues = fieldName => value => setValue(fieldName, value.trim(), { shouldValidate: true });

	const onSubmit = async ({ code }) => {
		if (isPast(expiredAt)) {
			setError('code', { message: errorText });

			return;
		}

		const reqData = isLogin ? { code, email } : { code, phoneNumber, userId };

		const { isSuccess, errorCode } = await submitTwoFaCodeFromPhone(reqData);

		if (isSuccess) {
			if (!isPasswordRecovery && isLogin) submitCallback(getItemFromSessionStorage('signInData'));
			else if (isPasswordRecovery && isLogin) {
				await submitCallback(getItemFromSessionStorage('newPasswordData'));

				if (setSnackbar) {
					setSnackbar({
						type: 'info',
						text: 'Password was changed successfully',
					});
				}

				history.push(Routes.AUTH.PASSWORD_RECOVERY.PASSWORD_WAS_CHANGED);
				clearSessionStorage();
			} else submitCallback();

			if (closeAfterSubmit) closeAfterSubmit(true);
		} else if (!isSuccess) setError('code', { message: errorCode });
	};

	const timerText = `${timer.minutes < 10
		? `0${timer.minutes}`
		: timer.minutes}:${timer.seconds < 10
		? `0${timer.seconds}`
		: timer.seconds}`;

	const handleChangeCode = e => setValue('code', e.target.value.toUpperCase());

	return (
		<FormWrapper
			className='two-fa-form'
			onSubmit={onSubmit}
		>
			{isLogin && <P16 className='title'>Enter verification code</P16>}
			<S14>
				Please enter the verification code that was sent to your phone number
				<span className='bold'> ******{userPhoneNumber.slice(-3)}</span>
			</S14>
			<div className='input-container'>
				<TextInput
					type='text'
					name='code'
					placeholder='Code'
					register={register}
					isLightTheme
					isError={!!errors.code}
					control={control}
					onBlur={trimValues('code')}
					onChange={handleChangeCode}
				/>
				<P12 className='warning-text'>{errors.code && errors.code.message}</P12>
			</div>
			{isMinuteTimer
				? <S14 className='timer'>
					Resend the code in <b>{timerText}</b>
				</S14>
				: <S14 className='timer'>
					Resending the code will be available in <b>{timerText}</b>
				</S14>
			}
			<PrimaryButton
				onClick={handleSubmit(onSubmit)}
				isLoading={isLoading}
				isDarkTheme={false}
				text='Submit'
				isFullWidth
				disabled={isDisableSubmit}
			/>
			<PrimaryButton
				onClick={activateTwoFa}
				isDarkTheme={false}
				text='Resend code'
				isOutline
				isFullWidth
				disabled={!isDisableSubmit}
			/>
		</FormWrapper>
	);
}

TwoFAForm.defaultProps = {
	phoneNumber: '',
	isLogin: false,
	isPasswordRecovery: false,
	userPhoneNumberFromDB: '',
};

TwoFAForm.propTypes = {
	phoneNumber: string,
	closeAfterSubmit: func,
	sendTwoFaCodeToPhone: func.isRequired,
	submitTwoFaCodeFromPhone: func.isRequired,
	email: string,
	isLogin: bool,
	submitCallback: func.isRequired,
	setSnackbar: func,
	userId: number,
	isPasswordRecovery: bool,
	check2Fa: func,
	password: string,
	isLoading: bool,
	userPhoneNumberFromDB: string,
};

export default memo(TwoFAForm);
