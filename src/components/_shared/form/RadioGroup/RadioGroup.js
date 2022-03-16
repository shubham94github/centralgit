import React, { memo } from 'react';
import { arrayOf, func, number, object, oneOfType, string } from 'prop-types';
import cn from 'classnames';
import RadioButton from '@components/_shared/form/RadioButton/RadioButton';

import './RadioGroup.scss';

const RadioGroup = ({
	name,
	buttons,
	marginRight,
	register,
	disabledIndex,
	defaultChecked,
}) => {
	const classes = index => cn('radio-button-container d-flex text-nowrap mb-1', {
		'radio-button_disabled': disabledIndex.includes(index),
	});

	return (
		<div className='d-flex flex-wrap'>
			{buttons.map((button, index) => (
				<div
					key={index}
					className={classes(index)}
					style={{ marginRight }}
				>
					<RadioButton
						id={button.value + index}
						type='radio'
						name={name}
						value={button.value}
						defaultChecked={defaultChecked === button.value}
						register={register}
						disabled={disabledIndex.includes(index)}
					/>
					<label
						htmlFor={button.value + index}
						className='d-flex justify-content-center align-items-center radio-group-text'
					>
						{button.text}
					</label>
				</div>
			))}
		</div>
	);
};

RadioGroup.defaultProps = {
	marginRight: '15px',
	disabledIndex: [],
};

RadioGroup.propTypes = {
	name: string,
	buttons: arrayOf(object).isRequired,
	marginRight: string,
	disabledIndex: arrayOf(number),
	register: func,
	defaultChecked: oneOfType([string, number]),
};

export default memo(RadioGroup);
