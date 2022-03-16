import { client } from '@api/clientApi';
import { newStartupLimit, relatedStartupPageSize, topRatedStartupLimit } from '@constants/constantsHomeApi';
import promiseMemoize from '@utils/promiseMemoize';

const { SERVER_URL } = process.env;

export const getNewStartups = promiseMemoize(() =>
	client.post(`${SERVER_URL}/v1/home/retailer/new-startups`, { limit: newStartupLimit }));

export const getTopRatedStartups = promiseMemoize(() =>
	client.post(`${SERVER_URL}/v1/home/retailer/top-rated`, { limit: topRatedStartupLimit }));

export const getRelatedStartups = promiseMemoize(() =>
	client.post(`${SERVER_URL}/v1/home/retailer/related`, { pageSize: relatedStartupPageSize, page: 1 }));

export const sendEmailForStartup = data => client.post(`${SERVER_URL}/v1/email/send`, data);
