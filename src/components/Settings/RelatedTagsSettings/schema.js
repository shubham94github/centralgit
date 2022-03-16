import { array, object } from 'yup';
import { associatedTagsErrMsg, maxTagsLength } from '@components/Auth/constants';

export const schema = object({
	relatedTags: array()
		.nullable()
		.test('validateTags', associatedTagsErrMsg, val => val.length <= maxTagsLength)
		.default([]),
});
