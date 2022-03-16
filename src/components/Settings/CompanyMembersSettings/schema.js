import { object, string } from 'yup';
import {
	PASSWORD_LENGTH,
	ERROR_MESSAGE_LENGTH_SIGN_UP,
	getMaxLengthErrMsg,
	MAX_INPUT_LENGTH_MESSAGE,
	MAX_NOTES_ERROR_MESSAGE,
} from '@constants/validationMessages';
import {
	MIN_INPUT_LENGTH,
	MAX_INPUT_LENGTH,
	MAX_CITY_LENGTH,
} from '@constants/validationConstants';
import {
	validateMinTextAreaLengthOrEmpty,
	validatePassword,
} from '@utils/validation';
import { validationErrMessages } from '@constants/common';

export const editMemberSchema = object({
	firstName: string()
		.required(validationErrMessages.firstName)
		.max(255, ERROR_MESSAGE_LENGTH_SIGN_UP)
		.trim()
		.default(''),
	lastName: string()
		.required(validationErrMessages.lastName)
		.max(255, ERROR_MESSAGE_LENGTH_SIGN_UP)
		.default('')
		.trim(),
	country: object()
		.required(validationErrMessages.country)
		.nullable()
		.default(null),
	city: string()
		.default('')
		.trim()
		.max(MAX_CITY_LENGTH, getMaxLengthErrMsg(MAX_CITY_LENGTH))
		.required(validationErrMessages.city),
	department: object({
		value: string().max(MAX_INPUT_LENGTH, MAX_INPUT_LENGTH_MESSAGE),
		label: string().trim().max(MAX_INPUT_LENGTH, MAX_INPUT_LENGTH_MESSAGE),
	})
		.default(null)
		.nullable()
		.required(validationErrMessages.department),
	position: object({
		value: string().max(MAX_INPUT_LENGTH, MAX_INPUT_LENGTH_MESSAGE),
		label: string().trim().max(MAX_INPUT_LENGTH, MAX_INPUT_LENGTH_MESSAGE),
	})
		.default(null)
		.nullable()
		.required(validationErrMessages.position),
	email: string()
		.required(validationErrMessages.email)
		.email('Invalid e-mail')
		.default('')
		.trim(),
	note: string()
		.test(validateMinTextAreaLengthOrEmpty)
		.max(MAX_INPUT_LENGTH, MAX_NOTES_ERROR_MESSAGE)
		.default('')
		.trim(),
});

export const addMemberSchema = object({
	firstName: string()
		.required(validationErrMessages.firstName)
		.max(255, ERROR_MESSAGE_LENGTH_SIGN_UP)
		.trim()
		.default(''),
	lastName: string()
		.required(validationErrMessages.lastName)
		.max(255, ERROR_MESSAGE_LENGTH_SIGN_UP)
		.default('')
		.trim(),
	country: object()
		.required(validationErrMessages.country)
		.nullable()
		.default(null),
	city: string()
		.default('')
		.trim()
		.max(MAX_CITY_LENGTH, getMaxLengthErrMsg(MAX_CITY_LENGTH))
		.required(validationErrMessages.city),
	department: object({
		value: string().max(MAX_INPUT_LENGTH, MAX_INPUT_LENGTH_MESSAGE),
		label: string().trim().max(MAX_INPUT_LENGTH, MAX_INPUT_LENGTH_MESSAGE),
	})
		.default(null)
		.nullable()
		.required(validationErrMessages.department),
	position: object({
		value: string().max(MAX_INPUT_LENGTH, MAX_INPUT_LENGTH_MESSAGE),
		label: string().trim().max(MAX_INPUT_LENGTH, MAX_INPUT_LENGTH_MESSAGE),
	})
		.default(null)
		.nullable()
		.required(validationErrMessages.position),
	email: string()
		.required(validationErrMessages.email)
		.email('Invalid e-mail')
		.default('')
		.trim(),
	password: string()
		.required(validationErrMessages.password)
		.test(validatePassword('password'))
		.min(MIN_INPUT_LENGTH, PASSWORD_LENGTH)
		.max(MAX_INPUT_LENGTH, PASSWORD_LENGTH)
		.default('')
		.trim(),
	note: string()
		.test(validateMinTextAreaLengthOrEmpty)
		.max(MAX_INPUT_LENGTH, MAX_NOTES_ERROR_MESSAGE)
		.default('')
		.trim(),
});
