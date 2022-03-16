const appName = process.env.APP_NAME;
export const moduleName = 'home';

export const SET_IS_LOADING = `${appName}/${moduleName}/SET_IS_LOADING`;
export const GET_HOME_INFO = `${appName}/${moduleName}/GET_HOME_INFO`;
export const SET_NEW_STARTUPS = `${appName}/${moduleName}/SET_NEW_STARTUPS`;
export const SET_RELATED_STARTUPS = `${appName}/${moduleName}/SET_RELATED_STARTUPS`;
export const SET_RATED_STARTUPS = `${appName}/${moduleName}/SET_RATED_STARTUPS`;
export const CLEAR_HOME_STORE = `${appName}/${moduleName}/CLEAR_HOME_STORE`;
export const SEND_EMAIL = `${appName}/${moduleName}/SEND_EMAIL`;

export { default } from './reducer';
