import React from 'react';
import { dateFormattingWithTime } from '@utils/date';
import Tooltip from '@components/_shared/Tooltip';
import { P12 } from '@components/_shared/text';

/* eslint-disable */

export const columns = [
	{
		name: 'Category Name',
		grow: 2,
		property: 'name',
		selector: 'category.name',
		sortable: true,
		omit: false,
		disableOmit: false,
		cell: ({ category: { name } }) => (
			<Tooltip
				message={
					<P12 className='parent-paths'>
						{name}
					</P12>
				}
			>
				<div className='category-name'>{name}</div>
			</Tooltip>
		),
	},
	{
		name: 'Category Route',
		grow: 2,
		property: 'category.parentNames',
		selector: 'parentNames',
		cell: ({ category: { parentNames, name } }) => {
			const routeText = [ ...parentNames, name  ].join(' > ');

			return (
				!!parentNames?.length
					&& <Tooltip
						message={
							<P12 className='parent-paths'>
								{routeText}
							</P12>
						}
					>
						<div  className='category-name'>{routeText}</div>
					</Tooltip>
			);
		},
		sortable: false,
		omit: false,
		disableOmit: false,
	},
	{
		name: 'Action',
		property: 'activity',
		selector: 'activity',
		maxWidth: '100px',
		sortable: false,
		omit: false,
		disableOmit: false,
	},
	{
		name: 'Admin Name',
		property: 'fullName',
		selector: 'admin.fullName',
		minWidth: '150px',
		maxWidth: '250px',
		sortable: false,
		omit: false,
		disableOmit: false,
	},
	{
		name: 'Admin Role',
		grow: 2,
		property: 'name',
		selector: 'admin.authority.name',
		maxWidth: '200px',
		sortable: true,
		omit: false,
		disableOmit: false,
	},
	{
		name: 'Action Date',
		grow: 2,
		property: 'createdAt',
		selector: 'createdAt',
		sortable: true,
		minWidth: '200px',
		cell: ({ createdAt }) => {
			const actionDate = dateFormattingWithTime(createdAt);

			return <div>{actionDate}</div>;
		},
		omit: false,
		disableOmit: false,
	},
];
