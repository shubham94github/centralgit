import { all, call, fork, put, select } from 'redux-saga/effects';
import { SET_IS_LOADING, SET_MEMBERS } from './index';
import {
	sendAccountInformationRetailer,
	sendAccountInformationStartup,
	changePassword,
	updateBillingDetailsRetailer,
	updateRelatedTags,
	updateSectorsOfCompetence,
	updateAreasOfInterests,
	sendCompanyInfoStartup,
	sendCompanyInfoRetailer,
	addNewMember,
	getAllMembers,
	changeMemberStatus,
	deleteMember,
	editMember,
	senAccountInfoForMember,
	subscriptionReactivate,
	subscriptionCancel,
	getPaymentPlans,
	sendDiscount,
	sendEnterprise,
} from '@api/settingsApi';
import { GET_USER, HANDLE_LOG_OUT, SET_COMPANY_INFO, SET_NEW_USER_LOGO } from '@ducks/auth';
import { onServerErrorHandler, setSnackbar } from '@ducks/common/sagas';
import enums from '@constants/enums';
import { downgradePaymentPlanError, equalPasswordsError } from '@constants/errorCodes';
import { getUserWorker } from '@ducks/auth/sagas';
import { downloadUserAvatar } from '@api/fileUploadingApi';
import { toColor } from '@utils';
import { GET_DEPARTMENTS, GET_POSITIONS, SET_PAYMENT_PLANS } from '@ducks/common';
import history from '../../history';
import { Routes } from '@routes';
import { selectFeatures, selectPaymentPlans } from '../../redux/selectors';

const successSavedChangesText = 'The changes were saved successfully';
export const successAddedMember = 'A new member is created!';
export const successEditedMember = 'Changes have been saved!';
export const successDeletedMember = 'Changes have been saved!';
export const errorChangePlanText = 'The plan can\'t be applied. '
	+ 'The number of existing members exceeds the capabilities of the selected plan.';

export function* setIsLoading(isLoading) {
	yield put({
		type: SET_IS_LOADING,
		payload: { isLoading },
	});
}

export function* sendAccountInfoWorker({ payload: { accountInfo, isRetailer, isMember } }) {
	try {
		yield setIsLoading(true);

		const sendAccountInfo = isRetailer
			? sendAccountInformationRetailer
			: isMember
				? senAccountInfoForMember
				: sendAccountInformationStartup;

		yield call(sendAccountInfo, accountInfo);

		if (isMember) {
			yield all([
				put({
					type: GET_DEPARTMENTS,
				}),
				put({
					type: GET_POSITIONS,
				}),
			]);
		}

		yield put({
			type: SET_NEW_USER_LOGO,
			payload: { newUserLogo: null },
		});

		yield put({
			type: GET_USER,
		});

		yield setSnackbar({
			text: successSavedChangesText,
			type: enums.snackbarTypes.info,
		});
	} catch (e) {
		yield onServerErrorHandler(e);
	} finally {
		yield setIsLoading(false);
	}
}

export function* changePasswordWorker({ payload }) {
	try {
		yield setIsLoading(true);

		yield call(changePassword, payload);

		yield put({
			type: HANDLE_LOG_OUT,
		});

		history.push(Routes.AUTH.PASSWORD_RECOVERY.PASSWORD_WAS_CHANGED);
	} catch (e) {
		yield onServerErrorHandler(e);
		if (e.code === equalPasswordsError) {
			yield setSnackbar({
				text: e.message,
				type: enums.snackbarTypes.error,
			});
		}
	} finally {
		yield setIsLoading(false);
	}
}

export function* updateBillingDetailsWorker({ payload: { billingDetails } }) {
	try {
		yield setIsLoading(true);

		yield call(updateBillingDetailsRetailer, billingDetails);

		yield put({
			type: GET_USER,
		});
	} catch (e) {
		if (e?.code === downgradePaymentPlanError) {
			yield setSnackbar({
				text: errorChangePlanText,
				type: enums.snackbarTypes.error,
			});
		} else yield onServerErrorHandler(e);
	} finally {
		yield setIsLoading(false);
	}
}

export function* updateRelatedTagsWorker({ payload }) {
	try {
		yield setIsLoading(true);

		yield call(updateRelatedTags, payload);

		yield put({
			type: GET_USER,
		});
	} catch (e) {
		yield onServerErrorHandler(e);
	} finally {
		yield setIsLoading(false);
	}
}

export function* sendCompanyInfoWorker({ payload: { companyInfo, isRetailer } }) {
	try {
		yield setIsLoading(true);

		const saveCompanyInfo = isRetailer ? sendCompanyInfoRetailer : sendCompanyInfoStartup;

		yield call(saveCompanyInfo, companyInfo);
		yield getUserWorker();

		yield put({
			type: SET_COMPANY_INFO,
			payload: {
				companyInfo,
			},
		});

		yield setSnackbar({
			text: successSavedChangesText,
			type: enums.snackbarTypes.info,
		});
	} catch (e) {
		yield onServerErrorHandler(e);
	} finally {
		yield setIsLoading(false);
	}
}

export function* updateSectorsOfCompetenceWorker({ payload }) {
	try {
		yield setIsLoading(true);

		yield call(updateSectorsOfCompetence, payload);

		yield put({
			type: GET_USER,
		});

		yield setSnackbar({
			text: successEditedMember,
			type: enums.snackbarTypes.info,
		});
	} catch (e) {
		yield onServerErrorHandler(e);
	} finally {
		yield setIsLoading(false);
	}
}

export function* updateAreasOfInterestsWorker({ payload }) {
	try {
		yield setIsLoading(true);

		yield call(updateAreasOfInterests, payload);

		yield put({
			type: GET_USER,
		});

		yield setSnackbar({
			text: successEditedMember,
			type: enums.snackbarTypes.info,
		});
	} catch (e) {
		yield onServerErrorHandler(e);
	} finally {
		yield setIsLoading(false);
	}
}

export function* downloadAvatarForMember(member) {
	const [
		avatar30,
		avatar60,
		avatar120,
	] = yield all([
		call(downloadUserAvatar, member.avatar30?.id),
		call(downloadUserAvatar, member.avatar60?.id),
		call(downloadUserAvatar, member.avatar120?.id),
	]);

	try {
		return {
			...member,
			avatar30: {
				...member.avatar30,
				image: member.avatar30?.id ? avatar30 : '',
				color: !member.avatar30?.id
					? toColor(member.avatar30?.id.toString())
					: '',
			},
			avatar60: {
				...member.avatar60,
				image: member.avatar60?.id ? avatar60 : '',
				color: !member.avatar60?.id
					? toColor(member.avatar60?.id.toString())
					: '',
			},
			avatar120: {
				...member.avatar120,
				image: member.avatar120?.id ? avatar120 : '',
				color: !member.avatar120?.id
					? toColor(member.avatar120?.id.toString())
					: '',
			},
		};
	} catch (e) {
		yield fork(onServerErrorHandler, e);
	}
}

export function* getMembersWorker() {
	try {
		yield setIsLoading(true);

		const { items: members } = yield call(getAllMembers);

		const membersWithLogos = yield all(members.map(member => downloadAvatarForMember(member)));

		yield put({
			type: SET_MEMBERS,
			payload: {
				members: membersWithLogos,
			},
		});
	} catch (e) {
		yield onServerErrorHandler(e);
	} finally {
		yield setIsLoading(false);
	}
}

export function* addNewMemberWorker({ payload: { memberData, setFormError, onClose } }) {
	try {
		yield setIsLoading(true);

		yield call(addNewMember, memberData);

		onClose();

		yield setSnackbar({
			text: successAddedMember,
			type: enums.snackbarTypes.info,
		});

		yield call(getMembersWorker);
	} catch (e) {
		setFormError(e?.message);
	} finally {
		yield setIsLoading(false);
	}
}

export function* changeMemberStatusWorker({ payload: { updatedMemberStatus } }) {
	try {
		yield setIsLoading(true);

		yield call(changeMemberStatus, updatedMemberStatus);

		yield call(getMembersWorker);
	} catch (e) {
		yield onServerErrorHandler(e);
	} finally {
		yield setIsLoading(false);
	}
}

export function* deleteMemberWorker({ payload: { memberId, onClose } }) {
	try {
		yield setIsLoading(true);

		onClose();

		yield call(deleteMember, memberId);

		yield call(getMembersWorker);
	} catch (e) {
		yield onServerErrorHandler(e);
	} finally {
		yield setIsLoading(false);
	}
}

export function* editMemberWorker({ payload: { memberData, onClose, setFormError } }) {
	try {
		yield setIsLoading(true);

		yield call(editMember, memberData);

		onClose();

		yield setSnackbar({
			text: successEditedMember,
			type: enums.snackbarTypes.info,
		});

		yield call(getMembersWorker);
	} catch (e) {
		setFormError(e);
	} finally {
		yield setIsLoading(false);
	}
}

export function* toggleIsCancelledSubscriptionWorker({ payload: { isCancelledSubscription } }) {
	try {
		yield setIsLoading(true);

		const activationSubscriptionApi = isCancelledSubscription ? subscriptionReactivate : subscriptionCancel;

		yield call(activationSubscriptionApi);

		yield put({
			type: GET_USER,
		});

		yield call(getMembersWorker);
	} catch (e) {
		yield onServerErrorHandler(e);
	} finally {
		yield setIsLoading(false);
	}
}

export function* getPaymentPlansWorker() {
	try {
		yield setIsLoading(true);

		const { items: paymentPlans, features: { items: plansFeatures } } = yield call(getPaymentPlans);

		yield put({
			type: SET_PAYMENT_PLANS,
			payload: {
				paymentPlans,
				plansFeatures,
			},
		});
	} catch (e) {
		yield onServerErrorHandler(e);
	} finally {
		yield setIsLoading(false);
	}
}

export function* sendDiscountCodeWorker({ payload: { discountCodeData: { code, type } } }) {
	try {
		yield setIsLoading(true);

		const oldPaymentPlans = yield select(selectPaymentPlans);
		const features = yield select(selectFeatures);

		const discountData = yield call(sendDiscount, { code });

		const newPaymentPlans = oldPaymentPlans.map(oldPaymentPlan => {
			const existedPlan = discountData.paymentPlans.find(paymentPlan =>
				(paymentPlan.id === oldPaymentPlan.id && paymentPlan.planType === type));

			if (existedPlan) {
				if (discountData?.percentOff) {
					return {
						...oldPaymentPlan,
						price: {
							...oldPaymentPlan.price,
							unitAmountWithDiscount: oldPaymentPlan.price.unitAmount
								- (oldPaymentPlan.price.unitAmount * (discountData.percentOff / 100)),
						},
						discountCode: code,
					};
				} else if (discountData?.amountOff) {
					return {
						...oldPaymentPlan,
						price: {
							...oldPaymentPlan.price,
							unitAmountWithDiscount: oldPaymentPlan.price.unitAmount - discountData.amountOff,
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
		yield fork(onServerErrorHandler, e);
	} finally {
		yield setIsLoading(false);
	}
}

export function* sendEnterpriseCodeWorker({ payload: { enterpriseCodeData } }) {
	try {
		yield setIsLoading(true);

		const oldPaymentPlans = yield select(selectPaymentPlans);
		const features = yield select(selectFeatures);

		const enterprisePlanData = yield call(sendEnterprise, { code: enterpriseCodeData.code });

		yield put({
			type: SET_PAYMENT_PLANS,
			payload: {
				paymentPlans: [...oldPaymentPlans, { ...enterprisePlanData, enterpriseCode: enterpriseCodeData.code }],
				plansFeatures: features,
			},
		});
	} catch (e) {
		yield fork(onServerErrorHandler, e);
	} finally {
		yield setIsLoading(false);
	}
}
