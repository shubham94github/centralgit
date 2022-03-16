import { client } from './clientApi';
import { commonPartOfUrl } from '@constants/websocket';

const { MESSAGES_SERVER_URL } = process.env;
const notificationURL = `${MESSAGES_SERVER_URL}${commonPartOfUrl}`;

export const getNotifications = data => client.post(`${notificationURL}/notifications`, {
	...data,
	pageSize: 20,
});

export const getCountNewNotifications = () => client.get(`${notificationURL}/notifications/count/new`);

export const getCountAllNotifications = () => client.get(`${notificationURL}/notifications/count/all`);

export const removeNotification = id => client.delete(`${notificationURL}/notification/${id}/delete`);

export const removeAllNotifications = () => client.delete(`${notificationURL}/notifications/delete/all`);

export const readAllNotifications = () => client.get(`${notificationURL}/notifications/read/all`);
