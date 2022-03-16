import React, { memo, useEffect, useMemo, useState } from 'react';
import { connect } from 'react-redux';
import {
	getRetailers,
	approveUser,
	handleRetailerActivation,
	handleRetailerFilters,
	handleVerifyUser,
	getSubscriptionPlans,
} from '@ducks/admin/actions';
import { array, arrayOf, bool, func, number, object } from 'prop-types';
import { getColumns } from './columns';
import MainTable from '@components/_shared/MainTable';
import enums from '@constants/enums';
import { getListOfFilters } from './listOfFilters';
import { schema } from './schema';
import StartupsHeader from '@components/AdminPanel/Startups/StartupsHeader';
import { useHistory } from 'react-router-dom';
import { paymentPlanType, tableMetaType } from '@constants/types';
import { isEmpty } from '@utils/js-helpers';
import { pageSize } from '@constants/pagination';

const {
	groupActions,
	verifyUserTypes,
} = enums;

const Retailers = ({
	getRetailers,
	retailers,
	retailersCount,
	isLoading,
	retailersTableMeta,
	handleRetailerActivation,
	approveUser,
	selectedRetailerFilters,
	handleRetailerFilters,
	handleVerifyUser,
	isRetailersViewProfilePermission,
	isRetailersApprovePermission,
	listOfPermissions,
	isRetailersChangeStatusPermission,
	getSubscriptionPlans,
	paymentPlans,
}) => {
	const history = useHistory();
	const [pageCount, setPageCount] = useState(0);
	const [selectedRows, setSelectedRows] = useState([]);
	const [filterParams, setFilterParams] = useState([]);
	const [searchValue, setSearchValue] = useState(null);
	const columns = getColumns({
		approveUser,
		handleRetailerActivation,
		history,
		isRetailersViewProfilePermission,
	});

	const paymentPlanOptions = useMemo(() => paymentPlans?.map(item => ({
		value: item.id,
		label: item.uiName,
	})), [paymentPlans]);

	useEffect(() => setPageCount(Math.ceil(retailersCount / retailersTableMeta.size)),
		[retailersCount, setPageCount, retailersTableMeta.size]);

	useEffect(() => {
		if (isEmpty(retailers))
			getRetailers(retailersTableMeta);

		if (isEmpty(paymentPlans)) getSubscriptionPlans();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const onChangePage = page => getRetailers({
		...retailersTableMeta,
		page: page + 1,
	});

	const onChangeCountOfRecords = size => getRetailers({
		...retailersTableMeta,
		size,
		page: 1,
	});

	const onSort = (column, direction) => getRetailers({
		...retailersTableMeta,
		sort: {
			direction: direction.toUpperCase(),
			fieldName: column.property,
		},
	});

	const onSearch = data => {
		if (data.filterText === '') {
			getRetailers({ ...retailersTableMeta, fields: [], page: 1 });
			setSearchValue(null);
		}

		const isFieldExist = retailersTableMeta.fields.find(item => item.fieldName === data.fieldName);

		if (!isFieldExist) {
			setSearchValue(data);

			getRetailers({
				...retailersTableMeta,
				fields: [
					...retailersTableMeta.fields,
					{ ...data },
					...filterParams,
				],
				page: 1,
			});
		} else {
			const index = retailersTableMeta.fields.findIndex(item => item.fieldName === data.fieldName);
			const newReqData = retailersTableMeta.fields.map((item, i) => {
				if (i === index) return { fieldName: item.fieldName, filterText: data.filterText };

				return item;
			});

			setSearchValue(newReqData[0]);

			getRetailers({
				...retailersTableMeta,
				fields: [ ...newReqData, ...filterParams ],
				page: 1,
			});
		}
	};

	const handleGroupActions = type => {
		const ids = selectedRows.map(selectedRow => selectedRow.id);

		switch (type) {
			case groupActions.approve:
				return approveUser({ ids, type: verifyUserTypes.retailer });
			case groupActions.activate:
				return handleRetailerActivation({ ids, isBlocked: true });
			case groupActions.deactivate:
				return handleRetailerActivation({ ids, isBlocked: false });
			case groupActions.verify:
				return handleVerifyUser({ ids, type: verifyUserTypes.retailer });
			default: return;
		}
	};

	const handleChangeFilter = filters => {
		const fields = Object.keys(filters).reduce((acc, key) => {
			if (filters[key]) {
				if (typeof filters[key].value === 'string')
					acc.push({ fieldName: key, filterText: filters[key].value });
				else if (typeof filters[key].value === 'boolean')
					acc.push({ fieldName: key, filterBoolean: filters[key].value });
				else if ((typeof filters[key].value === 'number'))
					acc.push({ fieldName: key, filterNumber: filters[key].value });
			}

			return acc;
		}, []);

		const oldFields = retailersTableMeta.fields.filter(field => field.fieldName === 'categoryIds');

		setFilterParams(fields);

		getRetailers({
			...retailersTableMeta,
			page: 1,
			fields: !!searchValue?.filterText
				? [...oldFields, ...fields, searchValue]
				: [...oldFields, ...fields],
		});
	};

	return (
		<div className='retailers-container'>
			{!isEmpty(listOfPermissions)
				&& <MainTable
					columns={columns}
					data={retailers}
					listOfFilters={getListOfFilters(paymentPlanOptions)}
					tableHeader={StartupsHeader}
					isLoading={isLoading}
					selectableRows
					sortServer
					onSort={onSort}
					pageCount={pageCount}
					countOfRecords={retailersCount}
					tableMeta={retailersTableMeta}
					onChangePage={onChangePage}
					onSearch={onSearch}
					handleGroupActions={handleGroupActions}
					handleChangeFilter={handleChangeFilter}
					filtersSchema={schema}
					selectedRows={selectedRows}
					setSelectedRows={setSelectedRows}
					onChangeCountOfRecords={onChangeCountOfRecords}
					withPagination
					withFilters
					selectedFilters={selectedRetailerFilters}
					handleFilters={handleRetailerFilters}
					isApprovePermission={isRetailersApprovePermission}
					isChangeStatusPermission={isRetailersChangeStatusPermission}
				/>
			}
		</div>
	);
};

Retailers.defaultProps = {
	retailers: [],
	retailersCount: 0,
	retailersTableMeta: {
		fields: [],
		page: 1,
		size: pageSize,
		sort: {
			direction: 'ASC',
			fieldName: 'createdAt',
		},
	},
};

Retailers.propTypes = {
	retailers: array,
	retailersCount: number,
	isLoading: bool,
	retailersTableMeta: tableMetaType.isRequired,
	getRetailers: func.isRequired,
	handleRetailerActivation: func.isRequired,
	approveUser: func.isRequired,
	selectedRetailerFilters: object,
	handleRetailerFilters: func.isRequired,
	handleVerifyUser: func.isRequired,
	listOfPermissions: object,
	isRetailersViewProfilePermission: bool,
	isRetailersApprovePermission: bool,
	isRetailersChangeStatusPermission: bool,
	getSubscriptionPlans: func,
	paymentPlans: arrayOf(paymentPlanType),
};

export default connect(state => {
	const { admin, auth } = state;
	const {
		retailers,
		retailersCount,
		isLoading,
		retailersTableMeta,
		selectedRetailerFilters,
		subscriptionPlans,
	} = admin;
	const { listOfPermissions } = auth;

	return {
		retailers,
		retailersCount,
		isLoading,
		retailersTableMeta,
		selectedRetailerFilters,
		listOfPermissions,
		isRetailersViewProfilePermission: listOfPermissions?.isRetailersViewProfilePermission,
		isRetailersApprovePermission: listOfPermissions?.isRetailersApprovePermission,
		isRetailersChangeStatusPermission: listOfPermissions?.isRetailersChangeStatusPermission,
		paymentPlans: subscriptionPlans,
	};
}, {
	getRetailers,
	handleRetailerActivation,
	approveUser,
	handleRetailerFilters,
	handleVerifyUser,
	getSubscriptionPlans,
})(memo(Retailers));
