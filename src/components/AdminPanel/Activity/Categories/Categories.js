import React, { memo, useEffect, useState } from 'react';
import MainTable from '@components/_shared/MainTable';
import { connect } from 'react-redux';
import { getCategoriesActivity } from '@ducks/admin/actions';
import { array, bool, func, number } from 'prop-types';
import { columns } from './columns';
import CategoriesHeader from './CategoriesHeader';
import { listOfFilters } from './listOfFilters';
import { schema } from './schema';
import { tableMetaType } from '@constants/types';

import './Categories.scss';

const Categories = ({
	categoriesActivity,
	categoriesActivityCount,
	isLoading,
	categoriesActivityTableMeta,
	getCategoriesActivity,
}) => {
	const [pageCount, setPageCount] = useState(0);
	const [searchValue, setSearchValue] = useState();

	useEffect(() => {
		getCategoriesActivity(categoriesActivityTableMeta);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		setPageCount(Math.ceil(categoriesActivityCount / categoriesActivityTableMeta.size));
	}, [categoriesActivityCount, setPageCount, categoriesActivityTableMeta.size]);

	const onSort = (column, direction) => getCategoriesActivity({
		...categoriesActivityTableMeta,
		sort: {
			direction: direction.toUpperCase(),
			fieldName: column.property,
		},
	});

	const onChangePage = page => getCategoriesActivity({
		...categoriesActivityTableMeta,
		page: page + 1,
	});

	const onChangeCountOfRecords = size => getCategoriesActivity({
		...categoriesActivityTableMeta,
		size,
		page: 1,
	});

	const onSearch = searchData => {
		if (!searchData.filterText) {
			const fieldsWithoutSearch = categoriesActivityTableMeta.fields
				.filter(item => item.fieldName !== searchData.fieldName);

			getCategoriesActivity({ ...categoriesActivityTableMeta, fields: [ ...fieldsWithoutSearch ], page: 1 });
			setSearchValue(null);

			return;
		}

		if (!categoriesActivityTableMeta.fields.find(item => item.fieldName === searchData.fieldName)) {
			getCategoriesActivity({
				...categoriesActivityTableMeta,
				fields: [
					...categoriesActivityTableMeta.fields,
					{ ...searchData },
				],
				page: 1,
			});
		} else {
			const newReqData = categoriesActivityTableMeta.fields.map(item => {
				if (item.fieldName === searchData.fieldName)
					return { fieldName: item.fieldName, filterText: searchData.filterText };

				return item;
			});

			getCategoriesActivity({
				...categoriesActivityTableMeta,
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

		getCategoriesActivity({
			...categoriesActivityTableMeta,
			page: 1,
			fields: searchValue
				? [...fields, searchValue]
				: [...fields],
		});
	};

	return (
		<div className='categories-activity-container'>
			<MainTable
				title='Categories'
				columns={columns}
				data={categoriesActivity}
				isLoading={isLoading}
				sortServer={true}
				onSort={onSort}
				pageCount={pageCount}
				countOfRecords={categoriesActivityCount}
				tableMeta={categoriesActivityTableMeta}
				onChangePage={onChangePage}
				onChangeCountOfRecords={onChangeCountOfRecords}
				withPagination={true}
				tableHeader={CategoriesHeader}
				onSearch={onSearch}
				listOfFilters={listOfFilters}
				filtersSchema={schema}
				handleChangeFilter={handleChangeFilter}
				searchFieldName='name'
			/>
		</div>
	);
};

Categories.defaultProps = {
	categoriesActivity: [],
};

Categories.propTypes = {
	categoriesActivity: array,
	categoriesActivityCount: number,
	isLoading: bool,
	categoriesActivityTableMeta: tableMetaType.isRequired,
	getCategoriesActivity: func.isRequired,
};

export default connect(({ admin: {
	categoriesActivity,
	categoriesActivityCount,
	isLoading,
	categoriesActivityTableMeta,
} }) => {
	return {
		categoriesActivity,
		categoriesActivityCount,
		isLoading,
		categoriesActivityTableMeta,
	};
}, {
	getCategoriesActivity,
})(memo(Categories));
