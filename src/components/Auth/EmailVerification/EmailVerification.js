import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { P16, P14 } from '@components/_shared/text';
import { func, bool, string } from 'prop-types';
import { useHistory, useLocation } from 'react-router-dom';
import queryString from 'query-string';
import { Routes } from '@constants/routes';
import { resendVerification, verifyEmail, logOut } from '@ducks/auth/actions';
import { connect } from 'react-redux';
import LoadingOverlay from '@components/_shared/LoadingOverlay';
import { Icons as icons, Icons } from '@icons';
import { userType } from '@constants/types';
import PrimaryButton from '@components/_shared/buttons/PrimaryButton';
import { getItemFromLocalStorage } from '@utils/localStorage';
import { getItemFromStorage } from '@utils/storage';

import './EmailVerification.scss';

const emailTickIcon = Icons.emailTickIcon();
const exclamationIcon = icons.exclamation();
const redirectDelay = 15000;
const secondDelay = 1000;

const EmailVerification = ({
	verifyEmail,
	isLoading,
	user,
	isEmailVerified,
	emailVerificationError,
	resendVerification,
	logOut,
}) => {
	const location = useLocation();
	const { search } = location;
	const isMember = location.pathname.includes('member');
	const isRetailer = location.pathname.includes('retailer');
	const history = useHistory();
	const redirectHandler = useCallback(() => {
		logOut();
		history.push(Routes.AUTH.SIGN_IN);
	}, [history, logOut]);

	const [timer, setTimer] = useState(redirectDelay / 1000);
	const intervalId = useRef(null);

	useEffect(() => {
		if (isEmailVerified && !emailVerificationError) {
			intervalId.current = setInterval(() => {
				setTimer(prevTimer => {
					if (!prevTimer) {
						clearInterval(intervalId.current);
						intervalId.current = undefined;

						redirectHandler();

						return 0;
					}

					return prevTimer - 1;
				});
			}, secondDelay);
		} else if (emailVerificationError)
			clearInterval(intervalId.current);

		return () => {
			if (intervalId?.current) clearInterval(intervalId.current);
		};
	}, [emailVerificationError, isEmailVerified, redirectHandler]);

	useEffect(() => {
		verifyEmail({
			token: queryString.parse(search).token,
			isRetailer,
			isMember,
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const handleResendVerification = () => {
		resendVerification({
			isRetailer,
			isMember,
			token: getItemFromLocalStorage('resendVerificationToken') || user.token,
		});
	};

	return (
		<section className='sign-up-verification-section'>
			<div className='sign-up-verification-container'>
				<div className='pb-2 d-flex justify-content-center align-items-center'>
					{emailVerificationError ? exclamationIcon : emailTickIcon}
				</div>
				{isEmailVerified
					? <>
						<P16 className='label' bold>Congratulations! Your account is now verified!</P16>
						<P14 className='description'>
							You may now complete your account profile and explore the full
							features of RetailHub Innovation Explorer.
							<br/>
							You will be redirected to the login page in&nbsp;
							<b className='monospace'>{timer}</b> seconds or <br/>
							<span className='blue-link link underline' onClick={redirectHandler}>click here</span>.
						</P14>
					</>
					: emailVerificationError
						? <>
							<P16 className='label' bold>
								Sorry, this link is no longer valid
							</P16>
							<PrimaryButton
								onClick={handleResendVerification}
								text='Resend Verification E-mail'
							/>
						</>
						: <>
							<P16 className='label' bold>Email verifying in progress. Please wait.</P16>
							{isLoading && <LoadingOverlay classNames='verification-loading'/>}
						</>
				}
			</div>
		</section>
	);
};

EmailVerification.propTypes = {
	verifyEmail: func.isRequired,
	isLoading: bool,
	user: userType,
	isEmailVerified: bool,
	emailVerificationError: string,
	resendVerification: func.isRequired,
	logOut: func.isRequired,
};

export default  connect(({ auth }) => {
	const {
		isLoading,
		user,
		isEmailVerified,
		emailVerificationError,
	} = auth;

	return {
		isLoading,
		user: user || getItemFromStorage('user'),
		isEmailVerified,
		emailVerificationError,
	};
}, {
	verifyEmail,
	resendVerification,
	logOut,
})(memo(EmailVerification));
