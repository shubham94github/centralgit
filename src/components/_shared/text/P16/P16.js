import React from 'react';
import { bool, func, node, oneOfType, string } from 'prop-types';
import cn from 'classnames';

import './P16.scss';

const P16 = ({ children, bold, className, onClick }) => {
	const classes = cn('p16', { 'bold-theme': bold, [className]: !!className });

	return <p onClick={onClick} className={classes}>{children}</p>;
};

P16.defaultProps = {
	bold: '',
	className: '',
	onClick: () => {},
};

P16.propTypes = {
	children: node,
	bold: oneOfType([bool, string]),
	className: string,
	onClick: func,
};

export default P16;
