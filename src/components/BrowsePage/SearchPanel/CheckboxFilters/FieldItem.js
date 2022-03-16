import React, { memo, useEffect, useState } from 'react';
import Checkbox from '@components/_shared/form/Checkbox';
import { string, oneOfType, number, func, array } from 'prop-types';

const FieldItem = ({ value, label, onChangeHandler, selectedValues }) => {
	const [isChecked, setIsChecked] = useState(false);

	useEffect(() => {
		setIsChecked(selectedValues.includes(value));
	}, [selectedValues, value]);

	return (
		<Checkbox
			label={label}
			name={value}
			onChange={onChangeHandler(value)}
			classNames='checkbox-style'
			checked={isChecked}
		/>
	);
};

FieldItem.propTypes = {
	value: oneOfType([number, string]),
	label: string.isRequired,
	onChangeHandler: func.isRequired,
	selectedValues: array.isRequired,
};

export default memo(FieldItem);
