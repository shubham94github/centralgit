export const defaultFilterCategories = {
  categoryIds: [],
  narrowCategories: "All Categories",
  countryIds: [],
  founded: [],
  businessModel: [],
  companyStatus: [],
  targetMarket: [],
  numberOfClients: [],
  totalFundingAmount: [],
  tags: [],
  sort: "A-Z",
  sortDirection: "asc",
  page: 1,
  pageSize: 5,
  keyWord: null,
  companyType: [],
  presenceInCountriesIds: [],
  browseType: "All",
  isAvailableToChat: false,
  filterClientName: "",
};

export const trialPeriodSearchWarning = (count) =>
  `You have reached daily trial period limitations (${count} Searches)`;
export const minCharactersSearchWarning =
  "For the search minimum 3 letters are required";
