import { object, string } from 'yup';
import { MAX_INPUT_LENGTH } from '@constants/validationConstants';
import { MAX_TITLE_LENGTH_MESSAGE } from '@constants/validationMessages';
import { validationErrMessages } from '@constants/common';

export const schema = object({
	title: string()
		.trim()
		.required(validationErrMessages.title)
		.max(MAX_INPUT_LENGTH, MAX_TITLE_LENGTH_MESSAGE),
});
