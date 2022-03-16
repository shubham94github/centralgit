import { client } from './clientApi';
import promiseMemoize from '@utils/promiseMemoize';

const { SERVER_URL } = process.env;

export const getStartupProfile = id => client.get(`${SERVER_URL}/v1/browse/profile/${id}`);

export const getRetailerProfile = promiseMemoize(id => client.get(`${SERVER_URL}/v1/profile/${id}`));

export const createFeedback = (data, id) => client.post(`${SERVER_URL}/v1/browse/profile/${id}/feedbacks/create`, data);

export const updateFeedback = (data, id) => client.post(`${SERVER_URL}/v1/browse/profile/${id}/feedbacks/update`, data);

export const removeFeedback = (data, id) => client.delete(`${SERVER_URL}/v1/browse/profile/${id}/feedbacks/delete`, data);

export const getFeedback = (data, id) => client.post(`${SERVER_URL}/v1/browse/profile/${id}/feedbacks`, data);

export const getCountFeedback = (data, id) => client.post(`${SERVER_URL}/v1/browse/profile/${id}/feedbacks/count`, data);

export const getCheckExistsFeedback = id => client.get(`${SERVER_URL}/v1/browse/profile/${id}/feedbacks/check-exists`);

export const getProfileRating = id => client.get(`${SERVER_URL}/v1/browse/profile/${id}/rate`);

export const getSimilarStartups = startupId => client.post(`${SERVER_URL}/v1/home/retailer/similar-to`, { startupId });
