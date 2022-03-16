import { validationErrMessages } from '@constants/common';
import { object, string } from 'yup';
import { MAX_INPUT_LENGTH_MESSAGE, VALID_EMAIL } from '@constants/validationMessages';
import { MAX_INPUT_LENGTH } from '@constants/validationConstants';

export const schema = object({
	email: string()
		.required(validationErrMessages.email)
		.max(MAX_INPUT_LENGTH, MAX_INPUT_LENGTH_MESSAGE)
		.email(VALID_EMAIL)
		.trim()
		.default(''),
});

