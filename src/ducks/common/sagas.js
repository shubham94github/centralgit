import { SNACKBAR_DELAY } from '@constants/common';
import {
	SET_SNACKBAR,
	SET_COUNTRIES,
	SET_PAYMENT_PLANS,
	SET_CATEGORIES,
	SET_ALL_TAGS,
	SET_DEPARTMENTS,
	SET_POSITIONS,
	SET_PLATFORM_PARTNERS,
	SET_TRIAL,
	SET_IS_LOADING,
	SET_STARTUPS_OPTIONS,
	SET_PAYMENT_PLANS_FOR_COUPONS,
} from './index';
import { call, put, select, delay, all, fork } from 'redux-saga/effects';
import {
	getCountries,
	getPaymentPlans,
	getCategories,
	getAllTags,
	saveViewedHistoryProfile,
	getAllDepartments,
	getAllPositions,
	getAllPlatformPartners,
	sendMission,
	getTrial,
	getStartupsOptions,
	getPaymentPlansForCoupons,
} from '@api/commonApi';
import { optionsMapper, optionsMapperForStartups } from '@utils/optionsMapper';
import { HANDLE_LOG_OUT } from '../auth';
import { v4 as uuid } from 'uuid';
import { downloadCategoryIcon  } from '@api/fileUploadingApi';
import enums from '@constants/enums';
import { selectTrialData } from '../../redux/selectors';
import history from '../../history';
import { Routes } from '@routes';

export const invalidTokenErr = 'invalid_token';
const commonServerErrorMessage = 'Sorry. Unknown server error. Try again later';
const successfulMissionMessage = 'Your Mission was sent!';

export function* onServerErrorHandler(error, isSetSnackbar = true) {
	if (error.error === invalidTokenErr || error?.response?.status === 401) {
		yield put({
			type: HANDLE_LOG_OUT,
		});
	} else if (isSetSnackbar) {
		yield setSnackbar({
			text: error?.message || error?.error_description || commonServerErrorMessage,
			type: enums.snackbarTypes.warning,
		});
	}
}

export function* setIsLoading(isLoading) {
	yield put({
		type: SET_IS_LOADING,
		payload: { isLoading },
	});
}

export function* getCountriesWorker() {
	yield setIsLoading(true);

	try {
		const { data: { items } } = yield call(getCountries);
		const countries = optionsMapper(items);

		yield put({
			type: SET_COUNTRIES,
			payload: {
				countries,
			},
		});
	} catch (e) {
		yield fork(onServerErrorHandler, e);
	} finally {
		yield setIsLoading(false);
	}
}

export function* getTagsWorker() {
	try {
		yield setIsLoading(true);

		const { items } = yield call(getAllTags);
		const tags = optionsMapper(items);

		yield put({
			type: SET_ALL_TAGS,
			payload: {
				tags,
			},
		});
	} catch (e) {
		yield fork(onServerErrorHandler, e);
	} finally {
		yield setIsLoading(false);
	}
}

export function* deleteSnackbarWorker({ payload: { id } }) {
	const { common: { snackbars } } = yield select();

	const newSnackbars = id
		? snackbars.filter(snackbar => snackbar.id !== id)
		: [];

	yield put({
		type: SET_SNACKBAR,
		payload: {
			snackbars: [...newSnackbars],
		},
	});
}

export function* getSnackbarWorker({ payload: { snackbar, delay: ms = SNACKBAR_DELAY } }) {
	const { common: { snackbars } } = yield select();
	const id = uuid();

	yield put({
		type: SET_SNACKBAR,
		payload: {
			snackbars: [...snackbars, {
				...snackbar,
				id,
			}],
		},
	});

	yield delay(ms);
	yield deleteSnackbarWorker({ payload: { id } });
}

export function* setSnackbar(snackbar) {
	yield getSnackbarWorker({
		payload: {
			snackbar,
			delay: SNACKBAR_DELAY,
		},
	});
}

export function* getPaymentPlansWorker({ payload: { paymentPlansData } }) {
	yield setIsLoading(true);

	try {
		const { data: { items, features: { items: plansFeatures } } } = yield call(getPaymentPlans, paymentPlansData);

		yield put({
			type: SET_PAYMENT_PLANS,
			payload: {
				paymentPlans: items,
				plansFeatures,
			},
		});
	} catch (e) {
		yield fork(onServerErrorHandler, e);
	} finally {
		yield setIsLoading(false);
	}
}

function* downloadSvgForCategory(category) {
	try {
		return {
			...category,
			logo: {
				...category.logo,
				svg: category.logo?.id
					? yield call(downloadCategoryIcon, category.logo.id)
					: '',
			},
			areasLogo: {
				...category.areasLogo,
				svg: category.areasLogo?.id
					? yield call(downloadCategoryIcon, category.areasLogo.id)
					: '',
			},
		};
	} catch (e) {
		yield onServerErrorHandler(e);
	}
}

function* getSvgForCategories(items) {
	try {
		return yield all(items.map(category => downloadSvgForCategory(category)));
	} catch (e) {
		yield onServerErrorHandler(e);
	}
}

export function* getCategoriesWorker() {
	try {
		yield setIsLoading(true);

		const { items } = yield call(getCategories);
		const categories = yield call(getSvgForCategories, optionsMapper(items));

		yield put({
			type: SET_CATEGORIES,
			payload: {
				categories,
			},
		});
	} catch (e) {
		yield fork(onServerErrorHandler, e);
	} finally {
		yield setIsLoading(false);
	}
}

export function* viewedHistoryProfileWorker({ payload: { id } }) {
	try {
		yield call(saveViewedHistoryProfile, id);
	} catch (e) {
		yield fork(onServerErrorHandler, e);
	}
}

export function* getDepartmentsWorker() {
	try {
		yield setIsLoading(true);

		const resp = yield call(getAllDepartments);

		yield put({
			type: SET_DEPARTMENTS,
			payload: { departments: resp.items.map(item => ({
				...item,
				label: item.name,
				value: item.id,
			})) },
		});
	} catch (e) {
		yield fork(onServerErrorHandler, e);
	} finally {
		yield setIsLoading(false);
	}
}

export function* getPositionsWorker() {
	try {
		yield setIsLoading(true);

		const resp = yield call(getAllPositions);

		yield put({
			type: SET_POSITIONS,
			payload: { positions: resp.items.map(item => ({
				...item,
				label: item.name,
				value: item.id,
			})) },
		});
	} catch (e) {
		yield fork(onServerErrorHandler, e);
	} finally {
		yield setIsLoading(false);
	}
}

export function* getPlatformPartnersWorker() {
	try {
		yield setIsLoading(true);

		const { items } = yield call(getAllPlatformPartners);
		const platformPartners = optionsMapper(items);

		yield put({
			type: SET_PLATFORM_PARTNERS,
			payload: { platformPartners },
		});
	} catch (e) {
		yield fork(onServerErrorHandler, e);
	} finally {
		yield setIsLoading(false);
	}
}

export function* sendMissionWorker({ payload: { data } }) {
	try {
		yield setIsLoading(true);

		yield call(sendMission, data);

		yield setSnackbar({
			text: successfulMissionMessage,
			type: enums.snackbarTypes.info,
		});
	} catch (e) {
		yield onServerErrorHandler(e);
	} finally {
		yield setIsLoading(false);
	}
}

export function* getTrialDataWorker() {
	try {
		const {
			isTrial,
			trialSearch,
			trialProfile,
			trialSearchMax,
			trialProfileMax,
		} = yield call(getTrial);

		if (isTrial) {
			const isTrialSearch = trialSearch < trialSearchMax;
			const isTrialProfile = trialProfile < trialProfileMax;

			const trialData = {
				isTrial,
				trialSearch,
				trialProfile,
				trialSearchMax,
				trialProfileMax,
				isTrialSearch,
				isTrialProfile,
			};

			yield put({
				type: SET_TRIAL,
				payload: {
					trialData,
				},
			});
		}
	} catch (e) {
		yield onServerErrorHandler(e);
	}
}

export function* getTrialDataInForkWorker() {
	try {
		const {
			isTrial,
			trialSearch,
			trialProfile,
			trialSearchMax,
			trialProfileMax,
		} = yield call(getTrial);

		if (isTrial) {
			const isTrialSearch = trialSearch < trialSearchMax;
			const isTrialProfile = trialProfile < trialProfileMax;

			const trialData = {
				isTrial,
				trialSearch,
				trialProfile,
				trialSearchMax,
				trialProfileMax,
				isTrialSearch,
				isTrialProfile,
			};

			yield put({
				type: SET_TRIAL,
				payload: {
					trialData,
				},
			});
		}
	} catch (e) {
		yield onServerErrorHandler(e);
	}
}

export function* incTrialProfileWorker() {
	try {
		yield getTrialDataWorker();

		const trialData = yield select(selectTrialData);

		if (!trialData) return;

		const { trialProfile, trialProfileMax } = trialData;

		if (trialProfile >= trialProfileMax) history.push(Routes.HOME);
		else {
			yield put({
				type: SET_TRIAL,
				payload: {
					trialData: {
						...trialData,
						trialProfile: trialProfile + 1,
						isTrialProfile: trialProfile + 1 < trialProfileMax,
					},
				},
			});
		}
	} catch (e) {
		yield onServerErrorHandler(e);
	}
}

export function* incTrialSearchWorker() {
	try {
		yield getTrialDataWorker();

		const trialData = yield select(selectTrialData);

		if (!trialData) return;

		const { trialSearch, trialSearchMax } = trialData;

		yield put({
			type: SET_TRIAL,
			payload: {
				trialData: {
					...trialData,
					isTrialSearch: trialSearch < trialSearchMax,
				},
			},
		});
	} catch (e) {
		yield onServerErrorHandler(e);
	}
}

export function* getStartupsOptionsWorker() {
	try {
		setIsLoading(true);

		const { items } = yield call(getStartupsOptions);

		const startupsOptions = optionsMapperForStartups(items);

		yield put({
			type: SET_STARTUPS_OPTIONS,
			payload: {
				startupsOptions,
			},
		});
	} catch (e) {
		yield onServerErrorHandler(e);
	} finally {
		setIsLoading(false);
	}
}

export function* getPaymentPlansOptionsWorker() {
	try {
		setIsLoading(true);

		const { items } = yield call(getPaymentPlansForCoupons);

		const paymentPlansForCoupons = optionsMapper(items);

		yield put({
			type: SET_PAYMENT_PLANS_FOR_COUPONS,
			payload: {
				paymentPlansForCoupons,
			},
		});
	} catch (e) {
		yield onServerErrorHandler(e);
	} finally {
		setIsLoading(false);
	}
}
