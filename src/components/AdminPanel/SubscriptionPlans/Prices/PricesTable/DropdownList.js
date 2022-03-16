import React  from 'react';
import { func, number, oneOfType, string } from 'prop-types';

const DropdownList = ({
	id,
	editPrice,
	deletePrice,
	usingCount,
}) => {
	const onEdit = () => editPrice(id);
	const onDelete = () => deletePrice(id);

	return (
		<div className='dropdown-list'>
			<div className='dropdown-item' onClick={onEdit}>Edit</div>
			{!usingCount && <div className='dropdown-item' onClick={onDelete}>Delete</div>}
		</div>
	);
};

DropdownList.propTypes = {
	id: oneOfType([string, number]),
	editPrice: func,
	deletePrice: func,
	usingCount: number,
};

export default DropdownList;
