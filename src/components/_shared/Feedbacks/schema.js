import { object } from 'yup';

export const schema = object({
	starsCount: object()
		.nullable()
		.required('Please choose a rate'),
});
