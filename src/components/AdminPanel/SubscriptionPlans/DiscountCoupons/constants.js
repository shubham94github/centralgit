/* eslint-disable max-len */
import { Icons } from '@icons';
import { colors } from '@colors';

export const searchInputPlaceholder = 'Search by Coupon name or Id Code';
export const plusIcons = Icons.plus(colors.white);
export const guidelineIcon = Icons.infoIcon(colors.grass50);
export const addNewCouponBtnText = 'Add new Discount Coupon';
export const defaultTableMeta = {
	code: '',
};
export const textForGuideline ='Set the status of discount codes users use on the Registration screen.';
export const discountCouponAddTitle ='Add New Discount Coupon';
export const discountCouponEditTitle ='Edit Discount Coupon';
export const tableDiscountCouponTitle = 'Discount coupons';
export const errorMessageIdCodeCoupon = 'This Id code already exists';
export const errorMessagePercentOff = 'The percentage can’t be more than 100%';
export const errorMessageRedeemBy = 'Please enter the coupon expiration date';
export const confirmRemoveMessage = 'Are you sure you want to delete this Discount Coupon?';
export const confirmCancelMessage = 'Are you sure you want to cancel this Coupon?';
export const confirmCancelText = 'The coupon will be suspended for all users who have previously'
	+ ' applied the coupon. All Users will be notified.';
export const successRemoveText = 'This coupon has been deleted!';
export const successCancelText = 'This coupon has been canceled!';
export const successCreateText = 'A new coupon has been created!';
export const successEditText = 'This coupon has been changed!';
export const errorText = 'Failed. Try again';
export const invalidTokenErr = 'invalid_token';
export const saleValues = [
	{
		id: 'percentOff',
		value: 'Percent Off',
		label: 'Percent off',
	},
	{
		id: 'amountOff',
		value: 'Amount Off',
		label: 'Amount off (in cents)',
	},
];
export const durationValues = [
	{
		id: 'once',
		value: 'ONCE',
		label: 'Once',
	},
	{
		id: 'forever',
		value: 'FOREVER',
		label: 'Forever',
	},
	{
		id: 'repeating',
		value: 'REPEATING',
		label: 'Repeating',
	},
];

export const discountCouponsStatuses = {
	blocked: 'BLOCKED',
	active: 'ACTIVE',
	cancelled: 'CANCELLED',
};

export const discountStatusesDefinition = [
	{
		status: 'Active',
		definition: 'сan be used by any type of user as many times as they want.',
	},
	{
		status: 'Blocked',
		definition: 'upon changing the coupon\'s status to Blocked, new users will no longer be able to use the coupon. However, users who previously used the coupon can still enjoy the coupon\'s benefits until the coupon\'s status is changed to Canceled.',
	},
	{
		status: 'Canceled',
		definition: 'coupons will not work both for new and existing users.',
	},
];
