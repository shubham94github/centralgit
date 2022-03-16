import React from 'react';
import { bool, node, oneOfType, string } from 'prop-types';
import cn from 'classnames';

import './S12.scss';

const S12 = ({ children, bold, className }) => {
	const classes = cn({ 'bold-theme': bold, [className]: !!className }, 's12');

	return <span className={classes}>{children}</span>;
};

S12.defaultProps = {
	bold: '',
	className: '',
};

S12.propTypes = {
	children: node,
	bold: oneOfType([bool, string]),
	className: string,
};

export default S12;
