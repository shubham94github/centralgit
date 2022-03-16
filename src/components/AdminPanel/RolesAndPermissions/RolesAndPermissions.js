import React, { memo, useState } from 'react';
import { array, func } from 'prop-types';
import { P14, P16 } from '@components/_shared/text';
import PrimaryButton from '@components/_shared/buttons/PrimaryButton';
import {
	addNewRoleBtnText,
	infoIcon,
	pageInfo,
	pageTitle,
	errorCreationMessageText,
	successCreationMessageText,
	editRoleModalTitle,
	deleteRoleConfirmationText,
	errorDeletingMessageText,
	successDeleteMessageText,
	errorUpdatingMessageText,
	successUpdateMessageText,
} from '@components/AdminPanel/RolesAndPermissions/constants';
import AppModal from '@components/Common/AppModal';
import { connect } from 'react-redux';
import { setSnackbar } from '@ducks/common/actions';
import LoadingOverlay from '@components/_shared/LoadingOverlay';
import { useGetAuthorities } from '@utils/hooks/useGetAuthorities';
import AddNewRole from '@components/AdminPanel/RolesAndPermissions/AddNewRole';
import { createAuthority, deleteAuthority, updateAuthority } from '@api/adminApi';
import Markdown from 'markdown-to-jsx';
import UserRolesTable from '@components/AdminPanel/RolesAndPermissions/UserRolesTable';
import enums from '@constants/enums';
import EditRole from '@components/AdminPanel/RolesAndPermissions/EditRole';
import Confirm from '@components/_shared/ModalComponents/Confirm';
import replaceBreakLinesWithAsterisk from '@utils/replaceBreakLinesWithAsterisk';

import './RolesAndPermissions.scss';

function RolesAndPermissions({ setSnackbar }) {
	const [isAddNewRoleModal, setIsAddNewRoleModal] = useState(false);
	const [wasUpdatedBackend, setWasUpdatedBackend] = useState();
	const [editingRoleId, setEditingRoleId] = useState();
	const [deletingUserRoleId, setDeletingUserRoleId] = useState();

	const { authorities, isLoading, setIsLoading, counts } = useGetAuthorities({
		wasUpdatedBackend,
		setWasUpdatedBackend,
		setSnackbar,
	});

	const showManageRoles = () => setIsAddNewRoleModal(true);
	const closeManageRoles = () => setIsAddNewRoleModal(false);
	const setEditRole = id => setEditingRoleId(id);
	const closeDeleteConfirmModal = () => setDeletingUserRoleId(null);
	const setRemovingRoleId = id => setDeletingUserRoleId(id);
	const closeEditRoleModal = () => setEditingRoleId(null);

	const sendRequest = async ({ request, payload, successMessage, errorMessage }) => {
		try {
			setIsLoading(true);

			const { name, permissions, id } = payload;

			await request({ name, permissions, id });

			setDeletingUserRoleId(null);
			setEditingRoleId(null);
			setIsAddNewRoleModal(false);
			setSnackbar({
				type: 'info',
				text: successMessage,
			});
			setWasUpdatedBackend(true);
		} catch (e) {
			setSnackbar({
				type: 'error',
				text: errorMessage,
			});
		} finally {
			setIsLoading(false);
		}
	};

	const addNewRole = async ({ name, permissions }) => {
		await sendRequest({
			request: createAuthority,
			payload: {  name, permissions },
			successMessage: successCreationMessageText,
			errorMessage: errorCreationMessageText,
		});
	};

	const updateUserRole = async ({ id, name, permissions }) => {
		await sendRequest({
			request: updateAuthority,
			payload: {  name, permissions, id },
			successMessage: successUpdateMessageText,
			errorMessage: errorUpdatingMessageText,
		});
	};

	const handleDeleteUserRole = async () => {
		await sendRequest({
			request: deleteAuthority,
			payload: { id: deletingUserRoleId },
			successMessage: successDeleteMessageText,
			errorMessage: errorDeletingMessageText,
		});
	};

	return (
		<div className='roles-and-permissions'>
			<div className='roles-and-permissions-header'>
				<P16 bold>{pageTitle}</P16>
				<div className='description'>
					{infoIcon}
					<P14>
						<Markdown options={{  wrapper: 'div' }}>{replaceBreakLinesWithAsterisk(pageInfo)}</Markdown>
					</P14>
				</div>
				<PrimaryButton onClick={showManageRoles} isAdmin>{addNewRoleBtnText}</PrimaryButton>
				<UserRolesTable
					removeRole={setRemovingRoleId}
					editRoles={setEditRole}
					counts={counts}
					userRoles={authorities?.items}
					permissions={enums.permissions}
				/>
				{isAddNewRoleModal
					&& <AppModal
						width='620px'
						component={AddNewRole}
						onClose={closeManageRoles}
						title={addNewRoleBtnText}
						outerProps={{
							userRoles: authorities?.items,
							isLoading,
							addNewRole,
						}}
					/>
				}
				{!!editingRoleId
					&& <AppModal
						width='620px'
						component={EditRole}
						onClose={closeEditRoleModal}
						title={editRoleModalTitle}
						outerProps={{
							userRoles: authorities?.items,
							isLoading,
							updateUserRole,
							userRoleId: editingRoleId,
						}}
					/>
				}
				{!!deletingUserRoleId
					&& <AppModal
						title={deleteRoleConfirmationText}
						isHeader
						component={Confirm}
						outerProps={{
							deletingUserRoleId,
							successConfirm: handleDeleteUserRole,
						}}
						onClose={closeDeleteConfirmModal}
						width='600px'
					/>
				}
			</div>
			{isLoading && <LoadingOverlay/>}
		</div>
	);
}

RolesAndPermissions.propTypes = {
	usersRoles: array,
	setSnackbar: func,
};

export default connect(null, {
	setSnackbar,
})(memo(RolesAndPermissions));
