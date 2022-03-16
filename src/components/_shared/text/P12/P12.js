import React from 'react';
import { bool, node, oneOfType, string } from 'prop-types';
import cn from 'classnames';

import './P12.scss';

const P12 = ({ children, bold, className }) => {
	const classes = cn('p12', { 'bold-theme': bold, [className]: !!className });

	return <div className={classes}>{children}</div>;
};

P12.defaultProps = {
	bold: '',
	className: '',
};

P12.propTypes = {
	children: node,
	bold: oneOfType([bool, string]),
	className: string,
};

export default P12;
