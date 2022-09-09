import { all, takeEvery, takeLatest, takeLeading } from "redux-saga/effects";
import {
  ATTACH_PAYMENT_METHOD,
  CHECK_EMAIL,
  GET_ALL_CARDS_INFO,
  GET_CARD_INFO,
  GET_CATEGORIES,
  GET_PROFILE,
  GET_USER,
  HANDLE_LOG_OUT,
  HANDLE_SIGN_IN,
  HANDLE_SIGN_UP,
  HANDLE_UPLOAD_COMPANY_LOGO,
  HANDLE_UPLOAD_DOCUMENTS,
  HANDLE_UPLOAD_LOGO,
  RESEND_VERIFICATION,
  RETRY_PAYMENT,
  SAVE_PAYMENT_PLAN,
  SEND_ACCOUNT_INFO,
  SEND_AREAS_OF_INTEREST,
  SEND_BILLING_INFO,
  SEND_COMPANY_INFO,
  SEND_RELATED_TAGS,
  SEND_SECTORS_OF_COMPETENCE,
  UPDATE_PAYMENT_CARD,
  VERIFY_EMAIL,
  GET_TOP_LEVEL_CATEGORIES,
  SEND_CONTACT_US,
  DETACH_PAYMENT_METHOD,
  GENERATE_LIST_OF_PERMISSIONS,
  SEND_DISCOUNT_CODE,
  SEND_ENTERPRISE_CODE,
  HANDLE_UPLOAD_NEW_LOGO,
  RECREATE_PAYMENT_CARD,
  SET_IS_SUBSCRIPTION_PAID_SUCCESS,
  SET_IS_SUBSCRIPTION_PAID_FAIL,
} from "./index";

import {
  attachPaymentMethodWorker,
  checkEmailWorker,
  getAllCardsInfoWorker,
  getCardInfoWorker,
  getCategoriesWorker,
  getTopLevelCategoriesWorker,
  getProfileWorker,
  getUserWorker,
  handleSignInWorker,
  handleSignUpWorker,
  handleUploadCompanyLogoWorker,
  handleUploadDocumentsWorker,
  handleUploadLogoWorker,
  logOutWorker,
  resendVerificationWorker,
  retryPaymentWorker,
  savePaymentPlanWorker,
  sendAccountInfoWorker,
  sendAreasOfInterestWorker,
  sendBillingInfoWorker,
  sendCompanyInfoWorker,
  sendRelatedTagsWorker,
  sendSectorsOfCompetenceWorker,
  updatePaymentCardWorker,
  verifyEmailWorker,
  sendContactUsWorker,
  detachPaymentMethodWorker,
  generateAndSetListOfPermissionsWorker,
  sendDiscountCodeWorker,
  sendEnterpriseCodeWorker,
  handleUploadNewLogoWorker,
  recreatePaymentCardWorker,
  onSubscriptionPaidSuccessWorker,
  onSubscriptionPaidFailWorker,
} from "./sagas";

export function* authSaga() {
  all([
    yield takeLatest(HANDLE_SIGN_IN, handleSignInWorker),
    yield takeEvery(HANDLE_SIGN_UP, handleSignUpWorker),
    yield takeEvery(CHECK_EMAIL, checkEmailWorker),
    yield takeLatest(HANDLE_LOG_OUT, logOutWorker),
    yield takeEvery(VERIFY_EMAIL, verifyEmailWorker),
    yield takeEvery(SEND_COMPANY_INFO, sendCompanyInfoWorker),
    yield takeEvery(HANDLE_UPLOAD_LOGO, handleUploadLogoWorker),
    yield takeEvery(HANDLE_UPLOAD_NEW_LOGO, handleUploadNewLogoWorker),
    yield takeEvery(HANDLE_UPLOAD_DOCUMENTS, handleUploadDocumentsWorker),
    yield takeEvery(SEND_ACCOUNT_INFO, sendAccountInfoWorker),
    yield takeEvery(SEND_SECTORS_OF_COMPETENCE, sendSectorsOfCompetenceWorker),
    yield takeEvery(GET_CATEGORIES, getCategoriesWorker),
    yield takeEvery(SEND_AREAS_OF_INTEREST, sendAreasOfInterestWorker),
    yield takeEvery(SEND_RELATED_TAGS, sendRelatedTagsWorker),
    yield takeEvery(GET_USER, getUserWorker),
    yield takeEvery(SAVE_PAYMENT_PLAN, savePaymentPlanWorker),
    yield takeEvery(SEND_BILLING_INFO, sendBillingInfoWorker),
    yield takeEvery(GET_PROFILE, getProfileWorker),
    yield takeEvery(RESEND_VERIFICATION, resendVerificationWorker),
    yield takeEvery(HANDLE_UPLOAD_COMPANY_LOGO, handleUploadCompanyLogoWorker),
    yield takeEvery(ATTACH_PAYMENT_METHOD, attachPaymentMethodWorker),
    yield takeEvery(GET_CARD_INFO, getCardInfoWorker),
    yield takeEvery(UPDATE_PAYMENT_CARD, updatePaymentCardWorker),
    yield takeEvery(RECREATE_PAYMENT_CARD, recreatePaymentCardWorker),
    yield takeEvery(RETRY_PAYMENT, retryPaymentWorker),
    yield takeLeading(GET_ALL_CARDS_INFO, getAllCardsInfoWorker),
    yield takeLeading(GET_TOP_LEVEL_CATEGORIES, getTopLevelCategoriesWorker),
    yield takeLeading(SEND_CONTACT_US, sendContactUsWorker),
    yield takeLeading(DETACH_PAYMENT_METHOD, detachPaymentMethodWorker),
    yield takeEvery(
      GENERATE_LIST_OF_PERMISSIONS,
      generateAndSetListOfPermissionsWorker
    ),
    yield takeLeading(SEND_DISCOUNT_CODE, sendDiscountCodeWorker),
    yield takeLeading(SEND_ENTERPRISE_CODE, sendEnterpriseCodeWorker),
    yield takeLeading(
      SET_IS_SUBSCRIPTION_PAID_SUCCESS,
      onSubscriptionPaidSuccessWorker
    ),
    yield takeLeading(
      SET_IS_SUBSCRIPTION_PAID_FAIL,
      onSubscriptionPaidFailWorker
    ),
  ]);
}

export default authSaga;
