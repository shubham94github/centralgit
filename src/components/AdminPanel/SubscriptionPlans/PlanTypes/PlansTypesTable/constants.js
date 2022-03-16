export const subscriptionPlansColumns = [
	{
		name: '№',
		selector: 'number',
		maxWidth: '40px',
		center: true,
	},
	{
		name: 'Plan Type',
		selector: 'plan',
		maxWidth: '165px',
	},
	{
		name: 'Description',
		selector: 'description',
	},
];

export const subscriptionPlansData = [
	{
		id: 1,
		number: 1,
		plan: 'Single User',
		description: 'Plan applied to the Single User',
	},
	{
		id: 2,
		number: 2,
		plan: 'Multi-User',
		description: 'Plan applied to the Companies',
	},
	{
		id: 3,
		number: 3,
		plan: 'Enterprise',
		description: 'Plan applied to Users with the promo code',
	},
];
