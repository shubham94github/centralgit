import { object, string, number } from 'yup';
import { validationErrMessages } from '@constants/common';
import { MAX_INPUT_LENGTH } from '@constants/validationConstants';
import { MAX_INPUT_LENGTH_MESSAGE } from '@constants/validationMessages';

export const schema = object({
	title: string()
		.required(validationErrMessages.featureName)
		.max(MAX_INPUT_LENGTH, MAX_INPUT_LENGTH_MESSAGE)
		.nullable()
		.default(''),
	sortOrdering: object({
		value: number(),
		label: number(),
	})
		.required(validationErrMessages.sortOrder)
		.nullable()
		.default(null),
});

