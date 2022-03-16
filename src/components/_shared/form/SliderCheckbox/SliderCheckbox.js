import React, { memo } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

import './SliderCheckbox.scss';

function SliderCheckbox({
	onChange,
	id,
	label,
	checked,
	isClickableLabel,
	disabled,
	isLabelBefore,
}) {
	const handleChange = ({ target: { checked } }) => onChange(id, checked);

	const handleClickLabel = value => {
		if (!isClickableLabel) return;

		onChange(value);
	};

	return (
		<label htmlFor={id} className={cn('slider-checkbox-container', { 'label-before': isLabelBefore })}>
			{label && isLabelBefore
				&& <span
					className='label'
					onClick={isClickableLabel ? onChange : () => {}}
				>
					{label}
				</span>
			}
			<label htmlFor={id} className='custom-checkbox-slider'/>
			<input
				id={id}
				name='checkbox'
				type='checkbox'
				checked={ checked }
				onChange={handleChange}
				disabled={disabled}
				className='back-checkbox'
			/>
			{label && !isLabelBefore
				&& <span
					className='label'
					onClick={handleClickLabel}
				>
					{label}
				</span>
			}
		</label>
	);
}

SliderCheckbox.defaultProps = {
	id: '',
	label: '',
	checked: false,
	onChange: () => {},
	isClickableLabel: false,
	disabled: false,
	isLabelBefore: false,
};

SliderCheckbox.propTypes = {
	id: PropTypes.string.isRequired,
	label: PropTypes.string,
	checked: PropTypes.bool.isRequired,
	onChange: PropTypes.func,
	isClickableLabel: PropTypes.bool,
	disabled: PropTypes.bool,
	isLabelBefore: PropTypes.bool,
};

export default memo(SliderCheckbox);
