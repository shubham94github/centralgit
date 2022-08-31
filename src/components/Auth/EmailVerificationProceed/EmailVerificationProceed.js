import React, { memo, useState } from "react";
import { connect } from "react-redux";
import { bool, func, string } from "prop-types";
import { useLocation } from "react-router-dom";
import { P16, P14 } from "@components/_shared/text";
import PrimaryButton from "@components/_shared/buttons/PrimaryButton";
import { Routes } from "@constants/routes";
import { resendVerification } from "@ducks/auth/actions";
import AppModal from "@components/Common/AppModal";
import ContactUs from "@components/_shared/ContactUs";
import SuccessMessage from "@components/_shared/ContactUs/SuccessMessage";
import { userType } from "@constants/types";
import { getItemFromLocalStorage } from "@utils/localStorage";
import { Icons } from "@icons";
import enums from "@constants/enums";
import RegistrationProgressBar from "@components/_shared/RegistrationProgressBar";
import "./EmailVerificationProceed.scss";

const {
  userRoles: { member },
} = enums;
const sendVerifyEmailIcon = Icons.sendVerifyEmailIcon();

const EmailVerificationProceed = ({
  resendVerification,
  emailForVerify,
  isLoading,
  user,
}) => {
  const location = useLocation();
  const isRetailer =
    location.pathname === Routes.AUTH.SIGN_UP.EMAIL_VERIFICATION_PROCEED_RETAIL;
  const isMember = user?.role === member;
  const [isShowContactUs, setIsShowContactUs] = useState(false);
  const [isShowSuccessMessage, setIsShowSuccessMessage] = useState(false);

  const toggleContactUsModal = () =>
    setIsShowContactUs((prevState) => !prevState);
  const toggleSuccessMessage = () =>
    setIsShowSuccessMessage((prevState) => !prevState);

  const handleResendVerification = () => {
    resendVerification({
      isRetailer,
      isMember,
      token: getItemFromLocalStorage("resendVerificationToken") || user.token,
    });
  };

  return (
    <>
      <RegistrationProgressBar stepCount={3} />
      <section className="sign-up-verification-proceed-section ">
        <div className="sign-up-verification-proceed-container">
          {/* <div className='pb-2 d-flex justify-content-center align-items-center'>
					{sendVerifyEmailIcon}
				</div> */}
          <div className="verify-email_title">
            <span>Verify </span>your <span>E-mail</span>!
          </div>
          <div className="description">
            <p>
              We have sent an email to
              {` ${emailForVerify}`} You need to verify your email to continue.
              If you have not received the verification email, please check your
              'Spam' or 'Bulk' folder.
            </p>
            <p>
              You can also click the Resend button below to have another email
              sent to you.
            </p>
          </div>
          <PrimaryButton
            text="Resend Verification E-mail"
            onClick={handleResendVerification}
            disabled={isLoading}
            isLoading={isLoading}
            className="ResendBtn rounded-pill px-5"
          />
        </div>
        {isShowContactUs && (
          <AppModal
            component={ContactUs}
            onClose={toggleContactUsModal}
            className="contact-as-modal"
            isCloseIcon={false}
            title="Contact us"
            outerProps={{
              toggleContactUsModal,
              toggleSuccessMessage,
            }}
          />
        )}
        {isShowSuccessMessage && (
          <AppModal
            component={SuccessMessage}
            onClose={toggleSuccessMessage}
            className="success-message-as-modal"
          />
        )}
      </section>
    </>
  );
};

EmailVerificationProceed.propTypes = {
  resendVerification: func.isRequired,
  emailForVerify: string,
  isLoading: bool,
  user: userType,
};

EmailVerificationProceed.defaultProps = {
  emailForVerify: "",
};

const mapStateToProps = ({ auth: { emailForSignUp, isLoading, user } }) => ({
  emailForVerify: emailForSignUp || user?.email,
  isLoading,
  user,
});

export default connect(mapStateToProps, {
  resendVerification,
})(memo(EmailVerificationProceed));
