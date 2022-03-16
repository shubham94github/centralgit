import React, { memo, useEffect } from 'react';
import { connect } from 'react-redux';
import { array, bool, func, number, object } from 'prop-types';
import { changeFilterOfRatedStartups, getRatedStartups } from '@ducks/admin/actions';
import ListOfStartup from '@components/_shared/ListOfStartup';
import SortForStartups from '@components/_shared/SortForStartups';

import './ListOfRatedStartupsHOC.scss';

const ListOfRatedStartupsHOC = ({
	startups,
	countOfRecords,
	isLoadingListOfStartups,
	changeFilterOfRatedStartups,
	filterRated,
	getRatedStartups,
}) => {
	const onSelectChange = option => {
		const selectedValue = {
			field: 'fieldName',
			data: option.value,
		};

		changeFilterOfRatedStartups(selectedValue);
	};

	useEffect(() => {
		if (!startups.length) getRatedStartups({ filterRated });
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<div className='admin-rated-startups-container'>
			<div className='sort-section'>
				<SortForStartups
					countOfRecords={countOfRecords}
					sort={filterRated.sort.fieldName}
					onSelectChange={onSelectChange}
					countOfRecordsText='Startups rated by this Company'
					isAdmin
				/>
			</div>
			<ListOfStartup
				startups={startups}
				isLoading={isLoadingListOfStartups}
				countOfRecords={countOfRecords}
				page={filterRated.page}
				pageSize={filterRated.pageSize}
				setFieldForFilter={changeFilterOfRatedStartups}
				width='880px'
				emptyStartupsMessage='No Rated Startups'
				isAdmin
			/>
		</div>
	);
};

ListOfRatedStartupsHOC.propTypes = {
	startups: array.isRequired,
	countOfRecords: number,
	isLoadingListOfStartups: bool,
	changeFilterOfRatedStartups: func.isRequired,
	filterRated: object.isRequired,
	getRatedStartups: func.isRequired,
};

const mapStateToProps = ({
	admin: {
		ratedStartups: {
			startups,
			countOfRecords,
		},
		filterRated,
		isLoadingListOfStartups,
	},
}) => ( {
	startups,
	countOfRecords,
	isLoadingListOfStartups,
	filterRated,
});

export default connect(mapStateToProps, {
	getRatedStartups,
	changeFilterOfRatedStartups,
})(memo(ListOfRatedStartupsHOC));
