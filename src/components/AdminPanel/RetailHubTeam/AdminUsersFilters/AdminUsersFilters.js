import React, { useEffect, useMemo, useState } from 'react';
import  { array, arrayOf, bool, func, object, string } from 'prop-types';
import Select from '@components/_shared/form/Select';
import { authorityType, selectedFiltersType, tableMetaType } from '@constants/types';
import SearchInput from '@components/_shared/form/SearchInput';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import enums from '@constants/enums';
import prepareSelectStyles from '@components/_shared/MainTable/utils/prepareSelectStyles';
import { isEmpty } from '@utils/js-helpers';
import cn from 'classnames';
import PrimaryButton from '@components/_shared/buttons/PrimaryButton';
import {
	addNewUserBtnText,
	filtersIcon,
	groupActions,
	plusIcons,
	refreshIcon,
} from '@components/AdminPanel/RetailHubTeam/constants';
import { schema } from './schema';
import { generateOptions } from '../utils';
import useQueryParams from '@utils/hooks/useQueryParams';
import { useHistory } from 'react-router-dom';

const AdminUsersFilters = ({
	listOfFilters,
	selectedRows,
	onSearch,
	isLoading,
	selectedFilters,
	handleFilters,
	handleGroupActions,
	groupActionsValue,
	setGroupActionsValue,
	tableMeta,
	openCreationModal,
	roles,
}) => {
	const defaultSchema = schema.default();
	const history = useHistory();

	const { handleSubmit, control, setValue, reset, getValues, watch } = useForm({
		resolver: yupResolver(schema),
		mode: enums.validationMode.onBlur,
	});

	const [isFilter, setIsFilter] = useState(true);
	const selectStyles = useMemo(() => prepareSelectStyles(), []);
	const groupActionsSelectPlaceholder = selectedRows.length === 0 ? 'Selected' : `Selected (${selectedRows.length})`;
	const selectOptions = generateOptions(groupActions, selectedRows.length);
	const [searchValue, setSearchValue] = useState('');

	useEffect(() => {
		if (!isEmpty(selectedFilters)) {
			const role = selectedFilters.find(item => item.fieldName === 'authority');

			const searchValue = selectedFilters.find(item => item.fieldName === 'filterText');

			if (searchValue) setSearchValue(searchValue.filterText);

			if (role) {
				setValue('authority', {
					label: role.filterText,
					value: role.filterText,
				});
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedFilters]);

	useEffect(() => {
		if (!tableMeta?.fields) return;

		const value = tableMeta?.fields.find(field => field.fieldName === 'firstName');

		if (value) setSearchValue(value.filterText);
	}, [tableMeta]);

	const query = useQueryParams();

	useEffect(() => {
		const roleName = query.get('roleName');
		const filterText = query.get('filterText');

		setValue('authority', roleName
			? {
				label: roleName,
				value: roleName,
			}
			: null);

		handleFilters(
			roleName
				? {
					label: roleName,
					value: roleName,
				}
				: null,
		);

		setSearchValue(filterText || '');

		onSearch(filterText || '');
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const setQueryParams = (filterText, authority)  => {
		const newQueryParams = new URLSearchParams();

		if (!isEmpty(authority)) newQueryParams.append('roleName', authority);
		else newQueryParams.delete('roleName');

		if (!isEmpty(filterText)) newQueryParams.append('filterText', filterText);
		else newQueryParams.delete('filterText');

		history.push({ search: newQueryParams.toString() });
	};

	const resetFilters = () => {
		setQueryParams(searchValue);
		reset({ ...defaultSchema });
	};

	const isFilterValues = () => {
		const values = Object.values(getValues()).filter(value => value);

		return !!values.length;
	};

	const filterButtonClasses = cn('show-filter-btn', {
		'active': isFilterValues(),
	});

	const toggleIsFilter = () => setIsFilter(!isFilter);

	const handleSubmitFilters = data => {
		const filteredValues = Object.keys(data).reduce((acc, key) => {
			if (!isEmpty(data[key])) acc[key] = data[key];

			return acc;
		}, {});

		setQueryParams(searchValue, filteredValues.authority?.label);
		handleFilters();
	};

	const handleChangeGroupSelect = data => {
		setGroupActionsValue(data);
		handleGroupActions(data.value);
	};

	const onChange = fieldName => option => setValue(fieldName, option);

	const handleSearch = filterText => {
		const values = getValues();

		setQueryParams(filterText, values.authority?.label);
	};

	return (
		<div className='admin-users-header'>
			<div className='table-filters-container'>
				<div className='table-header-actions'>
					<Select
						options={selectOptions}
						classNamePrefix='group-actions-select'
						placeholder={groupActionsSelectPlaceholder}
						onChange={handleChangeGroupSelect}
						isSearchable={false}
						isFilter={true}
						isCreateable={false}
						customStyles={selectStyles}
						value={groupActionsValue}
						disabled={!selectedRows.length}
					/>
					<SearchInput
						placeholder='Search'
						onSearch={handleSearch}
						initialValue={searchValue}
						disabled={isLoading}
						isClearable
						value={searchValue}
						isOuterValue
						sendValue={setSearchValue}
					/>
					<PrimaryButton
						className={filterButtonClasses}
						isDarkTheme={false}
						onClick={toggleIsFilter}
					>
						{filtersIcon} Filters
					</PrimaryButton>
				</div>
				<div className={`table-filters ${!isFilter ? 'closed' : ''}`}>
					{listOfFilters.map((filter, i) => {
						const { placeholder, property } = filter;

						const isFilterForStart = property === 'country';

						return (
							<Select
								name={property}
								control={control}
								key={`${property}-${i}`}
								options={roles}
								placeholder={placeholder}
								onChange={onChange(property)}
								value={watch(property)}
								isClearable
								isFilterForStart={isFilterForStart}
								isBorder
							/>
						);
					})}
					<div className='filter-btns'>
						<PrimaryButton
							text='Apply'
							className='filter-btn apply'
							isDarkTheme={false}
							onClick={handleSubmit(handleSubmitFilters)}
						/>
						<PrimaryButton
							className='filter-btn reset'
							isDarkTheme={false}
							onClick={resetFilters}
						>
							{refreshIcon} Reset
						</PrimaryButton>
					</div>
				</div>
			</div>
			<PrimaryButton
				className='admin-primary add-user-btn'
				onClick={openCreationModal}
			>
				{plusIcons}
				{addNewUserBtnText}
			</PrimaryButton>
		</div>
	);
};

AdminUsersFilters.propTypes = {
	listOfFilters: array.isRequired,
	selectedRows: array.isRequired,
	handleSearch: func.isRequired,
	handleFilters: func.isRequired,
	handleGroupActions: func.isRequired,
	countries: array,
	filtersSchema: object,
	isLoading: bool,
	categoriesFilterClasses: string.isRequired,
	toggleCategoriesFilter: func.isRequired,
	selectedFilters: selectedFiltersType,
	groupActionsValue: object,
	setGroupActionsValue: func.isRequired,
	toggleManageColumns: func.isRequired,
	tableMeta: tableMetaType.isRequired,
	openCreationModal: func.isRequired,
	roles: arrayOf(authorityType),
	onSearch: func.isRequired,
};

export default AdminUsersFilters;
