import {
	ADD_NEW_MEMBER,
	CHANGE_MEMBER_STATUS,
	CHANGE_PASSWORD,
	DELETE_MEMBER,
	EDIT_MEMBER,
	GET_MEMBERS,
	SEND_ACCOUNT_INFO,
	SEND_COMPANY_INFO,
	TOGGLE_IS_CANCELLED_SUBSCRIPTION,
	UPDATE_AREAS_OF_INTERESTS,
	UPDATE_BILLING_DETAILS,
	UPDATE_RELATED_TAGS,
	UPDATE_SECTORS_OF_COMPETENCE,
	GET_PAYMENT_PLANS,
	SEND_DISCOUNT_CODE,
	SEND_ENTERPRISE_CODE,
} from './index';
import { sendGallery } from '@api/settingsApi';
import { GET_PROFILE, GET_USER } from '@ducks/auth';
import { GET_SNACKBAR } from '@ducks/common';
import { SNACKBAR_DELAY } from '@constants/common';
import { setIsLoading } from '@ducks/auth/actions';
import { sendTwoFaCodeToPhone } from '@api/auth';
import { GET_PROFILE_STARTUP } from '@ducks/profile';

export const sendAccountInfo = ({ accountInfo, isRetailer, isMember }) => ({
	type: SEND_ACCOUNT_INFO,
	payload: { accountInfo, isRetailer, isMember },
});

export const sendCompanyInfo = (companyInfo, isRetailer) => ({
	type: SEND_COMPANY_INFO,
	payload: { companyInfo, isRetailer },
});

export const updateBillingDetails = billingDetails => ({
	type: UPDATE_BILLING_DETAILS,
	payload: { billingDetails },
});

export const changePassword = newPasswordData => ({
	type: CHANGE_PASSWORD,
	payload: { ...newPasswordData },
});

export const updateRelatedTags = relatedTags => ({
	type: UPDATE_RELATED_TAGS,
	payload: { ...relatedTags },
});

export const updateSectorsOfCompetence = sectorsOfCompetence => ({
	type: UPDATE_SECTORS_OF_COMPETENCE,
	payload: { ...sectorsOfCompetence },
});

export const updateAreasOfInterests = areasOfInterests => ({
	type: UPDATE_AREAS_OF_INTERESTS,
	payload: { ...areasOfInterests },
});

export const saveGallery = ({ galleryData, id }) => async dispatch => {
	await sendGallery(galleryData);

	dispatch({
		type: GET_USER,
	});
	dispatch({
		type: GET_PROFILE,
		payload: { id },
	});
	dispatch({
		type: GET_PROFILE_STARTUP,
		payload: { id },
	});

	dispatch({
		type: GET_SNACKBAR,
		payload: { snackbar: { text: 'Gallery is saved', type: 'info' }, delay: SNACKBAR_DELAY },
	});
};

export const addNewMember = ({ memberData, setFormError, onClose }) => ({
	type: ADD_NEW_MEMBER,
	payload: { memberData, setFormError, onClose },
});

export const getAllMembers = () => ({
	type: GET_MEMBERS,
});

export const changeMemberStatus = updatedMemberStatus => ({
	type: CHANGE_MEMBER_STATUS,
	payload: { updatedMemberStatus },
});

export const deleteMember = ({ memberId, onClose }) => ({
	type: DELETE_MEMBER,
	payload: { memberId, onClose },
});

export const editMember = ({ memberData, onClose, setFormError }) => ({
	type: EDIT_MEMBER,
	payload: { memberData, onClose, setFormError },
});

export const enableTwoFa = userTwoFaData => async dispatch => {
	try {
		dispatch(setIsLoading(true));

		return await sendTwoFaCodeToPhone(userTwoFaData);
	} catch (e) {
		dispatch(setIsLoading(false));

		return e.response.data.error_description;
	}
};

export const getUser = () => ({
	type: GET_USER,
});

export const toggleIsCancelledSubscription = ({ isCancelledSubscription }) => ({
	type: TOGGLE_IS_CANCELLED_SUBSCRIPTION,
	payload: { isCancelledSubscription },
});

export const getPaymentPlans = () => ({
	type: GET_PAYMENT_PLANS,
});

export const sendDiscount = discountCodeData => ({
	type: SEND_DISCOUNT_CODE,
	payload: { discountCodeData },
});

export const sendEnterprise = enterpriseCodeData => ({
	type: SEND_ENTERPRISE_CODE,
	payload: { enterpriseCodeData },
});
