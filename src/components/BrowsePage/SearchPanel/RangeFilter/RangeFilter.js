import React, { memo, useEffect, useState } from 'react';
import Range from '@components/_shared/form/Range';
import { connect } from 'react-redux';
import { setFieldForFilter } from '@ducks/browse/action';
import { array, func, shape, string } from 'prop-types';
import { extremesForRangesTypes } from '@constants/types';
import { isEmpty } from '@utils/js-helpers';

const RangeFilter = ({
	fieldName,
	setFieldForFilter,
	fieldsRange,
	extremesForRanges,
}) => {
	const selectedValues = fieldsRange[fieldName];
	const minRange = extremesForRanges[`${fieldName}Min`] || 0;
	const maxRange = extremesForRanges[`${fieldName}Max`] || 0;
	const [defaultValue, setDefaultValue] = useState([minRange, maxRange]);

	const onChangeHandler = value => {
		if (value[0] !== defaultValue[0] || value[1] !== defaultValue[1]) {
			const data = {
				field: fieldName,
				data: [value[0], value[1]],
			};

			setFieldForFilter(data);
		}
	};

	useEffect(() => {
		if (!isEmpty(selectedValues)) setDefaultValue([selectedValues[0], selectedValues[1]]);
	}, [selectedValues]);

	return (
		<Range
			onChangeHandler={onChangeHandler}
			min={minRange}
			max={maxRange}
			defaultValue={defaultValue}
		/>
	);
};

RangeFilter.propTypes = {
	fieldName: string.isRequired,
	setFieldForFilter: func.isRequired,
	fieldsRange: shape({
		numberOfClients: array.isRequired,
		totalFundingAmount: array.isRequired,
	}),
	extremesForRanges: extremesForRangesTypes,
};

const mapStateToProps = ({
	browse: {
		filterCategories: {
			numberOfClients,
			totalFundingAmount,
		},
	},
}) => ({
	fieldsRange: {
		numberOfClients,
		totalFundingAmount,
	},
});

export default connect(mapStateToProps, {
	setFieldForFilter,
})(memo(RangeFilter));
