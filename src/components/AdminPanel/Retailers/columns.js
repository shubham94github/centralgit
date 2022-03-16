import React from 'react';
import { getCompanyIcon } from '@utils/getCompanyIcon';
import CustomDropdown from '@components/_shared/CustomDropdown';
import { colors } from '@constants/colors';
import { fullDateFormatting, dateFormattingWithTime } from '@utils/date';
import { func } from 'prop-types';
import MenuList from '../helpers/MenuList';
import { getRetailerRole } from './utils/getRetailerRole';
import enums from '@constants/enums';
import Tooltip from '@components/_shared/Tooltip';
import { P12 } from '@components/_shared/text';
import combineCategoriesByName from '@utils/combineCategoriesByName';
import { Icons } from '@icons';

const {
	verifyUserTypes,
} = enums;

const maxStringLengths = {
	shortName: 20,
};

const unpaidStatuses = ['Account registration', 'Subscription plan'];

export const getColumns = ({
	approveUser,
	handleRetailerActivation,
	history,
	isRetailersViewProfilePermission,
}) => {
	const menuIcon = Icons.threeDotsMenuIcon(colors.black);

	return [
		{
			name: 'Actions',
			width: '100px',
			grow: 1,
			property: 'actions',
			selector: 'actions',
			sortable: false,
			// eslint-disable-next-line react/prop-types
			cell: ({ isBlocked, id, isApprovedByAdmin, role, status }) => {
				const handleApprove = () => approveUser({ ids: [id], type: verifyUserTypes.retailer });
				const handleActivation = () => handleRetailerActivation({ ids: [id], isBlocked });
				const outerProps = {
					id,
					isApprovedByAdmin,
					isBlocked,
					handleApprove,
					handleActivation,
					typeOfRole: 'retailer',
					role,
					isWithoutEdit: true,
					status,
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
			grow: 1,
			property: 'logo30',
			selector: 'retailer.logo30',
			sortable: false,
			// eslint-disable-next-line react/prop-types
			cell: ({ retailer: { logo30 }, id }) => {
				const isForTable = true;
				const handleOpenProfile = () => {
					if (!isRetailersViewProfilePermission) return;

					history.push(`/admin-panel/profile/user/${id}`);
				};
				// eslint-disable-next-line react/prop-types
				return (
					<div
						onClick={handleOpenProfile}
						style={{ cursor: 'pointer' }}
					>
						{/* eslint-disable-next-line react/prop-types */}
						{getCompanyIcon(logo30, logo30.name, logo30.color, isForTable)}
					</div>
				);
			},
			omit: false,
			disableOmit: true,
		},
		{
			name: 'Brand',
			grow: 2,
			property: 'companyShortName',
			selector: 'retailer.companyShortName',
			sortable: true,
			width: '200px',
			omit: false,
			disableOmit: true,
			// eslint-disable-next-line react/prop-types
			cell: ({ retailer: { companyShortName }, id }) => {
				const handleOpenProfile = () => {
					if (!isRetailersViewProfilePermission) return;

					history.push(`/admin-panel/profile/user/${id}`);
				};

				return (
					<Tooltip
						// eslint-disable-next-line react/prop-types
						isVisibleTooltip={companyShortName?.length > maxStringLengths.shortName}
						placement='bottom'
						message={companyShortName}
					>
						<div
							onClick={handleOpenProfile}
							style={{ cursor: 'pointer' }}
							className='truncate-brand'
						>
							{companyShortName}
						</div>
					</Tooltip>
				);
			},
		},
		{
			name: 'User type',
			grow: 2,
			property: 'role',
			selector: 'role',
			sortable: false,
			width: '200px',
			// eslint-disable-next-line react/prop-types
			cell: ({ role }) => {
				// eslint-disable-next-line react/prop-types
				return <div>{getRetailerRole(role)}</div>;
			},
			omit: false,
			disableOmit: true,
		},
		{
			name: 'Account E-mail',
			grow: 2,
			property: 'email',
			selector: 'email',
			sortable: true,
			width: '310px',
			// eslint-disable-next-line react/prop-types
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
			// eslint-disable-next-line react/prop-types
			cell: ({ isVerified }) => {
				return <div>{isVerified ? 'Yes' : 'No'}</div>;
			},
			omit: false,
			disableOmit: false,
		},
		{
			name: 'Sectors',
			grow: 1,
			property: 'retailer.companySectors',
			selector: 'companySectors',
			sortable: false,
			width: '170px',
			// eslint-disable-next-line react/prop-types
			cell: ({ retailer: { companySectors } }) => {
				return (
					// eslint-disable-next-line react/prop-types
					!!companySectors?.length
						&& <Tooltip
							placement='top'
							message={
								<P12 className='parent-paths'>
									{
										combineCategoriesByName(companySectors)
											.map((companySector, i) => (
												<div key={i}>
													{
														companySector.sameItems.map(item => (
															<span key={item}>
																{item}
																<br/>
															</span>
														))
													}
												</div>
											))
									}
								</P12>
							}
						>
							{/* eslint-disable-next-line react/prop-types */}
							<div>{companySectors?.length}</div>
						</Tooltip>
				);
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
			// eslint-disable-next-line react/prop-types
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
			// eslint-disable-next-line react/prop-types
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
			selector: 'retailer.country.name',
			sortable: false,
			omit: false,
			disableOmit: false,
		},
		{
			name: 'City',
			grow: 2,
			property: 'city',
			selector: 'retailer.city',
			sortable: true,
			omit: false,
			disableOmit: false,
		},
		{
			name: 'Registered at RTHb date',
			grow: 2,
			property: 'createdAt',
			selector: 'retailer.createdAt',
			sortable: true,
			width: '270px',
			// eslint-disable-next-line react/prop-types
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
			// eslint-disable-next-line react/prop-types
			cell: ({ onlineStatus }) => {
				// eslint-disable-next-line react/prop-types
				const lastSeen = onlineStatus?.visitedAt ? dateFormattingWithTime(onlineStatus?.visitedAt) : '';

				return <div>{lastSeen}</div>;
			},
			omit: false,
			disableOmit: false,
		},
		{
			name: 'Payment info',
			grow: 2,
			property: 'isSubscriptionPaid',
			selector: 'retailer.stripePaymentSettings.isSubscriptionPaid',
			sortable: true,
			width: '170px',
			// eslint-disable-next-line react/prop-types
			cell: ({ retailer: { stripePaymentSettings: { isSubscriptionPaid } }, status }) => {
				const rule = isSubscriptionPaid
					&& !unpaidStatuses.find(unpaidStatus => unpaidStatus === status);

				return <div>{rule ? 'Paid' : 'Unpaid'}</div>;
			},
			omit: false,
			disableOmit: false,
		},
		{
			name: 'Next payment',
			grow: 2,
			property: 'nextPaymentDate',
			selector: 'retailer.stripePaymentSettings.nextPaymentDate',
			sortable: true,
			width: '200px',
			// eslint-disable-next-line react/prop-types
			cell: ({ retailer: { stripePaymentSettings: { nextPaymentDate } } }) => {
				// eslint-disable-next-line react/prop-types
				const lastSeen = nextPaymentDate ? dateFormattingWithTime(nextPaymentDate) : '';

				return <div>{lastSeen}</div>;
			},
			omit: false,
			disableOmit: false,
		},
		{
			name: 'Payment plan',
			grow: 2,
			property: 'paymentPlanName',
			selector: 'retailer.paymentPlan?.name',
			sortable: true,
			width: '200px',
			omit: false,
			disableOmit: false,
			cell: ({ retailer }) => retailer.paymentPlan?.uiName,
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
