import React, { memo } from 'react';
import { connect } from 'react-redux';
import { setFieldForFilter } from '@ducks/browse/action';
import DatePicker from '@components/_shared/form/DatePicker';
import { array, func } from 'prop-types';
import { isEmpty } from '@utils/js-helpers';

const Found = ({ setFieldForFilter, founded }) => {
	const onDateChange = date => {
		const data = {
			field: 'founded',
			data: [+date.startDate, +date.endDate],
		};

		setFieldForFilter(data);
	};

	return (
		<div className='item-style date-range'>
			<DatePicker
				isSingleDate={false}
				onChange={onDateChange}
				maxDate={new Date()}
				dateFrom={founded[0]}
				dateTo={founded[1]}
				isVisibleRange={!isEmpty(founded)}
			/>
		</div>
	);
};

Found.propTypes = {
	setFieldForFilter: func.isRequired,
	founded: array.isRequired,
};

const mapStateToProps = ({ browse: { filterCategories } }) => ({
	founded: filterCategories.founded,
});

export default connect(mapStateToProps, {
	setFieldForFilter,
})(memo(Found));
