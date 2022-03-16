import { Record } from 'immutable';
import {
	SET_NEW_STARTUPS,
	SET_IS_LOADING,
	SET_RATED_STARTUPS,
	CLEAR_HOME_STORE,
	SET_RELATED_STARTUPS,
} from './index';

const InitialState = Record({
	isLoading: false,
	newStartups: [],
	ratedStartups: [],
	relatedStartups: [],
});

const homeReducer = (state = new InitialState(), { type, payload }) => {
	switch (type) {
		case SET_NEW_STARTUPS:
			return state.set('newStartups', payload.newStartups);

		case SET_RATED_STARTUPS:
			return state.set('ratedStartups', payload.ratedStartups);

		case SET_RELATED_STARTUPS:
			return state.set('relatedStartups', payload.relatedStartups);

		case SET_IS_LOADING:
			return state.set('isLoading', payload.isLoading);

		case CLEAR_HOME_STORE:
			return new InitialState();

		default:
			return state;
	}
};

export default homeReducer;
