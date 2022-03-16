export const listOfFilters = [
	{
		placeholder: 'Role',
		type: 'string',
		property: 'adminRole',
		options: [],
		width: 226,
	},
	{
		placeholder: 'User type',
		type: 'string',
		property: 'userRole',
		options: [
			{ label: 'Startup', value: 'STARTUP' },
			{ label: 'Retailer', value: 'RETAILER' },
			{ label: 'Brand', value: 'RETAILER_BRAND' },
			{ label: 'Consultant', value: 'RETAILER_CONSULTANT' },
			{ label: 'Service provider', value: 'RETAILER_SERVICE_PROVIDER' },
			{ label: 'Venture capital', value: 'RETAILER_VENTURE_CAPITAL' },
			{ label: 'Entrepreneur', value: 'RETAILER_ENTREPRENEUR' },
			{ label: 'Investor', value: 'RETAILER_INVESTOR' },
			{ label: 'Private person', value: 'RETAILER_PRIVATE_PERSON' },
		],
		width: 226,
	},
	{
		placeholder: 'Action',
		type: 'string',
		property: 'activity',
		options: [],
		width: 226,
	},
	{
		placeholder: 'Date Range',
		type: 'date',
		property: 'createdAt',
		width: 226,
	},
];
