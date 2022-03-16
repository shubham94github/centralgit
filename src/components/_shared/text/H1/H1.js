import React from 'react';
import { bool, func, node, oneOfType, string } from 'prop-types';
import cn from 'classnames';

import './H1.scss';

const H1 = ({ children, bold, className, onClick }) => {
	const classes = cn('h1', { 'bold-theme': bold, [className]: !!className });

	return <h1 onClick={onClick} className={classes}>{children}</h1>;
};

H1.defaultProps = {
	bold: '',
	className: '',
	onClick: () => {},
};

H1.propTypes = {
	children: node,
	bold: oneOfType([bool, string]),
	className: string,
	onClick: func,
};

export default H1;
