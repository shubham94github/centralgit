import React from 'react';
import { bool, func, node, oneOfType, string } from 'prop-types';
import cn from 'classnames';

import './S18.scss';

const S18 = ({ children, bold, className, onClick }) => {
	const classes = cn('s18', { 'bold-theme': bold, [className]: !!className });

	return <span className={classes} onClick={onClick}>{children}</span>;
};

S18.defaultProps = {
	bold: '',
	className: '',
	onClick: () => {},
};

S18.propTypes = {
	children: node,
	bold: oneOfType([bool, string]),
	className: string,
	onClick: func,
};

export default S18;
