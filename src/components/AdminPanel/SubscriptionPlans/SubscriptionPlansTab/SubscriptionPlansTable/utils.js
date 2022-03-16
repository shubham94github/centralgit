import React from 'react';
import { Icons } from '@icons';
import { colors } from '@colors';
import DropdownList from './DropdownList';
import CustomDropdown from '@components/_shared/CustomDropdown';
import { currencyFormatter } from '@utils/currencyFormatter';
import Tooltip from '@components/_shared/Tooltip';
import { capitalizeMultiWordString } from '@utils/capitalizeMultiWordString';
import { getRetailerRole } from '@components/AdminPanel/Retailers/utils/getRetailerRole';

const menuIcon = Icons.threeDotsMenuIcon(colors.black);
const notApplicable = 'N/A';

export const generateColumns = ({
	handleEdit,
	handleDelete,
	handleChangePaymentPlanStatus,
}) => ([
	{
		name: 'Actions',
		property: 'actions',
		selector: 'actions',
		width: '100px',
		// eslint-disable-next-line react/prop-types
		cell: ({ id, usingCount, isHidden }) => {
			const editPrice = () => handleEdit(id);
			const deletePrice = () => handleDelete(id);
			const changePaymentPlanStatus = () => handleChangePaymentPlanStatus(id, isHidden);
			const outerProps = {
				id,
				isAbleToDelete: !usingCount,
				editPrice,
				deletePrice,
				changePaymentPlanStatus,
				isHidden,
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
		name: 'Plan Name',
		grow: 2,
		cell: row => {
			return (
				<Tooltip
					message={row.uiName}
					placement='bottom-start'
					isVisibleTooltip={row.uiName?.length > 23}
				>
					<div className='name'>{row.uiName}</div>
				</Tooltip>
			);
		},
	},
	{
		name: 'Stripe Product name',
		selector: 'stripeName',
		sortable: true,
		grow: 3,
		cell: row => (
			<Tooltip
				isVisibleTooltip={row.stripeName.length > 32}
				message={row.stripeName}
				placement='bottom-start'
			>
				<div className='name'>{row.stripeName}</div>
			</Tooltip>
		),
	},
	{
		name: 'Plan Type',
		sortable: false,
		cell: row => <span>{capitalizeMultiWordString(row.planType)}</span>,
	},
	{
		name: 'User Role',
		width: '135px',
		cell: row => {
			if (!row.role) return;

			return <span>{getRetailerRole(row.role)}</span>;
		},
	},
	{
		name: 'Group Name',
		cell: row => (
			<div className='bands'>{row.memberGroup?.name || notApplicable}</div>
		),
	},
	{
		name: 'Price',
		sortable: false,
		grow: 1.5,
		cell: row => (
			<div className='price'>
				{`${row.price?.name || notApplicable} - ${currencyFormatter.format(row.price.unitAmount / 100)}`}
			</div>
		),
	},
	{
		name: 'Trial Period',
		cell: row => row.trial ? <div className='trial'>{`${row.trial} days`}</div> : notApplicable,
	},
	{
		name: 'Discounts',
		cell: ({ discountCount }) => !!discountCount && discountCount,
	},
	{
		name: 'Users',
		sortable: false,
		cell: ({ usingCount }) => !!usingCount && usingCount,
	},
	{
		name: 'Status',
		sortable: true,
		cell: ({ isHidden }) => isHidden ? 'Disabled' : 'Enabled',
	},
]);
