import { array, date, object, string } from 'yup';
import {
	MAX_INPUT_DURATION_IN_MONTH,
	MAX_INPUT_LENGTH,
	MAX_INPUT_LENGTH_ID_CODE,
} from '@constants/validationConstants';
import { getMaxLengthErrMsg, MAX_INPUT_LENGTH_MESSAGE } from '@constants/validationMessages';
import { validationErrMessages } from '@constants/common';
import { validateMaxCountPercentOff } from '@utils/validation';
import { errorMessagePercentOff } from '@components/AdminPanel/SubscriptionPlans/DiscountCoupons/constants';

export const editSchema = object({
	name: string()
		.trim()
		.required(validationErrMessages.couponName)
		.max(MAX_INPUT_LENGTH, MAX_INPUT_LENGTH_MESSAGE)
		.default(''),
	idCodeCoupon: string()
		.trim()
		.max(MAX_INPUT_LENGTH_ID_CODE, getMaxLengthErrMsg(MAX_INPUT_LENGTH_ID_CODE))
		.default(''),
	duration: object()
		.default(null)
		.nullable(),
	durationInMonths: string()
		.trim()
		.max(MAX_INPUT_DURATION_IN_MONTH, getMaxLengthErrMsg(MAX_INPUT_DURATION_IN_MONTH))
		.default(''),
	maxRedemptions: string()
		.trim()
		.default(null)
		.nullable(),
	redeemBy: date()
		.default(null)
		.nullable(),
	planIds: array()
		.default(null)
		.nullable(),
	percentOff: string()
		.nullable()
		.test('validateMaxCountPercentOff', errorMessagePercentOff, validateMaxCountPercentOff)
		.default(''),
	amountOff: string()
		.nullable()
		.default(''),
});

const baseSchema = {
	name: string()
		.trim()
		.required(validationErrMessages.couponName)
		.max(MAX_INPUT_LENGTH, MAX_INPUT_LENGTH_MESSAGE)
		.default(''),
	idCodeCoupon: string()
		.trim()
		.required(validationErrMessages.couponIdCode)
		.max(MAX_INPUT_LENGTH_ID_CODE, getMaxLengthErrMsg(MAX_INPUT_LENGTH_ID_CODE))
		.default(''),
	duration: object()
		.required(validationErrMessages.duration)
		.default(null)
		.nullable(),
	durationInMonths: string()
		.trim()
		.max(MAX_INPUT_DURATION_IN_MONTH, getMaxLengthErrMsg(MAX_INPUT_DURATION_IN_MONTH))
		.default(''),
	maxRedemptions: string()
		.trim()
		.default(null)
		.nullable(),
	redeemBy: date()
		.required(validationErrMessages.redeemBy)
		.default(null)
		.nullable(),
	planIds: array()
		.default(null)
		.nullable()
		.required(validationErrMessages.planIds),
};

export const percentOffSchema = object({
	...baseSchema,
	percentOff: string()
		.nullable()
		.required(validationErrMessages.percentOff)
		.test('validateMaxCountPercentOff', errorMessagePercentOff, validateMaxCountPercentOff)
		.default(''),
});

export const amountOffSchema = object({
	...baseSchema,
	amountOff: string()
		.nullable()
		.required(validationErrMessages.amountOff)
		.default(''),
});
