import { validationErrMessages } from '@constants/common';
import { object, string } from 'yup';
import { getMaxLengthErrMsg } from '@constants/validationMessages';
import { MAX_INPUT_LENGTH } from '@constants/validationConstants';
import { validateAmount } from '@utils/validation';
import { replaceAllDotsExceptFirst } from '@utils/replaceAllDotsExceptFirst';

const maUnitAmountLength = 6;
const { priceNameRequired, priceIsCorrectAmount, priceAmountRequired } = validationErrMessages;

export const schema = object({
	name: string()
		.required(priceNameRequired)
		.default('')
		.max(MAX_INPUT_LENGTH, getMaxLengthErrMsg(MAX_INPUT_LENGTH))
		.trim(),
	unitAmount: string()
		.default('')
		.transform(v => !!v ? replaceAllDotsExceptFirst(v) : undefined)
		.max(maUnitAmountLength, getMaxLengthErrMsg(maUnitAmountLength))
		.test('priceIsCorrectAmount', priceIsCorrectAmount, validateAmount)
		.required(priceAmountRequired),
	comment: string()
		.max(500, getMaxLengthErrMsg(500))
		.default(''),
	currency: object()
		.default({
			label: 'USD',
			value: 'USD',
		})
		.nullable(),
});

