import {
  verificationEmailFail,
  verificationEmailSuccess,
  couponNotExistTextError,
} from "@components/Auth/SignUp/SignUpCompany/constants";
import enums from "@constants/enums";
import {
  GET_USER,
  LOG_OUT,
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
  SET_PROFILE,
  SET_UPLOADED_DOCUMENTS,
  SET_USER,
  SET_USER_LOGO,
  SET_TOP_LEVEL_CATEGORIES,
  SET_IS_EMAIL_VERIFIED,
  SET_EMAIL_VERIFICATION_ERROR,
  SET_IS_BLOCKED_DOMAIN,
  SET_REMEMBER_ME,
  SET_LIST_OF_PERMISSIONS,
  SET_NEW_USER_LOGO,
  SET_IS_PAYMENT_RECREATION_IN_PROGRESS,
} from "./index";
import { call, put, all, select, fork, cancel } from "redux-saga/effects";
import {
  attachPaymentMethodToCustomer,
  checkEmailDomainForRetailer,
  checkEmailForExisting,
  getUser,
  getUserProfile,
  resendVerificationForRetailer,
  resendVerificationForMember,
  resendVerificationForStartup,
  savePaymentPlanForRetailer,
  signUpAsRetailer,
  signUpAsStartup,
  signUpAsMember,
  verifyRetailerEmail,
  verifyMemberEmail,
  verifyStartupEmail,
  sendContactUs,
  sendDiscountCode,
  sendEnterpriseCode,
} from "@api/auth";
import {
  blockedDomainError,
  couponNotExistError,
  emailExistenceError,
  maxCountOfMemberErrors,
  trialPeriodError,
} from "@constants/errorCodes";
import gettingStartedApi from "@api/gettingStartedApi";
import { createInstancesForApis } from "@api/createInstancesForApis";
import {
  downloadCompanyAvatar,
  downloadUserAvatar,
  uploadAttachedDocuments,
  uploadCompanyLogo,
  uploadCroppedCompanyLogo,
  uploadCroppedUserLogo,
  uploadUserLogo,
} from "@api/fileUploadingApi";
import { getCategories, getTopLevelCategories } from "@api/commonApi";
import {
  clearSessionStorage,
  setItemToSessionStorage,
} from "@utils/sessionStorage";
import { Routes } from "@routes";
import history from "../../history";
import { getEmailDomain, toColor } from "@utils";
import {
  getPaymentPlansWorker,
  onServerErrorHandler,
  setSnackbar,
} from "@ducks/common/sagas";
import { disconnectWebsocket } from "@api/websocketApi";
import { getChannelsByUserIdWorker } from "@ducks/messages/sagas";
import {
  detachPaymentMethod,
  getAllPaymentMethod,
  getCustomer,
  getPaymentMethod,
  getSubscription,
  paySubscription,
  recreatePaymentMethod,
  updatePayment,
} from "@api/stripeApi";
import { CLEAR_MESSAGES_STORE } from "@ducks/messages";
import { CLEAR_PROFILE_STORE } from "@ducks/profile";
import { CLEAR_ADMIN_STORE } from "@ducks/admin";
import { CLEAR_BROWSE_STORE } from "@ducks/browse";
import { CLEAR_COMMON_STORE, SET_PAYMENT_PLANS } from "@ducks/common";
import { CLEAR_HOME_STORE } from "@ducks/home";
import { CLEAR_SETTINGS_STORE } from "@ducks/settings";
import { optionsMapper } from "@utils/optionsMapper";
import {
  selectChannels,
  selectFeatures,
  selectPaymentPlans,
  selectUser,
  selectUserId,
} from "../../redux/selectors";
import {
  clearLocalStorage,
  getItemFromLocalStorage,
  setItemToLocalStorage,
} from "@utils/localStorage";
import { getChannelById } from "@api/messagesApi";
import { clearCache } from "@utils/promiseMemoize";
import { getItemFromStorage, setItemToStorage } from "@utils/storage";
import { generateListOfPermissions } from "@utils/generateListOfPermissions";

const paymentSuccessText = "Payment successful";

const { admin, superAdmin } = enums.userRoles;

export function* setIsLoading(isLoading) {
  yield put({
    type: SET_IS_LOADING,
    payload: { isLoading },
  });
}

function* getUserImages(user) {
  const [
    avatar,
    avatar30,
    avatar60,
    avatar120,
    retailerLogo,
    retailerLogo120,
    retailerLogo60,
    retailerLogo30,
    startupLogo,
    startupLogo120,
    startupLogo60,
    startupLogo30,
  ] = yield all([
    call(downloadUserAvatar, user.avatar?.id),
    call(downloadUserAvatar, user.avatar30?.id),
    call(downloadUserAvatar, user.avatar60?.id),
    call(downloadUserAvatar, user.avatar120?.id),
    call(downloadUserAvatar, user?.retailer?.logo?.id),
    call(downloadUserAvatar, user?.retailer?.logo120?.id),
    call(downloadUserAvatar, user?.retailer?.logo60?.id),
    call(downloadUserAvatar, user?.retailer?.logo30?.id),
    call(downloadUserAvatar, user.startup?.logo?.id),
    call(downloadUserAvatar, user.startup?.logo120?.id),
    call(downloadUserAvatar, user.startup?.logo60?.id),
    call(downloadUserAvatar, user.startup?.logo30?.id),
  ]);

  return {
    ...user,
    avatar: user.avatar?.image
      ? user.avatar?.image
      : {
          ...user.avatar,
          image: user?.avatar?.id ? avatar : "",
        },
    avatar30: user.avatar30?.image
      ? user.avatar30?.image
      : {
          ...user.avatar30,
          image: user?.avatar30?.id ? avatar30 : "",
        },
    avatar60: user.avatar60?.image
      ? user.avatar60?.image
      : {
          ...user.avatar60,
          image: user?.avatar60?.id ? avatar60 : "",
        },
    avatar120: user.avatar120?.image
      ? user.avatar120?.image
      : {
          ...user.avatar120,
          image: user?.avatar120?.id ? avatar120 : "",
        },
    startup: user.startup
      ? {
          ...user.startup,
          logo: user.startup?.logo?.image
            ? user.startup.logo.image
            : {
                ...user.startup.logo,
                image: user?.startup?.logo?.id ? startupLogo : "",
              },
          logo120: user.startup?.logo120?.image
            ? user.startup.logo120.image
            : {
                ...user.startup.logo120,
                image: user?.startup?.logo120?.id ? startupLogo120 : "",
              },
          logo60: user.startup?.logo60?.image
            ? user.startup.logo60?.image
            : {
                ...user.startup.logo60,
                image: user?.startup?.logo60?.id ? startupLogo60 : "",
              },
          logo30: user.startup?.logo30?.image
            ? user.startup.logo30.image
            : {
                ...user.startup.logo30,
                image: user?.startup?.logo30?.id ? startupLogo30 : "",
              },
        }
      : null,
    retailer: user?.retailer
      ? {
          ...user?.retailer,
          logo: user?.retailer?.logo?.image
            ? user?.retailer?.logo.image
            : {
                ...user?.retailer?.logo,
                image: user?.retailer?.logo?.id ? retailerLogo : "",
              },
          logo120: user?.retailer?.logo120?.image
            ? user?.retailer?.logo120.image
            : {
                ...user?.retailer?.logo120,
                image: user?.retailer?.logo120?.id ? retailerLogo120 : "",
              },
          logo60: user?.retailer?.logo60?.image
            ? user?.retailer?.logo60?.image
            : {
                ...user?.retailer?.logo60,
                image: user?.retailer?.logo60?.id ? retailerLogo60 : "",
              },
          logo30: user?.retailer?.logo30?.image
            ? user?.retailer?.logo30?.image
            : {
                ...user?.retailer?.logo30,
                image: user?.retailer?.logo30?.id ? retailerLogo30 : "",
              },
        }
      : null,
  };
}

function* getUserAndCompanyImages(user, rememberMe) {
  const userWithImages = yield call(getUserImages, user);

  const isStartup = !!userWithImages.startup;
  const dataProfile = isStartup
    ? userWithImages.startup
    : userWithImages.retailer;

  const userAvatar = {
    color: toColor(userWithImages.id.toString()),
  };

  setItemToStorage("userAvatar", userAvatar, rememberMe);
  setItemToStorage("user", userWithImages, rememberMe);

  const companyAvatar = {
    name: userWithImages.retailer
      ? userWithImages.retailer?.companyShortName
      : userWithImages.startup?.companyShortName,
    color: userWithImages.retailer
      ? toColor(userWithImages.retailer?.id.toString())
      : toColor(userWithImages.startup?.id.toString()),
  };

  yield all([
    call(setItemToStorage, ["companyAvatar", companyAvatar, rememberMe]),
    put({
      type: SET_USER,
      payload: {
        user: userWithImages,
        userAvatar,
        companyAvatar,
      },
    }),
    put({
      type: SET_COMPANY_LOGO,
      payload: {
        companyLogo: {
          logo: dataProfile?.logo?.id,
          logo30Id: dataProfile?.logo30?.id,
          logo60Id: dataProfile?.logo60?.id,
          logo120Id: dataProfile?.logo120?.id,
        },
      },
    }),
    put({
      type: SET_USER_LOGO,
      payload: {
        userLogo: {
          avatar120Id: userWithImages?.avatar120?.id,
          avatar30Id: userWithImages?.avatar30?.id,
          avatar60Id: userWithImages?.avatar60?.id,
          avatarId: userWithImages?.avatar?.id,
        },
      },
    }),
  ]);
}

export function* generateAndSetListOfPermissionsWorker({ payload: { user } }) {
  if (user.role === admin || user.role === superAdmin) {
    const listOfPermissions = generateListOfPermissions(
      user.authority.permissions,
      enums.permissionTypes
    );

    yield put({
      type: SET_LIST_OF_PERMISSIONS,
      payload: { listOfPermissions },
    });
  }
}

export function* handleSignInWorker({
  payload: { accessToken, refreshToken, rememberMe },
}) {
  let getChannelsByUserIdSaga;

  try {
    const channels = yield select(selectChannels);

    setItemToStorage("accessToken", accessToken, rememberMe);
    setItemToStorage("refreshToken", refreshToken, rememberMe);
    setItemToLocalStorage("rememberMe", rememberMe);

    const user = yield call(getUser);

    yield fork(getUserAndCompanyImages, user, rememberMe);

    yield call(generateAndSetListOfPermissionsWorker, { payload: { user } });

    if (!channels) {
      getChannelsByUserIdSaga = yield fork(getChannelsByUserIdWorker, {
        payload: {
          id: user.id,
          data: { page: 0, pageSize: 10 },
        },
      });
    }

    createInstancesForApis(user.role);

    if (rememberMe) setItemToLocalStorage("user", user);
    else setItemToSessionStorage("user", user);

    yield all([
      put({
        type: SET_USER,
        payload: { user },
      }),
      put({
        type: SET_USER_LOGO,
        payload: {
          userLogo: {
            avatar120Id: user?.avatar120?.id,
            avatar30Id: user?.avatar30?.id,
            avatar60Id: user?.avatar60?.id,
            avatarId: user?.avatar?.id,
          },
        },
      }),
      put({
        type: SET_REMEMBER_ME,
        payload: { rememberMe },
      }),
    ]);

    gettingStartedApi.createInstance(user.role);
  } catch (e) {
    yield all([cancel(getChannelsByUserIdSaga), onServerErrorHandler(e)]);
  } finally {
    yield setIsLoading(false);
  }
}

export function* logOutWorker() {
  try {
    disconnectWebsocket();
    clearSessionStorage();
    clearLocalStorage();

    yield getChannelById(clearCache);

    yield all([
      put({
        type: LOG_OUT,
      }),
      put({
        type: CLEAR_MESSAGES_STORE,
      }),
      put({
        type: CLEAR_COMMON_STORE,
      }),
      put({
        type: CLEAR_PROFILE_STORE,
      }),
      put({
        type: CLEAR_ADMIN_STORE,
      }),
      put({
        type: CLEAR_BROWSE_STORE,
      }),
      put({
        type: CLEAR_HOME_STORE,
      }),
      put({
        type: CLEAR_SETTINGS_STORE,
      }),
    ]);
  } catch (e) {
    yield fork(onServerErrorHandler, e);
  }
}

export function* getUserWorker() {
  try {
    yield setIsLoading(true);
    const user = yield call(getUser);

    yield fork(getUserAndCompanyImages, user);

    createInstancesForApis(user.role);
    setItemToStorage("user", user);

    const userAvatar = {
      color: toColor(user.id.toString()),
    };

    yield put({
      type: SET_USER,
      payload: {
        user: user,
        userAvatar,
      },
    });

    setItemToStorage("user", user);

    yield getProfileWorker({ payload: { id: user.id } });
  } catch (e) {
    yield fork(onServerErrorHandler, e);
  } finally {
    yield setIsLoading(false);
  }
}

export function* sendCompanyInfoWorker({ payload }) {
  const { saveCompanyInfo } = gettingStartedApi.getInstance();

  try {
    yield setIsLoading(true);
    yield call(saveCompanyInfo, payload.data);
    yield put({ type: GET_USER });
    yield put({
      type: SET_COMPANY_INFO,
      payload: {
        companyInfo: payload.data,
      },
    });
  } catch (e) {
    yield fork(onServerErrorHandler, e);
    yield setIsLoading(false);
  }
}

export function* handleUploadLogoWorker({ payload }) {
  try {
    const {
      auth: { user, userAvatar, companyAvatar },
    } = yield select();
    yield setIsLoading(true);
    const [{ id }, { avatar60Id, avatar30Id, avatar120Id }] = yield all([
      yield call(uploadUserLogo, payload.file),
      yield call(uploadCroppedUserLogo, payload.file),
    ]);

    yield put({
      type: SET_USER_LOGO,
      payload: {
        userLogo: {
          avatar120Id,
          avatar30Id,
          avatar60Id,
          avatarId: id,
        },
      },
    });

    const newUser = {
      ...user,
      avatar: {
        ...user.avatar,
        id,
        image: yield call(downloadUserAvatar, id),
      },
      avatar30: {
        ...user.avatar30,
        id: avatar30Id,
        image: yield call(downloadUserAvatar, avatar30Id),
      },
      avatar60: {
        ...user.avatar60,
        id: avatar60Id,
        image: yield call(downloadUserAvatar, avatar60Id),
      },
      avatar120: {
        ...user.avatar120,
        id: avatar120Id,
        image: yield call(downloadUserAvatar, avatar120Id),
      },
    };

    setItemToSessionStorage("user", newUser);

    yield put({
      type: SET_USER,
      payload: {
        user: newUser,
        userAvatar,
        companyAvatar,
      },
    });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
  } finally {
    yield setIsLoading(false);
  }
}

export function* handleUploadNewLogoWorker({ payload }) {
  try {
    yield setIsLoading(true);

    const [{ id }, { avatar60Id, avatar30Id, avatar120Id }] = yield all([
      yield call(uploadUserLogo, payload.newUserLogo),
      yield call(uploadCroppedUserLogo, payload.newUserLogo),
    ]);

    const image = yield call(downloadUserAvatar, avatar120Id);

    yield put({
      type: SET_NEW_USER_LOGO,
      payload: {
        newUserLogo: {
          avatar120Id,
          avatar30Id,
          avatar60Id,
          avatarId: id,
          image,
        },
      },
    });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
  } finally {
    yield setIsLoading(false);
  }
}

export function* handleUploadCompanyLogoWorker({ payload }) {
  try {
    const {
      auth: { user, userAvatar, companyAvatar },
    } = yield select();
    yield setIsLoading(true);
    const [{ id }, { logo60Id, logo30Id, logo120Id }] = yield all([
      yield call(uploadCompanyLogo, payload.file),
      yield call(uploadCroppedCompanyLogo, payload.file),
    ]);

    yield put({
      type: SET_COMPANY_LOGO,
      payload: {
        companyLogo: {
          logo120Id,
          logo30Id,
          logo60Id,
          logo: id,
        },
      },
    });

    const newUser = {
      ...user,
      startup: user.startup
        ? {
            ...user.startup,
            logo: {
              ...user.startup.logo,
              id,
              image: yield call(downloadCompanyAvatar, id),
            },
            logo120: {
              ...user.startup.logo120,
              id: logo120Id,
              image: yield call(downloadCompanyAvatar, logo120Id),
            },
            logo60: {
              ...user.startup.logo60,
              id: logo60Id,
              image: yield call(downloadCompanyAvatar, logo60Id),
            },
            logo30: {
              ...user.startup.logo30,
              id: logo30Id,
              image: yield call(downloadCompanyAvatar, logo30Id),
            },
          }
        : null,
      retailer: user?.retailer
        ? {
            ...user?.retailer,
            logo: {
              ...user?.retailer?.logo,
              id,
              image: yield call(downloadCompanyAvatar, id),
            },
            logo120: {
              ...user?.retailer?.logo120,
              id: logo120Id,
              image: yield call(downloadCompanyAvatar, logo120Id),
            },
            logo60: {
              ...user?.retailer?.logo60,
              id: logo60Id,
              image: yield call(downloadCompanyAvatar, logo60Id),
            },
            logo30: {
              ...user?.retailer?.logo30,
              id: logo30Id,
              image: yield call(downloadCompanyAvatar, logo30Id),
            },
          }
        : null,
    };

    setItemToSessionStorage("user", newUser);

    yield put({
      type: SET_USER,
      payload: {
        user: newUser,
        userAvatar,
        companyAvatar,
      },
    });
  } catch (e) {
    yield fork(onServerErrorHandler, e);
  } finally {
    yield setIsLoading(false);
  }
}

export function* handleUploadDocumentsWorker({ payload }) {
  try {
    yield setIsLoading(true);

    const uploadedDocuments = yield select(
      (state) => state.auth.companyDocuments
    );
    const res = yield call(uploadAttachedDocuments, payload.files);

    yield put({
      type: SET_UPLOADED_DOCUMENTS,
      payload: { companyDocuments: [...uploadedDocuments, ...res] },
    });
  } catch (e) {
    yield fork(onServerErrorHandler, e);
  } finally {
    yield setIsLoading(false);
  }
}

export function* sendAccountInfoWorker({ payload }) {
  const { sendAccountInfo } = gettingStartedApi.getInstance();

  try {
    yield setIsLoading(true);

    yield call(sendAccountInfo, payload.data.accountInfo);
    yield put({ type: GET_USER });
  } catch (e) {
    yield fork(onServerErrorHandler, e);
    yield setIsLoading(false);
  }
}

export function* handleSignUpWorker({
  payload: {
    data,
    isRetail,
    role,
    isMember,
    setIsMemberRegisterError,
    setErrorType,
  },
}) {
  try {
    yield setIsLoading(true);
    console.log(data);
    const reqData = {
      ...data,
      // countryId: data.countryId.id,
      emailDomain: isRetail
        ? data.emailDomain
          ? data.emailDomain
          : null
        : getEmailDomain(data.email),
      companyLegalName: isRetail
        ? data.companyLegalName
          ? data.companyLegalName
          : null
        : data.companyLegalName,
      role,
    };

    // const signUp = isMember
    //   ? signUpAsMember
    //   : isRetail
    //   ? signUpAsRetailer
    //   : signUpAsStartup;
    const signUp = signUpAsRetailer;
    console.log(reqData);
    const { data: user } = yield call(signUp, reqData);

    setItemToLocalStorage("resendVerificationToken", user.token);
    setItemToSessionStorage("user", user);

    yield all([
      put({
        type: SET_USER,
        payload: {
          user,
        },
      }),
      put({
        type: SET_COMPANY_INFO,
        payload: {
          companyInfo: {
            companyLegalName: data.companyLegalName,
            companyShortName: data.companyShortName,
            // countryId: data.countryId,
            // position: data.position,
          },
        },
      }),
    ]);
    history.push(
      isMember
        ? Routes.AUTH.SIGN_UP.EEMAIL_VERIFICATION_PROCEED
        : isRetail
        ? Routes.AUTH.SIGN_UP.EMAIL_VERIFICATION_PROCEED
        : Routes.AUTH.SIGN_UP.EMAIL_VERIFICATION_PROCEED
    );
  } catch (e) {
    if (
      isMember &&
      (maxCountOfMemberErrors.includes(e?.response?.data?.code) ||
        e?.response?.data?.code === trialPeriodError)
    ) {
      setIsMemberRegisterError(true);
      setErrorType(e?.response?.data?.code);
    } else yield fork(onServerErrorHandler, e);
  } finally {
    yield setIsLoading(false);
  }
}

export function* checkEmailWorker({ payload: { data } }) {
  try {
    yield setIsLoading(true);

    const [checkExist, checkEmailDomain] = yield all([
      call(checkEmailForExisting, data),
      call(checkEmailDomainForRetailer, data),
    ]);

    if (checkExist.status === 200 && checkEmailDomain.status === 200) {
      yield put({
        type: SET_IS_COMPANY,
        payload: { isCompany: !checkEmailDomain.data.isPublic },
      });
    }

    yield put({
      type: SET_EMAIL,
      payload: {
        email: data.email,
      },
    });

    history.push(Routes.AUTH.SIGN_UP.CHOOSE_BUSINESS_TYPE);
  } catch (e) {
    if (e.response.data.code === emailExistenceError) {
      yield put({
        type: SET_IS_EMAIL_EXISTS,
        payload: {
          isEmailExists: true,
        },
      });
    }
    if (e.response.data.code === blockedDomainError) {
      yield put({
        type: SET_IS_BLOCKED_DOMAIN,
        payload: {
          isBlockedDomain: true,
        },
      });
    }

    yield fork(onServerErrorHandler, e.response.data);
  } finally {
    yield setIsLoading(false);
  }
}

export function* verifyEmailWorker({
  payload: { token, isRetailer, isMember },
}) {
  yield put({
    type: SET_EMAIL_VERIFICATION_ERROR,
    payload: { emailVerificationError: null },
  });

  try {
    yield setIsLoading(true);

    if (isMember) yield call(verifyMemberEmail, token);
    else if (!isRetailer) yield call(verifyStartupEmail, token);
    else yield call(verifyRetailerEmail, token);

    yield put({
      type: SET_IS_EMAIL_VERIFIED,
      payload: { isEmailVerified: true },
    });
  } catch (e) {
    yield put({
      type: SET_EMAIL_VERIFICATION_ERROR,
      payload: { emailVerificationError: e?.response?.data?.message },
    });
    yield fork(onServerErrorHandler, e);
  } finally {
    yield setIsLoading(false);
  }
}

export function* getCategoriesWorker() {
  try {
    yield setIsLoading(true);

    const categories = yield call(getCategories);

    yield put({
      type: SET_CATEGORIES,
      payload: { categories: categories.items },
    });
  } catch (e) {
    yield fork(onServerErrorHandler, e);
  } finally {
    yield setIsLoading(false);
  }
}

export function* sendAreasOfInterestWorker({ payload: { areasOfInterest } }) {
  const { sendAreasOfInterest } = gettingStartedApi.getInstance();

  try {
    yield setIsLoading(true);

    yield sendAreasOfInterest(areasOfInterest);

    yield put({
      type: GET_USER,
    });
  } catch (e) {
    yield fork(onServerErrorHandler, e);
    yield setIsLoading(false);
  }
}

export function* sendRelatedTagsWorker({ payload: { relatedTags } }) {
  const { sendRelatedTags } = gettingStartedApi.getInstance();

  try {
    yield setIsLoading(true);

    yield call(sendRelatedTags, relatedTags);

    yield put({
      type: GET_USER,
    });
  } catch (e) {
    yield fork(onServerErrorHandler, e);
    yield setIsLoading(false);
  }
}

export function* sendSectorsOfCompetenceWorker({
  payload: { sectorsOfCompetence },
}) {
  const { sendSectorsOfCompetence } = gettingStartedApi.getInstance();

  try {
    yield setIsLoading(true);

    yield call(sendSectorsOfCompetence, sectorsOfCompetence);

    yield put({
      type: GET_USER,
    });
  } catch (e) {
    yield fork(onServerErrorHandler, e);
    yield setIsLoading(false);
  }
}

export function* savePaymentPlanWorker({
  payload: { paymentPlanId, token, discountCode, enterpriseCode },
}) {
  try {
    yield setIsLoading(true);

    yield call(savePaymentPlanForRetailer, {
      discountCode,
      enterpriseCode,
      paymentPlanId: +paymentPlanId,
      token,
    });

    yield put({
      type: SET_PAYMENT_PLAN_ID,
      payload: {
        paymentPlanId,
      },
    });

    history.push(Routes.AUTH.SIGN_UP.RETAIL_BILLING_DETAILS);
  } catch (e) {
    yield fork(onServerErrorHandler, e);
  } finally {
    yield setIsLoading(false);
  }
}

export function* sendBillingInfoWorker({
  payload: { billingInfo, isNeededFetchUser },
}) {
  const { sendBillingInfo } = gettingStartedApi.getInstance();

  try {
    yield setIsLoading(true);
    yield call(sendBillingInfo, billingInfo);

    if (isNeededFetchUser) yield put({ type: GET_USER });
  } catch (e) {
    yield fork(onServerErrorHandler, e);
  } finally {
    yield setIsLoading(false);
  }
}

export function* getProfileWorker({ payload: { id } }) {
  try {
    yield setIsLoading(true);

    const resp = yield call(getUserProfile, id);

    const profile = {
      ...resp,
      logo60: {
        ...resp.logo60,
        image: resp.logo60?.id
          ? yield call(downloadUserAvatar, resp.logo60?.id)
          : "",
        name: !resp.logo60?.id ? resp?.companyLegalName : "",
        color: !resp.logo60?.id ? toColor(resp?.id.toString()) : "",
      },
    };

    const isStartup = !!resp.startup;
    const dataProfile = isStartup ? resp.startup : resp.retailer;

    yield all([
      put({
        type: SET_PROFILE,
        payload: { profile },
      }),
      put({
        type: SET_COMPANY_LOGO,
        payload: {
          companyLogo: {
            logo: dataProfile?.logo?.id,
            logo30Id: dataProfile?.logo30?.id,
            logo60Id: dataProfile?.logo60?.id,
            logo120Id: dataProfile?.logo120?.id,
          },
        },
      }),
      put({
        type: SET_USER_LOGO,
        payload: {
          userLogo: {
            avatar120Id: resp?.avatar120?.id,
            avatar30Id: resp?.avatar30?.id,
            avatar60Id: resp?.avatar60?.id,
            avatarId: resp?.avatar?.id,
          },
        },
      }),
    ]);
  } catch (e) {
    yield fork(onServerErrorHandler, e);
  } finally {
    yield setIsLoading(false);
  }
}

export function* resendVerificationWorker({
  payload: { isRetailer, isMember, token },
}) {
  try {
    yield setIsLoading(true);

    const response = isMember
      ? yield resendVerificationForMember({ token })
      : isRetailer
      ? yield resendVerificationForRetailer({ token })
      : yield resendVerificationForStartup({ token });

    if (response?.status === 200) {
      yield setIsLoading(false);
      yield setSnackbar({
        text: verificationEmailSuccess,
        type: enums.snackbarTypes.info,
      });
    }
  } catch (e) {
    yield fork(onServerErrorHandler, e);
    yield setSnackbar({
      text: verificationEmailFail,
      type: enums.snackbarTypes.error,
    });
  } finally {
    yield setIsLoading(false);
  }
}

export function* attachPaymentMethodWorker({
  payload: { methodId, isRedirect, isRetryPayment, stripeSubscriptionId },
}) {
  try {
    yield setIsLoading(true);

    const user = getItemFromStorage("user");

    const token =
      getItemFromLocalStorage("resendVerificationToken") || user?.token;

    const userId = yield select(selectUserId) || user?.id;

    if (!!methodId)
      yield attachPaymentMethodToCustomer({ methodId, token, userId });

    if (isRetryPayment) {
      yield retryPaymentWorker({
        payload: { id: stripeSubscriptionId, isRedirect },
      });

      yield setSnackbar({
        text: paymentSuccessText,
        type: enums.snackbarTypes.info,
      });
    }

    if (!isRedirect && !isRetryPayment) {
      const {
        auth: {
          user: { retailer, startup },
        },
      } = yield select();
      const customerId = retailer?.customerId || startup?.customerId;

      yield getAllCardsInfoWorker({ payload: { customerId } });
    }

    if (isRedirect)
      history.push(Routes.AUTH.SIGN_UP.EMAIL_VERIFICATION_PROCEED_RETAIL);
  } catch (e) {
    const error = e?.response?.data || e;

    yield fork(onServerErrorHandler, error);
  } finally {
    yield setIsLoading(false);
  }
}

export function* detachPaymentMethodWorker({ payload: { methodId } }) {
  try {
    yield setIsLoading(true);

    yield detachPaymentMethod(methodId);

    const user = yield select(selectUser);

    const customerId = user?.retailer?.customerId || user?.startup?.customerId;

    if (customerId) yield getAllCardsInfoWorker({ payload: { customerId } });
  } catch (e) {
    yield fork(onServerErrorHandler, e);
  } finally {
    yield setIsLoading(false);
  }
}

export function* getCardInfoWorker({ payload: { id } }) {
  try {
    yield setIsLoading(true);

    const {
      invoiceSettings: { defaultPaymentMethod },
    } = yield call(getCustomer, id);

    if (!defaultPaymentMethod) {
      yield put({
        type: SET_CARD_INFO,
        payload: {
          cardInfo: null,
        },
      });
      return;
    }

    const {
      card: { brand, last4 },
      id: paymentMethodId,
    } = yield call(getPaymentMethod, defaultPaymentMethod);

    yield put({
      type: SET_CARD_INFO,
      payload: {
        cardInfo: {
          brand,
          last4,
          paymentMethodId,
        },
      },
    });
  } catch (e) {
    yield fork(onServerErrorHandler, e);
  } finally {
    yield setIsLoading(false);
  }
}

export function* getAllCardsInfoWorker({ payload: { customerId } }) {
  try {
    yield setIsLoading(true);

    const {
      invoiceSettings: { defaultPaymentMethod },
    } = yield call(getCustomer, customerId);

    const { data = [] } = yield call(getAllPaymentMethod, customerId);

    const cardsInfo = data.map(
      ({ card: { brand, last4 }, id: paymentMethodId }) => ({
        brand,
        last4,
        paymentMethodId,
      })
    );

    yield put({
      type: SET_ALL_CARDS_INFO,
      payload: {
        cardsInfo,
        defaultPaymentMethod,
      },
    });
  } catch (e) {
    yield fork(onServerErrorHandler, e);
  } finally {
    yield setIsLoading(false);
  }
}

export function* updatePaymentCardWorker({ payload: { id } }) {
  try {
    yield setIsLoading(true);

    yield call(updatePayment, id);

    const user = yield call(getUser);

    yield put({
      type: SET_USER,
      payload: { user },
    });

    history.push(Routes.SUBSCRIPTION.UPDATE_CARD_SUCCESSFULLY);
  } catch (e) {
    yield fork(onServerErrorHandler, e);

    history.push(Routes.SUBSCRIPTION.UPDATE_CARD_FAILED);
  } finally {
    yield setIsLoading(false);
  }
}

export function* recreatePaymentCardWorker({
  payload: { planId, paymentMethodId },
}) {
  try {
    yield setIsLoading(true);

    yield put({
      type: SET_IS_PAYMENT_RECREATION_IN_PROGRESS,
      payload: { isPaymentRecreationInProgress: true },
    });

    yield call(recreatePaymentMethod, planId, paymentMethodId);
  } catch (e) {
    yield put({
      type: SET_IS_PAYMENT_RECREATION_IN_PROGRESS,
      payload: {
        payload: { isPaymentRecreationInProgress: false },
      },
    });

    yield fork(onServerErrorHandler, e);

    history.push(Routes.SUBSCRIPTION.UPDATE_CARD_FAILED);
  }
}

export function* retryPaymentWorker({ payload: { id, isRedirect = true } }) {
  try {
    yield setIsLoading(true);

    const { latestInvoice } = yield call(getSubscription, id);

    yield call(paySubscription, latestInvoice);

    const user = yield call(getUser);

    yield put({
      type: SET_USER,
      payload: { user },
    });

    if (isRedirect) history.push(Routes.SUBSCRIPTION.PAYMENT_RETRY);
  } catch (e) {
    yield fork(onServerErrorHandler, e);
  } finally {
    if (isRedirect) yield setIsLoading(false);
  }
}

export function* getTopLevelCategoriesWorker() {
  try {
    yield setIsLoading(true);

    const { items } = yield call(getTopLevelCategories);

    const categories = items.filter((item) => item.name !== "Import");

    const topLevelCategories = optionsMapper(categories);

    yield put({
      type: SET_TOP_LEVEL_CATEGORIES,
      payload: { topLevelCategories },
    });
  } catch (e) {
    yield fork(onServerErrorHandler, e);
  } finally {
    yield setIsLoading(false);
  }
}

export function* sendContactUsWorker({ payload: data }) {
  try {
    yield call(sendContactUs, data);
  } catch (e) {
    yield fork(onServerErrorHandler, e);
  }
}

export function* updateUserAndRedirectToWorker({ payload: { route } }) {
  try {
    yield setIsLoading(true);

    yield put({
      type: GET_USER,
    });

    history.push(route);
  } catch (e) {
    yield fork(onServerErrorHandler, e);
  } finally {
    yield setIsLoading(false);
  }
}

export function* sendDiscountCodeWorker({
  payload: {
    discountCodeData: { code, token, type },
  },
}) {
  try {
    yield setIsLoading(true);

    const user = yield select(selectUser);
    const oldPaymentPlans = yield select(selectPaymentPlans);
    const features = yield select(selectFeatures);
    const currentDate = new Date().getTime();

    const { data: discountData } = yield call(sendDiscountCode, {
      code,
      token,
    });

    if (+`${discountData.redeemBy}000` < currentDate) {
      yield all([
        call(setSnackbar, {
          type: "error",
          text: "Your code has been expired",
        }),
        call(getPaymentPlansWorker, {
          payload: { paymentPlansData: { token: user.token } },
        }),
      ]);

      return;
    }

    const newPaymentPlans = oldPaymentPlans.map((oldPaymentPlan) => {
      const existedPlan = discountData.paymentPlans.find(
        (paymentPlan) =>
          paymentPlan.id === oldPaymentPlan.id && paymentPlan.planType === type
      );

      if (existedPlan) {
        if (discountData?.percentOff) {
          return {
            ...oldPaymentPlan,
            price: {
              ...oldPaymentPlan.price,
              unitAmountWithDiscount:
                oldPaymentPlan.price.unitAmount -
                oldPaymentPlan.price.unitAmount *
                  (discountData.percentOff / 100),
            },
            discountCode: code,
          };
        } else if (discountData?.amountOff) {
          return {
            ...oldPaymentPlan,
            price: {
              ...oldPaymentPlan.price,
              unitAmountWithDiscount:
                oldPaymentPlan.price.unitAmount - discountData.amountOff,
            },
            discountCode: code,
          };
        }
      } else return oldPaymentPlan;
    });

    yield put({
      type: SET_PAYMENT_PLANS,
      payload: {
        paymentPlans: newPaymentPlans,
        plansFeatures: features,
      },
    });
  } catch (e) {
    if (e.response.data.code === couponNotExistError) {
      yield setSnackbar({
        text: couponNotExistTextError,
        type: enums.snackbarTypes.error,
      });
    } else yield fork(onServerErrorHandler, e);
  } finally {
    yield setIsLoading(false);
  }
}

export function* sendEnterpriseCodeWorker({ payload: { enterpriseCodeData } }) {
  try {
    yield setIsLoading(true);

    const oldPaymentPlans = yield select(selectPaymentPlans);
    const features = yield select(selectFeatures);

    const { data: enterprisePlanData } = yield call(
      sendEnterpriseCode,
      enterpriseCodeData
    );

    yield put({
      type: SET_PAYMENT_PLANS,
      payload: {
        paymentPlans: [
          ...oldPaymentPlans,
          { ...enterprisePlanData, enterpriseCode: enterpriseCodeData.code },
        ],
        plansFeatures: features,
      },
    });
  } catch (e) {
    yield fork(onServerErrorHandler, e);
  } finally {
    yield setIsLoading(false);
  }
}

export function* updateUserStripePaymentSettings() {
  const oldUser = yield select(selectUser);
  const user = yield call(getUser);
  const fieldName = !!oldUser?.retailer ? "retailer" : "member";

  const newUser = {
    ...oldUser,
    [fieldName]: {
      ...oldUser[fieldName],
      stripePaymentSettings: user[fieldName].stripePaymentSettings,
    },
  };

  yield put({
    type: SET_USER,
    payload: { user: newUser },
  });
}

export function* onSubscriptionPaidSuccessWorker({ payload, type }) {
  const { isSubscriptionPaid } = payload;
  const isPaymentRecreationInProgress = yield select(
    (state) => state.auth.isPaymentRecreationInProgress
  );

  if (!isSubscriptionPaid) {
    yield put({ payload, type });

    return;
  }

  yield updateUserStripePaymentSettings();

  if (isPaymentRecreationInProgress && isSubscriptionPaid) {
    yield setSnackbar({
      text: paymentSuccessText,
      type: enums.snackbarTypes.info,
    });
  }

  yield put({ type, payload: { isSubscriptionPaid } });
}

export function* onSubscriptionPaidFailWorker({ payload, type }) {
  const { isSubscriptionPaid } = payload;

  yield updateUserStripePaymentSettings();

  yield setSnackbar({
    text: "Sorry, your Payment failed. Please try again.",
    type: enums.snackbarTypes.error,
  });

  yield put({ type, payload: { isSubscriptionPaid } });

  if (!history.location.pathname.includes(Routes.SUBSCRIPTION.INDEX))
    history.push(Routes.SUBSCRIPTION.INDEX);
}
