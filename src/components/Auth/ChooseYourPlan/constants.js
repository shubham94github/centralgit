export const columns = [
	{
		title: 'Single Account',
		type: 'SINGLE_USER',
		featureType: 'isSingleUser',
	},
	{
		title: 'Multi-Account',
		type: 'MULTI_USER',
		featureType: 'isMultiUser',
	},
	{
		title: 'Enterprise',
		type: 'ENTERPRISE',
		featureType: 'isEnterpriseUser',
	},
];

export const featurePoints = [
	'You will not be charged until your trial period has ended.',
	'We will send you a reminder before your trial ends.',
	'Upgrade at anytime.',
];

export const radioFields = [
	{
		id: 'basic',
		name: 'paymentPlanId',
		value: 1,
	},
	{
		id: 'standard',
		name: 'paymentPlanId',
		value: 2,
	},
	{
		id: 'premium',
		name: 'paymentPlanId',
		value: 3,
	},
];
