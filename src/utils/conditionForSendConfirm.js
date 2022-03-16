import { markDownToText } from './index';
import {
	MIN_WARNING_COMPANY_DESCRIPTION,
	MIN_WARNING_SOLUTION_PRODUCTS_SERVICES,
} from '@constants/validationConstants';

export const conditionsForSendConfirm = (companyDescription, solutionProductsServices) => {
	const companyDescriptionLength = markDownToText(companyDescription).length;
	const solutionProductsServicesLength = markDownToText(solutionProductsServices).length;

	return {
		isWarningCompanyDescription: companyDescriptionLength < MIN_WARNING_COMPANY_DESCRIPTION,
		isWarningSolutionProductsServices: solutionProductsServicesLength < MIN_WARNING_SOLUTION_PRODUCTS_SERVICES,
	};
};
