export const listOfFilters = [
	{
		placeholder: 'E-mail Verified',
		type: 'boolean',
		property: 'isVerified',
		options: [
			{ value: true, label: 'Yes' },
			{ value: false, label: 'No' },
		],
	},
	{
		placeholder: 'Startup Type',
		type: 'string',
		property: 'accountType',
		options: [
			{ value: 'STANDARD', label: 'Standard' },
			{ value: 'DEMO', label: 'Demo' },
			{ value: 'INCOMPLETE', label: 'Incomplete' },
			{ value: 'IMPORTED', label: 'Imported' },
		],
	},
	{
		placeholder: 'Rate',
		type: 'string',
		property: 'rateStars',
		options: [
			{ value: 1, label: 1 },
			{ value: 2, label: 2 },
			{ value: 3, label: 3 },
			{ value: 4, label: 4 },
			{ value: 5, label: 5 },
		],
	},
	{
		placeholder: 'Status',
		type: 'boolean',
		property: 'isBlocked',
		options: [
			{ value: false, label: 'Active' },
			{ value: true, label: 'Blocked' },
		],
	},
	{
		placeholder: 'Getting started status',
		type: 'string',
		property: 'status',
		options: [
			{ value: 'ACCOUNT_REGISTRATION', label: 'Account Registration' },
			{ value: 'ACCOUNT_INFORMATION', label: 'Account Information' },
			{ value: 'COMPANY_INFORMATION', label: 'Company Information' },
			{ value: 'SECTORS_OF_COMPETENCE', label: 'Sector of Competence' },
			{ value: 'AREAS_OF_INTEREST', label: 'Areas of Interest' },
			{ value: 'COMPLETED', label: 'Completed' },
		],
	},
	{
		placeholder: 'Country',
		type: 'string',
		property: 'country',
		options: [],
	},
	{
		placeholder: 'Company type',
		type: 'string',
		property: 'companyType',
		options: [
			{ value: 'SINGLE_ENTREPRENEUR', label: 'Single Entrepreneur' },
			{ value: 'LIMITED_LIABILITY_COMPANY', label: 'Limited Liability Company' },
			{ value: 'LIMITED_LIABILITY_PARTNERSHIP', label: 'Limited Liability Partnership' },
			{ value: 'PUBLICLY_LISTED_COMPANY', label: 'Publicly Listed Company' },
			{ value: 'GOVERNMENT_ENTERPRISE', label: 'Government Enterprise' },
			{ value: 'CHARITY', label: 'Charity' },
		],
	},
	{
		placeholder: 'Business model',
		type: 'string',
		property: 'businessModel',
		options: [
			{ value: 'PRODUCT_AND_SERVICE_SALES', label: 'Product and service sales' },
			{ value: 'SUBSCRIPTION', label: 'Subscription' },
			{ value: 'LICENSING', label: 'Licensing' },
			{ value: 'FREEMIUM', label: 'Freemium' },
			{ value: 'SUPPORT', label: 'Support' },
		],
	},
	{
		placeholder: 'Company Status',
		type: 'string',
		property: 'companyStatus',
		options: [
			{ value: 'STEALTH', label: 'Stealth' },
			{ value: 'START_UP', label: 'Start-up' },
			{ value: 'SCALE_UP', label: 'Scale Up' },
			{ value: 'GROWTH', label: 'Growth' },
			{ value: 'ESTABLISHED', label: 'Established' },
		],
	},
	{
		placeholder: 'Approved',
		type: 'boolean',
		property: 'isApprovedByAdmin',
		options: [
			{ value: true, label: 'Yes' },
			{ value: false, label: 'No' },
		],
	},
];
