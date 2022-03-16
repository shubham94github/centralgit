import {
	GET_NEW_NOTIFICATIONS,
	GET_NOTIFICATIONS,
	REMOVE_NOTIFICATION,
	REMOVE_ALL_NOTIFICATIONS,
	READ_ALL_NOTIFICATIONS,
	GET_MORE_NOTIFICATIONS,
} from './index';
import { all, takeEvery, takeLeading } from 'redux-saga/effects';
import {
	getNewNotificationsWorker,
	getNotificationsWorker,
	removeNotificationWorker,
	removeAllNotificationsWorker,
	readAllNotificationsWorker,
	getMoreNotificationsWorker,
} from './sagas';

export function* notificationsSaga() {
	all([
		yield takeEvery(GET_NEW_NOTIFICATIONS, getNewNotificationsWorker),
		yield takeLeading(GET_NOTIFICATIONS, getNotificationsWorker),
		yield takeEvery(REMOVE_NOTIFICATION, removeNotificationWorker),
		yield takeLeading(REMOVE_ALL_NOTIFICATIONS, removeAllNotificationsWorker),
		yield takeLeading(READ_ALL_NOTIFICATIONS, readAllNotificationsWorker),
		yield takeLeading(GET_MORE_NOTIFICATIONS, getMoreNotificationsWorker),
	]);
}
