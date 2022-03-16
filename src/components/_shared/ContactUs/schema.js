import { validationErrMessages } from '@constants/common';
import { object, string } from 'yup';
import { MAX_TEXTAREA_LENGTH, MIN_TEXTAREA_LENGTH } from '@constants/validationConstants';
import { getMaxLengthErrMsg, TEXTAREA_MIN_LENGTH_MESSAGE } from '@constants/validationMessages';

export const schema = object({
	email: string()
		.email('Invalid e-mail')
		.required(validationErrMessages.email)
		.default('')
		.trim(),
	problem: string()
		.required('Please describe your problem or question')
		.max(MAX_TEXTAREA_LENGTH, getMaxLengthErrMsg(MAX_TEXTAREA_LENGTH))
		.min(MIN_TEXTAREA_LENGTH, TEXTAREA_MIN_LENGTH_MESSAGE)
		.trim()
		.default(''),
});
