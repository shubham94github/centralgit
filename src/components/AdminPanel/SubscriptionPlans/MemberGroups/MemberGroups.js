import React, { memo, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { createNewMemberGroup, deleteMemberGroup, editMemberGroup, getMemberGroups } from '@ducks/admin/actions';
import { arrayOf, bool, func } from 'prop-types';
import { memberGroupsType } from '@constants/types';
import { isEmpty } from '@utils/js-helpers';
import { getColumns } from '@components/AdminPanel/SubscriptionPlans/MemberGroups/columns';
import MainTable from '@components/_shared/MainTable';
import MemberGroupsHeader from '@components/AdminPanel/SubscriptionPlans/MemberGroups/MemberGroupsHeader';
import AppModal from '@components/Common/AppModal';
import MemberGroupsModal from '@components/_shared/ModalComponents/MemberGroupsModal';
import Confirm from '@components/_shared/ModalComponents/Confirm';

import './MemberGroups.scss';

const confirmMessage = 'Are you sure you want to delete this Group?';

const MemberGroups = ({
	memberGroups,
	isLoading,
	getMemberGroups,
	createNewMemberGroup,
	editMemberGroup,
	deleteMemberGroup,
}) => {
	const [isShowMemberGroups, setIsShowMemberGroups] = useState(false);
	const [isShowConfirm, setIsShowConfirm] = useState(false);
	const [selectedMemberGroup, setSelectedMemberGroup] = useState(null);
	const [selectedMemberGroupId, setSelectedMemberGroupId] = useState(null);
	const modalTitle = selectedMemberGroup ? 'Edit Group' : 'Add New Group';

	const openMemberGroups = () => setIsShowMemberGroups(true);

	const closeMemberGroups = () => {
		setSelectedMemberGroup(null);
		setSelectedMemberGroupId(null);
		setIsShowMemberGroups(false);
	};

	const openConfirm = () => setIsShowConfirm(true);

	const closeConfirm = () => setIsShowConfirm(false);

	const memberGroupsProps = {
		createNewMemberGroup,
		editMemberGroup,
		selectedMemberGroup,
	};

	const columns = getColumns({
		setSelectedMemberGroup,
		openMemberGroups,
		setSelectedMemberGroupId,
		openConfirm,
	});

	useEffect(() => {
		if (isEmpty(memberGroups)) getMemberGroups();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const handleDelete = () => {
		deleteMemberGroup(selectedMemberGroupId);

		closeConfirm();
	};

	return (
		<div className='member-groups-container'>
			<MainTable
				title='Member Groups'
				columns={columns}
				data={memberGroups}
				isLoading={isLoading}
				selectableRows={false}
				sortServer
				withPagination={false}
				withFilters={false}
				tableHeader={MemberGroupsHeader}
				toggleModal={openMemberGroups}
			/>
			{isShowMemberGroups
				&& <AppModal
					component={MemberGroupsModal}
					onClose={closeMemberGroups}
					outerProps={memberGroupsProps}
					title={modalTitle}
					width='630px'
				/>
			}
			{isShowConfirm
				&& <AppModal
					className='confirm-pop-up'
					onClose={closeConfirm}
					title={confirmMessage}
					outerProps={{
						successConfirm: handleDelete,
						onClose: closeConfirm,
					}}
					component={Confirm}
				/>
			}
		</div>
	);
};

MemberGroups.propTypes = {
	memberGroups: arrayOf(memberGroupsType),
	isLoading: bool,
	getMemberGroups: func.isRequired,
	createNewMemberGroup: func.isRequired,
	editMemberGroup: func.isRequired,
	deleteMemberGroup: func.isRequired,
};

export default connect(({ admin: { memberGroups, isLoading } }) => ({
	memberGroups,
	isLoading,
}), {
	getMemberGroups,
	createNewMemberGroup,
	editMemberGroup,
	deleteMemberGroup,
})(memo(MemberGroups));
