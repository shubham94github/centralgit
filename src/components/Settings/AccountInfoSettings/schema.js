import { validationErrMessages } from '@constants/common';
import { bool, number, object, string } from 'yup';
import { validatePhoneNumber } from '@utils/validation';
import { MAX_INPUT_LENGTH } from '@constants/validationConstants';
import { MAX_INPUT_LENGTH_MESSAGE } from '@constants/validationMessages';

const schema = object({
	firstName: string()
		.required(validationErrMessages.firstName)
		.trim()
		.max(MAX_INPUT_LENGTH, MAX_INPUT_LENGTH_MESSAGE),
	lastName: string()
		.required(validationErrMessages.lastName)
		.trim()
		.max(MAX_INPUT_LENGTH, MAX_INPUT_LENGTH_MESSAGE),
	position: object({
		value: string().trim().max(MAX_INPUT_LENGTH, MAX_INPUT_LENGTH_MESSAGE),
		label: string().trim().max(MAX_INPUT_LENGTH, MAX_INPUT_LENGTH_MESSAGE),
	}).default(null).nullable(),
	department: object({
		value: string().trim().max(MAX_INPUT_LENGTH, MAX_INPUT_LENGTH_MESSAGE),
		label: string().trim().max(MAX_INPUT_LENGTH, MAX_INPUT_LENGTH_MESSAGE),
	}).default(null).nullable(),
	email: string().email().required(validationErrMessages.email).trim(),
	phoneNumber: string()
		.nullable()
		.test('validatePhoneNumber', validationErrMessages.phoneNumberInvalid, validatePhoneNumber),
	avatarId: number().transform(v => !!v ? v : undefined),
	isEnabled2fa: bool().default(false),
});

export default schema;
