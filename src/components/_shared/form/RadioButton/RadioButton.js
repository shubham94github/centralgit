import React, { useRef } from 'react';
import { bool, func, number, oneOfType, string } from 'prop-types';

import './RadioButton.scss';

function RadioButton({
	id,
	name,
	value,
	label,
	isLabelBefore,
	defaultChecked,
	register,
	disabled,
	checked,
	isFilter,
	onChange,
}) {
	const labelRef = useRef();

	const handleLabelClick = () => labelRef.current.click();

	return (
		<div className='radio-button-container'>
			{label && isLabelBefore
				&& <span
					className='radio-label'
					onClick={handleLabelClick}
				>
					{label}
				</span>
			}
			<label
				htmlFor={id}
				className={`radio-button${disabled ? ' disabled' : ''}`}
				ref={labelRef}
			>
				{
					isFilter
						? <input
							id={id}
							name={name}
							value={value}
							type='radio'
							disabled={disabled}
							checked={checked}
							onChange={onChange(value)}
						/>
						: <input
							id={id}
							name={name}
							value={value}
							type='radio'
							defaultChecked={defaultChecked}
							ref={register}
							disabled={disabled}
							checked={checked}
							onChange={onChange(value)}
						/>
				}
				<span className='checked'/>
			</label>
			{label && !isLabelBefore
				&& <span
					className='label'
					onClick={handleLabelClick}
				>
					{label}
				</span>
			}
		</div>
	);
}

RadioButton.propTypes = {
	id: oneOfType([string, number]),
	name: string,
	value: oneOfType([string, number]),
	label: oneOfType([string, number]),
	isLabelBefore: bool,
	defaultChecked: bool,
	register: func,
	disabled: bool,
	checked: bool,
	isFilter: bool,
	onChange: func,
};

RadioButton.defaultProps = {
	isFilter: false,
	onChange: () => {},
};

export default RadioButton;
