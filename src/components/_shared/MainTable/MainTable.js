import React, { memo, useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { array, bool, func, number, object, string, elementType } from 'prop-types';
import LoadingOverlay from '@components/_shared/LoadingOverlay';
import { colors } from '@colors';
import Paginate from '@components/_shared/Paginate';
import { Col, Row } from 'react-bootstrap';
import AppModal from '@components/Common/AppModal';
import ManageTableColumns from '@components/_shared/ModalComponents/ManageTableColumns';
import { getCountries, getCategories } from '@ducks/common/actions';
import { connect } from 'react-redux';
import cn from 'classnames';
import hideSomeFirstLevelCategories from '@utils/hideSomeFirstLevelCategories';
import StartupCategoriesFilter from '@components/_shared/ModalComponents/StartupCategoriesFilter';
import { P16 } from '@components/_shared/text';
import ExpandableRow from '@components/AdminPanel/ManageCategories/ExpandableRow';
import { useLocation } from 'react-router-dom';
import hideImportFirstLevelCategories from '@utils/hideImportFirstLevelCategories';
import RetailerCategoriesFilter from '@components/_shared/ModalComponents/RetailerCategoriesFilter';
import { Icons } from '@icons';
import { tableMetaType } from '@constants/types';
import { isEmpty } from '@utils/js-helpers';

import './MainTable.scss';

const SortIcon = () => {
	return <div className='sort-icon'>{Icons.sortIcon(colors.white)}</div>;
};

const MainTable = props => {
	const {
		data,
		columns,
		isLoading,
		title,
		tableHeader: TableHeader,
		selectableRows,
		pageCount,
		countOfRecords,
		tableMeta,
		onChangePage,
		sortServer,
		onSort,
		onSearch,
		getCountries,
		countries,
		selectedRows,
		setSelectedRows,
		onChangeCountOfRecords,
		getCategories,
		categories,
		withPagination,
		isExpandableRows,
		noTableHead,
		toggleModal,
		searchFieldName,
		className,
	} = props;
	const location = useLocation();
	const isRetailer = location.pathname.includes('retailers');
	const [isManageColumnsModal, setIsManageColumnsModal] = useState(false);
	const [isCategoriesFilterModal, setIsCategoriesFilterModal] = useState(false);
	const [selectableColumns, setSelectableColumns] = useState([...columns]);
	const [categoriesFilter, setCategoriesFilter] = useState([]);
	const [groupActionsValue, setGroupActionsValue] = useState(null);
	const categoriesFilterClasses = cn('show-categories-filter-btn', {
		'active': categoriesFilter.length,
	});

	useEffect(() => {
		tableMeta?.fields?.map(field => {
			if (field.fieldName === 'categoryIds' || field.fieldName === 'areaIds')
				setCategoriesFilter(field.filterCategories);
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (isEmpty(countries)) getCountries();
		if (isEmpty(categories)) getCategories();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const handlePageClick = ({ selected }) => onChangePage(selected);

	const toggleCategoriesFilter = () => setIsCategoriesFilterModal(prevState => !prevState);

	const toggleManageColumns = () => setIsManageColumnsModal(prevState => !prevState);

	const manageColumnsProps = {
		onClose: toggleManageColumns,
		columns: selectableColumns,
		setSelected: setSelectableColumns,
	};

	const categoriesFilterProps = {
		onClose: toggleCategoriesFilter,
		categories: isRetailer ? hideImportFirstLevelCategories(categories) : hideSomeFirstLevelCategories(categories),
		setCategoriesFilter,
		categoriesFilter,
	};

	const handleSearch = value => {
		const search = value.trim();

		if (search.length > 2 || search.length === 0) {
			const data = {
				fieldName: searchFieldName,
				filterText: search,
			};

			onSearch(data);
		}
	};

	const selectableRowSelected = row => selectedRows.find(selectedRow => row.id === selectedRow.id);

	const onSelectedRowsChange = data => {
		setGroupActionsValue(null);
		setSelectedRows(data.selectedRows);
	};

	return (
		<div className={className}>
			<div className='table-header'>
				{title && <P16 bold>{title}</P16>}
				{TableHeader
					&& <TableHeader
						{...props}
						handleSearch={handleSearch}
						groupActionsValue={groupActionsValue}
						categoriesFilterClasses={categoriesFilterClasses}
						toggleCategoriesFilter={toggleCategoriesFilter}
						setGroupActionsValue={setGroupActionsValue}
						toggleManageColumns={toggleManageColumns}
						toggleModal={toggleModal}
					/>
				}
			</div>
			<DataTable
				onSort={onSort}
				sortServer={sortServer}
				noHeader={true}
				paginationDefaultPage={1}
				columns={selectableColumns}
				data={data}
				selectableRows={selectableRows}
				onSelectedRowsChange={onSelectedRowsChange}
				sortIcon={<SortIcon/>}
				selectableRowSelected={selectableRowSelected}
				expandableRows={isExpandableRows}
				expandableRowsComponent={<ExpandableRow/>}
				noTableHead={noTableHead}
				expandableRowDisabled={row => !row.items?.length}
			/>
			{withPagination
				&& <Row>
					<Col
						xs={12}
						sm={12}
						xxl={12}
						className='mt-4'
					>
						<Paginate
							handlePageClick={handlePageClick}
							pageCount={pageCount}
							forcePage={tableMeta.page - 1}
							countOfRecords={countOfRecords}
							pageSize={tableMeta.size || tableMeta.pageSize}
							changePageSizeHandler={onChangeCountOfRecords}
						/>
					</Col>
				</Row>
			}
			{isLoading && <LoadingOverlay/>}
			{isManageColumnsModal
				&& <AppModal
					component={ManageTableColumns}
					outerProps={manageColumnsProps}
					onClose={toggleManageColumns}
					title='Customise table'
					width='356px'
				/>
			}
			{isCategoriesFilterModal
				&& <AppModal
					component={isRetailer ? RetailerCategoriesFilter : StartupCategoriesFilter}
					outerProps={categoriesFilterProps}
					onClose={toggleCategoriesFilter}
					title='Categories'
					width={isRetailer ? '420px' : '1170px'}
					isScrollable={true}
					isCentered={isRetailer}
				/>
			}
		</div>
	);
};

MainTable.defaultProps = {
	data: [],
	columns: [],
	selectableRows: false,
	pageCount: 0,
	countOfRecords: 0,
	sortServer: false,
	listOfFilters: [],
	countries: [],
	selectedRows: [],
	selectedFilters: {},
	categories: [],
	isManageCategories: false,
	isExpandableRows: false,
	noTableHead: false,
	searchFieldName: 'companyShortNameEmail',
	className: 'main-table',
};

MainTable.propTypes = {
	data: array,
	columns: array,
	isLoading: bool,
	title: string,
	tableHeader: elementType,
	selectableRows: bool,
	pageCount: number,
	countOfRecords: number,
	tableMeta: tableMetaType,
	onChangePage: func,
	sortServer: bool,
	onSort: func,
	onSearch: func,
	getCountries: func,
	countries: array,
	selectedRows: array,
	setSelectedRows: func,
	onChangeCountOfRecords: func,
	selectedFilters: object,
	handleFilters: func,
	getCategories: func,
	categories: array,
	withPagination: bool.isRequired,
	isExpandableRows: bool,
	noTableHead: bool,
	toggleModal: func,
	searchFieldName: string,
	isApprovePermission: bool,
	isChangeStatusPermission: bool,
	className: string,
};

export default connect(({ common, admin }) => {
	const { countries, categories } = common;
	const { searchRequest } = admin;

	return {
		countries,
		searchRequest,
		categories,
	};
}, {
	getCountries,
	getCategories,
})(memo(MainTable));
