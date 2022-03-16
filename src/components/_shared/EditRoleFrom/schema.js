import { object, string } from 'yup';
import { MAX_INPUT_LENGTH } from '@constants/validationConstants';
import { MAX_INPUT_LENGTH_MESSAGE } from '@constants/validationMessages';

export const schema = object({
	name: string()
		.default('')
		.trim()
		.max(MAX_INPUT_LENGTH, MAX_INPUT_LENGTH_MESSAGE)
		.required(),
	copyRightFrom: object()
		.default(null)
		.nullable(),
});
