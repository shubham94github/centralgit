import enums from '@constants/enums';

const { userRoles: {
	retailerCompany,
	retailerBrand,
	retailerConsultant,
	retailerServiceProvider,
	retailerVentureCapital,
	retailerEntrepreneur,
	retailerInvestor,
	retailerPrivatePerson,
} } = enums;

const retailerCompanies = [
	{
		label: 'Retailer',
		value: retailerCompany,
	},
	{
		label: 'Brand',
		value: retailerBrand,
	},
	{
		label: 'Consultant',
		value: retailerConsultant,
	},
	{
		label: 'Service Provider',
		value: retailerServiceProvider,
	},
	{
		label: 'Venture Capital',
		value: retailerVentureCapital,
	},
];
const retailerIndividuals = [
	{
		label: 'Entrepreneur',
		value: retailerEntrepreneur,
	},
	{
		label: 'Investor',
		value: retailerInvestor,
	},
	{
		label: 'Private Person',
		value: retailerPrivatePerson,
	},
];

export const userRoleAllOptions = [...retailerCompanies, ...retailerIndividuals];

export const intervalOptions = [
	{
		label: 'Day',
		value: 'DAY',
	},
	{
		label: 'Week',
		value: 'WEEK',
	},
	{
		label: 'Month',
		value: 'MONTH',
	},
	{
		label: 'Year',
		value: 'YEAR',
	},
];
