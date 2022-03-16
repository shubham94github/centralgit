import { client } from './clientApi';

const { ADMIN_SERVER_URL } = process.env;

export const createPrice = newPrice => client.post(`${ADMIN_SERVER_URL}/v1/admin/payment/prices/create`, newPrice);

export const editPrice = price => client.post(`${ADMIN_SERVER_URL}/v1/admin/payment/prices/update/${price.id}`, price);

export const removePrice = priceId => client.delete(`${ADMIN_SERVER_URL}/v1/admin/payment/prices/delete/${priceId}`);

export const getPrices = () => client.post(`${ADMIN_SERVER_URL}/v1/admin/payment/prices/all`);

export const getAllPaymentPlanNames = () => client.post(`${ADMIN_SERVER_URL}/v1/admin/payment/catalog/names/all`);

export const createNewPaymentPlan = paymentPlan => client.post(`${ADMIN_SERVER_URL}/v1/admin/payment/plans/create`, paymentPlan);

export const updatePaymentPlan = ({ planId, paymentPlan }) => client.post(`${ADMIN_SERVER_URL}/v1/admin/payment/plans/update/${planId}`, paymentPlan);

export const getMemberGroups = () => client.post(`${ADMIN_SERVER_URL}/v1/admin/payment/catalog/member-group/all`);

export const getSubscriptionPlans = (
	memberGroupId = null,
	paymentPlanPriceIds = null,
	role = null,
	isHidden = null,
) => client.post(`${ADMIN_SERVER_URL}/v1/admin/payment/plans/all`, {
	memberGroupId,
	paymentPlanPriceIds,
	role,
	isHidden,
});

export const deleteSubscriptionPlan = planId =>
	client.delete(`${ADMIN_SERVER_URL}/v1/admin/payment/plans/delete/${planId}`);

export const getEnterpriseCodes = () => client.post(`${ADMIN_SERVER_URL}/v1/admin/payment/enterprise/codes/all`);

export const editEnterpriseCode = ({ id, enterpriseCode: { code, paymentPlan } }) =>
	client.post(`${ADMIN_SERVER_URL}/v1/admin/payment/enterprise/codes/update/${id}`, {
		code,
		paymentPlan: paymentPlan.id,
	});

export const hidePaymentPlan = planId => client.delete(`${ADMIN_SERVER_URL}/v1/admin/payment/plans/hide/${planId}`);

export const unHidePaymentPlan = planId => client.delete(`${ADMIN_SERVER_URL}/v1/admin/payment/plans/unhide/${planId}`);
