import React, { memo } from 'react';
import { setFieldForFilter } from '@ducks/browse/action';
import { connect } from 'react-redux';
import { array, func, string, shape } from 'prop-types';
import FieldItem from '@components/BrowsePage/SearchPanel/CheckboxFilters/FieldItem';

const CheckboxFilters = ({
	fieldName,
	fields,
	fieldsCheckbox,
	setFieldForFilter,
}) => {
	const selectedValues = fieldsCheckbox[fieldName];

	const onChangeHandler = value => () => {
		const changedSelectedValues = selectedValues.includes(value)
			? selectedValues.filter(selectedValue => selectedValue !== value)
			: [...selectedValues, value];
		const data = {
			field: fieldName,
			data: changedSelectedValues,
		};

		setFieldForFilter(data);
	};

	return (
		fields.map(({ value, label, id }) => (
			<FieldItem
				value={value}
				key={id}
				label={label}
				onChangeHandler={onChangeHandler}
				selectedValues={selectedValues}
			/>
		))
	);
};

CheckboxFilters.propTypes = {
	fieldName: string.isRequired,
	fields: array.isRequired,
	fieldsCheckbox: shape({
		businessModel: array.isRequired,
		companyStatus: array.isRequired,
		targetMarket: array.isRequired,
	}),
	setFieldForFilter: func.isRequired,
};

const mapStateToProps = ({
	browse: {
		filterCategories: {
			businessModel,
			companyStatus,
			targetMarket,
			narrowCategories,
		},
	},
}) => ({
	fieldsCheckbox: {
		businessModel,
		companyStatus,
		targetMarket,
		narrowCategories,
	},
});

export default connect(mapStateToProps, {
	setFieldForFilter,
})(memo(CheckboxFilters));
