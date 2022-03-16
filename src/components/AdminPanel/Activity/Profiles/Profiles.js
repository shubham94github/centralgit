import React, { memo, useEffect, useState } from 'react';
import MainTable from '@components/_shared/MainTable';
import { connect } from 'react-redux';
import { getProfilesActivity } from '@ducks/admin/actions';
import { array, bool, func, number } from 'prop-types';
import { getColumns } from './columns';
import { listOfFilters } from './listOfFilters';
import { schema } from './schema';
import ProfilesHeader from '@components/AdminPanel/Activity/Profiles/ProfilesHeader';
import { tableMetaType } from '@constants/types';
import { useHistory } from 'react-router-dom';

const Profiles = ({
	profilesActivity,
	profilesActivityCount,
	isLoading,
	profilesActivityTableMeta,
	getProfilesActivity,
}) => {
	const history = useHistory();
	const [pageCount, setPageCount] = useState(0);
	const [searchValue, setSearchValue] = useState(null);
	const columns = getColumns(history);

	useEffect(() => {
		getProfilesActivity(profilesActivityTableMeta);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		setPageCount(Math.ceil(profilesActivityCount / profilesActivityTableMeta.size));
	}, [profilesActivityCount, setPageCount, profilesActivityTableMeta.size]);

	const onSort = (column, direction) => getProfilesActivity({
		...profilesActivityTableMeta,
		sort: {
			direction: direction.toUpperCase(),
			fieldName: column.property,
		},
	});

	const onChangePage = page => getProfilesActivity({
		...profilesActivityTableMeta,
		page: page + 1,
	});

	const onChangeCountOfRecords = size => getProfilesActivity({
		...profilesActivityTableMeta,
		size,
		page: 1,
	});

	const onSearch = searchData => {
		if (!searchData.filterText) {
			const fieldsWithoutSearch = profilesActivityTableMeta.fields
				.filter(item => item.fieldName !== searchData.fieldName);

			getProfilesActivity({ ...profilesActivityTableMeta, fields: [ ...fieldsWithoutSearch ], page: 1 });
			setSearchValue(null);

			return;
		}

		if (!profilesActivityTableMeta.fields.find(item => item.fieldName === searchData.fieldName)) {
			getProfilesActivity({
				...profilesActivityTableMeta,
				fields: [
					...profilesActivityTableMeta.fields,
					{ ...searchData },
				],
				page: 1,
			});
		} else {
			const newReqData = profilesActivityTableMeta.fields.map(item => {
				if (item.fieldName === searchData.fieldName)
					return { fieldName: item.fieldName, filterText: searchData.filterText };

				return item;
			});

			getProfilesActivity({
				...profilesActivityTableMeta,
				fields: [ ...newReqData ],
				page: 1,
			});
		}

		setSearchValue(searchData);
	};

	const handleChangeFilter = filters => {
		const fields = Object.keys(filters).reduce((acc, key) => {
			if (filters[key]) {
				if (typeof filters[key].value === 'string')
					acc.push({ fieldName: key, filterText: filters[key].value });
				else if (typeof filters[key] === 'object')
					acc.push({ fieldName: key, filterDates: filters[key] });
			}

			return acc;
		}, []);

		getProfilesActivity({
			...profilesActivityTableMeta,
			page: 1,
			fields: searchValue
				? [...fields, searchValue]
				: [...fields],
		});
	};

	return (
		<div className='categories-activity-container'>
			<MainTable
				title='Profiles'
				columns={columns}
				data={profilesActivity}
				isLoading={isLoading}
				sortServer
				onSort={onSort}
				pageCount={pageCount}
				countOfRecords={profilesActivityCount}
				tableMeta={profilesActivityTableMeta}
				onChangePage={onChangePage}
				onChangeCountOfRecords={onChangeCountOfRecords}
				withPagination
				tableHeader={ProfilesHeader}
				onSearch={onSearch}
				listOfFilters={listOfFilters}
				filtersSchema={schema}
				handleChangeFilter={handleChangeFilter}
			/>
		</div>
	);
};

Profiles.defaultProps = {
	profilesActivity: [],
};

Profiles.propTypes = {
	profilesActivity: array,
	profilesActivityCount: number,
	isLoading: bool,
	profilesActivityTableMeta: tableMetaType.isRequired,
	getProfilesActivity: func.isRequired,
};

export default connect(({ admin: {
	profilesActivity,
	profilesActivityCount,
	isLoading,
	profilesActivityTableMeta,
} }) => {
	return {
		profilesActivity,
		profilesActivityCount,
		isLoading,
		profilesActivityTableMeta,
	};
}, {
	getProfilesActivity,
})(memo(Profiles));
