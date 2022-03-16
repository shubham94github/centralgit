import { Record } from 'immutable';
import {
	SET_FIELD,
	CLEAR_FIELD,
	SET_IS_LOADING,
	SET_STARTUPS,
	SET_COUNT,
	SET_RANGE,
	CLEAR_BROWSE_STORE,
	SET_HISTORY,
	SET_SAVED_SEARCH_HISTORY,
	SET_IS_HISTORY_LOADING,
} from './index';
import { defaultFilterCategories } from '@ducks/browse/constants';

const InitialState = Record({
	filterCategories: defaultFilterCategories,
	isLoading: false,
	isHistoryLoading: false,
	startups: [],
	countOfRecords: null,
	extremesForRanges: null,
	searchHistory: [],
	savedSearchHistory: [],
});

const browseReducer = (state = new InitialState(), { type, payload }) => {
	switch (type) {
		case SET_FIELD:
			return state.set('filterCategories', {
				...state.get('filterCategories'), ...payload.field,
			});

		case CLEAR_FIELD:
			return state.set('filterCategories', {
				...state.get('filterCategories'), ...defaultFilterCategories,
			});

		case SET_STARTUPS:
			return state.set('startups', payload.startups);

		case SET_IS_LOADING:
			return state.set('isLoading', payload.isLoading);

		case SET_COUNT:
			return state.set('countOfRecords', payload.count);

		case SET_RANGE:
			return state.set('extremesForRanges', payload.extremes);

		case SET_HISTORY:
			return state.set('searchHistory', payload.searchHistory);

		case SET_SAVED_SEARCH_HISTORY:
			return state.set('savedSearchHistory', payload.savedSearchHistory);

		case SET_IS_HISTORY_LOADING:
			return state.set('isHistoryLoading', payload.isHistoryLoading);

		case CLEAR_BROWSE_STORE:
			return new InitialState();

		default:
			return state;
	}
};

export default browseReducer;
