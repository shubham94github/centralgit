import { all, takeEvery, takeLeading } from 'redux-saga/effects';
import { getHomeInfoWorker, sendEmailForStartupWorker } from './sagas';
import { GET_HOME_INFO, SEND_EMAIL } from './index';

export function* homeSaga() {
	all([
		yield takeLeading(GET_HOME_INFO, getHomeInfoWorker),
		yield takeEvery(SEND_EMAIL, sendEmailForStartupWorker),
	]);
}

export default homeSaga;
