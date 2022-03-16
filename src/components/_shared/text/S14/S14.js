import React from 'react';
import { bool, func, node, oneOfType, string } from 'prop-types';
import cn from 'classnames';

import './S14.scss';

const S14 = ({ children, bold, className, onClick }) => {
	const classes = cn('s14', { 'bold-theme': bold, [className]: !!className });

	return <span onClick={onClick} className={classes}>{children}</span>;
};

S14.defaultProps = {
	bold: '',
	className: '',
};

S14.propTypes = {
	children: node,
	bold: oneOfType([bool, string]),
	className: string,
	onClick: func,
};

export default S14;
