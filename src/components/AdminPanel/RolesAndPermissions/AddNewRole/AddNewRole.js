import React, { memo } from 'react';
import { array, bool, func } from 'prop-types';
import EditRoleForm from '@components/_shared/EditRoleFrom';

const AddNewRole = ({ onClose, userRoles, addNewRole, isLoading }) => (
	<div className='add-new-role'>
		<EditRoleForm
			onClose={onClose}
			onSave={addNewRole}
			userRoles={userRoles}
			isLoading={isLoading}
		/>
	</div>
);

AddNewRole.propTypes = {
	onClose: func,
	addNewRole: func,
	userRoles: array,
	isLoading: bool,
};

export default memo(AddNewRole);
