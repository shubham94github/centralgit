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
} = Routes.AUTH.GETTING_STARTED;

export const menuItems = [
	{
		title: 'Account information',
		route: ACCOUNT_INFO,
		roles: [
			...allRetailers,
			startup,
		],
	},
	{
		title: 'Company details',
		route: COMPANY_INFO,
		roles: [
			...allRetailers,
			startup,
		],
	},
	{
		title: 'Gallery',
		route: GALLERY,
		roles: [startup],
	},
	{
		title: 'Billing details',
		route: BILLING_DETAILS,
		roles: allRetailers,
	},
	{
		title: 'Sectors of competence',
		route: SECTORS_COMPETENCE,
		roles: [startup],
	},
	{
		title: 'Areas of interest',
		route: AREAS_OF_INTEREST,
		roles: [startup],
	},
	{
		title: 'Associated tags',
		route: RELATED_TAGS,
		roles: [startup],
	},
];
