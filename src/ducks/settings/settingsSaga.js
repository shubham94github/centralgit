import { all, takeLatest, takeLeading } from 'redux-saga/effects';
import {
	SEND_ACCOUNT_INFO,
	CHANGE_PASSWORD,
	SEND_COMPANY_INFO,
	UPDATE_BILLING_DETAILS,
	UPDATE_RELATED_TAGS,
	UPDATE_SECTORS_OF_COMPETENCE,
	UPDATE_AREAS_OF_INTERESTS,
	ADD_NEW_MEMBER,
	GET_MEMBERS,
	CHANGE_MEMBER_STATUS,
	DELETE_MEMBER,
	EDIT_MEMBER,
	TOGGLE_IS_CANCELLED_SUBSCRIPTION,
	GET_PAYMENT_PLANS,
	SEND_DISCOUNT_CODE,
	SEND_ENTERPRISE_CODE,
} from './index';
import {
	sendAccountInfoWorker,
	changePasswordWorker,
	sendCompanyInfoWorker,
	updateBillingDetailsWorker,
	updateRelatedTagsWorker,
	updateSectorsOfCompetenceWorker,
	updateAreasOfInterestsWorker,
	addNewMemberWorker,
	getMembersWorker,
	changeMemberStatusWorker,
	deleteMemberWorker,
	editMemberWorker,
	toggleIsCancelledSubscriptionWorker,
	getPaymentPlansWorker,
	sendDiscountCodeWorker,
	sendEnterpriseCodeWorker,
} from './sagas';

export function* settingsSaga() {
	all([
		yield takeLeading(SEND_ACCOUNT_INFO, sendAccountInfoWorker),
		yield takeLeading(CHANGE_PASSWORD, changePasswordWorker),
		yield takeLatest(UPDATE_BILLING_DETAILS, updateBillingDetailsWorker),
		yield takeLeading(SEND_COMPANY_INFO, sendCompanyInfoWorker),
		yield takeLatest(UPDATE_RELATED_TAGS, updateRelatedTagsWorker),
		yield takeLatest(UPDATE_SECTORS_OF_COMPETENCE, updateSectorsOfCompetenceWorker),
		yield takeLatest(UPDATE_AREAS_OF_INTERESTS, updateAreasOfInterestsWorker),
		yield takeLatest(ADD_NEW_MEMBER, addNewMemberWorker),
		yield takeLeading(GET_MEMBERS, getMembersWorker),
		yield takeLeading(CHANGE_MEMBER_STATUS, changeMemberStatusWorker),
		yield takeLeading(DELETE_MEMBER, deleteMemberWorker),
		yield takeLeading(EDIT_MEMBER, editMemberWorker),
		yield takeLeading(TOGGLE_IS_CANCELLED_SUBSCRIPTION, toggleIsCancelledSubscriptionWorker),
		yield takeLeading(GET_PAYMENT_PLANS, getPaymentPlansWorker),
		yield takeLeading(SEND_DISCOUNT_CODE, sendDiscountCodeWorker),
		yield takeLeading(SEND_ENTERPRISE_CODE, sendEnterpriseCodeWorker),
	]);
}

export default settingsSaga;
