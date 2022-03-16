import React from 'react';
import { bool, func, node, oneOfType, string } from 'prop-types';
import cn from 'classnames';

import './H3.scss';

const H3 = ({ children, bold, className, onClick }) => {
	const classes = cn('h3', { 'bold-theme': bold, [className]: !!className });

	return <h3 onClick={onClick} className={classes}>{children}</h3>;
};

H3.defaultProps = {
	bold: '',
	className: '',
	onClick: () => {},
};

H3.propTypes = {
	children: node,
	bold: oneOfType([bool, string]),
	className: string,
	onClick: func,
};

export default H3;
