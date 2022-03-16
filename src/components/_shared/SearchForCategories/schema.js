import { object, string } from 'yup';
import { ERROR_MESSAGE_LENGTH } from '@constants/validationMessages';
import { defaultValueSelect } from './constants';

export const schema = object({
	category: object({
		value: string().required('Company field is required'),
	})
		.default(defaultValueSelect)
		.required('Category field is required'),
	search: string()
		.max(255, ERROR_MESSAGE_LENGTH)
		.required('Search field is required')
		.default(''),
});
