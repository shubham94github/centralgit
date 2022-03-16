import { array, object, string } from 'yup';

export const schema = object({
	adminRole: object().shape({
		value: string(),
		label: string(),
	})
		.nullable()
		.default(null),
	activity: object().shape({
		value: string(),
		label: string(),
	})
		.nullable()
		.default(null),
	userRole: object().shape({
		value: string(),
		label: string(),
	})
		.nullable()
		.default(null),
	createdAt: array().default(null).nullable(),
});
