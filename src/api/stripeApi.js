import { client } from '@api/clientApi';

const { SERVER_URL } = process.env;

export const getCustomer = id => client.get(`${SERVER_URL}/v1/payment/stripe/customer/${id}/get`);

export const getPaymentMethod = methodId => client.get(`${SERVER_URL}/v1/payment/stripe/method/${methodId}/get`);

export const getAllPaymentMethod = customerId => client.get(`${SERVER_URL}/v1/payment/stripe/method/all/customer/${customerId}`);

export const updatePayment = methodId => client.post(`${SERVER_URL}/v1/payment/stripe/invoices/attach/pay`, {
	methodId,
});

export const recreatePaymentMethod = (planId, paymentMethodId) => client.post(`${SERVER_URL}/v1/retailer/subscription/recreate`, {
	planId,
	paymentMethodId,
});

export const getSubscription = id => client.get(`${SERVER_URL}/payment/stripe/subscription/${id}`);

export const paySubscription = latestInvoice => client.post(`${SERVER_URL}/v1/payment/stripe/invoices/${latestInvoice}/pay`);

export const changePaymentPlan = id => client.post(`${SERVER_URL}/v1/payment/stripe/invoices/${id}/pay`);

export const detachPaymentMethod = methodId => client.get(`${SERVER_URL}/v1/payment/stripe/method/${methodId}/detach`);

export const attachPaymentCard = ({
	token,
	methodId,
	userId,
}) => client.post(`${SERVER_URL}/v1/payment/stripe/method/attach`, {
	token,
	methodId,
	userId,
});
