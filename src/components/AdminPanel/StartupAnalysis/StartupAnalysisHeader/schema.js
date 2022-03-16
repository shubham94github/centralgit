import { array, object } from 'yup';

export const schema = object({
	keywords: array()
		.default([]),
});

