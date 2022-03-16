import {
	GET_PROFILE_STARTUP,
	HANDLE_CREATE_FEEDBACK,
	GET_FEEDBACKS_INFO,
	HANDLE_REMOVE_FEEDBACK,
	CLEAR_PROFILE,
	GET_PROFILE_RETAILER,
	PROFILE_RESTRICTION,
	GET_SIMILAR_STARTUPS,
} from './index';

export const getProfile = ({ id }) => ({
	type: GET_PROFILE_STARTUP,
	payload: { id },
});

export const getProfileRetailer = id => ({
	type: GET_PROFILE_RETAILER,
	payload: id,
});

export const clearProfile = () => ({
	type: CLEAR_PROFILE,
});

export const createFeedback = data => ({
	type: HANDLE_CREATE_FEEDBACK,
	payload: data,
});

export const removeFeedback = data => ({
	type: HANDLE_REMOVE_FEEDBACK,
	payload: data,
});

export const getFeedbacksInfo = data => ({
	type: GET_FEEDBACKS_INFO,
	payload: data,
});

export const setWarningOfProfileRestriction = () => ({
	type: PROFILE_RESTRICTION,
});

export const getSimilarStartups = data => ({
	type: GET_SIMILAR_STARTUPS,
	payload: data,
});
