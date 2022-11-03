import enums from '@constants/enums'
import { Icons } from '@icons'
import { colors } from '@colors'

export const infoIcon = Icons.infoIcon(colors.darkblue70)

const {
  startup,
  retailerCompany,
  retailerBrand,
  retailerConsultant,
  retailerServiceProvider,
  retailerVentureCapital,
  retailerEntrepreneur,
  retailerInvestor,
  retailerPrivatePerson
} = enums.userRoles

const retailerCompanies = [
  retailerCompany,
  retailerBrand,
  retailerConsultant,
  retailerServiceProvider,
  retailerVentureCapital
]
const retailerIndividuals = [retailerEntrepreneur, retailerInvestor, retailerPrivatePerson]

const allRoles = [...retailerCompanies, ...retailerIndividuals, startup]

export const retailerGridArea = `
	"countryId city"
	"companyLegalName companyLegalName"
	"companyShortName companyShortName"
	"linkedInCompanyPage linkedInCompanyPage"
	"phoneNumber urlOfCompanyWebsite"
`

export const startupGridArea = `
	"countryId city"
	"companyLegalName companyLegalName"
	"companyShortName companyShortName"
	"owner linkedInCompanyPage"
	"phoneNumber urlOfCompanyWebsite"
	"founded totalFundingAmount"
`

export const textFields = [
  {
    id: 'countryId',
    span: '6',
    name: 'countryId',
    role: allRoles
  },
  {
    id: 'city',
    span: '6',
    placeholder: 'City',
    name: 'city',
    role: allRoles
  },
  {
    id: 'companyLegalName',
    span: '12',
    placeholder: 'Legal name',
    name: 'companyLegalName',
    role: allRoles
  },
  {
    id: 'companyShortName',
    span: '12',
    placeholder: 'Brand name',
    name: 'companyShortName',
    role: allRoles
  },
  {
    id: 'owner',
    span: '6',
    placeholder: 'Founder',
    name: 'owner',
    role: [startup]
  },
  {
    id: 'linkedInCompanyPage',
    span: '6',
    placeholder: 'LinkedIn company page',
    name: 'linkedInCompanyPage',
    role: allRoles
  },
  {
    id: 'phoneNumber',
    span: '6',
    placeholder: 'Phone',
    name: 'phoneNumber',
    mask: '+99 9999 999999',
    type: 'tel',
    role: allRoles
  },
  {
    id: 'urlOfCompanyWebsite',
    span: '6',
    placeholder: 'URL of company website',
    name: 'urlOfCompanyWebsite',
    role: allRoles
  },
  {
    id: 'founded',
    span: '6',
    placeholder: 'Founded',
    name: 'foundedAt',
    role: [startup]
  },
  {
    id: 'totalFundingAmount',
    span: '6',
    placeholder: 'Total Funding Amount',
    name: 'totalFundingAmount',
    role: [startup]
  }
]

export const companyTypes = [
  {
    id: 'singleEntrepreneur',
    value: 'Single Entrepreneur',
    label: 'Single Entrepreneur'
  },
  {
    id: 'limitedLiabilityCompany',
    value: 'Limited Liability Company',
    label: 'Limited Liability Company'
  },
  {
    id: 'limitedLiabilityPartnership',
    value: 'Limited Liability Partnership',
    label: 'Limited Liability Partnership'
  },
  {
    id: 'publiclyListedCompany',
    value: 'Publicly Listed Company',
    label: 'Publicly Listed Company'
  },
  {
    id: 'governmentEnterprise',
    value: 'Government Enterprise',
    label: 'Government Enterprise'
  },
  {
    id: 'charity',
    value: 'Charity',
    label: 'Charity'
  }
]

export const radioFields = {
  businessModel: {
    name: 'businessModel',
    title: 'Business model',
    values: [
      {
        id: 'productAndServiceSales',
        value: 'Product and service sales',
        label: 'Product and service sales'
      },
      {
        id: 'subscription',
        value: 'Subscription',
        label: 'Subscription'
      },
      {
        id: 'licensing',
        value: 'Licensing',
        label: 'Licensing'
      },
      {
        id: 'freemium',
        value: 'Freemium',
        label: 'Freemium'
      },
      {
        id: 'support',
        value: 'Support',
        label: 'Support'
      }
    ]
  },
  companyStatus: {
    name: 'companyStatus',
    title: 'Company status',
    values: [
      {
        id: 'startUp',
        value: 'Startup',
        label: 'Startup'
      },
      {
        id: 'growth',
        value: 'Growth',
        label: 'Growth'
      },
      {
        id: 'scaleUp',
        value: 'Scaleup',
        label: 'Scaleup'
      },
      {
        id: 'Unicorn',
        value: 'Unicorn',
        label: 'Unicorn'
      }
    ]
  }
}

export const targetRegions = [
  {
    id: 'europe',
    value: 'europe',
    label: 'Europe',
    name: 'europe',
    isChecked: true
  },
  {
    id: 'northAmerica',
    value: 'northAmerica',
    label: 'North America',
    name: 'northAmerica',
    isChecked: true
  },
  {
    id: 'middleEast',
    value: 'middleEast',
    label: 'Middle East',
    name: 'middleEast',
    isChecked: true
  },
  {
    id: 'southAmerica',
    value: 'southAmerica',
    label: 'South America',
    name: 'southAmerica',
    isChecked: true
  },
  {
    id: 'asia',
    value: 'asia',
    label: 'Asia',
    name: 'asia',
    isChecked: true
  },
  {
    id: 'africa',
    value: 'africa',
    label: 'Africa',
    name: 'africa',
    isChecked: true
  },
  {
    id: 'oceania',
    value: 'oceania',
    label: 'Oceania',
    name: 'oceania',
    isChecked: true
  }
]

export const accountType = {
  accountType: {
    name: 'accountTypes',
    title: 'Account type',
    values: [
      {
        id: 'demo',
        value: 'Demo',
        label: 'Demo'
      },
      {
        id: 'standard',
        value: 'Standard',
        label: 'Standard'
      },
      {
        id: 'incomplete',
        value: 'Incomplete',
        label: 'Incomplete'
      },
      {
        id: 'imported',
        value: 'Imported',
        label: 'Imported'
      }
    ]
  }
}

export const retailerRoles = {
  companyRoles: {
    name: 'role',
    title: 'Companies',
    values: [
      {
        id: 'retailer',
        value: 'Retailer',
        label: 'Retailer'
      },
      {
        id: 'brand',
        value: 'Brand',
        label: 'Brand'
      },
      {
        id: 'consultant',
        value: 'Consultant',
        label: 'Consultant'
      },
      {
        id: 'serviceProvider',
        value: 'Service provider',
        label: 'Service Provider'
      },
      {
        id: 'ventureCapital',
        value: 'Venture capital',
        label: 'Venture Capital'
      }
    ]
  },
  individualRoles: {
    name: 'role',
    title: 'Individuals',
    values: [
      {
        id: 'entrepreneur',
        value: 'Retailer Entrepreneur',
        label: 'Entrepreneur'
      },
      {
        id: 'investor',
        value: 'Investor',
        label: 'Investor'
      },
      {
        id: 'privatePerson ',
        value: 'Private person',
        label: 'Private Person'
      }
    ]
  }
}
