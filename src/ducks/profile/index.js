const appName = process.env.APP_NAME;
export const moduleName = 'profile';

export const SET_PROFILE = `${appName}/${moduleName}/SET_PROFILE`;
export const CLEAR_PROFILE = `${appName}/${moduleName}/CLEAR_PROFILE`;
export const GET_PROFILE_STARTUP = `${appName}/${moduleName}/GET_PROFILE_STARTUP`;
export const GET_PROFILE_RETAILER = `${appName}/${moduleName}/GET_PROFILE_RETAILER`;
export const HANDLE_CREATE_FEEDBACK = `${appName}/${moduleName}/HANDLE_CREATE_FEEDBACK`;
export const HANDLE_REMOVE_FEEDBACK = `${appName}/${moduleName}/HANDLE_REMOVE_FEEDBACK`;
export const SET_FEEDBACKS = `${appName}/${moduleName}/SET_FEEDBACKS`;
export const SET_COUNT_FEEDBACKS = `${appName}/${moduleName}/SET_COUNT_FEEDBACKS`;
export const SET_COUNT_ALL_FEEDBACKS = `${appName}/${moduleName}/SET_COUNT_ALL_FEEDBACKS`;
export const SET_IS_LOADING = `${appName}/${moduleName}/SET_IS_LOADING`;
export const SET_IS_LOADING_FEEDBACKS = `${appName}/${moduleName}/SET_IS_LOADING_FEEDBACKS`;
export const GET_FEEDBACKS_INFO = `${appName}/${moduleName}/GET_FEEDBACKS_INFO`;
export const SET_EXISTS_FEEDBACK = `${appName}/${moduleName}/SET_EXISTS_FEEDBACK`;
export const CLEAR_PROFILE_STORE = `${appName}/${moduleName}/CLEAR_PROFILE_STORE`;
export const SET_RATE_STARS = `${appName}/${moduleName}/SET_RATE_STARS`;
export const SET_RATE_COUNT = `${appName}/${moduleName}/SET_RATE_COUNT`;
export const PROFILE_RESTRICTION = `${appName}/${moduleName}/PROFILE_RESTRICTION`;
export const SAVE_GALLERY = `${appName}/${moduleName}/SAVE_GALLERY`;
export const GET_SIMILAR_STARTUPS = `${appName}/${moduleName}/GET_SIMILAR_STARTUPS`;
export const SET_SIMILAR_STARTUPS = `${appName}/${moduleName}/SET_SIMILAR_STARTUPS`;
export const SET_IS_LOADING_SIMILAR_STARTUPS = `${appName}/${moduleName}/SET_IS_LOADING_SIMILAR_STARTUPS`;

export { default } from './reducer';
