export const defaultFiltersForFeedbacks = {
	isAllStars: true,
	page: 0,
	pageSize: 5,
	rate: null,
};

export const defaultStartupFilters = {
	isVerified: null,
	accountType: null,
	rateStars: null,
	isBlocked: null,
	status: null,
	companyType: null,
	businessModel: null,
	companyStatus: null,
	country: null,
	filterCategories: [],
};

export const defaultRetailerFilters = {
	isVerified: null,
	isBlocked: null,
	status: null,
	country: null,
	paymentPlanName: null,
	filterCategories: [],
};

export const defaultFilterStartups = {
	page: 1,
	pageSize: 5,
	sort: {
		direction: 'DESC',
		fieldName: 'Added',
	},
};

export const defaultListOfStartups = {
	startups: [],
	countOfRecords: null,
};

export const emptyCategoryImportedErrorMessage = `Status for Startups with the "Imported" Category can't be changed.
Please choose at least one Category in Sectors of competence to remote the Imported Category.`;

export const emptyCategoryIncompleteErrorMessage = `Startup type can’t be changed.
Select at least one category in Sector of Competence to change Startup type.`;
