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
	validateStringIsIntegerOrEmpty,
	validatePhoneNumber,
	validateTextByLinksAndEmails,
	validateRequiredEditableTextarea,
	validateHtmlTextByMinLength,
	validateHtmlTextByMaxLength,
	validateTextareaMinOrEmpty,
} from '@utils/validation';
import {
	MAX_CITY_LENGTH,
	MAX_DESCRIPTION_LENGTH,
	MAX_INPUT_LENGTH,
	MAX_NUMBER_OF_CLIENTS,
	MAX_TEXTAREA_LENGTH,
	MAX_TOTAL_FUNDING_AMOUNT,
	MIN_DESCRIPTION_LENGTH,
	MIN_TEXTAREA_LENGTH,
} from '@constants/validationConstants';
import {
	getMaxLengthErrMsg,
	MAX_INPUT_LENGTH_MESSAGE,
	TEXT_LINK_EMAIL_ERROR_MESSAGE,
	getMaxTextareaLengthErrMsg,
	getMinTextareaLengthErrMsg,
	getMinLengthErrMsg,
	getMaxDescriptionLengthErrMsg,
} from '@constants/validationMessages';

export const baseSchema = {
	companyLegalName: string()
		.default('')
		.test('', invalidCompanyNameErrMsg, validateCompanyName)
		.trim()
		.max(MAX_INPUT_LENGTH, MAX_INPUT_LENGTH_MESSAGE),
	companyShortName: string()
		.default('')
		.required(validationErrMessages.shortCompanyName)
		.test('validateCompanyName', invalidCompanyNameErrMsg, validateCompanyName)
		.trim()
		.max(MAX_INPUT_LENGTH, MAX_INPUT_LENGTH_MESSAGE),
	countryId: object()
		.required(validationErrMessages.country)
		.default(null)
		.nullable(),
};

export const baseSchemaStartup = {
	numberOfClients: string()
		.default(null)
		.nullable()
		.max(MAX_NUMBER_OF_CLIENTS, getMaxLengthErrMsg(MAX_NUMBER_OF_CLIENTS))
		.test('validateNumber', 'Number of Clients is not a number', validateStringIsIntegerOrEmpty),
	totalFundingAmount: string()
		.default(null)
		.nullable()
		.max(MAX_TOTAL_FUNDING_AMOUNT, getMaxLengthErrMsg(MAX_TOTAL_FUNDING_AMOUNT))
		.test('validateNumber', 'Total Funding Amount is not a number', validateStringIsIntegerOrEmpty),
};

export const retailerSchema = object({
	...baseSchema,
	urlOfCompanyWebsite: string()
		.default('')
		.nullable()
		.trim(),
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
	companyDescription: string()
		.default('')
		.test('validateTextareaMinOrEmpty', getMinLengthErrMsg(MIN_DESCRIPTION_LENGTH, 'description'),
			validateTextareaMinOrEmpty(MIN_DESCRIPTION_LENGTH))
		.test('validateHtmlTextByMaxLength',
			getMaxDescriptionLengthErrMsg('description'),
			validateHtmlTextByMaxLength(MAX_DESCRIPTION_LENGTH))
		.test('validateLinksAndEmails', TEXT_LINK_EMAIL_ERROR_MESSAGE, validateTextByLinksAndEmails),
	role: string()
		.default('')
		.required(),
	categoryIds: array()
		.default(null)
		.max(maxCategoriesLength, categoriesErrMsg)
		.min(1, validationErrMessages.businessSector)
		.nullable()
		.required(validationErrMessages.businessSector),
	tags: array().default([]).nullable().max(maxAssociatedTagsLength, associatedTagsErrMsg),
});

export const startupSchemaIncomplete = object({
	...baseSchema,
	...baseSchemaStartup,
	companyLegalName: string()
		.default('')
		.test('', invalidCompanyNameErrMsg, validateCompanyName)
		.max(MAX_INPUT_LENGTH, MAX_INPUT_LENGTH_MESSAGE),
	city: string()
		.default('')
		.trim()
		.max(MAX_CITY_LENGTH, getMaxLengthErrMsg(MAX_CITY_LENGTH)),
	linkedInCompanyPage: string()
		.default('')
		.max(MAX_INPUT_LENGTH, MAX_INPUT_LENGTH_MESSAGE)
		.trim(),
	phoneNumber: string()
		.default('')
		.test('validatePhoneNumber', validationErrMessages.phoneNumberInvalid, validatePhoneNumber)
		.nullable(),
	owner: string()
		.default('')
		.max(MAX_INPUT_LENGTH, MAX_INPUT_LENGTH_MESSAGE)
		.trim(),
	urlOfCompanyWebsite: string()
		.default('')
		.max(MAX_INPUT_LENGTH, MAX_INPUT_LENGTH_MESSAGE)
		.trim(),
	foundedAt: date().default(null).nullable(),
	companyType: object().default(null).nullable(),
	targetMarket: array().nullable().default(null).nullable(),
	companyDescription: string()
		.default('')
		.test('validateLinksAndEmails', TEXT_LINK_EMAIL_ERROR_MESSAGE, validateTextByLinksAndEmails)
		.test('validateCompanyDescriptionMax', getMaxTextareaLengthErrMsg('Company description'),
			validateHtmlTextByMaxLength(MAX_DESCRIPTION_LENGTH))
		.test('validateTextareaMinOrEmpty', getMinTextareaLengthErrMsg('Company description'),
			validateTextareaMinOrEmpty(MIN_TEXTAREA_LENGTH)),
	solutionProductsServices: string()
		.default('')
		.test('validateLinksAndEmails', TEXT_LINK_EMAIL_ERROR_MESSAGE, validateTextByLinksAndEmails)
		.test('validateSolutionProductsServicesMax', getMaxTextareaLengthErrMsg('Solutions, products and services'),
			validateHtmlTextByMaxLength(MAX_DESCRIPTION_LENGTH))
		.test('validateTextareaMinOrEmpty', getMinTextareaLengthErrMsg('Solutions, products and services'),
			validateTextareaMinOrEmpty(MIN_TEXTAREA_LENGTH)),
	platformPartners: array()
		.nullable()
		.default(null),
	clientsList: array()
		.nullable()
		.default(null),
	numberOfClients: string()
		.default('')
		.nullable()
		.max(MAX_NUMBER_OF_CLIENTS, getMaxLengthErrMsg(MAX_NUMBER_OF_CLIENTS))
		.test('', 'Number of Clients is not a number', validateStringIsIntegerOrEmpty),
	integrationTiming: string()
		.default('')
		.nullable()
		.max(MAX_CITY_LENGTH, getMaxLengthErrMsg(MAX_CITY_LENGTH)),
	presenceInCountriesIds: array()
		.nullable()
		.default(null),
});

export const startupSchemaStandard = object({
	...baseSchema,
	...baseSchemaStartup,
	city: string()
		.default('')
		.trim()
		.max(MAX_CITY_LENGTH, getMaxLengthErrMsg(MAX_CITY_LENGTH))
		.required(validationErrMessages.city),
	linkedInCompanyPage: string()
		.default('')
		.max(MAX_INPUT_LENGTH, MAX_INPUT_LENGTH_MESSAGE)
		.trim(),
	phoneNumber: string()
		.default('')
		.nullable()
		.test('validatePhoneNumber', validationErrMessages.phoneNumberInvalid, validatePhoneNumber),
	owner: string()
		.default('')
		.max(MAX_INPUT_LENGTH, MAX_INPUT_LENGTH_MESSAGE)
		.trim(),
	urlOfCompanyWebsite: string()
		.default('')
		.max(MAX_INPUT_LENGTH, MAX_INPUT_LENGTH_MESSAGE)
		.trim(),
	foundedAt: date().default(null).nullable().required('Please add the date of foundation'),
	companyType: object().default(null).nullable().required('Please choose a company type'),
	companyStatus: string().default('').nullable().required('Company status is required field'),
	businessModel: string().default('').nullable().required('Business model is required field'),
	targetMarket: array().default(null).nullable().required('Please choose your target market'),
	companyDescription: string()
		.default('')
		.test('validateRequiredEditableTextarea', validationErrMessages.companyDescription,
			validateRequiredEditableTextarea)
		.test('validateLinksAndEmails', TEXT_LINK_EMAIL_ERROR_MESSAGE, validateTextByLinksAndEmails)
		.test('validateHtmlTextByMaxLength', getMaxTextareaLengthErrMsg('Company description'),
			validateHtmlTextByMaxLength(MAX_DESCRIPTION_LENGTH))
		.test('validateHtmlTextByMinLength', getMinTextareaLengthErrMsg('Company description'),
			validateHtmlTextByMinLength(MIN_TEXTAREA_LENGTH)),
	solutionProductsServices: string()
		.default('')
		.test('validateRequiredEditableTextarea', validationErrMessages.solutionProductsServices,
			validateRequiredEditableTextarea)
		.test('validateLinksAndEmails', TEXT_LINK_EMAIL_ERROR_MESSAGE, validateTextByLinksAndEmails)
		.test('validateSolutionProductsServicesMax', getMaxTextareaLengthErrMsg('Solutions, products and services'),
			validateHtmlTextByMaxLength(MAX_DESCRIPTION_LENGTH))
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
		.test('', 'Number of Clients is not a number', validateStringIsIntegerOrEmpty),
	integrationTiming: string()
		.nullable()
		.default('')
		.max(MAX_CITY_LENGTH, getMaxLengthErrMsg(MAX_CITY_LENGTH)),
	presenceInCountriesIds: array()
		.nullable()
		.default(null),
});

export const startupSchemaDemo = object({
	...baseSchema,
	...baseSchemaStartup,
	companyShortName: string()
		.default('')
		.required(validationErrMessages.brandName)
		.test('validateCompanyName', invalidCompanyNameErrMsg, validateCompanyName)
		.max(MAX_INPUT_LENGTH, MAX_INPUT_LENGTH_MESSAGE),
	city: string()
		.default(null)
		.nullable()
		.trim()
		.max(MAX_CITY_LENGTH, getMaxLengthErrMsg(MAX_CITY_LENGTH)),
	linkedInCompanyPage: string()
		.default(null)
		.nullable()
		.max(MAX_INPUT_LENGTH, MAX_INPUT_LENGTH_MESSAGE)
		.trim(),
	phoneNumber: string()
		.default(null)
		.test('validatePhoneNumber', validationErrMessages.phoneNumberInvalid, validatePhoneNumber)
		.nullable(),
	owner: string()
		.default(null)
		.nullable()
		.max(MAX_INPUT_LENGTH, MAX_INPUT_LENGTH_MESSAGE)
		.trim(),
	urlOfCompanyWebsite: string()
		.default(null)
		.nullable()
		.max(MAX_INPUT_LENGTH, MAX_INPUT_LENGTH_MESSAGE)
		.trim(),
	foundedAt: date().default(null).nullable().required('Please add the date of foundation'),
	companyType: object().default(null).nullable(),
	targetMarket: array().default(null).nullable().required('Please choose your target market'),
	companyDescription: string()
		.default('')
		.test('validateRequiredEditableTextarea', validationErrMessages.companyDescription,
			validateRequiredEditableTextarea)
		.test('validateLinksAndEmails', TEXT_LINK_EMAIL_ERROR_MESSAGE, validateTextByLinksAndEmails)
		.test('validateHtmlTextByMaxLength', getMaxTextareaLengthErrMsg('Company description'),
			validateHtmlTextByMaxLength(MAX_TEXTAREA_LENGTH))
		.test('validateHtmlTextByMinLength', getMinTextareaLengthErrMsg('Company description'),
			validateHtmlTextByMinLength(MIN_TEXTAREA_LENGTH)),
	solutionProductsServices: string()
		.default('')
		.test('validateLinksAndEmails', TEXT_LINK_EMAIL_ERROR_MESSAGE, validateTextByLinksAndEmails)
		.test('validateHtmlTextByMaxLength', getMaxTextareaLengthErrMsg('Solutions, products and services'),
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
		.default(null)
		.nullable()
		.max(MAX_NUMBER_OF_CLIENTS, getMaxLengthErrMsg(MAX_NUMBER_OF_CLIENTS))
		.test('validateNumber', 'Number of Clients is not a number', validateStringIsIntegerOrEmpty),
	integrationTiming: string()
		.default(null)
		.nullable()
		.max(MAX_CITY_LENGTH, getMaxLengthErrMsg(MAX_CITY_LENGTH)),
	presenceInCountriesIds: array()
		.nullable()
		.default(null),
});
