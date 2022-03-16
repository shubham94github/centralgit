import { validationErrMessages } from '@constants/common';
import { object, string } from 'yup';

export const schema = object({
	email: string()
		.email('Invalid e-mail')
		.required(validationErrMessages.email)
		.default('')
		.trim(),
});
