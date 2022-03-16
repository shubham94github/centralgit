import React from 'react';
import { Icons } from '@icons';
import { colors } from '@colors';
import DropdownList from './DropdownList';
import CustomDropdown from '@components/_shared/CustomDropdown';
import { currencyFormatter } from '@utils/currencyFormatter';
import Tooltip from '@components/_shared/Tooltip';
import { dateFormatCorrection } from '@utils';

const menuIcon = Icons.threeDotsMenuIcon(colors.black);

export const generateColumns = ({
	handleEdit,
}) => ([
	{
		name: 'Actions',
		width: '100px',
		// eslint-disable-next-line react/prop-types
		cell: row => {
			const { id, usingCount, isActivated } = row;

			const editEnterpriseCode = () => handleEdit(row);
			const outerProps = {
				id,
				isAbleToDelete: !!usingCount && usingCount > 0,
				editEnterpriseCode,
				isActivated,
			};

			return <div className='center'>
				{isActivated
					? <div>{menuIcon}</div>
					: <CustomDropdown
						className='dropdown-menu-table'
						button={menuIcon}
						outerProps={outerProps}
						component={DropdownList}
					/>
				}
			</div>;
		},
	},
	{
		name: 'Stripe Product name',
		minWidth: '200px',
		sortable: false,
		cell: row => row.paymentPlan?.stripeName && (
			<Tooltip
				isVisibleTooltip={row.paymentPlan?.stripeName?.length > 50}
				message={row?.paymentPlan?.stripeName}
				placement='bottom-start'
			>
				<div className='stripe-name'>{row?.paymentPlan?.stripeName}</div>
			</Tooltip>
		),
	},
	{
		name: 'Generated Code',
		minWidth: '170px',
		sortable: false,
		cell: row => (
			<Tooltip
				isVisibleTooltip={row.code.length > 50}
				message={row.code}
				placement='bottom-start'
			>
				<div className='name'>{row.code}</div>
			</Tooltip>
		),
	},
	{
		name: 'Date Code Apply',
		minWidth: '170px',
		sortable: false,
		cell: row => <span>{dateFormatCorrection(row.activatedAt, 'dd MMM yyyy')}</span>,
	},
	{
		name: 'Company Name',
		minWidth: '170px',
		cell: row => <span>{row.retailer?.companyShortName}</span>,
	},
	{
		name: 'Price',
		sortable: false,
		cell: row => {
			const priceName = `Price ${ row?.paymentPlan?.price?.id} - ${
				currencyFormatter.format(row?.paymentPlan?.price?.unitAmount / 100)}`;

			return row?.paymentPlan?.price ? <div className='price'>{priceName}</div> : 'N/A';
		},
	},
	{
		name: 'Group',
		sortable: false,
		cell: row => row.paymentPlan?.memberGroup ? row.paymentPlan?.memberGroup?.name : 'N/A',
	},
	{
		name: 'Plan Name',
		minWidth: '100px',
		cell: row => row.paymentPlan?.uiName,
	},
]);
