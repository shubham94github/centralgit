const appName = process.env.APP_NAME;
export const moduleName = 'messaging';

export const SET_CHANNELS = `${appName}/${moduleName}/SET_CHANNELS`;
export const GET_CHANNELS = `${appName}/${moduleName}/GET_CHANNELS`;
export const GET_CHANNELS_IN_FORK = `${appName}/${moduleName}/GET_CHANNELS_IN_FORK`;
export const SET_IS_LOADING = `${appName}/${moduleName}/SET_IS_LOADING`;
export const SET_IS_CREATE_CHANNEL_LOADING = `${appName}/${moduleName}/SET_IS_CREATE_CHANNEL_LOADING`;
export const SEND_MESSAGE = `${appName}/${moduleName}/SEND_MESSAGE`;
export const SET_ACTIVE_CHANNEL = `${appName}/${moduleName}/SET_ACTIVE_CHANNEL`;
export const GET_ALL_MESSAGES_FOR_CHAT = `${appName}/${moduleName}/GET_ALL_MESSAGES_FOR_CHAT`;
export const SET_MESSAGES_FOR_CHAT = `${appName}/${moduleName}/SET_MESSAGES_FOR_CHAT`;
export const SET_NEW_MESSAGE_IN_CHAT = `${appName}/${moduleName}/SET_NEW_MESSAGE_IN_CHAT`;
export const OPEN_CHAT = `${appName}/${moduleName}/OPEN_CHAT`;
export const SET_NEW_CHANNEL = `${appName}/${moduleName}/SET_NEW_CHANNEL`;
export const CREATE_CHANNEL_AND_SEND_MESSAGE = `${appName}/${moduleName}/CREATE_CHANNEL_AND_SEND_MESSAGE`;
export const SEND_CHANNEL_MESSAGE = `${appName}/${moduleName}/SEND_CHANNEL_MESSAGE`;
export const LOAD_MORE_MESSAGES = `${appName}/${moduleName}/LOAD_MORE_MESSAGES`;
export const SET_META = `${appName}/${moduleName}/SET_META`;
export const SET_READ_MESSAGE_IN_CHAT = `${appName}/${moduleName}/SET_READ_MESSAGE_IN_CHAT`;
export const SET_IS_LOADING_MESSAGES = `${appName}/${moduleName}/SET_IS_LOADING_MESSAGES`;
export const SEND_READ_MESSAGES = `${appName}/${moduleName}/SEND_READ_MESSAGES`;
export const SET_ALL_MESSAGES = `${appName}/${moduleName}/SET_ALL_MESSAGES`;
export const SET_NEW_MESSAGES_COUNTER = `${appName}/${moduleName}/SET_NEW_MESSAGES_COUNTER`;
export const GET_NEW_MESSAGES_COUNTER = `${appName}/${moduleName}/GET_NEW_MESSAGES_COUNTER`;
export const SET_CONNECT_STATUS = `${appName}/${moduleName}/SET_CONNECT_STATUS`;
export const GET_ONLINE_STATUSES = `${appName}/${moduleName}/GET_ONLINE_STATUSES`;
export const FIND_MESSAGES_IN_CHAT = `${appName}/${moduleName}/FIND_MESSAGES_IN_CHAT`;
export const SET_FOUND_MESSAGES_IN_CHAT = `${appName}/${moduleName}/SET_FOUND_MESSAGES_IN_CHAT`;
export const SET_IS_SEARCH_MESSAGES_LOADING = `${appName}/${moduleName}/SET_IS_SEARCH_MESSAGES_LOADING`;
export const SET_FOUND_MESSAGE = `${appName}/${moduleName}/SET_FOUND_MESSAGE`;
export const SET_IS_SHORT_PROFILE_OPEN = `${appName}/${moduleName}/SET_IS_SHORT_PROFILE_OPEN`;
export const CLEAR_MESSAGES_STORE = `${appName}/${moduleName}/CLEAR_MESSAGES_STORE`;
export const LOAD_MORE_CHANNELS = `${appName}/${moduleName}/LOAD_MORE_CHANNELS`;
export const SET_IS_LOADING_CHANNELS = `${appName}/${moduleName}/SET_IS_LOADING_CHANNELS`;
export const SET_CHANNELS_META = `${appName}/${moduleName}/SET_CHANNELS_META`;
export const SET_COUNT_OF_MESSAGES_IN_CHAT = `${appName}/${moduleName}/SET_COUNT_OF_MESSAGES_IN_CHAT`;
export const SET_NEW_CHAT = `${appName}/${moduleName}/SET_NEW_CHAT`;
export const ON_NEW_COUNTERS = `${appName}/${moduleName}/ON_NEW_COUNTERS`;
export const CHAT_RESTRICTION = `${appName}/${moduleName}/CHAT_RESTRICTION`;
export const DELETE_CHAT = `${appName}/${moduleName}/DELETE_CHAT`;

export { default } from './reducer';
