import React, { memo, useState } from 'react';
import TextInput from '@components/_shared/form/TextInput';
import { P12 } from '@components/_shared/text';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import enums from '@constants/enums';
import { schema } from './schema';
import { isEmpty } from '@utils/js-helpers';
import PrimaryButton from '@components/_shared/buttons/PrimaryButton';
import { Routes } from '@routes';
import { NavLink } from 'react-router-dom';
import { bool, func } from 'prop-types';
import PasswordHint from '@components/Auth/SignUp/SignUpCompany/PasswordHint';
import TooltipForPassword from '@components/Auth/SignUp/TooltipForPassword';
import { confirmPasswordError, newPasswordMatchWithCurrentError } from './constant';

import './ChangePasswordModal.scss';

function ChangePasswordModal({
	handleChangePassword,
	onClose,
	isActive2Fa,
	setNewPasswords,
	showTwoFaModal,
}) {
	const {
		register,
		errors,
		watch,
		setError,
		clearErrors,
		handleSubmit,
	} = useForm({
		resolver: yupResolver(schema),
		mode: enums.validationMode.all,
		defaultValues: {
			...schema.default(),
		},
	});
	const [isPasswordFieldActive, setIsPasswordFieldActive] = useState(false);
	const newPassword = watch('newPassword');
	const confirmPassword = watch('confirmPassword');
	const currentPassword = watch('currentPassword');

	const onSubmit = values => {
		if (isActive2Fa) {
			setNewPasswords(values);
			onClose();
			showTwoFaModal({ target: { checked: true } });
		}
		else {
			handleChangePassword(values);
			onClose();
		}
	};

	const togglePasswordFieldState = isPasswordFieldActive => setIsPasswordFieldActive(isPasswordFieldActive);

	const onBlur = () => {
		togglePasswordFieldState(false);

		if (newPassword && confirmPassword && newPassword !== confirmPassword)
			setError('confirmPassword', { message: confirmPasswordError });
		else if (currentPassword && newPassword && currentPassword === newPassword)
			setError('newPassword', { message: newPasswordMatchWithCurrentError });
		else {
			clearErrors('confirmPassword');
			clearErrors('newPassword');
		}
	};

	return (
		<div className='change-password-modal'>
			<TextInput
				id='currentPassword'
				type='password'
				name='currentPassword'
				register={register({ required: true })}
				isLightTheme
				placeholder='Current Password'
				error={errors.currentPassword?.message}
				onBlur={onBlur}
			/>
			{errors.currentPassword
				&& <P12 className='warning-text'>
					{errors.currentPassword.message}&nbsp;
				</P12>
			}
			<div>
				<NavLink className='blue-link underline p14' to={Routes.AUTH.PASSWORD_RECOVERY.EMAIL_FORM}>
					Forgot password?
				</NavLink>
			</div>
			<TooltipForPassword
				placement='top'
				component={PasswordHint}
				isVisibleTooltip={!!errors.newPassword?.message && isPasswordFieldActive}
			>
				<div className='mb-15'>
					<TextInput
						id='newPassword'
						type='password'
						name='newPassword'
						register={register({ required: true })}
						isLightTheme
						placeholder='New password'
						error={errors.newPassword?.message}
						onBlur={onBlur}
						onFocus={() => togglePasswordFieldState(true)}
					/>
				</div>
			</TooltipForPassword>
			{errors.newPassword
				&& <P12 className='warning-text'>
					{errors.newPassword.message}&nbsp;
				</P12>
			}
			<TextInput
				id='confirmPassword'
				type='password'
				name='confirmPassword'
				register={register({ required: true })}
				isLightTheme
				placeholder='Confirm password'
				error={errors.confirmPassword?.message}
				onBlur={onBlur}
			/>
			{errors.confirmPassword
				&& <P12 className='warning-text'>
					{errors.confirmPassword.message}&nbsp;
				</P12>
			}
			<PrimaryButton
				onClick={handleSubmit(onSubmit)}
				isDarkTheme={false}
				text='Change password'
				disabled={!isEmpty(errors)}
				isFullWidth
			/>
		</div>
	);
}

ChangePasswordModal.propTypes = {
	handleChangePassword: func.isRequired,
	onClose: func.isRequired,
	setNewPasswords: func.isRequired,
	showTwoFaModal: func.isRequired,
	isActive2Fa: bool.isRequired,
};

export default memo(ChangePasswordModal);
