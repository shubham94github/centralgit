const appName = process.env.APP_NAME;
export const moduleName = 'notifications';

export const SET_NOTIFICATIONS = `${appName}/${moduleName}/SET_NOTIFICATIONS`;
export const GET_NOTIFICATIONS = `${appName}/${moduleName}/GET_NOTIFICATIONS`;
export const REMOVE_NOTIFICATION = `${appName}/${moduleName}/REMOVE_NOTIFICATION`;
export const REMOVE_ALL_NOTIFICATIONS = `${appName}/${moduleName}/REMOVE_NOTIFICATIONS`;
export const SET_COUNT_NEW_NOTIFICATIONS = `${appName}/${moduleName}/SET_COUNT_NEW_NOTIFICATIONS`;
export const SET_COUNT_ALL_NOTIFICATIONS = `${appName}/${moduleName}/SET_COUNT_ALL_NOTIFICATIONS`;
export const GET_NEW_NOTIFICATIONS = `${appName}/${moduleName}/GET_NEW_NOTIFICATIONS`;
export const READ_ALL_NOTIFICATIONS = `${appName}/${moduleName}/READ_NOTIFICATIONS`;
export const SET_IS_LOADING = `${appName}/${moduleName}/SET_IS_LOADING`;
export const GET_MORE_NOTIFICATIONS = `${appName}/${moduleName}/GET_MORE_NOTIFICATIONS`;
export const SET_PAGE = `${appName}/${moduleName}/SET_PAGE`;
export const CLEAR_NOTIFICATIONS = `${appName}/${moduleName}/CLEAR_NOTIFICATIONS`;

export { default } from './reducer';
