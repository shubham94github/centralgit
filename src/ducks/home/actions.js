import { GET_HOME_INFO, SEND_EMAIL } from './index';

export const getHomeInfo = data => ({
	type: GET_HOME_INFO,
	payload: data,
});

export const sendEmailForStartup = data => ({
	type: SEND_EMAIL,
	payload: data,
});
