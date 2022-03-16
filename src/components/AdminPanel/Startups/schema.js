import { bool, number, object, string } from 'yup';

export const schema = object({
	isVerified: object().shape({
		value: bool(),
		label: string(),
	})
		.nullable()
		.default(null),
	accountType: object().shape({
		value: string(),
		label: string(),
	})
		.nullable()
		.default(null),
	rateStars: object().shape({
		value: string(),
		label: string(),
	})
		.nullable()
		.default(null),
	isBlocked: object().shape({
		value: bool(),
		label: string(),
	})
		.nullable()
		.default(null),
	status: object().shape({
		value: string(),
		label: string(),
	})
		.nullable()
		.default(null),
	country: object().shape({
		id: number(),
		label: string(),
		name: string(),
		value: string(),
	})
		.nullable()
		.default(null),
	companyType: object().shape({
		value: string(),
		label: string(),
	})
		.nullable()
		.default(null),
	businessModel: object().shape({
		value: string(),
		label: string(),
	})
		.nullable()
		.default(null),
	companyStatus: object().shape({
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

