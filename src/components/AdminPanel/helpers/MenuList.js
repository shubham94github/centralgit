import React, { memo } from 'react';
import { S14 } from '@components/_shared/text';
import SliderCheckbox from '@components/_shared/form/SliderCheckbox';
import { bool, number, func, string } from 'prop-types';
import enums from '@constants/enums';

import './MenuList.scss';

const {
	retailerEntrepreneur,
	retailerInvestor,
	retailerPrivatePerson,
} = enums.userRoles;

const { completedGettingStarted } = enums.gettingStartedStatusesAdminPanel;

const MenuList = ({
	id,
	isApprovedByAdmin,
	handleApprove,
	handleActivation,
	isBlocked,
	toggleClickDropdown,
	typeOfRole,
	role,
	status,
	isAdmin,
	handleEdit,
	isWithoutEdit,
}) => {
	const isStartup = typeOfRole === 'startup';
	const isCompletedGettingStarted = status === completedGettingStarted;
	const approveCondition = (isStartup
		? !isApprovedByAdmin
		: !isApprovedByAdmin
			&& (role === retailerEntrepreneur
				|| role === retailerInvestor
				|| role === retailerPrivatePerson
			))
		|| isAdmin;
	const individualsCondition = status !== 'Completed'
		&& (role === retailerEntrepreneur
		|| role === retailerInvestor
		|| role === retailerPrivatePerson);
	const itemClassName = !isCompletedGettingStarted
		&& (isStartup
		|| role === retailerEntrepreneur
		|| role === retailerInvestor
		|| role === retailerPrivatePerson)
		? 'menu-list__text-item'
		: 'menu-list__item';

	const onClickApprove = () => {
		if (!isCompletedGettingStarted) return;

		toggleClickDropdown();
		handleApprove();
	};

	return (
		<ul className='menu-list'>
			{approveCondition
				? <li className={itemClassName}>
					{!isCompletedGettingStarted && isStartup
						? <S14>To Approve Startup should finish all getting started steps</S14>
						: individualsCondition
							? <S14>
								To approve this account, please make sure
								all of the Getting Started steps have been completed
							</S14>
							: <div onClick={onClickApprove}>
								<S14>Approve</S14>
							</div>
					}
				</li>
				: <li className='menu-list__slider-item'>
					<S14 className='item-title'>Activate</S14>
					<SliderCheckbox
						id={id.toString()}
						checked={!isBlocked}
						onChange={handleActivation}
					/>
				</li>
			}
			{!isWithoutEdit
				&& <li className='menu-list__item' onClick={handleEdit}>
					<S14 className='item-title'>Edit</S14>
				</li>
			}
		</ul>
	);
};

MenuList.defaultProps = {
	id: null,
	isApprovedByAdmin: false,
	isBlocked: false,
	typeOfRole: '',
	role: '',
	status: '',
	isWithoutEdit: false,
};

MenuList.propTypes = {
	id: number,
	isApprovedByAdmin: bool,
	handleApprove: func,
	handleActivation: func,
	isBlocked: bool,
	toggleClickDropdown: func.isRequired,
	typeOfRole: string,
	role: string,
	status: string,
	isAdmin: bool,
	handleEdit: func,
	isWithoutEdit: bool,
};

export default memo(MenuList);
