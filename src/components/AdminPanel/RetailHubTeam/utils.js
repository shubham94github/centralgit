import React from 'react';
import { getUserIcon } from '@utils/getUserIcon';
import { toColor } from '@utils';
import CustomDropdown from '@components/_shared/CustomDropdown';
import MenuList from '@components/AdminPanel/helpers/MenuList';
import { Icons } from '@icons';
import { colors } from '@colors';
import { dateFormattingWithTime, fullDateFormatting } from '@utils/date';
import Tooltip from '@components/_shared/Tooltip';

const menuIcon = Icons.threeDotsMenuIcon(colors.black);

const maxStringLengthEmail = 25;

export const getColumns = ({ activateUser, blockUser, handleEditUser }) => ([
	{
		name: 'Actions',
		width: '100px',
		grow: 1,
		sortable: false,
		// eslint-disable-next-line react/prop-types
		cell: user => {
			const { isBlocked, isApprovedByAdmin, id, status } = user;
			const handleActivation = () => isBlocked ? activateUser([id]) : blockUser([id]);
			const handleEdit = () => handleEditUser(user);

			const outerProps = {
				id,
				isApprovedByAdmin,
				isBlocked,
				handleActivation,
				typeOfRole: 'admin',
				status,
				handleEdit,
			};

			return (
				<div className='center'>
					<CustomDropdown
						className='dropdown-menu-table'
						button={menuIcon}
						outerProps={outerProps}
						component={MenuList}
					/>
				</div>
			);
		},
	},
	{
		name: 'Logo',
		sortable: false,
		// eslint-disable-next-line react/prop-types
		cell: ({ id, avatar, firstName, lastName }) =>
			<span>{getUserIcon(avatar, toColor(`${id}`), firstName, lastName)}</span>,
	},
	{
		name: 'Account E-mail',
		property: 'email',
		selector: 'email',
		sortable: true,
		grow: 3,
		minWidth: '250px',
		cell: user => {
			const isNeedToolTip = user.email.length > maxStringLengthEmail;
			const userEmail = isNeedToolTip ? `${user.email.substring(0, maxStringLengthEmail)}...` : user.email;

			return (
				<Tooltip
					isVisibleTooltip={isNeedToolTip}
					placement='bottom'
					message={user.email}
				>
					<div style={{ cursor: 'pointer' }}>
						{userEmail}
					</div>
				</Tooltip>
			);
		},
	},
	{
		name: 'First Name',
		property: 'firstName',
		selector: 'firstName',
		sortable: false,
		grow: 10,
		maxWidth: '380px',
	},
	{
		name: 'Last Name',
		property: 'lastName',
		selector: 'lastName',
		sortable: false,
		grow: 10,
		maxWidth: '380px',
	},
	{
		name: 'Role',
		property: 'authority',
		selector: 'authority.name',
		sortable: true,
		grow: 7,
	},
	{
		name: 'Status',
		property: 'isBlocked',
		sortable: true,
		grow: 3,
		cell: user => <span>{user.isBlocked ? 'Blocked': 'Active'}</span>,
	},
	{
		name: 'Country',
		property: 'country',
		sortable: false,
		grow: 10,
		cell: user => <Tooltip
			message={<span>{user.country?.name}</span>}
			placement='top'
		>
			<span className='truncate-country'>{user.country?.name}</span>
		</Tooltip>,
	},
	{
		name: 'City',
		property: 'city',
		selector: 'city',
		sortable: false,
		grow: 10,
	},
	{
		name: 'Last Seen',
		property: 'visitedAt',
		sortable: true,
		minWidth: '170px',
		cell: user => <span>{dateFormattingWithTime(user.visitedAt)}</span>,
	},
	{
		name: 'Registered at RTHb',
		property: 'createdAt',
		sortable: true,
		minWidth: '200px',
		cell: user => <span>{fullDateFormatting(user.createdAt)}</span>,
	},
]);

export const generateOptions = (arr, selectedRowsLength) => arr.map(item => ({
	label: selectedRowsLength === 0 ? `${item.label}` : `${item.label} (${selectedRowsLength})`,
	value: item.value,
}));
