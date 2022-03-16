import React, { memo } from 'react';
import { bool, element, func, node, oneOfType, string } from 'prop-types';
import { stopPropagation } from '@utils';
import cn from 'classnames';

import './Checkbox.scss';

const Checkbox = ({
	checked,
	classNames,
	disabled,
	isIndefinite,
	label,
	name,
	onChange,
	readOnly,
	register,
	isSelectedAndDisabled,
}) => {
	const classes = cn('checkbox-container', {
		[classNames]: !!classNames,
		'indefinite': isIndefinite,
		'disabled': disabled,
		'selected-disabled': isSelectedAndDisabled,
	});

	const handleOnChange = e => {
		if (readOnly) return;

		onChange(e);
	};

	return (
		<div className={classes} onClick={stopPropagation}>
			<input
				checked={checked}
				className='checkbox'
				disabled={disabled || isSelectedAndDisabled}
				id={name}
				name={name}
				onChange={handleOnChange}
				readOnly={readOnly}
				ref={register}
				type='checkbox'
			/>
			<label className='checkbox-label' htmlFor={name}>
				{label}
			</label>
		</div>
	);
};

Checkbox.defaultProps = {
	onChange: () => {},
	readOnly: false,
	isSelectedAndDisabled: false,
};

Checkbox.propTypes = {
	checked: bool,
	classNames: string,
	disabled: bool,
	isIndefinite: bool,
	label: oneOfType([string, node, element]),
	name: string,
	onChange: func,
	readOnly: bool,
	register: func,
	isSelectedAndDisabled: bool,
};

export default memo(Checkbox);
