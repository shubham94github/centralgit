import React, { memo } from 'react';
import { func } from 'prop-types';
import S16 from '@components/_shared/text/S16';

import './MenuList.scss';

const MenuList = ({
	handleEditFeature,
	handleDeleteFeature,
}) => (
	<ul className='feature-menu-list'>
		<li className='feature-menu-list__item'>
			<div onClick={handleEditFeature}>
				<S16>Edit</S16>
			</div>
		</li>
		<li className='feature-menu-list__item'>
			<div onClick={handleDeleteFeature}>
				<S16>Delete</S16>
			</div>
		</li>
	</ul>
);

MenuList.propTypes = {
	handleEditFeature: func.isRequired,
	handleDeleteFeature: func.isRequired,
};

export default memo(MenuList);
