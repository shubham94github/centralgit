import React from 'react';

export const getCategoryIcon = icon => {
	if (icon?.image) {
		return (
			<div className='category-icon'>
				<img
					className='icon'
					src={icon?.image}
					alt='icon of category'
				/>
			</div>
		);
	}

	return '';
};
