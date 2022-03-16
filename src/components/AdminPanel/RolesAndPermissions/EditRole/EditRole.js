import React  from 'react';
import { arrayOf, bool, func, number } from 'prop-types';
import EditRoleForm from '@components/_shared/EditRoleFrom';
import { userRoleType } from '@constants/types';

const EditRole = ({
	userRoles,
	isLoading,
	updateUserRole,
	userRoleId,
	onClose,
}) => {
	return (
		<div className='edit-role'>
			<EditRoleForm
				onClose={onClose}
				onSave={updateUserRole}
				userRoles={userRoles}
				isLoading={isLoading}
				editingUserRole={userRoles.find(role => role.id === userRoleId)}
			/>
		</div>
	);
};

EditRole.propTypes = {
	updateUserRole: func.isRequired,
	userRoleId: number.isRequired,
	onClose: func.isRequired,
	userRoles: arrayOf(userRoleType),
	isLoading: bool,
};

export default EditRole;
