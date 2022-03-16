import React  from 'react';
import { bool, func, number, oneOfType, string } from 'prop-types';
import { S16 } from '@components/_shared/text';
import SliderCheckbox from '@components/_shared/form/SliderCheckbox';

const DropdownList = ({
	id,
	editPrice,
	deletePrice,
	isAbleToDelete,
	changePaymentPlanStatus,
	isHidden,
}) => {
	const onEdit = () => editPrice(id);
	const onDelete = () => deletePrice(id);

	return (
		<div className='dropdown-list'>
			<div className='dropdown-item' onClick={onEdit}>Edit</div>
			{isAbleToDelete && <div className='dropdown-item' onClick={onDelete}>Delete</div>}
			<div className='menu-list__slider-item'>
				<S16 className='item-title'>Enabled</S16>
				<SliderCheckbox
					id={id.toString()}
					checked={!isHidden}
					onChange={changePaymentPlanStatus}
				/>
			</div>
		</div>
	);
};

DropdownList.propTypes = {
	id: oneOfType([string, number]),
	editPrice: func,
	deletePrice: func,
	isAbleToDelete: bool,
	changePaymentPlanStatus: func,
	isHidden: bool,
};

export default DropdownList;
