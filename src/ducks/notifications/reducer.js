import { Record } from 'immutable';
import {
	SET_NOTIFICATIONS,
	SET_COUNT_NEW_NOTIFICATIONS,
	SET_IS_LOADING,
	SET_COUNT_ALL_NOTIFICATIONS,
	SET_PAGE,
	CLEAR_NOTIFICATIONS,
} from './index';

const InitialState = Record({
	notificationsList: [],
	countOfNewNotifications: 0,
	countAllNotifications: 0,
	isLoading: false,
	page: 0,
});

const notificationsReducer =(state = new InitialState(), action) => {
	const { payload, type } = action;

	switch (type) {
		case SET_NOTIFICATIONS:
			return state.set('notificationsList', payload.notificationsList);
		case SET_COUNT_NEW_NOTIFICATIONS:
			return state.set('countOfNewNotifications', payload.countOfNewNotifications);
		case SET_COUNT_ALL_NOTIFICATIONS:
			return state.set('countAllNotifications', payload.countAllNotifications);
		case SET_PAGE:
			return state.set('page', payload.page);
		case SET_IS_LOADING:
			return state.set('isLoading', payload.isLoading);
		case CLEAR_NOTIFICATIONS:
			return state.clear();
		default: return state;
	}
};

export default notificationsReducer;
