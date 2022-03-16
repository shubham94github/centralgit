import { radioFields } from '@components/_shared/CompanyInfo/fields';
import { isEmpty } from '@utils/js-helpers';
import { colors } from '@colors';
import { getItemFromSessionStorage } from '@utils/sessionStorage';

export const valuesMapper = ({ companyInfo, currentFormValues, isStartup, user, isIncompleteAccount }) => {
	const baseData = {
		country: currentFormValues.country ? currentFormValues.country : companyInfo.country,
		companyLegalName: currentFormValues.companyLegalName
			? currentFormValues.companyLegalName
			: companyInfo.companyLegalName,
		companyShortName: currentFormValues.companyShortName
			? currentFormValues.companyShortName
			: companyInfo.companyShortName,
		city: currentFormValues.city
			? currentFormValues.city
			: companyInfo.city,
	};

	const userData = getItemFromSessionStorage('user') || user;

	return isStartup
		? {
			...baseData,
			founded: currentFormValues.founded
				? new Date(currentFormValues.founded)
				: companyInfo.foundedAt
					? new Date(companyInfo.foundedAt)
					: null,
			owner: isIncompleteAccount
				? ''
				: userData?.startup?.owner || `${userData.firstName || ''} ${userData.lastName || ''}`,
			linkedInCompanyPage: currentFormValues.linkedInCompanyPage
				? currentFormValues.linkedInCompanyPage
				: companyInfo.linkedInCompanyPage,
			urlOfCompanyWebsite: currentFormValues.urlOfCompanyWebsite
				? currentFormValues.urlOfCompanyWebsite
				: companyInfo.urlOfCompanyWebsite,
			phoneNumber: currentFormValues.phoneNumber
				? currentFormValues.phoneNumber
				: companyInfo.phoneNumber,
			totalFundingAmount: currentFormValues.totalFundingAmount
				? currentFormValues.totalFundingAmount
				: companyInfo.totalFundingAmount,
			companyType: currentFormValues.companyType
				? currentFormValues.companyType
				: companyInfo.companyType,
			businessModel: currentFormValues.businessModel
				? currentFormValues.businessModel
				: companyInfo.businessModel && companyInfo.businessModel !== radioFields.businessModel.values[0].value
					? companyInfo.businessModel
					: radioFields.businessModel.values[0].value,
			companyStatus: currentFormValues.companyStatus
				? currentFormValues.companyStatus
				: companyInfo.companyStatus && companyInfo.companyStatus !== radioFields.companyStatus.values[0].value
					? companyInfo.companyStatus
					: radioFields.companyStatus.values[0].value,
			targetMarket: currentFormValues.targetMarket
				? currentFormValues.targetMarket
				: companyInfo.targetMarket,
			companyDescription: currentFormValues.companyDescription
				? currentFormValues.companyDescription
				: companyInfo.companyDescription,
			solutionProductsServices: currentFormValues.solutionProductsServices
				? currentFormValues.solutionProductsServices
				: companyInfo.solutionProductsServices,
			platformPartners: currentFormValues.platformPartners
				? currentFormValues.platformPartners
				: companyInfo.platformPartners,
			clientsList: currentFormValues.clientsList
				? currentFormValues.clientsList
				: companyInfo.clientsList,
			presenceInCountriesIds: currentFormValues.presenceInCountriesIds
				? currentFormValues.presenceInCountriesIds
				: companyInfo.presenceInCountriesIds,
			numberOfClients: currentFormValues.numberOfClients
				? currentFormValues.numberOfClients
				: companyInfo.numberOfClients,
			integrationTiming: currentFormValues.integrationTiming
				? currentFormValues.integrationTiming
				: companyInfo.integrationTiming,
		}
		: {
			...baseData,
			emailDomain: currentFormValues.emailDomain
				? currentFormValues.emailDomain
				:  companyInfo.emailDomain,
			companyDescription: currentFormValues.companyDescription
				? currentFormValues.companyDescription
				: companyInfo.companyDescription,
			categoryIds: !isEmpty(currentFormValues.categoryIds)
				? currentFormValues.categoryIds
				:  companyInfo.categoryIds,
			tags: !isEmpty(currentFormValues.tags)
				? currentFormValues?.tags
				: companyInfo?.tags,
			phoneNumber: currentFormValues.phoneNumber
				? currentFormValues.phoneNumber
				: companyInfo.phoneNumber,
			linkedInCompanyPage: currentFormValues.linkedInCompanyPage
				? currentFormValues.linkedInCompanyPage
				: companyInfo.linkedInCompanyPage,
			urlOfCompanyWebsite: currentFormValues.urlOfCompanyWebsite
				? currentFormValues.urlOfCompanyWebsite
				: companyInfo.urlOfCompanyWebsite,
		};
};

export const prepareSelectStyles = () => (
	{
		option: (base, state) => {
			const backgroundColor = state.isSelected ? colors.grass20 : colors.white;

			return {
				...base,
				backgroundColor,
				padding: '6px',
				color: colors.darkblue70,
				overflow: 'hidden',
				textOverflow: 'ellipsis',
				whiteSpace: 'nowrap',

				'&:hover': {
					background: colors.grass10,
				},
			};
		},
	}
);
