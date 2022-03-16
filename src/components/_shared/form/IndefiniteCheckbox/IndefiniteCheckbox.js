import React, { memo } from 'react';
import { bool, func, node, string } from 'prop-types';
import { stopPropagation } from '@utils';
import cn from 'classnames';

import './IndefiniteCheckbox.scss';

const IndefiniteCheckbox = ({
	name,
	label,
	disabled,
	register,
	onChange,
	classNames,
	isIndefinite,
	value,
}) => {
	const classes = cn('checkbox-container', {
		[classNames]: !!classNames,
		'indefinite': isIndefinite,
	});

	return (
		<div className={classes} onClick={stopPropagation}>
			<input
				type='checkbox'
				className='checkbox'
				id={name}
				name={name}
				onChange={onChange}
				disabled={disabled}
				ref={register}
				checked={value}
			/>
			<label className='checkbox-label' htmlFor={name}>
				{label}
			</label>
		</div>
	);
};

IndefiniteCheckbox.defaultValues = {
	onChange: () => {},
};

IndefiniteCheckbox.propTypes = {
	name: string,
	value: bool,
	label: node,
	disabled: bool,
	onChange: func,
	register: func,
	classNames: string,
	isIndefinite: bool,
};

export default memo(IndefiniteCheckbox);
