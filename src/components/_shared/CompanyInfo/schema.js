import {
	associatedTagsErrMsg,
	categoriesErrMsg,
	invalidCompanyNameErrMsg,
	maxCategoriesLength,
	maxAssociatedTagsLength,
} from '@components/Auth/constants';
import { validationErrMessages } from '@constants/common';
import { string, object, date, array } from 'yup';
import {
	validateCompanyName,
	validateEmailDomain,
	validateHtmlTextByMaxLength,
	validateHtmlTextByMinLength,
	validatePhoneNumber,
	validateRequiredArrayValue,
	validateRequiredEditableTextarea,
	validateStringIsIntegerOrEmpty,
	validateTextByLinksAndEmails,
} from '@utils/validation';
import {
	MAX_CITY_LENGTH,
	MAX_INPUT_LENGTH,
	MAX_NUMBER_OF_CLIENTS,
	MAX_TEXTAREA_LENGTH,
	MAX_TOTAL_FUNDING_AMOUNT,
	MIN_DESCRIPTION_LENGTH,
	MIN_TEXTAREA_LENGTH,
} from '@constants/validationConstants';
import {
	getMaxLengthErrMsg,
	getMinLengthErrMsg,
	MAX_INPUT_LENGTH_MESSAGE,
	TEXT_LINK_EMAIL_ERROR_MESSAGE,
	getMaxTextareaLengthErrMsg,
	getMinTextareaLengthErrMsg,
	getMaxDescriptionLengthErrMsg,
} from '@constants/validationMessages';
import enums from '@constants/enums';

export const baseSchema = {
	country: object()
		.required(validationErrMessages.country)
		.default(null)
		.nullable(),
	city: string()
		.default('')
		.trim()
		.max(MAX_CITY_LENGTH, getMaxLengthErrMsg(MAX_CITY_LENGTH))
		.required(validationErrMessages.city),
	linkedInCompanyPage: string()
		.max(MAX_INPUT_LENGTH, MAX_INPUT_LENGTH_MESSAGE)
		.default('')
		.trim(),
	phoneNumber: string()
		.default('')
		.test('validatePhoneNumber', validationErrMessages.phoneNumberInvalid, validatePhoneNumber)
		.nullable(),
	logoId: object().nullable(),
};

const retailSchema = {
	...baseSchema,
	companyLegalName: string()
		.default('')
		.test('', invalidCompanyNameErrMsg, validateCompanyName)
		.trim()
		.max(MAX_INPUT_LENGTH, MAX_INPUT_LENGTH_MESSAGE),
	companyShortName: string()
		.default('')
		.required(validationErrMessages.shortCompanyName)
		.test('', invalidCompanyNameErrMsg, validateCompanyName)
		.trim()
		.max(MAX_INPUT_LENGTH, MAX_INPUT_LENGTH_MESSAGE),
	companyDescription: string()
		.default('')
		.test('validateHtmlTextByMinLength', getMinLengthErrMsg(MIN_DESCRIPTION_LENGTH, 'description'),
			validateHtmlTextByMinLength(MIN_DESCRIPTION_LENGTH))
		.test('validateUserCompanyDescriptionMaxOrEmpty',
			getMaxDescriptionLengthErrMsg('description'),
			validateHtmlTextByMaxLength(MAX_TEXTAREA_LENGTH))
		.test('validateLinksAndEmails', TEXT_LINK_EMAIL_ERROR_MESSAGE, validateTextByLinksAndEmails),
	categoryIds: array()
		.default(null)
		.max(maxCategoriesLength, categoriesErrMsg)
		.min(1, validationErrMessages.businessSector)
		.nullable()
		.required(validationErrMessages.businessSector),
	tags: array().default([]).nullable().max(maxAssociatedTagsLength, associatedTagsErrMsg),
};

const {
	retailerCompany,
	retailerServiceProvider,
	retailerConsultant,
	retailerVentureCapital,
	retailerBrand,
} = enums.userRoles;

const retailerCompanies = [
	retailerCompany,
	retailerBrand,
	retailerConsultant,
	retailerServiceProvider,
	retailerVentureCapital,
];

export const getRetailSchema = role => object(
	!retailerCompanies.includes(role)
		? {
			...retailSchema,
			urlOfCompanyWebsite: string()
				.default('')
				.nullable()
				.trim(),
		}
		: {
			...retailSchema,
			emailDomain: string()
				.required(validationErrMessages.email)
				.trim()
				.test('validateEmailDomain', 'Field must be a valid email domain', validateEmailDomain)
				.max(MAX_INPUT_LENGTH, MAX_INPUT_LENGTH_MESSAGE),
			urlOfCompanyWebsite: string()
				.default('')
				.nullable()
				.trim(),
		},
);

export const startupSchema = object({
	...baseSchema,
	companyLegalName: string()
		.default('')
		.nullable()
		.test('', invalidCompanyNameErrMsg, validateCompanyName)
		.required(validationErrMessages.legalCompanyName)
		.max(MAX_INPUT_LENGTH, MAX_INPUT_LENGTH_MESSAGE),
	companyShortName: string()
		.default('')
		.nullable()
		.required(validationErrMessages.shortCompanyName)
		.test('validateCompanyName', invalidCompanyNameErrMsg, validateCompanyName)
		.max(MAX_INPUT_LENGTH, MAX_INPUT_LENGTH_MESSAGE),
	owner: string()
		.max(MAX_INPUT_LENGTH, MAX_INPUT_LENGTH_MESSAGE)
		.trim()
		.nullable()
		.default(''),
	urlOfCompanyWebsite: string()
		.default('')
		.nullable()
		.trim(),
	founded: date().default(null).nullable().required('Please add the date of foundation'),
	companyType: object().default(null).nullable().required('Please choose a company type'),
	companyStatus: string().required('Company status is required field'),
	targetMarket:
		array()
			.default(null)
			.nullable()
			.test('validateTargetMarker', 'Please choose your target market', validateRequiredArrayValue)
			.required('Please choose your target market'),
	companyDescription: string()
		.default('')
		.required(validationErrMessages.companyDescription)
		.test('validateRequiredEditableTextarea', validationErrMessages.companyDescription,
			validateRequiredEditableTextarea)
		.test('validateLinksAndEmails', TEXT_LINK_EMAIL_ERROR_MESSAGE, validateTextByLinksAndEmails)
		.test('validateCompanyDescriptionMax', getMaxTextareaLengthErrMsg('Company description'),
			validateHtmlTextByMaxLength(MAX_TEXTAREA_LENGTH))
		.test('validateHtmlTextByMinLength', getMinTextareaLengthErrMsg('Company description'),
			validateHtmlTextByMinLength(MIN_TEXTAREA_LENGTH)),
	solutionProductsServices: string()
		.default('')
		.test('validateRequiredEditableTextarea', validationErrMessages.solutionProductsServices,
			validateRequiredEditableTextarea)
		.test('validateLinksAndEmails', TEXT_LINK_EMAIL_ERROR_MESSAGE, validateTextByLinksAndEmails)
		.test('validateSolutionProductsServicesMax', getMaxTextareaLengthErrMsg('Solutions, products and services'),
			validateHtmlTextByMaxLength(MAX_TEXTAREA_LENGTH))
		.test('validateHtmlTextByMinLength', getMinTextareaLengthErrMsg('Solutions, products and services'),
			validateHtmlTextByMinLength(MIN_TEXTAREA_LENGTH)),
	platformPartners: array()
		.nullable()
		.default(null),
	clientsList: array()
		.nullable()
		.default(null),
	numberOfClients: string()
		.default('')
		.max(MAX_NUMBER_OF_CLIENTS, getMaxLengthErrMsg(MAX_NUMBER_OF_CLIENTS))
		.test('validateNumber', 'Number of Clients is not a number', validateStringIsIntegerOrEmpty),
	totalFundingAmount: string()
		.default(null)
		.nullable()
		.max(MAX_TOTAL_FUNDING_AMOUNT, getMaxLengthErrMsg(MAX_TOTAL_FUNDING_AMOUNT))
		.test('validateNumber', 'Total Funding Amount is not a number', validateStringIsIntegerOrEmpty),
	integrationTiming: string()
		.default('')
		.max(MAX_CITY_LENGTH, getMaxLengthErrMsg(MAX_CITY_LENGTH)),
	presenceInCountriesIds: array()
		.nullable()
		.default(null),
});
