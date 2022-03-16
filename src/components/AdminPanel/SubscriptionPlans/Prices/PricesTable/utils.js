import React from 'react';
import { Icons } from '@icons';
import { colors } from '@colors';
import DropdownList from './DropdownList';
import CustomDropdown from '@components/_shared/CustomDropdown';
import Tooltip from '@components/_shared/Tooltip';
import { P12 } from '@components/_shared/text';

const menuIcon = Icons.threeDotsMenuIcon(colors.black);

export const generateColumns = ({
	handleEdit,
	handleDelete,
}) => ([
	{
		name: 'Actions',
		width: '100px',
		// eslint-disable-next-line react/prop-types
		cell: ({ id, usingCount }) => {
			const editPrice = () => handleEdit(id);
			const deletePrice = () => handleDelete(id);
			const outerProps = {
				id,
				editPrice,
				deletePrice,
				usingCount,
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
		name: 'Price Name',
		selector: 'name',
		width: '200px',
	},
	{
		name: 'Value',
		cell: row => +row.unitAmount / 100,
	},
	{
		name: 'Currency',
		cell: row => <span>{row.currency}</span>,
	},
	{
		name: 'Plans',
		selector: 'usingCount',
	},
	{
		name: 'Comments',
		width: '350px',
		cell: row => {
			return (
				<Tooltip
					isVisibleTooltip={row.comment?.length > 22}
					placement='bottom-start'
					message={<P12>{row.comment}</P12>}
				>
					<div className='comment'>{row.comment}</div>
				</Tooltip>
			);
		},
	},
]);
