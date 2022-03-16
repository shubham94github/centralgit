import { all } from 'redux-saga/effects';
import authSaga from '@ducks/auth/authSaga';
import commonSaga from '@ducks/common/commonSaga';
import { messagesSaga } from '@ducks/messages/messagesSaga';
import homeSaga from '@ducks/home/homeSaga';
import profileSaga from '@ducks/profile/profileSaga';
import browseSaga from '@ducks/browse/browseSaga';
import adminSaga from '@ducks/admin/adminSaga';
import { notificationsSaga } from '@ducks/notifications/notificationsSaga';
import settingsSaga from '@ducks/settings/settingsSaga';

export default function* sagaWatcher() {
	yield all([
		authSaga(),
		commonSaga(),
		messagesSaga(),
		homeSaga(),
		profileSaga(),
		browseSaga(),
		adminSaga(),
		notificationsSaga(),
		settingsSaga(),
	]);
}
