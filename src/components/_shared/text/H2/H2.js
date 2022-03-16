import React from 'react';
import { bool, func, node, oneOfType, string } from 'prop-types';
import cn from 'classnames';

import './H2.scss';

const H2 = ({ children, bold, className, onClick }) => {
	const classes = cn('h2', { 'bold-theme': bold, [className]: !!className });

	return <h2 onClick={onClick} className={classes}>{children}</h2>;
};

H2.defaultProps = {
	bold: '',
	className: '',
	onClick: () => {},
};

H2.propTypes = {
	children: node,
	bold: oneOfType([bool, string]),
	className: string,
	onClick: func,
};

export default H2;
