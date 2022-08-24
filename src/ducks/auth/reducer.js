import { Record } from "immutable";
import {
  CLEAR_EMAIL_FOR_SIGN_UP,
  CLEAR_UPLOADED_DOCUMENTS,
  LOG_OUT,
  REMOVE_COMPANY_FILE,
  SET_ALL_CARDS_INFO,
  SET_CARD_INFO,
  SET_CATEGORIES,
  SET_COMPANY_INFO,
  SET_COMPANY_LOGO,
  SET_EMAIL,
  SET_IS_COMPANY,
  SET_IS_EMAIL_EXISTS,
  SET_IS_LOADING,
  SET_PAYMENT_PLAN_ID,
  SET_PAYMENT_PLAN_TOKEN,
  SET_UPLOADED_DOCUMENTS,
  SET_USER,
  SET_USER_LOGO,
  SET_TOP_LEVEL_CATEGORIES,
  SET_BUSINESS_TYPE,
  SET_IS_EMAIL_VERIFIED,
  SET_EMAIL_VERIFICATION_ERROR,
  SET_IS_BLOCKED_DOMAIN,
  SET_REMEMBER_ME,
  SET_IS_MEMBER,
  SET_LIST_OF_PERMISSIONS,
  SET_NEW_USER_LOGO,
  SET_IS_SUBSCRIPTION_PAID_SUCCESS,
  SET_IS_SUBSCRIPTION_PAID_FAIL,
  SET_IS_PAYMENT_RECREATION_IN_PROGRESS,
} from "./index";

const InitialState = Record({
  user: null,
  emailForSignUp: "",
  companyDocuments: [],
  isLoading: false,
  isCompany: false,
  firstName: "",
  lastName: "",
  password: "",
  categories: [],
  companyLogo: null,
  userLogo: null,
  paymentPlanToken: "",
  companyInfo: null,
  userAvatar: null,
  companyAvatar: null,
  currentPaymentPlanId: null,
  cardInfo: null,
  cardsInfo: [],
  isEmailExists: null,
  defaultPaymentMethodId: null,
  topLevelCategories: [],
  businessType: null,
  isEmailVerified: false,
  emailVerificationError: null,
  isBlockedDomain: null,
  isMember: false,
  rememberMe: false,
  listOfPermissions: null,
  newUserLogo: null,
  isSubscriptionPaid: false,
  isPaymentRecreationInProgress: false,
});

const authReducer = (state = new InitialState(), action) => {
  const { type, payload } = action;

  switch (type) {
    case SET_LIST_OF_PERMISSIONS:
      return state.set("listOfPermissions", payload.listOfPermissions);

    case SET_EMAIL:
      return state.set("emailForSignUp", payload.email);

    case SET_IS_EMAIL_EXISTS:
      return state.set("isEmailExists", payload.isEmailExists);

    case SET_IS_BLOCKED_DOMAIN:
      return state.set("isBlockedDomain", payload.isBlockedDomain);

    case CLEAR_EMAIL_FOR_SIGN_UP:
      return state.set("emailForSignUp", "");

    case SET_USER:
      return state
        .set("user", payload.user)
        .set("userAvatar", payload.userAvatar || state.get("userAvatar"))
        .set(
          "companyAvatar",
          payload.companyAvatar || state.get("companyAvatar")
        );

    case LOG_OUT: {
      return new InitialState();
    }

    case SET_IS_LOADING:
      return state.set("isLoading", payload.isLoading);

    case SET_IS_COMPANY:
      return state.set("isCompany", payload.isCompany);

    case SET_UPLOADED_DOCUMENTS:
      return state.set("companyDocuments", payload.companyDocuments);

    case SET_CATEGORIES:
      return state.set("categories", payload.categories);

    case SET_PAYMENT_PLAN_TOKEN:
      return state.set("paymentPlanToken", payload.token);

    case SET_PAYMENT_PLAN_ID:
      return state.set("currentPaymentPlanId", payload.paymentPlanId);

    case REMOVE_COMPANY_FILE:
      return state.set(
        "companyDocuments",
        state.get("companyDocuments").filter((doc) => doc.id !== payload.fileId)
      );

    case CLEAR_UPLOADED_DOCUMENTS:
      return state.set("companyDocuments", []);

    case SET_USER_LOGO:
      return state.set("userLogo", payload.userLogo);

    case SET_COMPANY_LOGO:
      return state.set("companyLogo", payload.companyLogo);

    case SET_COMPANY_INFO:
      return state.set("companyInfo", payload.companyInfo);

    case SET_CARD_INFO:
      return state.set("cardInfo", payload.cardInfo);

    case SET_ALL_CARDS_INFO:
      return state.merge({
        cardsInfo: payload.cardsInfo,
        defaultPaymentMethodId: payload.defaultPaymentMethod,
      });

    case SET_TOP_LEVEL_CATEGORIES:
      return state.set("topLevelCategories", payload.topLevelCategories);

    case SET_BUSINESS_TYPE:
      return state.set("businessType", payload.businessType);

    case SET_IS_EMAIL_VERIFIED:
      return state.merge({
        isEmailVerified: payload.isEmailVerified,
        emailVerificationError: payload.isEmailVerified
          ? null
          : state.get("emailVerificationError"),
      });

    case SET_EMAIL_VERIFICATION_ERROR: {
      return state.set(
        "emailVerificationError",
        payload.emailVerificationError
      );
    }

    case SET_IS_MEMBER:
      return state.set("isMember", payload.isMember);

    case SET_REMEMBER_ME: {
      return state.set("rememberMe", payload.rememberMe);
    }

    case SET_NEW_USER_LOGO:
      return state.set("newUserLogo", payload.newUserLogo);

    case SET_IS_SUBSCRIPTION_PAID_SUCCESS:
      return state.set("isSubscriptionPaid", payload.isSubscriptionPaid);

    case SET_IS_SUBSCRIPTION_PAID_FAIL:
      return state.set("isSubscriptionPaid", payload.isSubscriptionPaid);

    case SET_IS_PAYMENT_RECREATION_IN_PROGRESS:
      return state.set(
        "isPaymentRecreationInProgress",
        payload.isPaymentRecreationInProgress
      );

    default:
      return state;
  }
};

export default authReducer;
