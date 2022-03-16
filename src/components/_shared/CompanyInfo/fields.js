import enums from '@constants/enums';

export const tractionGridArea = `
	"platformPartners platformPartners"
	"clientsList clientsList"
	"numberOfClients integrationTiming"
	"presenceInCountriesIds presenceInCountriesIds"
	`;

const {
	startup,
	retailerCompany,
	retailerBrand,
	retailerConsultant,
	retailerServiceProvider,
	retailerVentureCapital,
	retailerEntrepreneur,
	retailerInvestor,
	retailerPrivatePerson,
} = enums.userRoles;

const retailerCompanies = [
	retailerCompany,
	retailerBrand,
	retailerConsultant,
	retailerServiceProvider,
	retailerVentureCapital,
];
const retailerIndividuals = [retailerEntrepreneur, retailerInvestor, retailerPrivatePerson];

const allRoles = [...retailerCompanies, ...retailerIndividuals, startup];

export const radioFields = {
	businessModel: {
		name: 'businessModel',
		title: 'Business model',
		values: [
			{
				id: 'productAndServiceSales',
				value: 'Product and service sales',
				label: 'Product and service sales',
			},
			{
				id: 'subscription',
				value: 'Subscription',
				label: 'Subscription',
			},
			{
				id: 'licensing',
				value: 'Licensing',
				label: 'Licensing',
			},
			{
				id: 'freemium',
				value: 'Freemium',
				label: 'Freemium',
			},
			{
				id: 'support',
				value: 'Support',
				label: 'Support',
			},
		],
	},
	companyStatus: {
		name: 'companyStatus',
		title: 'Company status',
		values: [
			{
				id: 'stealth',
				value: 'Stealth',
				label: 'Stealth',
			},
			{
				id: 'startUp',
				value: 'Start-up',
				label: 'Start-up',
			},
			{
				id: 'scaleUp',
				value: 'Scale-up',
				label: 'Scale-up',
			},
			{
				id: 'growth',
				value: 'Growth',
				label: 'Growth',
			},
			{
				id: 'established',
				value: 'Established',
				label: 'Established',
			},
		],
	},
};

export const retailerGridArea = `
	"country city"
	"companyLegalName companyLegalName"
	"companyShortName companyShortName"
	"linkedInCompanyPage phoneNumber"
	"urlOfCompanyWebsite emailDomain"
`;

export const startupGridArea = `
	"country city"
	"companyLegalName companyLegalName"
	"companyShortName companyShortName"
	"owner linkedInCompanyPage"
	"phoneNumber urlOfCompanyWebsite"
	"founded totalFundingAmount"
`;

export const textFields = [
	{
		id: 'country',
		span: '6',
		name: 'country',
		role: allRoles,
	},
	{
		id: 'city',
		span: '6',
		placeholder: 'City',
		name: 'city',
		role: allRoles,
	},
	{
		id: 'companyLegalName',
		span: '12',
		placeholder: 'Legal name',
		name: 'companyLegalName',
		role: allRoles,
	},
	{
		id: 'companyShortName',
		span: '12',
		placeholder: 'Brand name',
		name: 'companyShortName',
		role: allRoles,
	},
	{
		id: 'owner',
		span: '6',
		placeholder: 'Founder',
		name: 'owner',
		role: [ startup ],
	},
	{
		id: 'linkedInCompanyPage',
		span: '6',
		placeholder: 'LinkedIn company page',
		name: 'linkedInCompanyPage',
		role: allRoles,
	},
	{
		id: 'phoneNumber',
		span: '6',
		placeholder: 'Phone',
		name: 'phoneNumber',
		mask: '+99 9999 999999',
		role: allRoles,
		type: 'tel',
	},
	{
		id: 'urlOfCompanyWebsite',
		span: '6',
		placeholder: 'URL of company website',
		name: 'urlOfCompanyWebsite',
		role: allRoles,
	},
	{
		id: 'emailDomain',
		span: '6',
		placeholder: 'Company E-mail domain',
		name: 'emailDomain',
		role: retailerCompanies,
		isReadOnly: retailerCompanies,
	},
	{
		id: 'founded',
		span: '6',
		placeholder: 'Founded',
		name: 'founded',
		role: [ startup ],
	},
	{
		id: 'totalFundingAmount',
		span: '6',
		placeholder: 'Total Funding Amount',
		name: 'totalFundingAmount',
		role: [ startup ],
		type: 'number',
	},
];

export const targetRegions = [
	{
		id: 'europe',
		value: 'Europe',
		label: 'Europe',
		name: 'europe',
		isChecked: true,
	},
	{
		id: 'northAmerica',
		value: 'North America',
		label: 'North America',
		name: 'northAmerica',
		isChecked: true,
	},
	{
		id: 'middleEast',
		value: 'Middle East',
		label: 'Middle East',
		name: 'middleEast',
		isChecked: true,
	},
	{
		id: 'southAmerica',
		value: 'South America',
		label: 'South America',
		name: 'southAmerica',
		isChecked: true,
	},
	{
		id: 'asia',
		value: 'Asia',
		label: 'Asia',
		name: 'asia',
		isChecked: true,
	},
	{
		id: 'africa',
		value: 'Africa',
		label: 'Africa',
		name: 'africa',
		isChecked: true,
	},
	{
		id: 'oceania',
		value: 'Oceania',
		label: 'Oceania',
		name: 'oceania',
		isChecked: true,
	},
];

export const companyTypes = [
	{
		id: 'singleEntrepreneur',
		value: 'Single Entrepreneur',
		label: 'Single Entrepreneur',
	},
	{
		id: 'limitedLiabilityCompany',
		value: 'Limited Liability Company',
		label: 'Limited Liability Company',
	},
	{
		id: 'limitedLiabilityPartnership',
		value: 'Limited Liability Partnership',
		label: 'Limited Liability Partnership',
	},
	{
		id: 'publiclyListedCompany',
		value: 'Publicly Listed Company',
		label: 'Publicly Listed Company',
	},
	{
		id: 'governmentEnterprise',
		value: 'Government Enterprise',
		label: 'Government Enterprise',
	},
	{
		id: 'charity',
		value: 'Charity',
		label: 'Charity',
	},
];
