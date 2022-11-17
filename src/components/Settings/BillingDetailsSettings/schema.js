import { validationErrMessages } from '@constants/common'
import { getMaxLengthErrMsg, ERROR_MESSAGE_LENGTH, ERROR_MESSAGE_LENGTH_SIGN_UP } from '@constants/validationMessages'
import { validateCompanyName } from '@utils/validation'
import { invalidCompanyNameErrMsg } from '@components/Auth/constants'
import { object, string } from 'yup'
import {
  MAX_CITY_LENGTH,
  MAX_INPUT_LENGTH,
  MAX_TAX_ID_LENGTH,
  MAX_ZIP_CODE_LENGTH
} from '@constants/validationConstants'

const schema = object({
  companyLegalName: string()
    .required(validationErrMessages.legalCompanyName)
    .test('', invalidCompanyNameErrMsg, validateCompanyName)
    .min(1, ERROR_MESSAGE_LENGTH)
    .max(255, ERROR_MESSAGE_LENGTH_SIGN_UP)
    .default('')
    .trim(),
  countryId: object().default(null).nullable().required(validationErrMessages.country),
  address: string().trim().required(validationErrMessages.address).max(MAX_INPUT_LENGTH, ERROR_MESSAGE_LENGTH_SIGN_UP),
  city: string().trim().required(validationErrMessages.city).max(MAX_CITY_LENGTH, getMaxLengthErrMsg(MAX_CITY_LENGTH)),
  postZipCode: string()
    .trim()
    .max(MAX_ZIP_CODE_LENGTH, `Post/Zip Code must be less than ${MAX_ZIP_CODE_LENGTH} characters`),
  vatNumber: string().trim().max(MAX_TAX_ID_LENGTH, `VAT number must be less than ${MAX_TAX_ID_LENGTH} characters`),
  paymentMethod: string().trim().default('CREDIT')
})

export default schema
