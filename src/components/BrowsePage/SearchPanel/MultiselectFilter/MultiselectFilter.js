import React, { memo, useCallback, useEffect, useState } from 'react';
import { array, bool, func, string } from 'prop-types';
import { connect } from 'react-redux';
import { setFieldForFilter } from '@ducks/browse/action';
import Select from '@components/_shared/form/Select';
import prepareSelectStyles from '@components/_shared/form/Select/prepareSelectStyles';

const MultiselectFilter = ({
	setFieldForFilter,
	options,
	selectedValues,
	placeholder,
	fieldName,
	keyValue,
	isAssociatedTag,
}) => {
	const isFilterForStart = (fieldName === 'countryIds') || (fieldName === 'presenceInCountriesIds');

	const getSelectedOptions = useCallback(() => {
		return options.filter(obj => selectedValues.includes(obj[keyValue]));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [options, selectedValues]);

	const [initialOptions, setInitialOptions] = useState(getSelectedOptions);

	const onSelectChange = value => {
		const selectedIds = Array.isArray(value) ? value.map(obj => obj[keyValue]) : [];
		const data = {
			field: fieldName,
			data: selectedIds,
		};

		setFieldForFilter(data);
	};

	useEffect(() => setInitialOptions(getSelectedOptions), [setInitialOptions, getSelectedOptions]);

	return (
		<div className='item-style'>
			<Select
				isFilter={true}
				options={options}
				placeholder={placeholder}
				isMulti={true}
				isSearchable={true}
				isCreateable={false}
				onChange={onSelectChange}
				value={initialOptions}
				menuPlacement='auto'
				isFilterForStart={isFilterForStart}
				{...isAssociatedTag
					? { customStyles: prepareSelectStyles(null, null, null, true) }
					: {}
				}
			/>
		</div>
	);
};

MultiselectFilter.propTypes = {
	options: array,
	setFieldForFilter: func.isRequired,
	selectedValues: array.isRequired,
	placeholder: string,
	keyValue: string,
	fieldName: string.isRequired,
	isAssociatedTag: bool,
};

MultiselectFilter.defaultProps = {
	options: [],
	placeholder: '',
	keyValue: 'id',
};
export default connect(null, {
	setFieldForFilter,
})(memo(MultiselectFilter));
