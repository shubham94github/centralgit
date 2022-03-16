import React from 'react';
import CustomDropdown from '@components/_shared/CustomDropdown';
import { colors } from '@constants/colors';
import { Icons } from '@icons';
import MenuList from './MenuList';

const menuIcon = Icons.threeDotsMenuIcon(colors.black);

/* eslint-disable */

export const getColumns = ({
	setSelectedMemberGroup,
	openMemberGroups,
	setSelectedMemberGroupId,
	openConfirm,
}) => [
	{
		name: 'Actions',
		width: '100px',
		property: 'actions',
		selector: 'actions',
		sortable: false,
		cell: row => {
			const { usingCount } = row;

			const handleEdit = () => {
				setSelectedMemberGroup(row);

				openMemberGroups();
			};

			const handleDelete = () => {
				setSelectedMemberGroupId(row.id);

				openConfirm();
			};

			const menuProps = {
				handleEdit,
				handleDelete,
				usingCount,
			};

			return (
				<div className='center'>
					<CustomDropdown
						className='dropdown-menu-table'
						button={menuIcon}
						outerProps={menuProps}
						component={MenuList}
					/>
				</div>
			);
		},
		disableOmit: true,
	},
	{
		name: 'Group Name',
		grow: 2,
		property: 'name',
		selector: 'name',
		sortable: false,
		width: '160px',
		omit: false,
		disableOmit: true,
	},
	{
		name: 'Number of Members',
		grow: 2,
		property: 'maxMembers',
		selector: 'maxMembers',
		sortable: false,
		width: '200px',
		omit: false,
		disableOmit: false,
	},
	{
		name: 'Assigned to Plans',
		grow: 2,
		property: 'usingCount',
		selector: 'usingCount',
		sortable: false,
		width: '180px',
		omit: false,
		disableOmit: false,
	},
];
