import axios from 'axios';
import { client } from '@api/clientApi';
import promiseMemoize from '@utils/promiseMemoize';
import { imageConverter } from '@utils/imageConverter';

const { SERVER_URL } = process.env;

export const getCountries = promiseMemoize(() => axios.get(`${SERVER_URL}/v1/registration/startup/countries`));

export const getCategories = () => client.get(`${SERVER_URL}/v1/categories`);

export const getTopLevelCategories = promiseMemoize(() => client.get(`${SERVER_URL}/v1/categories/top-level`));

export const getPaymentPlans = paymentPlansData => axios.post(`${SERVER_URL}/v1/registration/retailer/payments`, paymentPlansData);

export const getAllTags = promiseMemoize(() => client.get(`${SERVER_URL}/v1/tags/get-all-tags`));

export const saveViewedHistoryProfile = startupId => client.post(`${SERVER_URL}/v1/click-history/save`, { startupId });

export const getAllDepartments = () => client.get(`${SERVER_URL}/v1/departments/get-all-departments`);

export const getAllPositions = () => client.get(`${SERVER_URL}/v1/positions/get-all-positions`);

export const getAllPlatformPartners = promiseMemoize(() => client.get(`${SERVER_URL}/v1/startup/getting-started/startups-traction`));

export const getStartupsOptions = promiseMemoize(() => client.get(`${SERVER_URL}/v1/startup/all`));

export const sendMission = data => client.post(`${SERVER_URL}/v1/browse/send-mission`, data);

export const getYoutubeThumbnail = (metaUrl, videoId) => {
	return axios.get(`https://www.youtube.com/oembed?url=https://youtu.be/${videoId}&format=json`).then(res => {
		return {
			title: res.data.title,
			description: res.data.description,
			thumbnail: res.data.thumbnail_url,
		};
	});
};

export const getVimeoThumbnail = metaUrl => axios.get(metaUrl).then(({ data }) => {
	return axios.get(data[0].thumbnail_large, {
		responseType: 'blob',
	}).then(async resp => {
		const thumbnail = await imageConverter(resp.data);

		return {
			title: data[0].title,
			description: data[0].description,
			thumbnail,
		};
	});
});

export const getVideoAttributes = async url => {
	const isYouTube = url.includes('youtube.com') || url.includes('youtu.be');
	const videoId = isYouTube ? url.split(/[=/]+/).pop().trim() : url.split('/').pop().trim();

	const metaUrl = isYouTube
		? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
		: `https://vimeo.com/api/v2/video/${videoId}.json`;

	return isYouTube ? getYoutubeThumbnail(metaUrl, videoId) : getVimeoThumbnail(metaUrl);
};

export const getTrial = () => client.get(`${SERVER_URL}/v1/info/trial`);

export const getPaymentPlansForCoupons = () => client.post(`${SERVER_URL}/v1/admin/payment/plans/all/dropdown`);
