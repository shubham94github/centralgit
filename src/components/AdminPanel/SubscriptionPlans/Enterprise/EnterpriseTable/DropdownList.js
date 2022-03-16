import React  from 'react';
import { func, number, oneOfType, string } from 'prop-types';

import './DropdownList.scss';

const DropdownList = ({
	id,
	editEnterpriseCode,
}) => {
	const onEdit = () => editEnterpriseCode(id);

	return (
		<div className='dropdown-list'>
			<div className='dropdown-item' onClick={onEdit}>Edit</div>
		</div>
	);
};

DropdownList.propTypes = {
	id: oneOfType([string, number]),
	editEnterpriseCode: func,
};

export default DropdownList;
