import React, { memo } from 'react';
import { array, arrayOf, bool, func } from 'prop-types';
import { selectValueType } from '@constants/types';
import NewAdminUserForm from '../NewAdminUserForm';

const AddNewAdminUser = ({
	createNewAdminUser,
	countries,
	roles,
	cancel,
	isLoading,
}) => {
	return (
		<NewAdminUserForm
			submitHandler={createNewAdminUser}
			cancelHandler={cancel}
			isLoading={isLoading}
			countries={countries}
			roles={roles}
			submitBtnTitle='Create'
		/>
	);
};

AddNewAdminUser.propTypes = {
	isLoading: bool,
	createNewAdminUser: func,
	countries: arrayOf(selectValueType),
	roles: array,
	cancel: func.isRequired,
};

export default memo(AddNewAdminUser);
