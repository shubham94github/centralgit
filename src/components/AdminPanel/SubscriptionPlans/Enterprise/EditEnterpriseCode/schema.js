import { object, string } from 'yup';
import { validationErrMessages } from '@constants/common';
import { ERROR_MESSAGE_LENGTH } from '@constants/validationMessages';

export const schema = object({
	code: string()
		.default('')
		.trim()
		.required(validationErrMessages.enterpriseCodeRequired)
		.min(1, ERROR_MESSAGE_LENGTH)
		.max(20),
});
