import { all, call, fork, put, select } from 'redux-saga/effects';
import {
	SET_PROFILE,
	SET_FEEDBACKS,
	SET_COUNT_FEEDBACKS,
	SET_IS_LOADING,
	SET_IS_LOADING_FEEDBACKS,
	SET_EXISTS_FEEDBACK,
	SET_RATE_STARS,
	SET_RATE_COUNT,
	SET_COUNT_ALL_FEEDBACKS,
	SET_IS_LOADING_SIMILAR_STARTUPS,
	SET_SIMILAR_STARTUPS,
} from './index';
import {
	getCountFeedback,
	getFeedback,
	createFeedback,
	getStartupProfile,
	getRetailerProfile,
	updateFeedback,
	removeFeedback,
	getCheckExistsFeedback,
	getProfileRating,
	getSimilarStartups,
} from '@api/profileApi';
import { downloadUserAvatar, getFileThumbnails } from '@api/fileUploadingApi';
import { toColor } from '@utils';
import { incTrialProfileWorker, onServerErrorHandler, setSnackbar } from '@ducks/common/sagas';
import enums from '@constants/enums';
import { trialPeriodProfileWarning } from '@ducks/profile/constants';
import { selectTrialData, selectUser } from '../../redux/selectors';

export function* setIsLoading(isLoading) {
	yield put({
		type: SET_IS_LOADING,
		payload: { isLoading },
	});
}

export function* setIsLoadingFeedbacks(isLoadingFeedbacks) {
	yield put({
		type: SET_IS_LOADING_FEEDBACKS,
		payload: { isLoadingFeedbacks },
	});
}

export function* setIsLoadingSimilarStartups(isLoadingSimilarStartups) {
	yield put({
		type: SET_IS_LOADING_SIMILAR_STARTUPS,
		payload: { isLoadingSimilarStartups },
	});
}

function* downloadAvatarOfFeedback(feedback) {
	try {
		return {
			...feedback,
			companyAvatar: {
				image: feedback.author?.logo60?.id
					? yield call(downloadUserAvatar, feedback.author?.logo60?.id)
					: '',
				name: !feedback.author?.logo60?.id ? feedback.author?.companyShortName : '',
				color: !feedback.author?.logo60?.id ? toColor(feedback.author?.id.toString()) : '',
			},
		};
	} catch (e) {
		yield fork(onServerErrorHandler, e);
	}
}

function* getLogoFeedbacks(feedbacks) {
	try {
		return yield all(feedbacks.map(feedback => downloadAvatarOfFeedback(feedback)),
		);
	} catch (e) {
		yield fork(onServerErrorHandler, e);
	}
}

export function* getProfileWorker({ payload: { id } }) {
	try {
		yield setIsLoading(true);
		const user = yield select(selectUser);

		if (user?.retailer) yield incTrialProfileWorker();

		const resp = yield call(getStartupProfile, id);
		const thumbnailIds = resp.documents.map(doc => doc.thumbnailId);
		const thumbnails = yield call(getFileThumbnails, thumbnailIds);

		const profile = {
			...resp,
			documents: resp.documents.map((doc, i) => ({ ...doc, thumbnail: thumbnails[i] })),
			logo60: {
				...resp.logo60,
				image: resp.logo60?.id
					? yield call(downloadUserAvatar, resp.logo60?.id)
					: '',
				name: !resp.logo60?.id ? resp?.companyShortName : '',
				color: !resp.logo60?.id ? toColor(resp?.id.toString()) : '',
			},
		};

		yield put({
			type: SET_PROFILE,
			payload: { profile },
		});
	} catch (e) {
		yield fork(onServerErrorHandler, e);
	} finally {
		yield setIsLoading(false);
	}
}

export function* getProfileRetailerWorker({ payload: { id } }) {
	try {
		yield setIsLoading(true);

		const respRetailer = yield call(getRetailerProfile, id);

		const profileRetailer = {
			...respRetailer,
			companyDescription: respRetailer.retailer.companyDescription,
			companyShortName: respRetailer.retailer.companyShortName,
			urlOfCompanyWebsite: respRetailer.retailer.urlOfCompanyWebsite,
			companySectors: respRetailer.retailer.companySectors,
			companyLegalName: respRetailer.retailer.companyLegalName,
			mainGoalInStartupHunting: respRetailer.retailer.mainGoalInStartupHunting,
			city: respRetailer.retailer.city,
			country: respRetailer.retailer.country,
			logo60: {
				...respRetailer.retailer.logo60,
				image: respRetailer.retailer?.logo60?.id
					? yield call(downloadUserAvatar, respRetailer.retailer.logo60?.id)
					: '',
				name: !respRetailer.retailer?.logo60?.id ? respRetailer?.retailer.companyShortName : '',
				color: !respRetailer.retailer?.logo60?.id ? toColor(respRetailer?.retailer?.id.toString()) : '',
			},
			user: {
				avatar: respRetailer.avatar,
				avatar30: respRetailer.avatar30,
				avatar60: respRetailer.avatar60,
				avatar120: respRetailer.avatar120,
				companyShortName: respRetailer.retailer.companyShortName,
				firstName: respRetailer.firstName,
				fullName: respRetailer.fullName,
				id: respRetailer.id,
				lastName: respRetailer.lastName,
				position: respRetailer.position,
			},
		};

		yield put({
			type: SET_PROFILE,
			payload: { profile: profileRetailer },
		});
	} catch (e) {
		yield fork(onServerErrorHandler, e);
	} finally {
		yield setIsLoading(false);
	}
}

export function* handleCreateFeedbacksWorker({ payload: { data, id, isEditMode } }) {
	try {
		yield setIsLoadingFeedbacks(true);

		if (isEditMode)
			yield call(updateFeedback, data, id);
		 else
			yield call(createFeedback, data, id);

		yield getFeedbacksInfoWorker({ payload: { data: { isAllStars: true, page: 0, pageSize: 5, rate: null }, id } });
	} catch (e) {
		yield fork(onServerErrorHandler, e);
	} finally {
		yield setIsLoadingFeedbacks(false);
	}
}

function* getFeedbacksWorker({ payload: { data, id } }) {
	try {
		const { items } = yield call(getFeedback, data, id);
		const feedbacks = yield getLogoFeedbacks(items);

		yield put({
			type: SET_FEEDBACKS,
			payload: { feedbacks },
		});

		const { flag } = yield call(getCheckExistsFeedback, id);

		yield put({
			type: SET_EXISTS_FEEDBACK,
			payload: { flag },
		});
	} catch (e) {
		yield fork(onServerErrorHandler, e);
	}
}

function* getCountFeedbacksWorker({ payload: { data, id } }) {
	try {
		const { count } = yield call(getCountFeedback, data, id);

		yield put({
			type: SET_COUNT_FEEDBACKS,
			payload: { count },
		});
	} catch (e) {
		yield fork(onServerErrorHandler, e);
	}
}

function* getCountAllFeedbacksWorker({ payload: { id } }) {
	try {
		const data = {
			isAllStars: true,
			rate: null,
		};

		const { count } = yield call(getCountFeedback, data, id);

		yield put({
			type: SET_COUNT_ALL_FEEDBACKS,
			payload: { count },
		});
	} catch (e) {
		yield fork(onServerErrorHandler, e);
	}
}

function* getProfileRatingWorker({ payload: { id } }) {
	try {
		const { stars, rate } = yield call(getProfileRating, id);

		yield put({
			type: SET_RATE_STARS,
			payload: { stars },
		});

		yield put({
			type: SET_RATE_COUNT,
			payload: { rate },
		});
	} catch (e) {
		yield fork(onServerErrorHandler, e);
	}
}

export function* getFeedbacksInfoWorker({ payload: { data: { isAllStars, page, pageSize, rate }, id } }) {
	yield setIsLoadingFeedbacks(true);

	try {
		const dataFeedbacks = {
			isAllStars,
			page,
			pageSize,
			rate,
		};
		const dataCount = {
			isAllStars,
			rate,
		};

		yield all([
			getFeedbacksWorker({ payload: { data: dataFeedbacks, id } }),
			getCountFeedbacksWorker({ payload: { data: dataCount, id } }),
			getCountAllFeedbacksWorker({ payload: { id } }),
			getProfileRatingWorker({ payload: { id } }),
		]);
	} catch (e) {
		yield fork(onServerErrorHandler, e);
	} finally {
		yield setIsLoadingFeedbacks(false);
	}
}

export function* handleRemoveFeedbacksWorker({ payload: { data, id } }) {
	try {
		yield setIsLoadingFeedbacks(true);

		yield call(removeFeedback, { id: data.id }, id);

		yield getFeedbacksInfoWorker({ payload: { data: { isAllStars: true, page: 0, pageSize: 5, rate: null }, id } });
	} catch (e) {
		yield fork(onServerErrorHandler, e);
	} finally {
		yield setIsLoadingFeedbacks(false);
	}
}

export function* displayProfileRestrictionWorker() {
	try {
		yield setIsLoading(true);

		const { trialProfileMax } = yield select(selectTrialData);

		yield setSnackbar({
			text: trialPeriodProfileWarning(trialProfileMax),
			type: enums.snackbarTypes.warning,
		});
	} catch (e) {
		yield onServerErrorHandler(e);
	} finally {
		yield setIsLoading(false);
	}
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

export function* getSimilarStartupsWorker({ payload: { data } }) {
	try {
		yield setIsLoadingSimilarStartups(true);

		const { items } = yield call(getSimilarStartups, data.startupId);

		const  similarStartups = yield call(getLogoStartup, items);

		yield put({
			type: SET_SIMILAR_STARTUPS,
			payload: { similarStartups },
		});
	} catch (e) {
		yield fork(onServerErrorHandler, e);
	} finally {
		yield setIsLoadingSimilarStartups(false);
	}
}
