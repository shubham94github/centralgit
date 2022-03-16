import React, { memo } from 'react';
import { bool, string } from 'prop-types';
import { Spinner } from 'react-bootstrap';
import cn from 'classnames';

import './LoadingOverlay.scss';

const LoadingOverlay = ({
	classNames,
	isCentered,
}) => {
	const styles = cn(
		'loading-overlay',
		{
			[classNames]: classNames && classNames,
			'centered': isCentered,
		},
	);

	return (
		<div className={styles}>
			<div className='spinner'>
				<Spinner
					animation='border'
					variant='danger'
					className='spinner-border-lg'
				/>
			</div>
		</div>
	);
};

LoadingOverlay.propTypes = {
	classNames: string,
	isCentered: bool,
};

export default memo(LoadingOverlay);
