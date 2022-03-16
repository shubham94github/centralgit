import { Routes } from '@routes';
import enums from '@constants/enums';

const {
	userRoles: {
		startup,
		retailerBrand,
		retailerVentureCapital,
		retailerConsultant,
		retailerServiceProvider,
		retailerCompany,
		retailerEntrepreneur,
		retailerPrivatePerson,
		retailerInvestor,
		member,
	},
} = enums;

const allRetailers = [
	retailerBrand,
	retailerVentureCapital,
	retailerConsultant,
	retailerServiceProvider,
	retailerCompany,
	retailerEntrepreneur,
	retailerPrivatePerson,
	retailerInvestor,
];

const {
	AREAS_OF_INTEREST,
	COMPANY_INFO,
	ACCOUNT_INFO,
	SECTORS_COMPETENCE,
	BILLING_DETAILS,
	RELATED_TAGS,
	GALLERY,
	COMPANY_MEMBERS,
} = Routes.SETTINGS;

export const menuItems = [
	{
		title: 'Account Settings',
		roles: [
			...allRetailers,
			startup,
		],
		items: [
			{
				title: 'Account information',
				route: ACCOUNT_INFO,
			},
		],
	},
	{
		title: 'Company Information',
		roles: [ ...allRetailers ],
		items: [
			{
				title: 'Company details',
				route: COMPANY_INFO,
			},
			{
				title: 'Billing details',
				route: BILLING_DETAILS,
			},
			{
				title: 'Company members',
				route: COMPANY_MEMBERS,
			},
		],
	},
	{
		title: 'Startup Company Information',
		roles: [startup],
		items: [
			{
				title: 'Company details',
				route: COMPANY_INFO,
			},
			{
				title: 'Gallery',
				route: GALLERY,
			},
			{
				title: 'Associated tags',
				route: RELATED_TAGS,
			},
		],
	},
	{
		title: 'Categories',
		roles: [startup],
		items: [
			{
				title: 'Sectors of competence',
				route: SECTORS_COMPETENCE,
			},
			{
				title: 'Areas of interest',
				route: AREAS_OF_INTEREST,
			},
		],
	},
	{
		title: 'Account Settings',
		roles: [member],
		items: [
			{
				title: 'Member Account information',
				route: ACCOUNT_INFO,
			},
		],
	},
];
