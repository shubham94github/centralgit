import React, { memo } from 'react';
import { Icons } from '@icons';
import { colors } from '@colors';
import { bool, func, number } from 'prop-types';
import cn from 'classnames';
import Tooltip from '@components/_shared/Tooltip';
import { useLocation } from 'react-router-dom';

import './AddNewMemberCard.scss';

const AddNewMemberCard = ({
	toggleModal,
	isDisabledButtonAddNewMember,
	maxMembers,
	isTrial,
}) => {
	const location = useLocation();
	const isDisabledMember = isDisabledButtonAddNewMember || isTrial;
	const plusIcon = Icons.plus(isDisabledMember ? colors.gray40 : colors.white);
	const classnamesIcon = cn('icon', { 'disabled': isDisabledMember });
	const isAdminPanel = location.pathname.includes('admin-panel');

	const addNewMember = () => {
		if (isDisabledMember) return;

		toggleModal();
	};

	return (
		<div
			className='add-member-card'
			onClick={addNewMember}
		>
			<Tooltip
				className='tooltip-add-member'
				placement='bottom-start'
				isVisibleTooltip={isDisabledMember}
				message={
					<span className='max-width-tooltip'>
						{isTrial
							? isAdminPanel
								? <>
									This User is on a Trial Period.
									<br/>
									You can't create members for
									<br/>
									him right now.
								</>
								: <>
									You can't create members during
									<br/>
									your Trial Period.
								</>
							:<>
								Current payment plan doesn’t allow you
								<br/>
								to create new members.
								<br/>
								{!!maxMembers && <>Change it or delete an existed member.</>}
							</>}
					</span>
				}
			>
				<div className={classnamesIcon}>{plusIcon}</div>
			</Tooltip>
			<div className='text'>Add a new Member</div>
		</div>
	);
};

AddNewMemberCard.defaultProps = {
	isDisabledButtonAddNewMember: false,
	isTrial: true,
};

AddNewMemberCard.propTypes = {
	toggleModal: func.isRequired,
	isDisabledButtonAddNewMember: bool,
	maxMembers: number,
	isTrial: bool,
};

export default memo(AddNewMemberCard);
