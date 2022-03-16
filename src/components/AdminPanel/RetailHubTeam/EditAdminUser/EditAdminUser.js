import React, { memo } from 'react';
import { array, bool, func } from 'prop-types';
import NewAdminUserForm from '../NewAdminUserForm';
import { userType } from '@constants/types';

const EditAdminUser = ({
	updateAdminUser,
	cancel,
	isLoading,
	adminUser,
	countries,
	roles,
}) => {
	return (
		<div className='edit-admin-user'>
			<NewAdminUserForm
				cancelHandler={cancel}
				submitHandler={updateAdminUser}
				isLoading={isLoading}
				adminUser={adminUser}
				countries={countries}
				roles={roles}
				submitBtnTitle='Update'
			/>
		</div>
	);
};

EditAdminUser.propTypes = {
	updateAdminUser: func.isRequired,
	cancel: func.isRequired,
	isLoading: bool,
	adminUser: userType.isRequired,
	countries: array,
	roles: array,
};

export default memo(EditAdminUser);
