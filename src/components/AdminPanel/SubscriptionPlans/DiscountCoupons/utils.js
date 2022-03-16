import React from 'react';
import CustomDropdown from '@components/_shared/CustomDropdown';
import DropdownList from './DropdownList';
import { Icons } from '@icons';
import { colors } from '@colors';
import { fullDateFormatting } from '@utils/date';
import Tooltip from '@components/_shared/Tooltip';
import { Routes } from '@routes';

const menuIcon = Icons.threeDotsMenuIcon(colors.black);
const milliseconds = 1000;

const {
	RETAILERS,
} = Routes.ADMIN_PANEL;

const generateListOfStripeNames = paymentPlans => paymentPlans.map(plan => plan.stripeName);

export const generateListOfIdCodeCoupon = coupons => coupons.map(plan => plan.code);

/* eslint react/prop-types: 0 */
export const getColumns = ({
	editCouponHandler,
	openRemoveModal,
	openCancelModal,
	activationCouponHandler,
	setRetailersTableMeta,
	retailersTableMeta,
	history,
	handleRetailerFilters,
}) => ([
	{
		name: 'Actions',
		width: '100px',
		cell: coupon => {
			const isPossibilityRemove = !coupon.usingCount;

			const editCoupon = () => editCouponHandler(coupon);
			const removeCoupon = () => openRemoveModal(coupon);
			const cancelCoupon = () => openCancelModal(coupon);
			const toggleActivation = () => activationCouponHandler(coupon.id, coupon.isBlocked);

			const outerProps = {
				editCoupon,
				isPossibilityRemove,
				removeCoupon,
				cancelCoupon,
				toggleActivation,
				isBlocked: coupon.isBlocked,
				status: coupon.status,
			};

			return (
				<div className='center'>
					<CustomDropdown
						className='dropdown-menu-table'
						button={menuIcon}
						outerProps={outerProps}
						component={DropdownList}
					/>
				</div>
			);
		},
	},
	{
		name: 'Name',
		selector: 'name',
		minWidth: '200px',
	},
	{
		name: 'Id Code',
		selector: 'code',
		minWidth: '200px',
	},
	{
		name: 'Status',
		selector: 'status',
		minWidth: '200px',
	},
	{
		name: 'Currency',
		selector: 'currency',
		minWidth: '100px',
	},
	{
		name: 'Percent off',
		minWidth: '150px',
		cell: ({ percentOff }) => (
			<span>{percentOff ? `${percentOff}%`: 'N/A'}</span>
		),
	},
	{
		name: 'Amount off',
		minWidth: '150px',
		cell: ({ amountOff  }) => {
			const amountOffUsd = amountOff / 100;

			return (
				<span>{amountOffUsd ? `$${amountOffUsd}` : 'N/A'}</span>
			);
		},
	},
	{
		name: 'Duration',
		minWidth: '200px',
		cell: ({ duration }) => {
			const formattedDuration = duration[0].toUpperCase() + duration.slice(1).toLowerCase();

			return (
				<span>{formattedDuration}</span>
			);
		},
	},
	{
		name: 'Duration in Months',
		selector: 'durationInMonths',
		minWidth: '200px',
	},
	{
		name: 'Max Redemptions',
		minWidth: '200px',
		cell: ({ maxRedemptions }) => (
			<span>{maxRedemptions || 'N/A'}</span>
		),
	},
	{
		name: 'Applies to',
		minWidth: '150px',
		cell: ({ paymentPlans }) => {
			const listOfNames = generateListOfStripeNames(paymentPlans);
			const stringOfNames = listOfNames.join(', ');

			return (
				<Tooltip
					placement='bottom-start'
					message={
						<ul>
							{listOfNames.map(( name, index ) => (
								<li key={name+index}>{name}</li>
							))}
						</ul>
					}
				>
					<span className='truncate-name'>
						{stringOfNames}
					</span>
				</Tooltip>
			);
		},
	},
	{
		name: 'Users',
		minWidth: '50px',
		cell: ({ usingCount, id }) => {
			const onRedirectToRetailersHandler = () => {
				setRetailersTableMeta({
					...retailersTableMeta,
					page: 1,
					fields: [{ fieldName: 'discountCodeId', filterNumber: id }],
				});

				handleRetailerFilters({
					country: null,
					isBlocked: null,
					isVerified: null,
					paymentPlanName: null,
					status: null,
					filterCategories: [],
				});

				history.push(RETAILERS);
			};

			return (!!usingCount
				&& <div
					onClick={onRedirectToRetailersHandler}
					className='link'
				>
					{usingCount}
				</div>
			);
		},
	},
	{
		name: 'Redeem by',
		minWidth: '150px',
		cell: ({ redeemBy }) => (
			<span>
				{fullDateFormatting(new Date(redeemBy * milliseconds))}
			</span>
		),
	},
]);
