import { validationErrMessages } from '@constants/common';
import { object, string } from 'yup';
import { validatePhoneNumber } from '@utils/validation';
import { MAX_INPUT_LENGTH } from '@constants/validationConstants';
import { MAX_INPUT_LENGTH_MESSAGE } from '@constants/validationMessages';

export const standardSchema = object({
	firstName: string()
		.required(validationErrMessages.firstName)
		.trim()
		.max(MAX_INPUT_LENGTH, MAX_INPUT_LENGTH_MESSAGE),
	lastName: string()
		.required(validationErrMessages.lastName)
		.trim()
		.max(MAX_INPUT_LENGTH, MAX_INPUT_LENGTH_MESSAGE),
	position: object({
		value: string().max(MAX_INPUT_LENGTH, MAX_INPUT_LENGTH_MESSAGE),
		label: string().trim().max(MAX_INPUT_LENGTH, MAX_INPUT_LENGTH_MESSAGE),
	}).default(null).nullable(),
	department: object({
		value: string().max(MAX_INPUT_LENGTH, MAX_INPUT_LENGTH_MESSAGE),
		label: string().trim().max(MAX_INPUT_LENGTH, MAX_INPUT_LENGTH_MESSAGE),
	}).default(null).nullable(),
	email: string()
		.email('Invalid e-mail')
		.required(validationErrMessages.email)
		.trim(),
	phoneNumber: string()
		.default('')
		.nullable()
		.test('validatePhoneNumber', validationErrMessages.phoneNumberInvalid, validatePhoneNumber),
});

export const otherTypesSchema = object({
	firstName: string()
		.trim()
		.max(MAX_INPUT_LENGTH, MAX_INPUT_LENGTH_MESSAGE)
		.nullable()
		.default(null),
	lastName: string()
		.trim()
		.max(MAX_INPUT_LENGTH, MAX_INPUT_LENGTH_MESSAGE)
		.nullable()
		.default(null),
	position: object({
		value: string().max(MAX_INPUT_LENGTH, MAX_INPUT_LENGTH_MESSAGE),
		label: string().trim().max(MAX_INPUT_LENGTH, MAX_INPUT_LENGTH_MESSAGE),
	}).default(null).nullable(),
	department: object({
		value: string().max(MAX_INPUT_LENGTH, MAX_INPUT_LENGTH_MESSAGE),
		label: string().trim().max(MAX_INPUT_LENGTH, MAX_INPUT_LENGTH_MESSAGE),
	}).default(null).nullable(),
	email: string().email().required(validationErrMessages.email).trim(),
	phoneNumber: string()
		.nullable()
		.test('validatePhoneNumber', validationErrMessages.phoneNumberInvalid, validatePhoneNumber),
});
