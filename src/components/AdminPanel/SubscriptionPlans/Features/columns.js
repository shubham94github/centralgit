import React from 'react';
import CustomDropdown from '@components/_shared/CustomDropdown';
import { colors } from '@constants/colors';
import { func } from 'prop-types';
import { Icons as icons, Icons } from '@icons';
import MenuList from './MenuList';
import cn from 'classnames';

const checkedIcon = icons.checkboxCheckedLight();
const editIcon = icons.editIcon(colors.darkblue70);

/* eslint react/prop-types: 0 */

export const getColumns = ({
	setSelectedFeature,
	openFeaturesModal,
	setSelectedFeatureId,
	openConfirm,
	setAssignType,
	openAssignFeatureModal,
}) => {
	const menuIcon = Icons.threeDotsMenuIcon(colors.black);

	return [
		{
			name: 'Actions',
			width: '100px',
			property: 'actions',
			selector: 'actions',
			sortable: false,
			cell: row => {
				const { isActions } = row;
				const handleEditFeature = () => {
					setSelectedFeature(row);
					openFeaturesModal();
				};
				const handleDeleteFeature = () => {
					setSelectedFeatureId(row.id);
					openConfirm();
				};
				const outerProps = {
					handleEditFeature,
					handleDeleteFeature,
				};

				return (!isActions
					&& <div className='center'>
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
			name: 'Feature',
			grow: 2,
			property: 'title',
			selector: 'title',
			sortable: false,
			width: '300px',
			omit: false,
			disableOmit: true,
		},
		{
			name: 'Single User',
			grow: 2,
			property: 'isSingleUser',
			selector: 'isSingleUser',
			sortable: false,
			width: '200px',
			omit: false,
			disableOmit: false,
			cell: ({ isSingleUser, isActions }) => {
				const classes = cn('centered', {
					'action': isActions,
				});
				const cellData = isActions
					? editIcon
					: isSingleUser
						? checkedIcon
						: '';

				const handleAssignFeature = () => {
					if (!isActions) return;

					setAssignType({ property: 'isSingleUser', label: 'Single User' });
					openAssignFeatureModal();
				};

				return <div className={classes} onClick={handleAssignFeature}>{cellData}</div>;
			},
		},
		{
			name: 'Multi-User',
			grow: 2,
			property: 'isMultiUser',
			selector: 'isMultiUser',
			sortable: false,
			width: '200px',
			omit: false,
			disableOmit: false,
			cell: ({ isMultiUser, isActions }) => {
				const classes = cn('centered', {
					'action': isActions,
				});
				const cellData = isActions
					? editIcon
					: isMultiUser
						? checkedIcon
						: '';

				const handleAssignFeature = () => {
					if (!isActions) return;

					setAssignType({ property: 'isMultiUser', label: 'Multi-User' });
					openAssignFeatureModal();
				};

				return <div className={classes} onClick={handleAssignFeature}>{cellData}</div>;
			},
		},
		{
			name: 'Enterprise',
			grow: 2,
			property: 'isEnterpriseUser',
			selector: 'isEnterpriseUser',
			sortable: false,
			width: '200px',
			omit: false,
			disableOmit: false,
			cell: ({ isEnterpriseUser, isActions }) => {
				const classes = cn('centered', {
					'action': isActions,
				});
				const cellData = isActions
					? editIcon
					: isEnterpriseUser
						? checkedIcon
						: '';

				const handleAssignFeature = () => {
					if (!isActions) return;

					setAssignType({ property: 'isEnterpriseUser', label: 'Enterprise' });
					openAssignFeatureModal();
				};

				return <div className={classes} onClick={handleAssignFeature}>{cellData}</div>;
			},
		},
	];
};

getColumns.PropTypes = {
	setSelectedFeature: func.isRequired,
	openFeaturesModal: func.isRequired,
	setSelectedFeatureId: func.isRequired,
	openConfirm: func.isRequired,
	setAssignType: func.isRequired,
	openAssignFeatureModal: func.isRequired,
};
