import { validationErrMessages } from '@constants/common';
import { object, string, number } from 'yup';
import { MIN_TEXTAREA_LENGTH, MAX_FEEDBACK_LENGTH } from '@constants/validationConstants';
import {
	getMaxLengthErrMsg,
	TEXTAREA_MIN_LENGTH_MESSAGE,
} from '@constants/validationMessages';

export const schema = object({
	isContact: string()
		.oneOf(['false', 'true'])
		.nullable()
		.default('false'),
	rate: number()
		.min(1)
		.max(5)
		.nullable()
		.required(validationErrMessages.startupRate)
		.default(''),
	text: string()
		.required('Leave your feedback about the Startup')
		.max(MAX_FEEDBACK_LENGTH, getMaxLengthErrMsg(MAX_FEEDBACK_LENGTH))
		.min(MIN_TEXTAREA_LENGTH, TEXTAREA_MIN_LENGTH_MESSAGE)
		.trim()
		.default(''),
});
