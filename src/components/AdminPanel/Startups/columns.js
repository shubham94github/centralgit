import React from 'react';
import { getCompanyIcon } from '@utils/getCompanyIcon';
import CustomDropdown from '@components/_shared/CustomDropdown';
import { colors } from '@constants/colors';
import { fullDateFormatting, dateFormattingWithTime } from '@utils/date';
import { func } from 'prop-types';
import MenuList from '../helpers/MenuList';
import combineCategoriesByName from '@utils/combineCategoriesByName';
import Tooltip from '@components/_shared/Tooltip';
import { P12 } from '@components/_shared/text';
import enums from '@constants/enums';
import { Icons } from '@icons';

/* eslint react/prop-types: 0 */

const {
	verifyUserTypes,
} = enums;

const maxStringLengths = {
	shortName: 20,
	founder: 10,
};

export const getColumns = ({
	approveUser,
	handleStartupActivation,
	history,
	isStartupsViewProfilePermission,
}) => {
	const menuIcon = Icons.threeDotsMenuIcon(colors.black);

	return [
		{
			name: 'Actions',
			width: '100px',
			property: 'actions',
			selector: 'actions',
			sortable: false,
			cell: ({ isBlocked, isApprovedByAdmin, id, status }) => {
				const handleApprove = () => approveUser({ ids: [id], type: verifyUserTypes.startup });
				const handleActivation = () => handleStartupActivation({ ids: [id], isBlocked });
				const outerProps = {
					id,
					isApprovedByAdmin,
					isBlocked,
					handleApprove,
					handleActivation,
					typeOfRole: 'startup',
					status,
					isWithoutEdit: true,
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
			disableOmit: true,
		},
		{
			name: 'Logo',
			property: 'logo30',
			selector: 'startup.logo30',
			sortable: false,
			cell: user => {
				const handleOpenProfile = () => {
					if (!isStartupsViewProfilePermission) return;

					history.push(`/admin-panel/profile/startup/${user.id}`);
				};
				const isForTable = true;
				return (
					<div
						onClick={handleOpenProfile}
						style={{ cursor: 'pointer' }}
					>
						{getCompanyIcon(
							user.startup.logo30,
							user.startup.logo30?.name,
							user.startup.logo30?.color,
							isForTable,
						)}
					</div>
				);
			},
			omit: false,
			disableOmit: true,
			width: '80px',
		},
		{
			name: 'Brand',
			grow: 2,
			property: 'companyShortName',
			selector: 'startup.companyShortName',
			sortable: true,
			width: '200px',
			cell: user => {
				if (!user.startup?.companyShortName) return;

				const handleOpenProfile = () => {
					if (!isStartupsViewProfilePermission) return;

					history.push(`/admin-panel/profile/startup/${user.id}`);
				};

				return (
					<Tooltip
						isVisibleTooltip={user.startup.companyShortName.length > maxStringLengths.shortName}
						placement={'bottom'}
						message={user.startup.companyShortName}
					>
						<div
							onClick={handleOpenProfile}
							style={{ cursor: 'pointer' }}
							className='truncate-brand'
						>
							{user.startup.companyShortName}
						</div>
					</Tooltip>
				);
			},
			omit: false,
			disableOmit: true,
		},
		{
			name: 'Startup Type',
			grow: 2,
			property: 'accountType',
			selector: 'startup.accountType',
			sortable: false,
			width: '170px',
			omit: false,
			disableOmit: false,
		},
		{
			name: 'Founder',
			grow: 2,
			property: 'owner',
			sortable: false,
			omit: false,
			disableOmit: false,
			cell: user => {
				if (!user.startup?.owner) return;

				return (
					<Tooltip
						isVisibleTooltip={user.startup?.owner.length > maxStringLengths.founder}
						placement={'bottom'}
						message={user.startup.owner}
					>
						<div
							style={{ cursor: 'pointer' }}
							className='truncate-brand'
						>
							{user.startup.owner}
						</div>
					</Tooltip>
				);
			},
		},
		{
			name: 'Account E-mail',
			grow: 2,
			property: 'email',
			selector: 'email',
			sortable: true,
			width: '310px',
			cell: ({ email }) => {
				return <div>{email}</div>;
			},
			omit: false,
			disableOmit: false,
		},
		{
			name: 'E-mail verified',
			grow: 1,
			property: 'isVerified',
			selector: 'isVerified',
			sortable: false,
			width: '170px',
			cell: ({ isVerified }) => {
				return <div>{isVerified ? 'Yes' : 'No'}</div>;
			},
			omit: false,
			disableOmit: false,
		},
		{
			name: 'Sectors',
			grow: 1,
			property: 'startup.categories',
			selector: 'categories',
			sortable: false,
			width: '170px',
			cell: ({ startup: { categories } }) => {
				return (
					categories && <Tooltip
						message={
							<P12 className='parent-paths'>
								{
									combineCategoriesByName(categories)
										.map((category, i) => {
											return (
												<div key={i}>
													{
														category.sameItems.map(item => (
															<span key={item}>
																{item}
																<br/>
															</span>
														))
													}
												</div>
											);
										})
								}
							</P12>
						}
					>
						<div>{categories?.length}</div>
					</Tooltip>
				);
			},
			omit: false,
			disableOmit: false,
		},
		{
			name: 'Areas',
			grow: 1,
			property: 'startup.areasOfInterest',
			selector: 'areasOfInterest',
			sortable: false,
			width: '170px',
			cell: ({ startup: { areasOfInterest } }) => {
				return (
					areasOfInterest && <Tooltip
						trigger={['hover', 'focus']}
						message={
							<P12 className='parent-paths'>
								{
									combineCategoriesByName(areasOfInterest)
										.map((areaOfInterest, i) => {
											return (
												<div key={i}>
													{
														areaOfInterest.sameItems.map(item => (
															<span key={item}>
																{item}
																<br/>
															</span>
														))
													}
												</div>
											);
										})
								}
							</P12>
						}
					>
						<div>{areasOfInterest?.length}</div>
					</Tooltip>
				);
			},
			omit: false,
			disableOmit: false,
		},
		{
			name: 'Rate',
			grow: 1,
			property: 'rateStars',
			selector: 'startup.rateStars',
			sortable: true,
			width: '130px',
			cell: ({ startup: { rateStars } }) => {
				const starsArray = Array.from({ length: rateStars }, () => Icons.ratingStarIcon(colors.orange40));

				return <div className='stars-container'>
					{starsArray.map((star, i) => <div key={`star-${i}`}>{star}</div>)}
				</div>;
			},
			omit: false,
			disableOmit: false,
		},
		{
			name: 'Approved',
			grow: 1,
			property: 'isApprovedByAdmin',
			selector: 'isApprovedByAdmin',
			sortable: false,
			cell: ({ isApprovedByAdmin }) => {
				return <div>{!!isApprovedByAdmin ? 'Yes' : 'Pending'}</div>;
			},
			omit: false,
			disableOmit: false,
		},
		{
			name: 'Status',
			grow: 2,
			property: 'isBlocked',
			selector: 'isBlocked',
			sortable: false,
			cell: ({ isBlocked }) => {
				return <div>{!isBlocked ? 'Active' : 'Blocked'}</div>;
			},
			omit: false,
			disableOmit: false,
		},
		{
			name: 'Getting Started Status',
			grow: 2,
			property: 'status',
			selector: 'status',
			sortable: false,
			width: '220px',
			omit: false,
			disableOmit: false,
		},
		{
			name: 'Account First Name',
			grow: 2,
			property: 'firstName',
			selector: 'firstName',
			sortable: false,
			width: '200px',
			omit: false,
			disableOmit: false,
		},
		{
			name: 'Account Last Name',
			grow: 2,
			property: 'lastName',
			selector: 'lastName',
			sortable: false,
			width: '200px',
			omit: false,
			disableOmit: false,
		},
		{
			name: 'Country',
			grow: 2,
			property: 'country',
			selector: 'startup.country.name',
			sortable: false,
			omit: false,
			disableOmit: false,
		},
		{
			name: 'City',
			grow: 2,
			property: 'city',
			selector: 'startup.city',
			sortable: true,
			omit: false,
			disableOmit: false,
		},
		{
			name: 'Company type',
			grow: 2,
			property: 'companyType',
			selector: 'startup.companyType',
			sortable: false,
			omit: false,
			disableOmit: false,
			width: '200px',
		},
		{
			name: 'Business model',
			grow: 2,
			property: 'businessModel',
			selector: 'startup.businessModel',
			sortable: false,
			width: '170px',
			omit: false,
			disableOmit: false,
		},
		{
			name: 'Company Status',
			grow: 2,
			property: 'companyStatus',
			selector: 'startup.companyStatus',
			sortable: false,
			width: '170px',
			omit: false,
			disableOmit: false,
		},
		{
			name: 'Registered at RTHb date',
			grow: 2,
			property: 'createdAt',
			selector: 'startup.createdAt',
			sortable: true,
			width: '270px',
			cell: ({ createdAt }) => {
				return <div>{fullDateFormatting(createdAt)}</div>;
			},
			omit: false,
			disableOmit: false,
		},
		{
			name: 'Last seen',
			grow: 2,
			property: 'visitedAt',
			selector: 'visitedAt',
			sortable: true,
			width: '200px',
			cell: ({ onlineStatus }) => {
				const lastSeen = onlineStatus?.visitedAt ? dateFormattingWithTime(onlineStatus?.visitedAt) : '';

				return <div>{lastSeen}</div>;
			},
			omit: false,
			disableOmit: false,
		},
	];
};

getColumns.defaultProps = {
	approveUser: () => {},
	handleStartupActivation: () => {},
};

getColumns.PropTypes = {
	approveUser: func.isRequired,
	handleStartupActivation: func.isRequired,
};
