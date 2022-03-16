import {
	GET_FIELD,
	CLEAR_FIELD,
	GET_FILTER_STARTUP,
	SET_FIELD_OUTSIDE,
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

export const setFieldForFilter = data => ({
	type: GET_FIELD,
	payload: data,
});

export const setFieldOutsideForFilter = data => ({
	type: SET_FIELD_OUTSIDE,
	payload: data,
});

export const setDefaultFieldForFilter = () => ({
	type: CLEAR_FIELD,
});

export const getStartupFilter = () => ({
	type: GET_FILTER_STARTUP,
});

export const getStartupFilterInFork = () => ({
	type: GET_FILTER_STARTUP_IN_FORK,
});

export const setWarningOfSearchRestriction = () => ({
	type: SEARCH_RESTRICTION,
});

export const setWarningOfCountCharactersSearch = () => ({
	type: SET_SEARCH_WARNING,
});

export const setIsBookmark = data => ({
	type: SET_IS_BOOKMARK,
	payload: data,
});

export const getHistory = () => ({
	type: GET_HISTORY,
});

export const setHistoryFilter = data => ({
	type: SET_HISTORY_FILTER,
	payload: data,
});

export const setSearchHistory = data => ({
	type: SAVE_SEARCH_HISTORY,
	payload: data,
});

export const editSearchHistory = data => ({
	type: EDIT_SEARCH_HISTORY,
	payload: data,
});

export const removeSavedSearch = data => ({
	type: REMOVE_SAVED_SEARCH,
	payload: data,
});
