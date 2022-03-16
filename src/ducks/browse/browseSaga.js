import { all, takeLatest, takeEvery, takeLeading } from 'redux-saga/effects';
import {
	setFieldWorker,
	getStartupFieldWorker,
	setFieldOutsideWorker,
	getExtremesForRangesWorker,
	displaySearchRestrictionWorker,
	displayCountOfSearchCharactersWorker,
	handleBookmarkWorker,
	getHistoryWorker,
	setHistoryFilterWorker,
	saveHistoryWorker,
	editHistoryWorker,
	removeSavedSearchWorker,
	getStartupFieldInForkWorker,
} from './sagas';
import {
	GET_FIELD,
	GET_FILTER_STARTUP,
	SET_FIELD_OUTSIDE,
	CLEAR_FIELD,
	SEARCH_RESTRICTION,
	SET_SEARCH_WARNING,
	SET_IS_BOOKMARK,
	GET_HISTORY,
	SET_HISTORY_FILTER,
	SAVE_SEARCH_HISTORY,
	EDIT_SEARCH_HISTORY,
	REMOVE_SAVED_SEARCH,
	GET_FILTER_STARTUP_IN_FORK,
} from './index';

export function* browseSaga() {
	all([
		yield takeEvery(GET_FIELD, setFieldWorker),
		yield takeEvery(SET_FIELD_OUTSIDE, setFieldOutsideWorker),
		yield takeLatest(GET_FILTER_STARTUP, getStartupFieldWorker),
		yield takeLeading(GET_FILTER_STARTUP_IN_FORK, getStartupFieldInForkWorker),
		yield takeLatest(CLEAR_FIELD, getExtremesForRangesWorker),
		yield takeEvery(SEARCH_RESTRICTION, displaySearchRestrictionWorker),
		yield takeEvery(SET_SEARCH_WARNING, displayCountOfSearchCharactersWorker),
		yield takeEvery(SET_IS_BOOKMARK, handleBookmarkWorker),
		yield takeEvery(GET_HISTORY, getHistoryWorker),
		yield takeLatest(SET_HISTORY_FILTER, setHistoryFilterWorker),
		yield takeLatest(SAVE_SEARCH_HISTORY, saveHistoryWorker),
		yield takeLatest(EDIT_SEARCH_HISTORY, editHistoryWorker),
		yield takeLatest(REMOVE_SAVED_SEARCH, removeSavedSearchWorker),
	]);
}

export default browseSaga;
