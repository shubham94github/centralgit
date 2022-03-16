import React, { forwardRef, memo } from 'react';
import { func, node } from 'prop-types';

import './CustomDropdown.scss';

const CustomToggleDropdown = forwardRef(({ children, onClick }, ref) => {
	const handleClick = e => {
		e.preventDefault();
		onClick(e);
	};

	return (
		<div
			ref={ref}
			onClick={handleClick}
		>
			{children}
		</div>
	);
});

CustomToggleDropdown.propTypes = {
	children: node,
	onClick: func.isRequired,
};

export default memo(CustomToggleDropdown);
