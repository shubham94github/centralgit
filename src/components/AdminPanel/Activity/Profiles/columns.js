import React from 'react';
import { dateFormattingWithTime } from '@utils/date';
import enums from '@constants/enums';
import { getCompanyIcon } from '@utils/getCompanyIcon';
import Tooltip from '@components/_shared/Tooltip';
import { P12 } from '@components/_shared/text';
import { retailerTypes } from '@constants/common';

/* eslint react/prop-types: 0 */

export const getColumns = history => ([
	{
		name: 'Logo',
		grow: 1,
		property: 'logo30',
		selector: 'retailer.logo30',
		sortable: false,
		cell: ({ user }) => {
			const isStartup = user.role === enums.userRoles.startup;
			const profile = isStartup ? user.startup : user?.retailer;
			const handleOpenProfile = () => history.push(`/admin-panel/profile/${isStartup ? 'startup' : 'user'}/${user.id}`);

			return (
				<div
					onClick={handleOpenProfile}
					style={{ cursor: 'pointer' }}
				>
					{getCompanyIcon(profile.logo30, profile.logo30.name, profile.logo30.color, true)}
				</div>
			);
		},
		omit: false,
		disableOmit: true,
	},
	{
		name: 'Brand Name',
		grow: 2,
		property: 'companyShortName',
		selector: 'companyShortName',
		cell: ({ user }) => {
			const isStartup = user.role === enums.userRoles.startup;
			const profile = isStartup ? user.startup : user?.retailer;
			const handleOpenProfile = () => history.push(`/admin-panel/profile/${isStartup ? 'startup' : 'user'}/${user.id}`);

			return <div
				className='truncate-brand-name'
				onClick={handleOpenProfile}
				style={{ cursor: 'pointer' }}
			>
				{profile.companyShortName}
			</div>;
		},
		sortable: true,
		omit: false,
		disableOmit: false,
	},
	{
		name: 'User Type',
		grow: 2,
		property: 'userType',
		selector: 'user.userType',
		sortable: false,
		omit: false,
		disableOmit: false,
		cell: ({ user }) => {
			const isStartup = user.role === enums.userRoles.startup;

			const profileType = isStartup
				? user.userType
				: retailerTypes.find(item => item.value === user.role).label;

			return <div>{profileType}</div>;
		},
	},
	{
		name: 'Action',
		grow: 2,
		property: 'activity',
		selector: 'activity',
		sortable: false,
		omit: false,
		disableOmit: false,
		cell: ({ activity }) => {
			const replacedActivity = activity.replaceAll('User: ', '').replaceAll('Startup: ', '');

			return (
				<Tooltip
					message={
						<P12>
							{replacedActivity}
						</P12>
					}
				>
					<div className='truncate-brand'>{replacedActivity}</div>
				</Tooltip>
			);
		},
	},
	{
		name: 'Admin Name',
		grow: 1,
		property: 'fullName',
		selector: 'admin.fullName',
		sortable: false,
		omit: false,
		disableOmit: false,
		width: '200px',
	},
	{
		name: 'Admin Role',
		grow: 2,
		property: 'name',
		selector: 'admin.authority.name',
		sortable: false,
		omit: false,
		disableOmit: false,
	},
	{
		name: 'Action Date',
		grow: 2,
		property: 'createdAt',
		selector: 'createdAt',
		sortable: true,
		cell: ({ createdAt }) => {
			const actionDate = dateFormattingWithTime(createdAt);

			return <div>{actionDate}</div>;
		},
		omit: false,
		disableOmit: false,
	},
]);
