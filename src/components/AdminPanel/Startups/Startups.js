import React, { memo, useEffect, useState } from 'react';
import MainTable from '@components/_shared/MainTable';
import { connect } from 'react-redux';
import {
	getStartups,
	approveUser,
	handleStartupActivation,
	handleStartupFilters,
	handleVerifyUser,
} from '@ducks/admin/actions';
import { array, bool, number, func, object } from 'prop-types';
import { getColumns } from './columns';
import { listOfFilters } from './listOfFilters';
import enums from '@constants/enums';
import { schema } from './schema';
import StartupsHeader from '@components/AdminPanel/Startups/StartupsHeader';
import { useHistory } from 'react-router-dom';
import { tableMetaType } from '@constants/types';
import { isEmpty } from '@utils/js-helpers';

const {
	groupActions,
	verifyUserTypes,
	gettingStartedStatusesAdminPanel,
} = enums;

const rateStarsType = 'rateStars';

const Startups = ({
	startups,
	startupsCount,
	getStartups,
	isLoading,
	startupsTableMeta,
	approveUser,
	handleStartupActivation,
	selectedStartupFilters,
	handleStartupFilters,
	handleVerifyUser,
	isStartupsViewProfilePermission,
	isStartupsApprovePermission,
	listOfPermissions,
	isStartupsChangeStatusPermission,
}) => {
	const history = useHistory();
	const [pageCount, setPageCount] = useState(0);
	const [selectedRows, setSelectedRows] = useState([]);
	const [searchValue, setSearchValue] = useState(null);
	const columns = getColumns({
		approveUser,
		handleStartupActivation,
		history,
		isStartupsViewProfilePermission,
	});

	useEffect(() => {
		getStartups(startupsTableMeta);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		setPageCount(Math.ceil(startupsCount / startupsTableMeta.size));
	}, [startupsCount, setPageCount, startupsTableMeta.size]);

	const onChangePage = page => getStartups({
		...startupsTableMeta,
		page: page + 1,
	});

	const onChangeCountOfRecords = size => getStartups({
		...startupsTableMeta,
		size,
		page: 1,
	});

	const onSort = (column, direction) => getStartups({
		...startupsTableMeta,
		sort: {
			direction: direction.toUpperCase(),
			fieldName: column.property,
		},
	});

	const onSearch = searchData => {
		if (!searchData.filterText) {
			const fieldsWithoutSearch = startupsTableMeta.fields
				.filter(item => item.fieldName !== searchData.fieldName);

			getStartups({ ...startupsTableMeta, fields: [ ...fieldsWithoutSearch ], page: 1 });
			setSearchValue(null);

			return;
		}

		if (!startupsTableMeta.fields.find(item => item.fieldName === searchData.fieldName)) {
			getStartups({
				...startupsTableMeta,
				fields: [
					...startupsTableMeta.fields,
					{ ...searchData },
				],
				page: 1,
			});
		} else {
			const newReqData = startupsTableMeta.fields.map(item => {
				if (item.fieldName === searchData.fieldName)
					return { fieldName: item.fieldName, filterText: searchData.filterText };

				return item;
			});

			getStartups({
				...startupsTableMeta,
				fields: [ ...newReqData ],
				page: 1,
			});
		}

		setSearchValue(searchData);
	};

	const handleGroupActions = type => {
		const ids = selectedRows.map(selectedRow => selectedRow.id);
		const idsForApprove = selectedRows.reduce((acc, selectedRow) => {
			if (selectedRow?.status === gettingStartedStatusesAdminPanel.completedGettingStarted)
				acc.push(selectedRow.id);

			return acc;
		}, []);

		switch (type) {
			case groupActions.approve:
				return approveUser({ ids: idsForApprove, type: verifyUserTypes.startup });
			case groupActions.activate:
				return handleStartupActivation({ ids, isBlocked: true });
			case groupActions.deactivate:
				return handleStartupActivation({ ids, isBlocked: false });
			case groupActions.verify:
				return handleVerifyUser({ ids, type: verifyUserTypes.startup });
			default: return;
		}
	};

	const handleChangeFilter = filters => {
		const fields = Object.keys(filters).reduce((acc, key) => {
			if (filters[key]) {
				if (key === rateStarsType)
					acc.push({ fieldName: key, filterNumber: +filters[key].value });
				else if (typeof filters[key].value === 'string')
					acc.push({ fieldName: key, filterText: filters[key].value });
				else if (typeof filters[key].value === 'boolean')
					acc.push({ fieldName: key, filterBoolean: filters[key].value });
			}

			return acc;
		}, []);

		const oldFields = startupsTableMeta.fields.filter(field => field.fieldName === 'categoryIds'
			|| field.fieldName === 'areaIds');

		getStartups({
			...startupsTableMeta,
			page: 1,
			fields: searchValue
				? [...oldFields, ...fields, searchValue]
				: [...oldFields, ...fields],
		});
	};

	return (
		<div className='startups-container'>
			{!isEmpty(listOfPermissions)
				&& <MainTable
					columns={columns}
					data={startups}
					listOfFilters={listOfFilters}
					tableHeader={StartupsHeader}
					isLoading={isLoading}
					selectableRows={true}
					sortServer={true}
					onSort={onSort}
					pageCount={pageCount}
					countOfRecords={startupsCount}
					tableMeta={startupsTableMeta}
					onChangePage={onChangePage}
					onSearch={onSearch}
					handleGroupActions={handleGroupActions}
					handleChangeFilter={handleChangeFilter}
					filtersSchema={schema}
					selectedRows={selectedRows}
					setSelectedRows={setSelectedRows}
					onChangeCountOfRecords={onChangeCountOfRecords}
					selectedFilters={selectedStartupFilters}
					handleFilters={handleStartupFilters}
					withPagination={true}
					withFilters={true}
					isApprovePermission={isStartupsApprovePermission}
					isChangeStatusPermission={isStartupsChangeStatusPermission}
				/>
			}
		</div>
	);
};

Startups.defaultProps = {
	startups: [],
	startupsCount: 0,
	startupsTableMeta: {},
};

Startups.propTypes = {
	startups: array,
	startupsCount: number,
	isLoading: bool,
	getStartups: func.isRequired,
	startupsTableMeta: tableMetaType.isRequired,
	approveUser: func.isRequired,
	handleStartupActivation: func.isRequired,
	selectedStartupFilters: object,
	handleStartupFilters: func.isRequired,
	handleVerifyUser: func.isRequired,
	listOfPermissions: object,
	isStartupsViewProfilePermission: bool,
	isStartupsApprovePermission: bool,
	isStartupsChangeStatusPermission: bool,
};

export default connect(({ admin, auth }) => {
	const { startups, startupsCount, isLoading, startupsTableMeta, selectedStartupFilters } = admin;
	const { listOfPermissions } = auth;

	return {
		startups,
		startupsCount,
		isLoading,
		startupsTableMeta,
		selectedStartupFilters,
		listOfPermissions,
		isStartupsViewProfilePermission: listOfPermissions?.isStartupsViewProfilePermission,
		isStartupsApprovePermission: listOfPermissions?.isStartupsApprovePermission,
		isStartupsChangeStatusPermission: listOfPermissions?.isStartupsChangeStatusPermission,
	};
}, {
	getStartups,
	approveUser,
	handleStartupActivation,
	handleStartupFilters,
	handleVerifyUser,
})(memo(Startups));
