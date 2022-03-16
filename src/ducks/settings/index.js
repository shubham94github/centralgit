import reducer from './reducer';

const appName = process.env.APP_NAME;
export const moduleName = 'settings';

export const SET_IS_LOADING = `${appName}/${moduleName}/SET_IS_LOADING`;
export const SEND_ACCOUNT_INFO = `${appName}/${moduleName}/SEND_ACCOUNT_INFO`;
export const SEND_COMPANY_INFO = `${appName}/${moduleName}/SEND_COMPANY_INFO`;
export const UPDATE_BILLING_DETAILS = `${appName}/${moduleName}/UPDATE_BILLING_DETAILS`;
export const CHANGE_PASSWORD = `${appName}/${moduleName}/CHANGE_PASSWORD`;
export const UPDATE_RELATED_TAGS = `${appName}/${moduleName}/UPDATE_RELATED_TAGS`;
export const UPDATE_SECTORS_OF_COMPETENCE = `${appName}/${moduleName}/UPDATE_SECTORS_OF_COMPETENCE`;
export const UPDATE_AREAS_OF_INTERESTS = `${appName}/${moduleName}/UPDATE_AREAS_OF_INTERESTS`;
export const ADD_NEW_MEMBER = `${appName}/${moduleName}/ADD_NEW_MEMBER`;
export const GET_MEMBERS = `${appName}/${moduleName}/GET_MEMBERS`;
export const SET_MEMBERS = `${appName}/${moduleName}/SET_MEMBERS`;
export const CHANGE_MEMBER_STATUS = `${appName}/${moduleName}/CHANGE_MEMBER_STATUS`;
export const DELETE_MEMBER = `${appName}/${moduleName}/DELETE_MEMBER`;
export const EDIT_MEMBER = `${appName}/${moduleName}/EDIT_MEMBER`;
export const CLEAR_SETTINGS_STORE = `${appName}/${moduleName}/CLEAR_SETTINGS_STORE`;
export const TOGGLE_IS_CANCELLED_SUBSCRIPTION = `${appName}/${moduleName}/TOGGLE_IS_CANCELLED_SUBSCRIPTION`;
export const GET_PAYMENT_PLANS = `${appName}/${moduleName}/GET_PAYMENT_PLANS`;
export const SEND_DISCOUNT_CODE = `${appName}/${moduleName}/SEND_DISCOUNT_CODE`;
export const SEND_ENTERPRISE_CODE = `${appName}/${moduleName}/SEND_ENTERPRISE_CODE`;

export default reducer;
