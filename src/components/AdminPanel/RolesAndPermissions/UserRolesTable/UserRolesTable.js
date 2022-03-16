import React, { memo } from 'react';
import { arrayOf, func, shape, object, number } from 'prop-types';
import { userRoleType } from '@constants/types';
import DataTable from 'react-data-table-component';
import { generateTableData, generateColumns } from '@components/AdminPanel/RolesAndPermissions/UserRolesTable/utils';
import { useHistory } from 'react-router-dom';

const UserRolesTable = ({ userRoles, permissions, editRoles, counts, removeRole }) => {
	const history = useHistory();

	const redirectToAdminsPage = roleName => {
		history.push(`/admin-panel/retail-hub-team?roleName=${roleName}`);
	};

	const tableData = generateTableData({ userRoles, permissions, counts });
	const columns = generateColumns({ userRoles, editRoles, removeRole, redirectToAdminsPage, counts });

	return (
		<div className='user-role-table'>
			<div className='permissions-table main-table'>
				<DataTable
					noHeader
					withFilters={false}
					withPagination={false}
					data={tableData}
					columns={columns}
				/>
			</div>
		</div>
	);
};

UserRolesTable.defaultProps = {
	userRoles: [],
};

UserRolesTable.propTypes = {
	userRoles: arrayOf(userRoleType),
	permissions: object.isRequired,
	editRoles: func.isRequired,
	removeRole: func.isRequired,
	counts: arrayOf(shape({
		count: number.isRequired,
		id: number.isRequired,
	})),
};

export default memo(UserRolesTable);
