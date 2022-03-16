import React, { memo } from 'react';
import RadioButton from '@components/_shared/form/RadioButton';
import { connect } from 'react-redux';
import { setFieldForFilter } from '@ducks/browse/action';
import { array, func, string } from 'prop-types';

const RadioFilter = ({ fieldName, fields, checkedValue, setFieldForFilter }) => {
	const onChangeHandler = value => () => {
		const data = {
			field: fieldName,
			data: value,
		};
		setFieldForFilter(data);
	};

	return fields.map(({ value, label, id }) => (
		<div key={id} className='item-style'>
			<RadioButton
				isFilter={true}
				id={id}
				value={value}
				disabled={false}
				onChange={onChangeHandler}
				checked={checkedValue === value}
				label={label}
			/>
		</div>),
	);
};

RadioFilter.propTypes = {
	fieldName: string.isRequired,
	fields: array.isRequired,
	checkedValue: string.isRequired,
	setFieldForFilter: func.isRequired,
};

export default connect(null, {
	setFieldForFilter,
})(memo(RadioFilter));
