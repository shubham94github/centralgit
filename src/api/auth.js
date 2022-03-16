import axios from 'axios';
import { base64Encoder } from '@utils/base64Encoder';
import { client } from './clientApi';

const { OAUTH_SERVER_URL } = process.env;
const { SERVER_URL } = process.env;
const { CLIENT_ID } = process.env;
const { CLIENT_SECRET } = process.env;

export const checkIsEnabledTwoFa = ({ email, password }) => axios({
	method: 'post',
	url: `${SERVER_URL}/v1/authentication/send`,
	data: {
		email,
		password,
	},
});

export const checkIsEnabledTwoFaForgotPassword = ({ email }) => axios.post(`${SERVER_URL}/v1/authentication/send/forgot-password`, { email });

export const signIn = ({ email, password }) => {
	const body = new FormData();

	body.set('username', email);
	body.set('password', password);
	body.set('grant_type', 'password');
	body.set('scope', 'read write');

	return axios({
		method: 'post',
		url: `${OAUTH_SERVER_URL}/oauth/token`,
		data: body,
		headers: {
			Authorization: `Basic ${base64Encoder(CLIENT_ID, CLIENT_SECRET)}`,
		},
	});
};

export const checkEmailForExisting = data => axios.post(`${SERVER_URL}/v1/registration/check-email`, data);

export const getUser = () => client.post(`${SERVER_URL}/v1/login`);

export const getUserProfile = () => client.get(`${SERVER_URL}/v1/profile`);

export const getUserProfileById = userId => client.get(`${SERVER_URL}/v1/profile/${userId}`);

export const signUpAsStartup = data => axios.post(`${SERVER_URL}/v1/registration/startup/register`, data);

export const signUpAsRetailer = data => axios.post(`${SERVER_URL}/v1/registration/retailer/register`, data);

export const signUpAsMember = data => axios.post(`${SERVER_URL}/v1/registration/member/register`, data);

export const verifyStartupEmail = token => axios.post(`${SERVER_URL}/v1/registration/startup/verification`, { token });

export const verifyRetailerEmail = token => axios.post(`${SERVER_URL}/v1/registration/retailer/verifications`, { token });

export const verifyMemberEmail = token => axios.post(`${SERVER_URL}/v1/registration/member/verifications`, { token });

export const checkEmailDomainForRetailer = data => axios.post(`${SERVER_URL}/v1/registration/retailer/email-check`, data);

export const savePaymentPlanForRetailer = data => axios.post(`${SERVER_URL}/v1/registration/retailer/payment`, data);

export const resendVerificationForRetailer = data => axios.post(`${SERVER_URL}/v1/registration/retailer/resend-verification-email`, data);

export const resendVerificationForMember = data => axios.post(`${SERVER_URL}/v1/registration/member/resend-verification-email`, data);

export const resendVerificationForStartup = data => axios.post(`${SERVER_URL}/v1/registration/startup/resend-verification-email`, data);

export const attachPaymentMethodToCustomer = data => axios.post(`${SERVER_URL}/v1/payment/stripe/method/attach`, data);

export const sendContactUs = data => axios.post(`${SERVER_URL}/v1/email/send/registration`, data);

export const sendEmailForPasswordRecovery = email => axios.post(`${SERVER_URL}/v1/password-recovery`, { email });

export const sendNewPassword = ({ newPassword, token }) => axios.post(`${SERVER_URL}/v1/password-recovery/change`, {
	password: newPassword,
	token,
});

export const sendGallery = galleryData => {
	return client.post(`${SERVER_URL}/v1/startup/getting-started/startup-gallery`, {
		files: galleryData?.fileId
			? {
				fileId: galleryData?.fileId || null,
			}
			: null,
		video: galleryData?.link
			? {
				description: galleryData?.description || null,
				link: galleryData?.link || null,
				source: galleryData?.source || null,
				title: galleryData?.title || null,
			}
			: null,
	});
};

export const checkIsMemberCompany = ({ brandName, email }) => axios.post(`${SERVER_URL}/v1/registration/member/is-member`, {
	brandName,
	email,
});

export const checkIsMemberIndividual = ({ companyShortName }) => axios.post(`${SERVER_URL}/v1/registration/member/is-individuals`, {
	companyShortName,
});

export const sendTwoFaCodeToPhone = ({ email }) => client.post(`${SERVER_URL}/v1/authentication/send`, {
	email,
});

export const submitTwoFaCodeFromPhone = ({ code, email }) => axios.post(`${SERVER_URL}/v1/authentication`, {
	code,
	email,
}).then(res => res.data);

export const sendDiscountCode = discountCodeData => axios.post(`${SERVER_URL}/v1/registration/retailer/get-discount-code`, discountCodeData);

export const sendEnterpriseCode = enterpriseCodeData => axios.post(`${SERVER_URL}/v1/registration/retailer/get-enterprise-code-plan`, enterpriseCodeData);
