import React from 'react';
import { string, node, bool, oneOfType, func } from 'prop-types';
import cn from 'classnames';

import './P14.scss';

const P14 = ({ children, bold, className, onClick }) => {
	const classes = cn('p14', { 'bold-theme': bold, [className]: !!className });

	return <p onClick={onClick} className={classes}>{children}</p>;
};

P14.defaultProps = {
	bold: '',
	className: '',
	onClick: () => {},
};

P14.propTypes = {
	children: node,
	bold: oneOfType([bool, string]),
	className: string,
	onClick: func,
};

export default P14;
