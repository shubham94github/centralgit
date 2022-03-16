import { object, string } from 'yup';
import { validationErrMessages } from '@constants/common';

export const schema = object({
	code: string()
		.required(validationErrMessages.code)
		.trim()
		.default(''),
});
