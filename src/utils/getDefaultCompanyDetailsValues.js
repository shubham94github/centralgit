import { companyTypes, targetRegions } from '@components/_shared/CompanyDetailsForm/constants';
import { retailerSchema } from '@components/_shared/CompanyDetailsForm/schema';
import { optionsMapper, singleOptionsMapper } from '@utils/optionsMapper';

export const getDefaultValuesStartup = (profile, schema, countries, selectedAccountType) => ({
	countryId: profile.country
		&& countries.find(country => profile.country.id === country.id),
	owner: profile?.owner || schema.default().owner,
	totalFundingAmount: profile?.totalFundingAmount?.toString() || schema.default().totalFundingAmount,
	numberOfClients: profile?.numberOfClients?.toString() || schema.default().numberOfClients,
	companyType: profile.companyType
		&& companyTypes.find(type => profile.companyType === type.value),
	targetMarket: profile.targetMarket.length
		? targetRegions.filter(country => profile.targetMarket.map(x => x).includes(country.label))
		: schema.default().targetMarket,
	presenceInCountriesIds: profile.presenceInCountries.length
		? optionsMapper(profile.presenceInCountries)
		: schema.default().presenceInCountriesIds,
	solutionProductsServices: profile?.solutionProductsServices
		? profile?.solutionProductsServices
		: schema.default().solutionProductsServices,
	platformPartners: profile.platformPartners.length
		? singleOptionsMapper(profile.platformPartners)
		: schema.default().platformPartners,
	clientsList: profile.clientsList.length
		? singleOptionsMapper(profile.clientsList)
		: schema.default().clientsList,
	accountType: selectedAccountType,
	businessModel: profile?.businessModel,
	integrationTiming: profile?.integrationTiming || schema.default().integrationTiming,
	companyStatus: profile?.companyStatus,
	foundedAt: profile.foundedAt && new Date(profile.foundedAt),
});

export const getDefaultValuesRetailer = (profile, countries, userType) => ({
	countryId: profile.country
		&& countries.find(country => profile.country.id === country.id),
	role: userType || retailerSchema.default().countryId,
	categoryIds: profile.companySectors.length
		? optionsMapper(profile.companySectors)
		: retailerSchema.default().categoryIds,
	tags: profile.tags.length
		? profile.tags.map(tag => {
			return { label: tag, value: tag };
		})
		: retailerSchema.default().tags,
});
