import { object, string } from 'yup';
import { validationErrMessages } from '@constants/common';
import { MAX_INPUT_LENGTH } from '@constants/validationConstants';
import { MAX_INPUT_LENGTH_MESSAGE } from '@constants/validationMessages';
import { validateStringIsIntegerOrEmpty } from '@utils/validation';

export const schema = object({
	name: string()
		.required(validationErrMessages.memberGroupsName)
		.max(MAX_INPUT_LENGTH, MAX_INPUT_LENGTH_MESSAGE)
		.nullable()
		.default(''),
	maxMembers: string()
		.required(validationErrMessages.numberOfMembers)
		.min(1)
		.max(3, 'Text must be less than 3 characters')
		.test('', validationErrMessages.numberOfMembers, validateStringIsIntegerOrEmpty)
		.default(''),
});

