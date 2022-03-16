import { retailerTypes } from '@constants/common';

export const getListOfFilters = paymentPlanOptions => ([
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
			{ value: 'PAYMENT_PLAN', label: 'Payment plan' },
			{ value: 'PAYMENT_METHOD', label: 'Payment method' },
			{ value: 'ACCOUNT_INFORMATION', label: 'Account Information' },
			{ value: 'COMPANY_INFORMATION', label: 'Company Information' },
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
		placeholder: 'Payment plan',
		type: 'string',
		property: 'paymentPlanId',
		options: paymentPlanOptions,
	},
	{
		placeholder: 'User type',
		type: 'string',
		property: 'role',
		options: [ ...retailerTypes ],
	},
	{
		placeholder: 'Approved',
		type: 'boolean',
		property: 'isApprovedByAdmin',
		options: [
			{ value: true, label: 'Yes' },
			{ value: false, label: 'Pending' },
		],
	},
]);
