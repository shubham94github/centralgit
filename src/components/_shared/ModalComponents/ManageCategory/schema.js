import { object, string, number } from 'yup';
import { validationErrMessages } from '@constants/common';
import { MAX_INPUT_LENGTH } from '@constants/validationConstants';
import { MAX_INPUT_LENGTH_MESSAGE } from '@constants/validationMessages';

export const schema = object({
	name: string()
		.required(validationErrMessages.categoryName)
		.max(MAX_INPUT_LENGTH, MAX_INPUT_LENGTH_MESSAGE)
		.nullable()
		.default(''),
	childHeader: string()
		.nullable()
		.max(MAX_INPUT_LENGTH, 'Title must be less than 255 characters')
		.default(''),
	weight: object({
		value: number(),
		label: number(),
	})
		.required(validationErrMessages.weight)
		.nullable()
		.default(null),
});

