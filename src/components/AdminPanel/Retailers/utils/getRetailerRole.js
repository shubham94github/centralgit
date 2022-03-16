const retailerRoles = [
	{ value: 'RETAILER', label: 'Retailer' },
	{ value: 'RETAILER_BRAND', label: 'Brand' },
	{ value: 'RETAILER_CONSULTANT', label: 'Consultant' },
	{ value: 'RETAILER_SERVICE_PROVIDER', label: 'Service Provider' },
	{ value: 'RETAILER_VENTURE_CAPITAL', label: 'Venture Capital' },
	{ value: 'RETAILER_ENTREPRENEUR', label: 'Entrepreneur' },
	{ value: 'RETAILER_INVESTOR', label: 'Investor' },
	{ value: 'RETAILER_PRIVATE_PERSON', label: 'Private Person' },
];

export const getRetailerRole = role => {
	if (!role) return;

	return retailerRoles.find(retailerRole => retailerRole.value === role)?.label;
};
