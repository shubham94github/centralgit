import { client } from './clientApi';
import { toColor } from '@utils';

const { SERVER_URL } = process.env;

export const getFilterStartups = data => client.post(`${SERVER_URL}/v1/browse/all`, data)
	.then(res => {
		return Promise.resolve({
			...res,
			items: res.items.map(startup => ({
				...startup,
				logo120: {
					...startup.logo120,
					name: startup?.companyShortName,
					color: toColor(startup?.id.toString()),
				},
			})),
		});
	});

export const getExtremesForRanges = () => client.get(`${SERVER_URL}/v1/browse/startup/get-search-min-max`);

export const saveBookmark = startupId => client.post(`${SERVER_URL}/v1/browse/save-bookmark`, { startupId });

export const removeBookmark = startupId => client.delete(`${SERVER_URL}/v1/browse/remove-bookmark/${startupId}`);

export const getSearchHistory = () => client.get(`${SERVER_URL}/v1/browse/get-search`);

export const getSavedSearchHistory = () => client.get(`${SERVER_URL}/v1/browse/get-all-saved-searches`);

export const saveSearchHistory = data => client.post(`${SERVER_URL}/v1/browse/save-saved-search`, data);

export const editSearchHistory = data => client.patch(`${SERVER_URL}/v1/browse/saved-search/edit-title`, data);

export const removeSavedSearch = savedSearchId => client.delete(`${SERVER_URL}/v1/browse/remove-saved-search/${savedSearchId}`);
