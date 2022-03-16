import React, { memo, useState } from 'react';
import { connect } from 'react-redux';
import { bool, func, string } from 'prop-types';
import { useLocation } from 'react-router-dom';
import { P16, P14 } from '@components/_shared/text';
import PrimaryButton from '@components/_shared/buttons/PrimaryButton';
import { Routes } from '@constants/routes';
import { resendVerification } from '@ducks/auth/actions';
import AppModal from '@components/Common/AppModal';
import ContactUs from '@components/_shared/ContactUs';
import SuccessMessage from '@components/_shared/ContactUs/SuccessMessage';
import { userType } from '@constants/types';
import { getItemFromLocalStorage } from '@utils/localStorage';
import { Icons } from '@icons';
import enums from '@constants/enums';

import './EmailVerificationProceed.scss';

const { userRoles: { member } } = enums;
const sendVerifyEmailIcon = Icons.sendVerifyEmailIcon();

const EmailVerificationProceed = ({
	resendVerification,
	emailForVerify,
	isLoading,
	user,
}) => {
	const location = useLocation();
	const isRetailer = location.pathname === Routes.AUTH.SIGN_UP.EMAIL_VERIFICATION_PROCEED_RETAIL;
	const isMember = user?.role === member;
	const [isShowContactUs, setIsShowContactUs] = useState(false);
	const [isShowSuccessMessage, setIsShowSuccessMessage] = useState(false);

	const toggleContactUsModal = () => setIsShowContactUs(prevState => !prevState);
	const toggleSuccessMessage = () => setIsShowSuccessMessage(prevState => !prevState);

	const handleResendVerification = () => {
		resendVerification({
			isRetailer,
			isMember,
			token: getItemFromLocalStorage('resendVerificationToken') || user.token,
		});
	};

	return (
		<section className='sign-up-verification-proceed-section'>
			<div className='sign-up-verification-proceed-container'>
				<div className='pb-2 d-flex justify-content-center align-items-center'>
					{sendVerifyEmailIcon}
				</div>
				<P16 className='label' bold>Verify your E-mail</P16>
				<P14 className='description'>
					We have sent an email to {emailForVerify}
					<br/>
					You need to verify your email to continue.
					<br/>
					If you have not received the verification email,
					<br/>
					please check your 'Spam' or 'Bulk' folder.
					<br/>
					<br/>
					You can also click the Resend button below to have
					<br/>
					another email sent to you.
				</P14>
				<PrimaryButton
					text='Resend Verification E-mail'
					onClick={handleResendVerification}
					disabled={isLoading}
					isLoading={isLoading}
				/>
			</div>
			{
				isShowContactUs
					&& <AppModal
						component={ContactUs}
						onClose={toggleContactUsModal}
						className='contact-as-modal'
						isCloseIcon={false}
						title='Contact us'
						outerProps={{
							toggleContactUsModal,
							toggleSuccessMessage,
						}}
					/>
			}
			{
				isShowSuccessMessage
					&& <AppModal
						component={SuccessMessage}
						onClose={toggleSuccessMessage}
						className='success-message-as-modal'
					/>
			}
		</section>
	);
};

EmailVerificationProceed.propTypes = {
	resendVerification: func.isRequired,
	emailForVerify: string,
	isLoading: bool,
	user: userType,
};

EmailVerificationProceed.defaultProps = {
	emailForVerify: '',
};

const mapStateToProps = ({ auth: { emailForSignUp, isLoading, user } }) => ({
	emailForVerify: emailForSignUp || user?.email,
	isLoading,
	user,
});

export default connect(mapStateToProps, {
	resendVerification,
})(memo(EmailVerificationProceed));
