import React, { memo } from 'react';
import { number, oneOfType, string } from 'prop-types';
import cn from 'classnames';

import './PillCounter.scss';

function PillCounter({ counter, className }) {
	const classes = cn('pill-counter', { [className]: !!className });

	return (
		<div className={classes}>
			{counter}
		</div>
	);
}

PillCounter.propTypes = {
	counter: oneOfType([number, string]),
	className: string,
};

export default memo(PillCounter);
