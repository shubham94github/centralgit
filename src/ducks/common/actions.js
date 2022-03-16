import { SNACKBAR_DELAY } from '@constants/common';
import {
	GET_COUNTRIES,
	GET_PAYMENT_PLANS,
	GET_CATEGORIES,
	GET_ALL_TAGS,
	GET_VIEWED_PROFILE,
	GET_SNACKBAR,
	DELETE_SNACKBAR,
	GET_DEPARTMENTS,
	GET_POSITIONS,
	GET_PLATFORM_PARTNERS,
	SEND_MISSION,
	GET_TRIAL,
	GET_TRIAL_IN_FORK,
	GET_STARTUPS_OPTIONS,
	GET_PAYMENT_PLANS_FOR_COUPONS,
} from './index';
import { SET_PAYMENT_PLAN_ID } from '@ducks/auth';

export const getCountries = () => ({
	type: GET_COUNTRIES,
});

export const getCategories = () => ({
	type: GET_CATEGORIES,
});

export const getPaymentPlans = paymentPlansData => ({
	type: GET_PAYMENT_PLANS,
	payload: { paymentPlansData },
});

export const getAllTags = () => ({
	type: GET_ALL_TAGS,
});

export const getViewedProfile = id => ({
	type: GET_VIEWED_PROFILE,
	payload: id,
});

export const setSnackbar = (snackbar, delay = SNACKBAR_DELAY) => ({
	type: GET_SNACKBAR,
	payload: { snackbar, delay },
});

export const deleteSnackbar = id => ({
	type: DELETE_SNACKBAR,
	payload: { id },
});

export const getDepartments = () => ({
	type: GET_DEPARTMENTS,
});

export const getPositions = () => ({
	type: GET_POSITIONS,
});

export const getPlatformPartners = () => ({
	type: GET_PLATFORM_PARTNERS,
});

export const sendMission = data => ({
	type: SEND_MISSION,
	payload: { data },
});

export const getTrialData = () => ({
	type: GET_TRIAL,
});

export const getTrialDataInFork = () => ({
	type: GET_TRIAL_IN_FORK,
});

export const getStartupsOptions = () => ({
	type: GET_STARTUPS_OPTIONS,
});

export const getPaymentPlansOptions = () => ({
	type: GET_PAYMENT_PLANS_FOR_COUPONS,
});

export const updatePaymentPlanForUnpaidUser = paymentPlanId => ({
	type: SET_PAYMENT_PLAN_ID,
	payload: {
		paymentPlanId,
	},
});
