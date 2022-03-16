import React, { memo } from 'react';
import SortForStartups from '@components/_shared/SortForStartups';
import { bool, func, number, string } from 'prop-types';
import { connect } from 'react-redux';
import { setFieldForFilter, setFieldOutsideForFilter } from '@ducks/browse/action';

const SortForStartupsBrowseHOC = ({
	countOfRecords,
	sort,
	setFieldForFilter,
	setFieldOutsideForFilter,
	isAvailableToChat,
}) => {
	const onSelectChange = option => {
		const sortValue = option.value;
		const sortDirectionData = {
			field: 'sortDirection',
			data: 'asc',
		};

		if (sortValue === 'Rated' || sortValue === 'Added' || sortValue === 'Found')
			sortDirectionData.data = 'desc';

		const selectedValue = {
			field: 'sort',
			data: sortValue,
		};

		setFieldOutsideForFilter(sortDirectionData);
		setFieldForFilter(selectedValue);
	};

	const toggleIsAvailableToChat = () => {
		const selectedParams = {
			field: 'isAvailableToChat',
			data: !isAvailableToChat,
		};

		setFieldForFilter(selectedParams);
	};

	return (
		<SortForStartups
			countOfRecords={countOfRecords}
			sort={sort}
			isAvailableToChat={isAvailableToChat}
			onSelectChange={onSelectChange}
			toggleIsAvailableToChat={toggleIsAvailableToChat}
			countOfRecordsText='Startups found'
		/>
	);
};

const mapStateToProps = ({
	browse: {
		countOfRecords,
		filterCategories,
	},
}) => ({
	countOfRecords,
	sort: filterCategories.sort,
	isAvailableToChat: filterCategories.isAvailableToChat,
});

SortForStartupsBrowseHOC.propTypes = {
	countOfRecords: number,
	sort: string.isRequired,
	setFieldForFilter: func.isRequired,
	setFieldOutsideForFilter: func.isRequired,
	isAvailableToChat: bool.isRequired,
};

export default connect(mapStateToProps, {
	setFieldForFilter,
	setFieldOutsideForFilter,
})(memo(SortForStartupsBrowseHOC));
