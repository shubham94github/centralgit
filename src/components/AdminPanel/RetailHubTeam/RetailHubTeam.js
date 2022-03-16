import React, { memo, useEffect, useMemo, useState } from 'react';
import { connect } from 'react-redux';
import { arrayOf, bool, func } from 'prop-types';
import {
	createNewUserModal,
	defaultTableMeta,
	pageTitle,
	activationSuccessText,
	blockSuccessText,
} from '@components/AdminPanel/RetailHubTeam/constants';
import MainTable from '@components/_shared/MainTable';
import { selectValueType, tableMetaType, userType } from '@constants/types';
import AppModal from '@components/Common/AppModal';
import AddNewAdminUser from '@components/AdminPanel/RetailHubTeam/AddNewAdminUser';
import { getCountries, setSnackbar } from '@ducks/common/actions';
import { useGetAuthorities } from '@utils/hooks/useGetAuthorities';
import { optionsMapper } from '@utils/optionsMapper';
import { activateAdminUser, createNewAdminUser, deActivateAdminUser, updateAdminUser } from '@api/adminApi';
import AdminUsersFilters from './AdminUsersFilters';
import { listOfFilters } from './AdminUsersFilters/listOfFilters';
import { schema } from '@components/AdminPanel/Startups/schema';
import { useGetAdminUsers } from '@utils/hooks/useGetAdminUsers';
import { isEmpty } from '@utils/js-helpers';
import enums from '@constants/enums';
import { errorText } from '@components/_shared/Gallery/contants';
import { getColumns } from '@components/AdminPanel/RetailHubTeam/utils';
import useQueryParams from '@utils/hooks/useQueryParams';
import { logOut } from '@ducks/auth/actions';
import isEqual from 'lodash/isEqual';
import usePrevious from '@utils/hooks/usePrevious';
import EditAdminUser from '@components/AdminPanel/RetailHubTeam/EditAdminUser';

import './RetailHubTeam.scss';

const RetailHubTeam = ({
	countries,
	getCountries,
	user,
	setSnackbar,
	logOut,
}) => {
	const [isNewUserModal, setIsNewUserModal] = useState(false);
	const [wasUpdatedBackend, setWasUpdatedBackend] = useState(false);
	const [tableMeta, setTableMeta] = useState(defaultTableMeta);
	const [selectedUsers, setSelectedUsers] = useState([]);
	const [isUserChanging, setIsUserChanging] = useState(false);
	const [editableUser, setEditableUser] = useState(null);

	const { authorities, isLoading: isAuthoritiesLoading } = useGetAuthorities({
		wasUpdatedBackend,
		setWasUpdatedBackend,
		setSnackbar,
	});

	const queryParams = useQueryParams();
	const roleName = queryParams.get('roleName');
	const filterText = queryParams.get('filterText');

	const queryFilter = useMemo(() => {
		return [
			{
				fieldName: 'authority',
				filterText: roleName,
			},
			{
				fieldName: 'filterText',
				filterText: filterText,
			},
		].filter(item => !isEmpty(item.filterText));
	}, [roleName, filterText]);

	const prevQueryFilter = usePrevious(queryFilter);

	const { adminUsers, isLoading, counts } = useGetAdminUsers({
		wasUpdatedBackend,
		setWasUpdatedBackend,
		setSnackbar,
		tableMeta: isEqual(prevQueryFilter, queryFilter) ? tableMeta : defaultTableMeta,
		filter: queryFilter,
		logOut,
	});

	useEffect(() => {
		if (!countries) getCountries();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const rolesSelectOptions = useMemo(() => optionsMapper(authorities?.items || []), [authorities]);

	const openCreationModal = () => setIsNewUserModal(true);
	const closeCreationModal = () => setIsNewUserModal(false);

	const handleCreateNewAdminUser = async newUser => {
		await createNewAdminUser(newUser);

		setWasUpdatedBackend(true);
		setIsNewUserModal(false);
	};

	const handleUpdateAdminUser = async updatedUser => {
		await updateAdminUser({ updatedUser, id: editableUser.id });

		setWasUpdatedBackend(true);
		setIsNewUserModal(false);
	};

	const onChangePage = page => {
		setTableMeta(prevTableMeta => ({
			...prevTableMeta,
			page: page + 1,
		}));
	};

	const onSearch = () => {
		setTableMeta({
			...tableMeta,
			page: 1,
		});
	};

	const handleChangeUserStatus = (sendRequest, successText, errorText) => async ids => {
		try {
			setIsUserChanging(true);

			await sendRequest(ids);

			setSnackbar({
				text: successText,
				type: enums.snackbarTypes.info,
			});
			setWasUpdatedBackend(true);
		} catch (e) {
			setSnackbar({
				text: errorText,
				type: enums.snackbarTypes.error,
			});
		} finally {
			setIsUserChanging(false);
		}
	};

	const activateUserAction = handleChangeUserStatus(activateAdminUser, activationSuccessText,
		errorText.uploadingError);
	const blockUserAction = handleChangeUserStatus(deActivateAdminUser, blockSuccessText, errorText.uploadingError);

	const handleEditUser = user => setEditableUser(user);

	const handleGroupActions = type => {
		const idsForAction = selectedUsers.reduce((acc, selectedRow) => {
			if (selectedRow?.status === enums.gettingStartedStatusesAdminPanel.completedGettingStarted)
				acc.push(selectedRow.id);

			return acc;
		}, []);

		switch (type) {
			case enums.groupActions.activate: return activateUserAction(idsForAction);
			case enums.groupActions.deactivate:return blockUserAction(idsForAction);
			default: return;
		}
	};

	const handleSelectedUsers = selectedUsers => {
		setSelectedUsers(!isEmpty(selectedUsers) ? selectedUsers : []);
	};

	const onChangeCountOfRecords = pageSize => {
		setTableMeta(prevTableMeta => ({
			...prevTableMeta,
			size: pageSize,
			page: 1,
		}));
	};

	const handleFilters = () => {
		setTableMeta(defaultTableMeta);
	};

	const onSort = (fieldName, direction) => {
		setTableMeta({
			...tableMeta,
			page: 1,
			sort: {
				direction: direction.toUpperCase(),
				fieldName: fieldName.property,
			},
		});
	};

	const columns = getColumns({
		activateUser: activateUserAction,
		handleEditUser,
		blockUser: blockUserAction,
	});

	const closeEditModal = () => setEditableUser(null);

	return (
		<div className='retail-hub-team'>
			<div className='title bold'>{pageTitle}</div>
			<MainTable
				sortServer
				columns={columns}
				data={adminUsers}
				listOfFilters={listOfFilters}
				isLoading={isLoading || isAuthoritiesLoading || isUserChanging}
				selectableRows
				pageCount={Math.ceil((counts) / tableMeta.size)}
				countOfRecords={counts}
				tableMeta={tableMeta}
				onChangePage={onChangePage}
				onSearch={onSearch}
				handleGroupActions={handleGroupActions}
				filtersSchema={schema}
				selectedRows={selectedUsers}
				setSelectedRows={handleSelectedUsers}
				onChangeCountOfRecords={onChangeCountOfRecords}
				selectedFilters={{}}
				handleFilters={handleFilters}
				withFilters
				withPagination
				tableHeader={AdminUsersFilters}
				openCreationModal={openCreationModal}
				onSort={onSort}
				roles={rolesSelectOptions}
			/>
			{isNewUserModal
				&& <AppModal
					component={AddNewAdminUser}
					title={createNewUserModal}
					onClose={closeCreationModal}
					isHeader
					isCloseIcon
					outerProps={{
						isLoading,
						createNewAdminUser: handleCreateNewAdminUser,
						user,
						countries,
						roles: rolesSelectOptions,
						cancel: closeCreationModal,
					}}
				/>
			}
			{editableUser
				&& <AppModal
					component={EditAdminUser}
					title={createNewUserModal}
					outerProps={{
						isLoading,
						updateAdminUser: handleUpdateAdminUser,
						user,
						countries,
						roles: rolesSelectOptions,
						cancel: closeEditModal,
						adminUser: editableUser,
					}}
					onClose={closeEditModal}
					isCloseIcon
					isHeader
				/>
			}
		</div>
	);
};

RetailHubTeam.defaultProps = {
	tableMeta: defaultTableMeta,
};

RetailHubTeam.propTypes = {
	tableMeta: tableMetaType,
	addNewAdminUser: func,
	isLoading: bool,
	countries: arrayOf(selectValueType),
	getCountries: func,
	user: userType,
	setSnackbar: func,
	logOut: func,
};

const mapStateToProps = ({ common: { countries, isLoading, authorities }, auth: { user } }) => {
	return {
		countries,
		user,
		isLoading,
		roles: authorities,
	};
};

export default connect(mapStateToProps, {
	getCountries,
	setSnackbar,
	logOut,
})(memo(RetailHubTeam));
