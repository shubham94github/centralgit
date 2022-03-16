import React from 'react';
import { bool, func, node, oneOfType, string } from 'prop-types';
import cn from 'classnames';

import './S16.scss';

const S16 = ({ children, bold, className, onClick }) => {
	const classes = cn('s16', { 'bold-theme': bold, [className]: !!className });

	return <span className={classes} onClick={onClick}>{children}</span>;
};

S16.defaultProps = {
	bold: '',
	className: '',
	onClick: () => {},
};

S16.propTypes = {
	children: node,
	bold: oneOfType([bool, string]),
	className: string,
	onClick: func,
};

export default S16;
