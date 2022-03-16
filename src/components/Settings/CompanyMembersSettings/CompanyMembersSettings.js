import React, { memo, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import AppModal from '@components/Common/AppModal';
import MemberForm from '@components/_shared/ModalComponents/MemberForm';
import { addMemberSchema, editMemberSchema } from './schema';
import { getCountries, getDepartments, getPositions } from '@ducks/common/actions';
import { array, arrayOf, bool, func, number } from 'prop-types';
import { countryType, departmentType, positionType } from '@constants/types';
import { addNewMember, changeMemberStatus, getAllMembers, deleteMember, editMember } from '@ducks/settings/actions';
import LoadingOverlay from '@components/_shared/LoadingOverlay';
import { isEmpty } from '@utils/js-helpers';
import cn from 'classnames';
import { H1, P16 } from '@components/_shared/text';
import MemberCard from '@components/_shared/MemberCard';
import AddNewMemberCard from '@components/Settings/CompanyMembersSettings/AddNewMemberCard';
import MasonryLayout from '@components/_shared/MasonryLayout';
import EditMember from '@components/Settings/CompanyMembersSettings/EditMember';
import Confirm from '@components/_shared/ModalComponents/Confirm';
import { getItemFromStorage } from '@utils/storage';

import './CompanyMembersSettings.scss';

const confirmMessage = 'Are you sure you want to delete this member?';

const CompanyMembersHOC = ({
	getCountries,
	getDepartments,
	getPositions,
	countries,
	departments,
	positions,
	addNewMember,
	isLoading,
	members,
	getAllMembers,
	changeMemberStatus,
	deleteMember,
	editMember,
	maxMembers,
	isTrial,
}) => {
	const [isShowAddMemberModal, setIsShowAddMemberModal] = useState(false);
	const [isShowEditMemberModal, setIsShowEditMemberModal] = useState(false);
	const [isShowConfirm, setIsShowConfirm] = useState(false);
	const [selectedMember, setSelectedMember] = useState();
	const [memberIdForDelete, setMemberIdForDelete] = useState();
	const isDisabledButtonAddNewMember = !maxMembers || members?.length >= maxMembers;

	const classes = cn('members-container', {
		'is-centered': isEmpty(members),
	});
	const schema = selectedMember ? editMemberSchema : addMemberSchema;

	useEffect(() => {
		if (isEmpty(countries)) getCountries();
		if (isEmpty(departments)) getDepartments();
		if (isEmpty(positions)) getPositions();
		if (isEmpty(members)) getAllMembers();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const toggleAddModal = () => setIsShowAddMemberModal(prevState => !prevState);

	const toggleEditModal = () => setIsShowEditMemberModal(prevState => !prevState);

	const toggleConfirm = id => {
		if (id) setMemberIdForDelete(id);
		else setMemberIdForDelete(null);

		setIsShowConfirm(prevState => !prevState);
	};

	const onSubmit = ({ memberData, setFormError, onClose }) => addNewMember({ memberData, setFormError, onClose });

	const setMemberForEdit = member => {
		setSelectedMember(member);
		toggleEditModal();
	};

	const onEditMember = ({ memberData, onClose, setFormError }) => editMember({
		memberData: {
			...memberData,
			memberId: selectedMember.member.id,
			isBlocked: selectedMember.isBlocked,
		},
		onClose,
		setFormError,
	});

	const onDeleteMember = () => deleteMember({ memberId: memberIdForDelete, onClose: toggleConfirm });

	const onChangeMemberStatus = updatedStatus => {
		setSelectedMember({
			...selectedMember,
			isBlocked: updatedStatus.isBlocked,
			member: {
				...selectedMember.member,
			},
		});

		changeMemberStatus(updatedStatus);
	};

	return (
		<div className={classes}>
			{isEmpty(members)
				&& <div className='no-results'>
					<H1 bold>No Results</H1>
					<P16>Please add a new member</P16>
				</div>
			}
			<MasonryLayout
				items={members}
				brickComponent={MemberCard}
				itemProps={{
					changeMemberStatus,
					deleteMember: toggleConfirm,
					editMember: setMemberForEdit,
				}}
				lastBrickComponent={AddNewMemberCard}
				lastBrickProps={{
					toggleModal: toggleAddModal,
					isDisabledButtonAddNewMember,
					maxMembers,
					isTrial,
				}}
			/>
			{isShowAddMemberModal
				&& <AppModal
					component={MemberForm}
					outerProps={{
						onSubmit,
						schema,
						countries,
						departments,
						positions,
						settingsLoading: isLoading,
					}}
					title='Add a new member'
					onClose={toggleAddModal}
					staticBackdrop={false}
					width='675px'
					isDarkModal
				/>
			}
			{isShowEditMemberModal
				&& <AppModal
					component={EditMember}
					outerProps={{
						onSubmit: onEditMember,
						schema,
						countries,
						departments,
						positions,
						isLoading,
						member: selectedMember,
						changeMemberStatus: onChangeMemberStatus,
					}}
					title='Edit a member'
					onClose={toggleEditModal}
					staticBackdrop={false}
					width='675px'
					isDarkModal
				/>
			}
			{isShowConfirm
				&& <AppModal
					className='confirm-pop-up'
					onClose={toggleConfirm}
					title={confirmMessage}
					outerProps={{
						successConfirm: onDeleteMember,
						onClose: toggleConfirm,
					}}
					component={Confirm}
				/>
			}
			{isLoading && <LoadingOverlay/>}
		</div>
	);
};

CompanyMembersHOC.propTypes = {
	getCountries: func.isRequired,
	getDepartments: func.isRequired,
	getPositions: func.isRequired,
	addNewMember: func.isRequired,
	getAllMembers: func.isRequired,
	changeMemberStatus: func.isRequired,
	editMember: func.isRequired,
	deleteMember: func.isRequired,
	countries: arrayOf(countryType),
	departments: arrayOf(departmentType),
	positions: arrayOf(positionType),
	isLoading: bool.isRequired,
	members: array,
	maxMembers: number,
	isTrial: bool,
};

export default connect(({
	common: {
		countries,
		departments,
		positions,
	},
	settings: {
		isLoading,
		members,
	},
	auth,
}) => {
	const user = auth?.user || getItemFromStorage('user');
	const maxMembers = user?.retailer?.paymentPlan?.memberGroup?.maxMembers;
	const isTrial = user?.retailer?.stripePaymentSettings?.isTrial;

	return {
		countries,
		departments,
		positions,
		isLoading,
		members,
		maxMembers,
		isTrial,
	};
}, {
	getCountries,
	getDepartments,
	getPositions,
	addNewMember,
	getAllMembers,
	changeMemberStatus,
	deleteMember,
	editMember,
})(memo(CompanyMembersHOC));
