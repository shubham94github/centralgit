import { client } from './clientApi';
import { markDownToText } from '@utils';

const { SERVER_URL } = process.env;

export const sendAccountInformationRetailer = accountInformation => client.post(`${SERVER_URL}/v1/settings/retailer/update-account-information`, accountInformation);

export const sendAccountInformationStartup = accountInformation => client.post(`${SERVER_URL}/v1/settings/startup/update-account-information`, accountInformation);

export const sendCompanyInfoRetailer = companyInfo => client.post(`${SERVER_URL}/v1/settings/retailer/update-company-details`, companyInfo);

export const sendCompanyInfoStartup = companyInfo => client.post(`${SERVER_URL}/v1/settings/startup/update-company-details`, companyInfo);

export const updateBillingDetailsRetailer = billingDetails => client.post(`${SERVER_URL}/v1/settings/retailer/update-billing-details`, billingDetails);

export const updateCompanyDetails = companyDetails => client.post(`${SERVER_URL}/v1/settings/retailer/update-company-details`, companyDetails);

export const changePassword = newPasswordData =>  client.post(`${SERVER_URL}/v1/settings/user/change-password`, newPasswordData);

export const updateRelatedTags = relatedTags => client.post(`${SERVER_URL}/v1/settings/startup/update-related-tags`, relatedTags);

export const updateSectorsOfCompetence = sectorsOfCompetence => client.post(`${SERVER_URL}/v1/settings/startup/update-sectors-of-competence`, sectorsOfCompetence);

export const updateAreasOfInterests = areasOfInterests => client.post(`${SERVER_URL}/v1/settings/startup/update-areas-of-interests`, areasOfInterests);

export const updateGallery = galleryData => client.post(`${SERVER_URL}/v1/settings/startup/gallery/video/${galleryData.videoId}/update`, {
	description: !markDownToText(galleryData.description)?.length ? null : galleryData.description,
	link: galleryData.link,
	source: galleryData.source || null,
	title: galleryData.title,
});

export const removeGalleryVideo = galleryData => client.delete(`/v1/settings/startup/gallery/video/${galleryData.videoId}/delete`, {
	description: !markDownToText(galleryData.description)?.length ? null : galleryData.description,
	link: galleryData.link,
	source: galleryData.source || null,
	title: galleryData.title,
});

export const createGalleryData = galleryData => client.post(`${SERVER_URL}/v1/settings/startup/gallery/video/create`, {
	description: !markDownToText(galleryData.description)?.length ? null : galleryData.description,
	link: galleryData.link,
	source: galleryData.source || null,
	title: galleryData.title,
});

export const sendGallery = galleryData => {
	const videoPromise = galleryData.videoId
		? galleryData.link
			? updateGallery(galleryData)
			: removeGalleryVideo(galleryData)
		: galleryData.link ? createGalleryData(galleryData) : new Promise(resolve => resolve());

	const promiseArray = [
		client.post(`${SERVER_URL}/v1/settings/startup/gallery/files/update`, {
			documentId: galleryData.fileId || [],
		}),
		videoPromise,
	];

	if (!galleryData.videoId && !galleryData.videoLink) promiseArray.pop();

	return Promise.all(promiseArray);
};

export const addNewMember = memberData => client.post(`${SERVER_URL}/v1/settings/retailer/add-new-member`, memberData);

export const getAllMembers = () => client.get(`${SERVER_URL}/v1/settings/retailer/all`);

export const changeMemberStatus = ({ isBlocked, memberId }) => client.put(`${SERVER_URL}/v1/settings/retailer/${memberId}/change-member-status`, {
	isBlocked,
});

export const deleteMember = memberId => client.delete(`${SERVER_URL}/v1/settings/retailer/${memberId}/delete-member`);

export const editMember = ({
	avatar120Id,
	avatar30Id,
	avatar60Id,
	avatarId,
	city,
	countryId,
	department,
	email,
	firstName,
	lastName,
	note,
	password,
	position,
	isBlocked,
	memberId,
}) => client.put(`${SERVER_URL}/v1/settings/retailer/edit-member`, {
	avatar120Id,
	avatar30Id,
	avatar60Id,
	avatarId,
	city,
	countryId,
	department,
	email,
	firstName,
	lastName,
	note,
	password,
	position,
	isBlocked,
	memberId,
});

export const senAccountInfoForMember = ({
	avatar120Id,
	avatar30Id,
	avatar60Id,
	avatarId,
	city,
	countryId,
	department,
	firstName,
	lastName,
	position,
}) => client.put(`${SERVER_URL}/v1/member/settings/update-account-information`, {
	avatar120Id,
	avatar30Id,
	avatar60Id,
	avatarId,
	city,
	countryId,
	department,
	firstName,
	lastName,
	position,
});

export const sendTwoFaCodeToPhone = ({ phoneNumber, userId }) => client.post(`${SERVER_URL}/v1/authentication/send-code`, {
	phoneNumber,
	userId,
});

export const submitTwoFaCodeFromPhone = ({ code, phoneNumber, userId }) => client.post(`${SERVER_URL}/v1/authentication/submit-code`, {
	code,
	phoneNumber,
	userId,
});

export const subscriptionReactivate = () => client.get(`${SERVER_URL}/v1/settings/retailer/subscription/reactivate`);

export const subscriptionCancel = () => client.get(`${SERVER_URL}/v1/settings/retailer/subscription/cancel`);

export const getPaymentPlans = () => client.get(`${SERVER_URL}/v1/settings/retailer/payments`);

export const sendDiscount = ({ code }) => client.post(`${SERVER_URL}/v1/settings/retailer/get-discount-code`, { code });

export const sendEnterprise = ({ code }) => client.post(`${SERVER_URL}/v1/settings/retailer/get-enterprise-code-plan`, { code });
