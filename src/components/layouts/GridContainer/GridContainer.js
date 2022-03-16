import React, { memo } from 'react';
import { node, number, string } from 'prop-types';
import cn from 'classnames';

import './GridContainer.scss';

const GridContainer = ({
	children,
	customClassName,
	columns,
	gap,
	template,
	gridTemplateAreas,
}) => {
	const classes = cn('grid-container', {
		[customClassName]: !!customClassName,
	});

	return (
		<div
			className={classes}
			style={{
				gridTemplateColumns: template || `repeat(${columns}, 1fr)`,
				gridGap: gap,
				gridTemplateAreas: gridTemplateAreas,
			}}
		>
			{children}
		</div>
	);
};

GridContainer.defaultProps = {
	customClassName: '',
	columns: 1,
	gap: '5px 30px',
};

GridContainer.propTypes = {
	children: node,
	customClassName: string,
	columns: number,
	gap: string,
	template: string,
	gridTemplateAreas: string,
};

export default memo(GridContainer);
