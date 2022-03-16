import { all, takeEvery, takeLeading } from 'redux-saga/effects';
import {
	getProfileWorker,
	getProfileRetailerWorker,
	handleCreateFeedbacksWorker,
	getFeedbacksInfoWorker,
	handleRemoveFeedbacksWorker,
	displayProfileRestrictionWorker,
	getSimilarStartupsWorker,
} from './sagas';
import {
	GET_PROFILE_STARTUP,
	GET_PROFILE_RETAILER,
	HANDLE_CREATE_FEEDBACK,
	GET_FEEDBACKS_INFO,
	HANDLE_REMOVE_FEEDBACK,
	PROFILE_RESTRICTION,
	GET_SIMILAR_STARTUPS,
} from './index';

export function* profileSaga() {
	all([
		yield takeEvery(GET_PROFILE_STARTUP, getProfileWorker),
		yield takeEvery(GET_PROFILE_RETAILER, getProfileRetailerWorker),
		yield takeEvery(HANDLE_CREATE_FEEDBACK, handleCreateFeedbacksWorker),
		yield takeEvery(GET_FEEDBACKS_INFO, getFeedbacksInfoWorker),
		yield takeEvery(HANDLE_REMOVE_FEEDBACK, handleRemoveFeedbacksWorker),
		yield takeEvery(PROFILE_RESTRICTION, displayProfileRestrictionWorker),
		yield takeLeading(GET_SIMILAR_STARTUPS, getSimilarStartupsWorker),
	]);
}

export default profileSaga;
