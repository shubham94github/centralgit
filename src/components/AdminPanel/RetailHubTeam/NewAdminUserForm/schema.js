import { validationErrMessages } from '@constants/common';
import { number, object, string } from 'yup';
import { validateLetters, validatePassword, validatePhoneNumber } from '@utils/validation';
import { MAX_CITY_LENGTH, MAX_INPUT_LENGTH } from '@constants/validationConstants';
import { getMaxLengthErrMsg, MAX_INPUT_LENGTH_MESSAGE, PASSWORD_LENGTH } from '@constants/validationMessages';
import { onlyLettersErrMsg } from '@components/Auth/constants';
import { fields } from './constants';

const schema = object({
	firstName: string()
		.required(validationErrMessages.firstNameAdminUser)
		.test('', onlyLettersErrMsg, validateLetters)
		.trim()
		.max(MAX_INPUT_LENGTH, MAX_INPUT_LENGTH_MESSAGE),
	lastName: string()
		.required(validationErrMessages.lastNameAdminUser)
		.test('', onlyLettersErrMsg, validateLetters)
		.trim()
		.max(MAX_INPUT_LENGTH, MAX_INPUT_LENGTH_MESSAGE),
	countryId: object()
		.default(null)
		.nullable()
		.required(validationErrMessages.country),
	city: string()
		.trim()
		.required(validationErrMessages.city)
		.max(MAX_CITY_LENGTH, getMaxLengthErrMsg(MAX_CITY_LENGTH))
		.nullable()
		.default(null),
	email: string()
		.email('Invalid e-mail')
		.max(MAX_INPUT_LENGTH, MAX_INPUT_LENGTH_MESSAGE)
		.required(validationErrMessages.email)
		.max(MAX_INPUT_LENGTH, getMaxLengthErrMsg(MAX_INPUT_LENGTH))
		.trim(),
	phoneNumber: string()
		.nullable()
		.default(null)
		.max(MAX_INPUT_LENGTH, MAX_INPUT_LENGTH_MESSAGE)
		.test('validatePhoneNumber', validationErrMessages.phoneNumberInvalid, validatePhoneNumber),
	password: string()
		.required(validationErrMessages.password)
		.max(MAX_INPUT_LENGTH, PASSWORD_LENGTH)
		.test(validatePassword(fields.password.name))
		.default('')
		.trim(),
	role: object().shape({
		value: string(),
		label: string(),
	})
		.nullable()
		.default(null),
	avatarId: number().transform(v => !!v ? v : undefined),
});

export default schema;
