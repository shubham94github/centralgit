import { combineReducers } from 'redux';
import authReducer, { moduleName as authModuleName } from '@ducks/auth';
import commonReducer, { moduleName as commonModuleName } from '@ducks/common';
import messagesReducer, { moduleName as messagesModuleName } from '@ducks/messages';
import homeReducer, { moduleName as homeModuleName } from '@ducks/home';
import profileReducer, { moduleName as profileModuleName } from '@ducks/profile';
import browseReducer, { moduleName as browseModuleName } from '@ducks/browse';
import adminReducer, { moduleName as adminModuleName } from '@ducks/admin';
import notificationsReducer, { moduleName as notificationsModuleName } from '@ducks/notifications';
import settingsReducer, { moduleName as settingsModuleName } from '@ducks/settings';

export const combinedReducer = {
	[authModuleName]: authReducer,
	[commonModuleName]: commonReducer,
	[messagesModuleName]: messagesReducer,
	[homeModuleName]: homeReducer,
	[profileModuleName]: profileReducer,
	[browseModuleName]: browseReducer,
	[adminModuleName]: adminReducer,
	[notificationsModuleName]: notificationsReducer,
	[settingsModuleName]: settingsReducer,
};

export const rootReducer = combineReducers(combinedReducer);
