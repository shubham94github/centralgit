import {
  ATTACH_PAYMENT_METHOD,
  CHECK_EMAIL,
  CLEAR_EMAIL_FOR_SIGN_UP,
  CLEAR_UPLOADED_DOCUMENTS,
  DETACH_PAYMENT_METHOD,
  GET_ALL_CARDS_INFO,
  GET_CARD_INFO,
  GET_CATEGORIES,
  GET_PROFILE,
  HANDLE_LOG_OUT,
  HANDLE_SIGN_IN,
  HANDLE_SIGN_UP,
  HANDLE_UPLOAD_COMPANY_LOGO,
  HANDLE_UPLOAD_DOCUMENTS,
  HANDLE_UPLOAD_LOGO,
  REMOVE_COMPANY_FILE,
  RESEND_VERIFICATION,
  RETRY_PAYMENT,
  SAVE_PAYMENT_PLAN,
  SEND_ACCOUNT_INFO,
  SEND_AREAS_OF_INTEREST,
  SEND_BILLING_INFO,
  SEND_COMPANY_INFO,
  SEND_RELATED_TAGS,
  SEND_SECTORS_OF_COMPETENCE,
  SET_EMAIL,
  SET_IS_EMAIL_EXISTS,
  SET_IS_LOADING,
  UPDATE_PAYMENT_CARD,
  VERIFY_EMAIL,
  SET_USER,
  GET_TOP_LEVEL_CATEGORIES,
  SEND_CONTACT_US,
  SET_BUSINESS_TYPE,
  SET_IS_BLOCKED_DOMAIN,
  GET_USER,
  SET_IS_MEMBER,
  GENERATE_LIST_OF_PERMISSIONS,
  SEND_DISCOUNT_CODE,
  SEND_ENTERPRISE_CODE,
  HANDLE_UPLOAD_NEW_LOGO,
  RECREATE_PAYMENT_CARD,
  SET_IS_SUBSCRIPTION_PAID_SUCCESS,
  SET_IS_SUBSCRIPTION_PAID_FAIL,
} from "./index";
import {
  signIn,
  sendGallery,
  checkIsEnabledTwoFa,
  sendNewPassword,
  checkIsEnabledTwoFaForgotPassword,
} from "@api/auth";
import { Routes } from "@routes";
import { setItemToSessionStorage } from "@utils/sessionStorage";
import { setItemToStorage } from "@utils/storage";

export const setEmailForSignUp = (email) => ({
  type: SET_EMAIL,
  payload: {
    email,
  },
});

export const clearEmailForSignUp = () => ({
  type: CLEAR_EMAIL_FOR_SIGN_UP,
});

export const setIsLoading = (isLoading) => ({
  type: SET_IS_LOADING,
  payload: { isLoading },
});

export const handleSignIn = (data, setFormError) => async (dispatch) => {
  try {
    dispatch(setIsLoading(true));

    const {
      data: { access_token: accessToken, refresh_token: refreshToken },
    } = await signIn(data);

    setItemToStorage("accessToken", accessToken, data.rememberMe);
    setItemToStorage("refreshToken", refreshToken, data.rememberMe);

    dispatch({
      type: HANDLE_SIGN_IN,
      payload: {
        accessToken,
        refreshToken,
        rememberMe: data.rememberMe,
      },
    });
  } catch (e) {
    console.log(e);
    setFormError(e.response?.data?.error_description);
  } finally {
    dispatch(setIsLoading(false));
  }
};

export const checkTwoFa =
  ({ data, history, isForgotPassword, setIsPasswordSent, setFormError }) =>
  async (dispatch) => {
    try {
      dispatch(setIsLoading(true));

      const { data: twoFaData } = await checkIsEnabledTwoFa(data);

      if (!twoFaData.isEnabled2fa) {
        if (isForgotPassword) {
          await sendNewPassword(data);

          setIsPasswordSent(true);
        } else dispatch(handleSignIn(data, setFormError));
      } else {
        if (isForgotPassword) setItemToSessionStorage("newPasswordData", data);
        else setItemToSessionStorage("signInData", data);
        setItemToSessionStorage("twoFaData", twoFaData);
        f;

        if (history) history.push(Routes.AUTH.TWO_FA);
      }
    } catch (e) {
      dispatch(setIsLoading(false));

      return e.response.data;
    }
  };

export const checkTwoFaForgotPassword =
  ({ data, history, setIsPasswordSent }) =>
  async (dispatch) => {
    try {
      dispatch(setIsLoading(true));

      const { data: twoFaData } = await checkIsEnabledTwoFaForgotPassword(data);

      if (!twoFaData.isEnabled2fa) {
        await sendNewPassword(data);

        setIsPasswordSent(true);
      } else {
        setItemToSessionStorage("newPasswordData", data);
        setItemToSessionStorage("twoFaData", twoFaData);

        history.push(Routes.AUTH.TWO_FA);
      }
    } catch (e) {
      dispatch(setIsLoading(false));

      return e.response.data;
    } finally {
      dispatch(setIsLoading(false));
    }
  };

export const signUp = (data) => ({
  type: HANDLE_SIGN_UP,
  payload: data,
});

export const checkEmail = ({ data, setError, startup = false }) => {
  return {
    type: CHECK_EMAIL,
    payload: { data, setError, startup },
  };
};

export const logOut = () => ({
  type: HANDLE_LOG_OUT,
});

export const verifyEmail = (data) => ({
  type: VERIFY_EMAIL,
  payload: data,
});

export const uploadLogo = (file) => ({
  type: HANDLE_UPLOAD_LOGO,
  payload: { file },
});

export const uploadNewLogo = (newUserLogo) => ({
  type: HANDLE_UPLOAD_NEW_LOGO,
  payload: { newUserLogo },
});

export const uploadCompanyLogo = (file) => ({
  type: HANDLE_UPLOAD_COMPANY_LOGO,
  payload: { file },
});

export const uploadDocuments = (files) => ({
  type: HANDLE_UPLOAD_DOCUMENTS,
  payload: { files },
});

export const clearDocuments = () => ({
  type: CLEAR_UPLOADED_DOCUMENTS,
});

export const sendCompanyInfo = (data) => ({
  type: SEND_COMPANY_INFO,
  payload: { data },
});

export const sendAccountInfo = (data, role) => ({
  type: SEND_ACCOUNT_INFO,
  payload: { data, role },
});

export const sendSectorsOfCompetence = (sectorsOfCompetence) => ({
  type: SEND_SECTORS_OF_COMPETENCE,
  payload: { sectorsOfCompetence },
});

export const getCategories = () => ({
  type: GET_CATEGORIES,
});

export const sendAreasOfInterest = (areasOfInterest) => ({
  type: SEND_AREAS_OF_INTEREST,
  payload: { areasOfInterest },
});

export const sendRelatedTags = (relatedTags) => ({
  type: SEND_RELATED_TAGS,
  payload: { relatedTags },
});

export const savePaymentPlan = (planData) => ({
  type: SAVE_PAYMENT_PLAN,
  payload: { ...planData },
});

export const removeCompanyFile = (fileId) => ({
  type: REMOVE_COMPANY_FILE,
  payload: { fileId },
});

export const sendBillingInfo = (billingInfo, isNeededFetchUser) => ({
  type: SEND_BILLING_INFO,
  payload: { billingInfo, isNeededFetchUser },
});

export const getProfile = (id) => ({
  type: GET_PROFILE,
  payload: { id },
});

export const resendVerification = (data) => ({
  type: RESEND_VERIFICATION,
  payload: data,
});

export const attachPaymentMethod = (
  data,
  isRedirect = true,
  isRetryPayment = false,
  stripeSubscriptionId
) => ({
  type: ATTACH_PAYMENT_METHOD,
  payload: {
    methodId: data,
    isRedirect,
    isRetryPayment,
    stripeSubscriptionId,
  },
});

export const getCardInfo = (id) => ({
  type: GET_CARD_INFO,
  payload: { id },
});

export const getAllCardsInfo = (customerId) => ({
  type: GET_ALL_CARDS_INFO,
  payload: { customerId },
});

export const retryPayment = (id) => ({
  type: RETRY_PAYMENT,
  payload: { id },
});

export const updatePaymentCard = (id) => ({
  type: UPDATE_PAYMENT_CARD,
  payload: { id },
});

export const recreatePaymentCard = (planId, paymentMethodId) => ({
  type: RECREATE_PAYMENT_CARD,
  payload: { planId, paymentMethodId },
});

export const resetEmailExistenceError = () => ({
  type: SET_IS_EMAIL_EXISTS,
  payload: { isEmailExists: null },
});

export const detachPaymentMethod = (methodId) => ({
  type: DETACH_PAYMENT_METHOD,
  payload: { methodId },
});

export const setUser = ({ user, userAvatar, companyAvatar }) => ({
  type: SET_USER,
  payload: {
    user,
    userAvatar,
    companyAvatar,
  },
});

export const generateListOfPermissions = ({ user }) => ({
  type: GENERATE_LIST_OF_PERMISSIONS,
  payload: {
    user,
  },
});

export const getTopLevelCategories = () => ({
  type: GET_TOP_LEVEL_CATEGORIES,
});

export const sendContactUs = (data) => ({
  type: SEND_CONTACT_US,
  payload: data,
});

export const setBusinessType = (businessType) => ({
  type: SET_BUSINESS_TYPE,
  payload: { businessType },
});

export const resetBlockedDomainError = () => ({
  type: SET_IS_BLOCKED_DOMAIN,
  payload: { isBlockedDomain: null },
});

export const saveGallery = (galleryData) => async (dispatch) => {
  await sendGallery(galleryData);

  dispatch({
    type: GET_USER,
  });
};

export const setIsHideStepsForMember = (isMember) => ({
  type: SET_IS_MEMBER,
  payload: { isMember },
});

export const sendDiscountCode = (discountCodeData) => ({
  type: SEND_DISCOUNT_CODE,
  payload: { discountCodeData },
});

export const sendEnterpriseCode = (enterpriseCodeData) => ({
  type: SEND_ENTERPRISE_CODE,
  payload: { enterpriseCodeData },
});

export const onSubscriptionPaidSuccess = (isSubscriptionPaid) => ({
  type: SET_IS_SUBSCRIPTION_PAID_SUCCESS,
  payload: { isSubscriptionPaid },
});

export const onSubscriptionPaidFailed = (isSubscriptionPaid) => ({
  type: SET_IS_SUBSCRIPTION_PAID_FAIL,
  payload: { isSubscriptionPaid },
});
