export const checkboxFields = {
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
      //   {
      //     id: 'stealth',
      //     value: 'Stealth',
      //     label: 'Stealth'
      //   },
      {
        id: 'startUp',
        value: 'Start-up',
        label: 'Startup'
      },
      {
        id: 'growth',
        value: 'Growth',
        label: 'Growth'
      },
      {
        id: 'scaleUp',
        value: 'Scale-up',
        label: 'Scaleup'
      },
      {
        id: 'unicorn',
        value: 'UNICORN',
        label: 'Unicorn'
      }
    ]
  },
  targetMarket: {
    name: 'targetMarket',
    title: 'What’s your target market?',
    values: [
      {
        id: 'asia',
        value: 'Asia',
        label: 'Asia'
      },
      {
        id: 'africa',
        value: 'Africa',
        label: 'Africa'
      },
      {
        id: 'europe',
        value: 'Europe',
        label: 'Europe'
      },
      {
        id: 'middleEast',
        value: 'Middle East',
        label: 'Middle East'
      },
      {
        id: 'northAmerica',
        value: 'North America',
        label: 'North America'
      },
      {
        id: 'oceania',
        value: 'Oceania',
        label: 'Oceania'
      },
      {
        id: 'southAmerica',
        value: 'South America',
        label: 'South America'
      }
    ]
  }
}

export const rangeFields = [
  {
    id: 'numberOfClients',
    name: 'numberOfClients',
    title: 'Number of Clients'
  },
  {
    id: 'totalFundingAmount',
    name: 'totalFundingAmount',
    title: 'Total Funding Amount'
  }
]

export const narrowCategories = {
  name: 'narrowCategories',
  title: 'Narrow Categories',
  values: [
    {
      id: 'allCategories',
      value: 'All Categories',
      label: 'All categories'
    },
    {
      id: 'areasOfInterest',
      value: 'Areas of Interest',
      label: 'Areas of interest'
    },
    {
      id: 'sectorOfCompetence',
      value: 'Sector of competence',
      label: 'Sector of competence'
    }
  ]
}

export const companyTypeOptions = [
  {
    id: 1,
    value: 'Single Entrepreneur',
    label: 'Single Entrepreneur'
  },
  {
    id: 2,
    value: 'Limited Liability Company',
    label: 'Limited Liability Company'
  },
  {
    id: 3,
    value: 'Limited Liability Partnership',
    label: 'Limited Liability Partnership'
  },
  {
    id: 4,
    value: 'Publicly Listed Company',
    label: 'Publicly Listed Company'
  },
  {
    id: 5,
    value: 'Government Enterprise',
    label: 'Government Enterprise'
  },
  {
    id: 6,
    value: 'Charity',
    label: 'Charity'
  }
]
