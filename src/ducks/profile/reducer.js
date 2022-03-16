import { Record } from 'immutable';
import {
	SET_PROFILE,
	SET_FEEDBACKS,
	SET_COUNT_FEEDBACKS,
	SET_IS_LOADING,
	SET_IS_LOADING_FEEDBACKS,
	CLEAR_PROFILE,
	SET_EXISTS_FEEDBACK,
	CLEAR_PROFILE_STORE,
	SET_RATE_STARS,
	SET_RATE_COUNT,
	SET_COUNT_ALL_FEEDBACKS,
	SET_SIMILAR_STARTUPS,
	SET_IS_LOADING_SIMILAR_STARTUPS,
} from './index';

const InitialState = Record({
	profile: null,
	feedbacks: [],
	count: null,
	countAllFeedbacks: null,
	isLoading: false,
	isLoadingFeedbacks: false,
	isExistsFeedback: null,
	rateStars: null,
	rateCount: null,
	similarStartups: [],
	isLoadingSimilarStartups: false,
});

const profileReducer = (state = new InitialState(), { type, payload }) => {
	switch (type) {
		case SET_PROFILE:
			return state.set('profile', payload.profile);

		case SET_COUNT_FEEDBACKS:
			return state.set('count', payload.count);

		case SET_COUNT_ALL_FEEDBACKS:
			return state.set('countAllFeedbacks', payload.count);

		case SET_FEEDBACKS:
			return state.set('feedbacks', payload.feedbacks);

		case SET_IS_LOADING:
			return state.set('isLoading', payload.isLoading);

		case SET_IS_LOADING_FEEDBACKS:
			return state.set('isLoadingFeedbacks', payload.isLoadingFeedbacks);

		case SET_IS_LOADING_SIMILAR_STARTUPS:
			return state.set('isLoadingSimilarStartups', payload.isLoadingSimilarStartups);

		case CLEAR_PROFILE:
			return state.clear();

		case SET_EXISTS_FEEDBACK:
			return state.set('isExistsFeedback', payload.flag);

		case SET_RATE_STARS:
			return state.set('rateStars', payload.stars);

		case SET_RATE_COUNT:
			return state.set('rateCount', payload.rate);

		case SET_SIMILAR_STARTUPS:
			return state.set('similarStartups', payload.similarStartups);

		case CLEAR_PROFILE_STORE:
			return new InitialState();

		default:
			return state;
	}
};

export default profileReducer;
