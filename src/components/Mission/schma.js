import { array, object, string } from 'yup';
import { validationErrMessages } from '@constants/common';
import { MAX_DESCRIPTION_MISSION_LENGTH, MAX_TITLE_LENGTH } from '@constants/validationConstants';
import { getMaxLengthErrMsg } from '@constants/validationMessages';

export const schema = object({
	searchTitle: string()
		.default('')
		.required(validationErrMessages.searchTitle)
		.trim()
		.max(MAX_TITLE_LENGTH, getMaxLengthErrMsg(MAX_TITLE_LENGTH)),
	description: string()
		.default('')
		.required(validationErrMessages.description)
		.trim()
		.max(MAX_DESCRIPTION_MISSION_LENGTH, getMaxLengthErrMsg(MAX_DESCRIPTION_MISSION_LENGTH)),
	implementationTime: object()
		.required(validationErrMessages.implementationTime)
		.default(null)
		.nullable(),
	budget: string()
		.default('')
		.nullable(),
	operationLocationIds: array()
		.nullable()
		.default([]),
	excludeCompaniesIds: array()
		.nullable()
		.default([]),
});
