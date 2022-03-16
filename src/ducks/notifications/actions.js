import {
	GET_NEW_NOTIFICATIONS,
	GET_NOTIFICATIONS,
	REMOVE_NOTIFICATION,
	REMOVE_ALL_NOTIFICATIONS,
	READ_ALL_NOTIFICATIONS,
	GET_MORE_NOTIFICATIONS,
	CLEAR_NOTIFICATIONS,
} from './index';

export const onNotifications = notification => ({
	type: GET_NEW_NOTIFICATIONS,
	payload: { notification },
});

export const getNotifications = () => ({
	type: GET_NOTIFICATIONS,
});

export const removeNotification = id => ({
	type: REMOVE_NOTIFICATION,
	payload: { id },
});

export const removeAllNotifications = () => ({
	type: REMOVE_ALL_NOTIFICATIONS,
});

export const readAllNotifications = () => ({
	type: READ_ALL_NOTIFICATIONS,
});

export const getMoreNotifications = () => ({
	type: GET_MORE_NOTIFICATIONS,
});

export const clearNotifications = () => ({
	type: CLEAR_NOTIFICATIONS,
});
