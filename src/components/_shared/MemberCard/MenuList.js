import React, { memo } from 'react';
import { func } from 'prop-types';

const MenuList = ({ handleDeleteMember, handleEditMember, toggleClickDropdown }) => {
	const editMember = () => {
		toggleClickDropdown();
		handleEditMember();
	};

	const deleteMember = () => {
		toggleClickDropdown();
		handleDeleteMember();
	};

	return (
		<ul className='menu-list'>
			<li className='menu-list__item' onClick={editMember}>Edit</li>
			<li className='menu-list__item' onClick={deleteMember}>Delete</li>
		</ul>
	);
};

MenuList.propTypes = {
	handleDeleteMember: func.isRequired,
	handleEditMember: func.isRequired,
	toggleClickDropdown: func.isRequired,
};

export default memo(MenuList);
