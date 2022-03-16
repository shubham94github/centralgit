import { bool, object, string } from 'yup';

export const schema = object({
	role: object({
		label: string(),
		value: string(),
	})
		.nullable()
		.default(null),
	memberGroupId: object({
		label: string(),
		value: string(),
	})
		.nullable()
		.default(null),
	paymentPlanPriceIds: object({
		label: string(),
		value: string(),
	})
		.nullable()
		.default(null),
	isHidden: object({
		label: string(),
		value: bool(),
	})
		.nullable()
		.default(null),
});
