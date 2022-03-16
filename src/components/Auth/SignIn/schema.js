import { validationErrMessages } from '@constants/common';
import { bool, object, string } from 'yup';
import { PASSWORD_LENGTH } from '@constants/validationMessages';
import { MAX_INPUT_LENGTH } from '@constants/validationConstants';

export const schema = object({
	email: string()
		.email('Invalid e-mail')
		.required(validationErrMessages.email)
		.default('')
		.trim(),
	password: string()
		.required(validationErrMessages.password)
		.max(MAX_INPUT_LENGTH, PASSWORD_LENGTH)
		.default('')
		.trim(),
	rememberMe: bool().default(false),
});

