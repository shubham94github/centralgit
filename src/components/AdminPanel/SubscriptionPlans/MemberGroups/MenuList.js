import React, { memo } from 'react';
import S16 from '@components/_shared/text/S16';
import { func, number } from 'prop-types';

import './MenuList.scss';

const MenuList = ({ handleEdit, handleDelete, usingCount }) => (
	<ul className='member-groups-menu-list'>
		<li className='member-groups-menu-list__item'>
			<div onClick={handleEdit}>
				<S16>Edit</S16>
			</div>
		</li>
		{!usingCount
			&& <li className='member-groups-menu-list__item'>
				<div onClick={handleDelete}>
					<S16>Delete</S16>
				</div>
			</li>
		}
	</ul>
);

MenuList.propTypes = {
	handleEdit: func.isRequired,
	handleDelete: func.isRequired,
	usingCount: number,
};

export default memo(MenuList);
