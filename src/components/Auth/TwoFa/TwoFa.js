import React, { memo } from 'react';
import TwoFAForm from '@components/_shared/TwoFAForm';
import { connect } from 'react-redux';
import { bool, func, shape, string } from 'prop-types';
import { sendNewPassword, sendTwoFaCodeToPhone, submitTwoFaCodeFromPhone } from '@api/auth';
import { checkTwoFa, handleSignIn } from '@ducks/auth/actions';
import { setSnackbar } from '@ducks/common/actions';
import { getItemFromSessionStorage } from '@utils/sessionStorage';
import { redirectToCorrectPageByStatus } from '@components/Auth/utils';
import { Redirect } from 'react-router-dom';
import { Routes } from '@routes';
import enums from '@constants/enums';

import './TwoFa.scss';

const { gettingStartedStatuses, userRoles } = enums;

export const TwoFa = ({
	handleSignIn,
	isAuthenticated,
	user,
	setSnackbar,
	checkTwoFa,
	isLoading,
}) => {
	const signInData = getItemFromSessionStorage('signInData');
	const newPasswords = getItemFromSessionStorage('newPasswordData');
	const isMember = user?.role === userRoles.member;
	const isVerified = user?.isVerified;
	const isCompletedUser = isMember ? isVerified : user?.status === gettingStartedStatuses.completedGettingStarted;
	const email = newPasswords?.email ? newPasswords?.email : signInData?.email;
	const password = signInData?.password;
	const submitCallback = newPasswords ? sendNewPassword : handleSignIn;
	const isRetailer = !!user?.retailer;

	if (!newPasswords) {
		if (!!user && !isCompletedUser)
			return redirectToCorrectPageByStatus(user);

		if (isAuthenticated && user?.status === gettingStartedStatuses.completedGettingStarted
			&& (!!user?.retailer || !!user?.member)
			&& (isRetailer
				? !user?.retailer?.stripePaymentSettings.isSubscriptionPaid
				: !user?.member?.stripePaymentSettings.isSubscriptionPaid
				&& !user?.retailer?.stripePaymentSettings.isTrial))
			return <Redirect to={Routes.SUBSCRIPTION.INDEX}/>;

		if (isAuthenticated)
			return <Redirect to={Routes.HOME}/>;
	}

	return (
		<div className='two-fa-container'>
			<div className='form-container'>
				<TwoFAForm
					email={email}
					password={password}
					sendTwoFaCodeToPhone={sendTwoFaCodeToPhone}
					submitTwoFaCodeFromPhone={submitTwoFaCodeFromPhone}
					isLogin
					submitCallback={submitCallback}
					isPasswordRecovery={!!newPasswords}
					setSnackbar={setSnackbar}
					check2Fa={checkTwoFa}
					isLoading={isLoading}
				/>
			</div>
		</div>
	);
};

TwoFa.propTypes = {
	handleSignIn: func.isRequired,
	setSnackbar: func.isRequired,
	isAuthenticated: bool.isRequired,
	isLoading: bool,
	user: shape({
		status: string,
	}),
	checkTwoFa: func.isRequired,
};

export default connect(({ auth }) => {
	const { user, isLoading } = auth;

	return {
		isAuthenticated: !!user,
		user,
		isLoading,
	};
}, {
	handleSignIn,
	setSnackbar,
	checkTwoFa,
})(memo(TwoFa));
