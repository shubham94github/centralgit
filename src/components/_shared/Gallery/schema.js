import { object, string } from 'yup';
import { MAX_INPUT_LENGTH } from '@constants/validationConstants';
import {
	getMaxTextareaLengthErrMsg,
	MAX_INPUT_LENGTH_MESSAGE,
	TEXT_LINK_EMAIL_ERROR_MESSAGE,
} from '@constants/validationMessages';
import { validateHtmlTextByMaxLength, validateTextByLinksAndEmails } from '@utils/validation';

export const schema = object({
	videoLink: string()
		.default('')
		.nullable()
		.trim()
		.max(MAX_INPUT_LENGTH, MAX_INPUT_LENGTH_MESSAGE),
	videoTitle: string()
		.default('')
		.nullable()
		.trim()
		.max(MAX_INPUT_LENGTH, MAX_INPUT_LENGTH_MESSAGE),
	videoDescription: string()
		.default('')
		.nullable()
		.trim()
		.test('validateLinksAndEmails', TEXT_LINK_EMAIL_ERROR_MESSAGE, validateTextByLinksAndEmails)
		.test('validateMaxLength', getMaxTextareaLengthErrMsg('The description', MAX_INPUT_LENGTH),
			validateHtmlTextByMaxLength(MAX_INPUT_LENGTH, false)),
});

export const fieldNames = {
	videoLink: 'videoLink',
	videoTitle: 'videoTitle',
	videoDescription: 'videoDescription',
};
