import { object, string } from 'yup';

export const schema = object({
	code: string()
		.trim()
		.default(''),
});
