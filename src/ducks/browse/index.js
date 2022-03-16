const appName = process.env.APP_NAME;
export const moduleName = 'browse';

export const GET_FIELD = `${appName}/${moduleName}/GET_FIELD`;
export const SET_FIELD_OUTSIDE = `${appName}/${moduleName}/SET_FIELD_OUTSIDE`;
export const SET_FIELD = `${appName}/${moduleName}/SET_FIELD`;
export const CLEAR_FIELD = `${appName}/${moduleName}/CLEAR_FIELD`;
export const GET_FILTER_STARTUP = `${appName}/${moduleName}/GET_FILTER_STARTUP`;
export const GET_FILTER_STARTUP_IN_FORK = `${appName}/${moduleName}/GET_FILTER_STARTUP_IN_FORK`;
export const SET_IS_LOADING = `${appName}/${moduleName}/SET_IS_LOADING`;
export const SET_STARTUPS = `${appName}/${moduleName}/SET_STARTUPS`;
export const SET_COUNT = `${appName}/${moduleName}/SET_COUNT`;
export const SET_RANGE = `${appName}/${moduleName}/SET_RANGE`;
export const CLEAR_BROWSE_STORE = `${appName}/${moduleName}/CLEAR_BROWSE_STORE`;
export const SEARCH_RESTRICTION = `${appName}/${moduleName}/SEARCH_RESTRICTION`;
export const SET_SEARCH_WARNING = `${appName}/${moduleName}/SET_SEARCH_WARNING`;
export const SET_IS_BOOKMARK = `${appName}/${moduleName}/SET_IS_BOOKMARK`;
export const GET_HISTORY = `${appName}/${moduleName}/GET_HISTORY`;
export const SET_HISTORY = `${appName}/${moduleName}/SET_HISTORY`;
export const SET_HISTORY_FILTER = `${appName}/${moduleName}/SET_HISTORY_FILTER`;
export const SAVE_SEARCH_HISTORY = `${appName}/${moduleName}/SAVE_SEARCH_HISTORY`;
export const EDIT_SEARCH_HISTORY = `${appName}/${moduleName}/EDIT_SEARCH_HISTORY`;
export const SET_SAVED_SEARCH_HISTORY = `${appName}/${moduleName}/SET_SAVED_SEARCH_HISTORY`;
export const REMOVE_SAVED_SEARCH = `${appName}/${moduleName}/REMOVE_SAVED_SEARCH`;
export const SET_IS_HISTORY_LOADING = `${appName}/${moduleName}/SET_IS_HISTORY_LOADING`;

export { default } from './reducer';
