import { all, takeEvery, takeLeading } from 'redux-saga/effects';
import {
	getCountriesWorker,
	getPaymentPlansWorker,
	getCategoriesWorker,
	getTagsWorker,
	viewedHistoryProfileWorker,
	getSnackbarWorker,
	deleteSnackbarWorker,
	getDepartmentsWorker,
	getPositionsWorker,
	getPlatformPartnersWorker,
	sendMissionWorker,
	getTrialDataWorker,
	incTrialProfileWorker,
	incTrialSearchWorker,
	getTrialDataInForkWorker,
	getStartupsOptionsWorker,
	getPaymentPlansOptionsWorker,
} from './sagas';
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
	INC_TRIAL_PROFILE,
	INC_TRIAL_SEARCH,
	GET_STARTUPS_OPTIONS,
	GET_PAYMENT_PLANS_FOR_COUPONS,
} from './index';

export function* commonSaga() {
	all([
		yield takeLeading(GET_COUNTRIES, getCountriesWorker),
		yield takeLeading(GET_PAYMENT_PLANS, getPaymentPlansWorker),
		yield takeLeading(GET_CATEGORIES, getCategoriesWorker),
		yield takeLeading(GET_ALL_TAGS, getTagsWorker),
		yield takeEvery(GET_VIEWED_PROFILE, viewedHistoryProfileWorker),
		yield takeEvery(GET_SNACKBAR, getSnackbarWorker),
		yield takeEvery(DELETE_SNACKBAR, deleteSnackbarWorker),
		yield takeLeading(GET_DEPARTMENTS, getDepartmentsWorker),
		yield takeLeading(GET_POSITIONS, getPositionsWorker),
		yield takeLeading(GET_PLATFORM_PARTNERS, getPlatformPartnersWorker),
		yield takeLeading(SEND_MISSION, sendMissionWorker),
		yield takeLeading(GET_TRIAL, getTrialDataWorker),
		yield takeLeading(GET_TRIAL_IN_FORK, getTrialDataInForkWorker),
		yield takeLeading(INC_TRIAL_PROFILE, incTrialProfileWorker),
		yield takeLeading(INC_TRIAL_SEARCH, incTrialSearchWorker),
		yield takeLeading(GET_STARTUPS_OPTIONS, getStartupsOptionsWorker),
		yield takeLeading(GET_PAYMENT_PLANS_FOR_COUPONS, getPaymentPlansOptionsWorker),
	]);
}

export default commonSaga;
