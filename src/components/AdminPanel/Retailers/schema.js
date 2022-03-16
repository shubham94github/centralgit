import { bool, object, string } from 'yup';

export const schema = object({
	isVerified: object()
		.nullable()
		.default(null),
	isBlocked: object()
		.nullable()
		.default(null),
	status: object()
		.nullable()
		.default(null),
	country: object()
		.nullable()
		.default(null),
	paymentPlanName: object()
		.nullable()
		.default(null),
	role: object().shape({
		value: string(),
		label: string(),
	})
		.nullable()
		.default(null),
	isApprovedByAdmin: object().shape({
		value: bool(),
		label: string(),
	})
		.nullable()
		.default(null),
});

