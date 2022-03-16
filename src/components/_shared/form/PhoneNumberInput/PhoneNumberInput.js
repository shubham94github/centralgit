
import React, { memo } from 'react';
import { bool, func, number, object, oneOfType, string } from 'prop-types';
import PhoneInputWithCountry from 'react-phone-number-input/react-hook-form';
import flags from 'react-phone-number-input/flags';
import cn from 'classnames';

import 'react-phone-number-input/style.css';
import './PhoneNumberInput.scss';

function PhoneNumberInput({
	id,
	inputType,
	name,
	classes,
	disabled,
	onChange,
	onBlurHandler,
	onFocusHandler,
	placeholder,
	readOnly,
	value,
	control,
}) {
	const classNames = cn('phone-number-input', {
		'phone-number-input__disabled': disabled,
		[classes]: !!classes,
	});

	const handleOnChange = e => {
		if (onChange) onChange(e);
	};

	return (
		<div className={classNames}>
			{!!value && <div className='phone-number-top-placeholder'>{placeholder}</div>}
			<PhoneInputWithCountry
				international
				countrySelectProps={{ unicodeFlags: false }}
				flags={flags}
				id={id}
				type={inputType}
				name={name}
				placeholder={placeholder}
				value={value}
				onChange={handleOnChange}
				onBlur={onBlurHandler}
				onFocus={onFocusHandler}
				readOnly={readOnly}
				disabled={disabled}
				control={control}
			/>
		</div>
	);
}

PhoneNumberInput.propTypes = {
	id: oneOfType([string, number]),
	inputType: string,
	name: string,
	classes: string,
	disabled: bool,
	onChange: func,
	onBlurHandler: func,
	onFocusHandler: func,
	placeholder: string,
	register: func,
	isEditable: bool,
	isEdit: bool,
	readOnly: bool,
	value: string,
	control: object,
};

export default memo(PhoneNumberInput);
