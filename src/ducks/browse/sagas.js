import {
  SET_FIELD,
  SET_IS_LOADING,
  SET_STARTUPS,
  SET_COUNT,
  SET_RANGE,
  SET_HISTORY,
  SET_SAVED_SEARCH_HISTORY,
  SET_IS_HISTORY_LOADING,
} from "./index";
import { all, call, fork, put, select } from "redux-saga/effects";
import {
  getFilterStartups,
  getExtremesForRanges,
  removeBookmark,
  saveBookmark,
  getSearchHistory,
  saveSearchHistory,
  getSavedSearchHistory,
  editSearchHistory,
  removeSavedSearch,
} from "@api/browseApi";
import { downloadUserAvatar } from "@api/fileUploadingApi";
import { toColor } from "@utils";
import { isEmpty } from "@utils/js-helpers";
import {
  incTrialSearchWorker,
  onServerErrorHandler,
  setSnackbar,
} from "@ducks/common/sagas";
import enums from "@constants/enums";
import {
  trialPeriodSearchWarning,
  minCharactersSearchWarning,
  defaultFilterCategories,
} from "@ducks/browse/constants";
import {
  selectListOfStartupsBrowse,
  selectStartupProfile,
  selectTrialData,
  selectFilterCategories,
  selectSavedSearchHistory,
} from "../../redux/selectors";
import {
  replaceListOfStartups,
  replaceStartupProfile,
} from "@utils/bookmarksHelper";
import { SET_PROFILE } from "@ducks/profile";
import { clearCache } from "@utils/promiseMemoize";
import { getStartupProfile } from "@api/profileApi";

export function* setIsLoading(isLoading) {
  yield put({
    type: SET_IS_LOADING,
    payload: { isLoading },
  });
}

export function* setIsHistoryLoading(isHistoryLoading) {
  yield put({
    type: SET_IS_HISTORY_LOADING,
    payload: { isHistoryLoading },
  });
}

export function* getExtremesForRangesWorker() {
  try {
    const {
      browse: { extremesForRanges, filterCategories },
    } = yield select();

    if (
      isEmpty(filterCategories.numberOfClients) ||
      isEmpty(filterCategories.totalFundingAmount) ||
      isEmpty(extremesForRanges)
    ) {
      const extremes = isEmpty(extremesForRanges)
        ? yield call(getExtremesForRanges)
        : extremesForRanges;

      yield put({
        type: SET_RANGE,
        payload: { extremes },
      });

      yield put({
        type: SET_FIELD,
        payload: {
          field: {
            numberOfClients: [
              extremes.numberOfClientsMin,
              extremes.numberOfClientsMax,
            ],
            totalFundingAmount: [
              extremes.totalFundingAmountMin,
              extremes.totalFundingAmountMax,
            ],
          },
        },
      });
    }
  } catch (e) {
    yield fork(onServerErrorHandler, e);
  }
}

export function* setFieldOutsideWorker({ payload }) {
  try {
    const field = { [payload.field]: payload.data };

    if (field) {
      if (payload.field !== "page") {
        yield put({
          type: SET_FIELD,
          payload: { field: { page: 1 } },
        });
      }

      yield put({
        type: SET_FIELD,
        payload: { field },
      });
    }
  } catch (e) {
    yield fork(onServerErrorHandler, e);
  }
}

export function* setHistoryFilterWorker({ payload }) {
  try {
    yield setIsLoading(true);

    const field = {
      ...defaultFilterCategories,
      ...payload,
    };

    yield put({
      type: SET_FIELD,
      payload: { field },
    });

    yield getStartupFieldWorker();
  } catch (e) {
    yield fork(onServerErrorHandler, e);
  } finally {
    yield setIsLoading(false);
  }
}

export function* setFieldWorker({ payload }) {
  try {
    yield setIsLoading(true);

    yield setFieldOutsideWorker({ payload });
    yield getStartupFieldWorker();
  } catch (e) {
    yield fork(onServerErrorHandler, e);
  } finally {
    yield setIsLoading(false);
  }
}

function* downloadLogoOfFilterStartup(startup, logo) {
  try {
    return {
      ...startup,
      logo120: {
        ...startup.logo120,
        image: startup.logo120?.id ? logo : "",
        name: !startup.logo120?.id ? startup?.companyShortName : "",
        color: !startup.logo120?.id ? toColor(startup?.id.toString()) : "",
      },
    };
  } catch (e) {
    yield fork(onServerErrorHandler, e);
  }
}
// 1 time set
function* getLogoFilterStartup(items) {
  try {
    yield setIsLoading(true);

    const logos = yield all(
      items.map((item) => call(downloadUserAvatar, item.logo120?.id))
    );

    const startupsWithLogos = yield all(
      items.map((startup, i) => downloadLogoOfFilterStartup(startup, logos[i]))
    );

    yield all([
      put({
        type: SET_STARTUPS,
        payload: { startups: startupsWithLogos },
      }),
    ]);
  } catch (e) {
    yield fork(onServerErrorHandler, e);
  } finally {
    yield setIsLoading(false);
  }
}
// 2 time set

export function* getStartupItemsWorker() {
  try {
    yield setIsLoading(true);

    yield incTrialSearchWorker();

    const {
      browse: { filterCategories },
    } = yield select();
    const lastIndexCategory = filterCategories.categoryIds?.length - 1;
    const categoryIds =
      lastIndexCategory >= 0
        ? [filterCategories.categoryIds[lastIndexCategory]]
        : [];

    const { items, count } = yield call(getFilterStartups, {
      ...filterCategories,
      categoryIds,
      //   filterClientName: "Onesource virtual",
    });

    yield fork(getLogoFilterStartup, items);

    yield all([
      put({
        type: SET_COUNT,
        payload: { count },
      }),
      put({
        type: SET_STARTUPS,
        payload: { startups: items },
      }),
    ]);
  } catch (e) {
    yield fork(onServerErrorHandler, e);
  } finally {
    yield setIsLoading(false);
  }
}

export function* getStartupFieldWorker() {
  try {
    yield setIsLoading(true);

    yield all([call(getExtremesForRangesWorker), call(getStartupItemsWorker)]);
  } catch (e) {
    yield fork(onServerErrorHandler, e);
  } finally {
    yield setIsLoading(false);
  }
}

export function* getStartupFieldInForkWorker() {
  yield fork(getStartupFieldWorker);
}

export function* displaySearchRestrictionWorker() {
  try {
    yield setIsLoading(true);

    const { trialSearchMax } = yield select(selectTrialData);

    yield setSnackbar({
      text: trialPeriodSearchWarning(trialSearchMax),
      type: enums.snackbarTypes.warning,
    });
  } catch (e) {
    yield onServerErrorHandler(e);
  } finally {
    yield setIsLoading(false);
  }
}

export function* displayCountOfSearchCharactersWorker() {
  try {
    yield setIsLoading(true);

    yield setSnackbar({
      text: minCharactersSearchWarning,
      type: enums.snackbarTypes.warning,
    });
  } catch (e) {
    yield onServerErrorHandler(e);
  } finally {
    yield setIsLoading(false);
  }
}
//3rd time set
export function* handleBookmarkWorker({ payload: { id, isBookmarked } }) {
  try {
    yield setIsLoading(true);

    yield call(getStartupProfile, clearCache);

    const startups = yield select(selectListOfStartupsBrowse);
    const profile = yield select(selectStartupProfile);

    if (isBookmarked) yield call(removeBookmark, id);
    else yield call(saveBookmark, id);

    if (profile) {
      yield put({
        type: SET_PROFILE,
        payload: {
          profile: replaceStartupProfile(profile, !isBookmarked),
        },
      });
    } else {
      yield put({
        type: SET_STARTUPS,
        payload: {
          startups: replaceListOfStartups(startups, id, !isBookmarked),
        },
      });
    }
  } catch (e) {
    yield onServerErrorHandler(e);
  } finally {
    yield setIsLoading(false);
  }
}

export function* getHistoryWorker() {
  try {
    yield setIsHistoryLoading(true);

    const [{ items: searchHistory }, { items: savedSearchHistory }] = yield all(
      [call(getSearchHistory), call(getSavedSearchHistory)]
    );

    yield all([
      put({
        type: SET_HISTORY,
        payload: { searchHistory },
      }),
      put({
        type: SET_SAVED_SEARCH_HISTORY,
        payload: { savedSearchHistory },
      }),
    ]);
  } catch (e) {
    yield onServerErrorHandler(e);
  } finally {
    yield setIsHistoryLoading(false);
  }
}

export function* saveHistoryWorker({ payload: { data } }) {
  try {
    yield setIsHistoryLoading(true);

    const { title } = data;
    const filterCategories = yield select(selectFilterCategories);
    const savedSearchHistory = yield select(selectSavedSearchHistory);

    const savedSearchHistoryItem = yield call(saveSearchHistory, {
      ...filterCategories,
      title,
    });

    yield put({
      type: SET_SAVED_SEARCH_HISTORY,
      payload: {
        savedSearchHistory: [savedSearchHistoryItem, ...savedSearchHistory],
      },
    });
  } catch (e) {
    yield onServerErrorHandler(e);
  } finally {
    yield setIsHistoryLoading(false);
  }
}

export function* editHistoryWorker({ payload: { data } }) {
  try {
    yield setIsHistoryLoading(true);

    const { savedSearchId, title } = data;
    const savedSearchHistory = yield select(selectSavedSearchHistory);

    const changedSearchHistoryItem = yield call(editSearchHistory, {
      savedSearchId,
      title,
    });

    yield put({
      type: SET_SAVED_SEARCH_HISTORY,
      payload: {
        savedSearchHistory: savedSearchHistory.map((history) => {
          if (history.id === savedSearchId) return changedSearchHistoryItem;

          return history;
        }),
      },
    });
  } catch (e) {
    yield onServerErrorHandler(e);
  } finally {
    yield setIsHistoryLoading(false);
  }
}

export function* removeSavedSearchWorker({ payload: { data } }) {
  try {
    yield setIsHistoryLoading(true);

    const { savedSearchId } = data;
    const savedSearchHistory = yield select(selectSavedSearchHistory);

    yield call(removeSavedSearch, savedSearchId);

    yield put({
      type: SET_SAVED_SEARCH_HISTORY,
      payload: {
        savedSearchHistory: savedSearchHistory.filter(
          (history) => history.id !== savedSearchId
        ),
      },
    });
  } catch (e) {
    yield onServerErrorHandler(e);
  } finally {
    yield setIsHistoryLoading(false);
  }
}
