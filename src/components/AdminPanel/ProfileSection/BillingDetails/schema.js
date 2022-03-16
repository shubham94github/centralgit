import { object, string } from 'yup';
import { validationErrMessages } from '@constants/common';
import { invalidCompanyNameErrMsg } from '@components/Auth/constants';
import { validateCompanyName } from '@utils/validation';
import { ERROR_MESSAGE_LENGTH, ERROR_MESSAGE_LENGTH_SIGN_UP, getMaxLengthErrMsg } from '@constants/validationMessages';
import {
	MAX_CITY_LENGTH,
	MAX_INPUT_LENGTH,
	MAX_TAX_ID_LENGTH,
	MAX_ZIP_CODE_LENGTH,
} from '@constants/validationConstants';

export const schema = object({
	companyLegalName: string()
		.required(validationErrMessages.legalCompanyName)
		.test('', invalidCompanyNameErrMsg, validateCompanyName)
		.min(1, ERROR_MESSAGE_LENGTH)
		.max(255, ERROR_MESSAGE_LENGTH_SIGN_UP)
		.default('')
		.trim(),
	countryId: object()
		.default(null)
		.nullable()
		.required(validationErrMessages.country),
	address: string()
		.trim()
		.required(validationErrMessages.address)
		.max(MAX_INPUT_LENGTH, ERROR_MESSAGE_LENGTH_SIGN_UP)
		.default(''),
	city: string()
		.trim()
		.required(validationErrMessages.city)
		.max(MAX_CITY_LENGTH, getMaxLengthErrMsg(MAX_CITY_LENGTH))
		.default(''),
	postZipCode: string()
		.trim()
		.max(MAX_ZIP_CODE_LENGTH, `Post/Zip Code must be less than ${MAX_ZIP_CODE_LENGTH} characters`)
		.default(''),
	vatNumber: string()
		.trim()
		.max(MAX_TAX_ID_LENGTH, `VAT number must be less than ${MAX_TAX_ID_LENGTH} characters`)
		.default(''),
});
