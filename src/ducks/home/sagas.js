import { SET_IS_LOADING, SET_NEW_STARTUPS, SET_RATED_STARTUPS, SET_RELATED_STARTUPS } from './index';
import { call, put, all, fork, cancel } from 'redux-saga/effects';
import { getNewStartups, getTopRatedStartups, sendEmailForStartup, getRelatedStartups } from '@api/homeApi';
import { downloadUserAvatar } from '@api/fileUploadingApi';
import { toColor } from '@utils';
import { onServerErrorHandler } from '@ducks/common/sagas';

export function* setIsLoading(isLoading) {
	yield put({
		type: SET_IS_LOADING,
		payload: { isLoading },
	});
}

function* downloadLogoOfStartup(startup) {
	try {
		return {
			...startup,
			logo120: {
				...startup.logo120,
				image: startup.logo120?.id
					? yield call(downloadUserAvatar, startup.logo120.id)
					: '',
				name: !startup.logo120?.id ? startup?.companyShortName : '',
				color: !startup.logo120?.id ? toColor(startup?.id.toString()) : '',
			},
		};
	} catch (e) {
		yield fork(onServerErrorHandler, e);
	}
}

function* getLogoStartup(items) {
	try {
		return yield all(items.map(startup => downloadLogoOfStartup(startup)));
	} catch (e) {
		yield fork(onServerErrorHandler, e);
	}
}

export function* getNewStartupsWorker() {
	try {
		const { items } = yield call(getNewStartups);
		const newStartups = yield call(getLogoStartup, items);

		yield put({
			type: SET_NEW_STARTUPS,
			payload: { newStartups },
		});
	} catch (e) {
		yield fork(onServerErrorHandler, e);
	}
}

export function* relatedStartupsWorker() {
	try {
		const { items } = yield call(getRelatedStartups);
		const relatedStartups = yield call(getLogoStartup, items);

		yield put({
			type: SET_RELATED_STARTUPS,
			payload: { relatedStartups },
		});
	} catch (e) {
		yield fork(onServerErrorHandler, e);
	}
}

export function* getTopRatedStartupsWorker() {
	try {
		const { items } = yield call(getTopRatedStartups);
		const ratedStartups = yield call(getLogoStartup, items);

		yield put({
			type: SET_RATED_STARTUPS,
			payload: { ratedStartups },
		});
	} catch (e) {
		yield fork(onServerErrorHandler, e);
	}
}

export function* getHomeInfoWorker() {
	let getChannelsByUserIdSaga;

	try {
		yield setIsLoading(true);

		yield all([
			call(getNewStartupsWorker),
			call(getTopRatedStartupsWorker),
			call(relatedStartupsWorker),
		]);
	} catch (e) {
		yield all([
			cancel(getChannelsByUserIdSaga),
			onServerErrorHandler(e),
		]);
	} finally {
		yield setIsLoading(false);
	}
}

export function* sendEmailForStartupWorker({ payload: data }) {
	try {
		yield call(sendEmailForStartup, data);
	} catch (e) {
		yield fork(onServerErrorHandler, e);
	}
}
