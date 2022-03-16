import { object, string } from 'yup';

export const schema = object({
	authority: object({ label: string(), value: string() }).default(null).nullable(),
});

