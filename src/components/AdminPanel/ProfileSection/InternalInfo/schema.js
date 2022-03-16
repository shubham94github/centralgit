import { object, string } from 'yup';
import { MAX_TEXTAREA_LENGTH } from '@constants/validationConstants';
import { getMaxLengthErrMsg } from '@constants/validationMessages';

export const schema = object({
	adminNote: string()
		.max(MAX_TEXTAREA_LENGTH, getMaxLengthErrMsg(MAX_TEXTAREA_LENGTH))
		.trim()
		.default(''),
});
