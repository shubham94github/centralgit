import React  from 'react';
import { bool, func, number, oneOfType, string } from 'prop-types';
import SliderCheckbox from '@components/_shared/form/SliderCheckbox';
import { discountCouponsStatuses } from '@components/AdminPanel/SubscriptionPlans/DiscountCoupons/constants';

const { cancelled } = discountCouponsStatuses;

const DropdownList = ({
	editCoupon,
	removeCoupon,
	cancelCoupon,
	toggleActivation,
	isPossibilityRemove,
	isBlocked,
	status,
}) => {
	const isCancelledStatus = status === cancelled;

	return (
		<div className='dropdown-list'>
			<div className='dropdown-item' onClick={editCoupon}>Edit</div>
			{isPossibilityRemove
				&& <div className='dropdown-item' onClick={removeCoupon}>Delete</div>
			}
			{!isCancelledStatus
				&& <>
					{!isPossibilityRemove
						&& <div className='dropdown-item' onClick={cancelCoupon}>Cancel</div>
					}
					<div className='dropdown-item slider'>
						<span>Activate</span>
						<SliderCheckbox
							checked={!isBlocked}
							onChange={toggleActivation}
						/>
					</div>
				</>
			}
		</div>
	);
};

DropdownList.propTypes = {
	id: oneOfType([string, number]),
	editCoupon: func,
	removeCoupon: func,
	cancelCoupon: func,
	toggleActivation: func,
	isPossibilityRemove: bool,
	isBlocked: bool,
	status: string.isRequired,
};

export default DropdownList;
