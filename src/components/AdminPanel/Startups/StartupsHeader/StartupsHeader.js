import React, { memo, useEffect, useMemo, useState } from 'react';
import Select from '@components/_shared/form/Select';
import SearchInput from '@components/_shared/form/SearchInput';
import PrimaryButton from '@components/_shared/buttons/PrimaryButton';
import { array, bool, func, object, shape, string } from 'prop-types';
import { getSelectData } from '@components/_shared/MainTable/utils/generateSelectOptions';
import prepareSelectStyles from '@components/_shared/MainTable/utils/prepareSelectStyles';
import { Icons } from '@icons';
import { colors } from '@colors';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import enums from '@constants/enums';
import cn from 'classnames';
import { isEmpty } from '@utils/js-helpers';
import { selectedFiltersType, tableMetaType } from '@constants/types';

import './StartupsHeader.scss';

const filtersIcon = Icons.filtersIcon(colors.white);
const refreshIcon = Icons.refreshIcon(colors.white);
const settingIcon = Icons.settingIcon(colors.darkblue50);

const StartupsHeader = ({
	listOfFilters,
	selectedRows,
	handleSearch,
	isLoading,
	categoriesFilterClasses,
	toggleCategoriesFilter,
	countries,
	filtersSchema,
	handleChangeFilter,
	selectedFilters,
	handleFilters,
	handleGroupActions,
	groupActionsValue,
	setGroupActionsValue,
	toggleManageColumns,
	tableMeta,
	isApprovePermission,
	isChangeStatusPermission,
}) => {
	const defaultSchema = filtersSchema.default();
	const { handleSubmit, control, watch, setValue, reset, getValues } = useForm({
		resolver: yupResolver(filtersSchema),
		defaultValues: defaultSchema,
		mode: enums.validationMode.onBlur,
	});
	const [isFilter, setIsFilter] = useState(true);
	const selectStyles = useMemo(() => prepareSelectStyles(), []);
	const groupActionsSelectPlaceholder = selectedRows.length === 0 ? 'Selected' : `Selected (${selectedRows.length})`;
	const selectOptions = getSelectData(selectedRows.length).filter(item => {
		switch (item.value) {
			case 'APPROVE':
				return isApprovePermission;

			case 'ACTIVATE':
			case 'DEACTIVATE':
				return isChangeStatusPermission;

			default:
				return true;
		}
	});
	const [searchValue, setSearchValue] = useState('');

	useEffect(() => {
		if (!isEmpty(selectedFilters)) reset(selectedFilters);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedFilters]);

	useEffect(() => {
		if (!tableMeta?.fields) return;

		const value = tableMeta?.fields.find(field => field.fieldName === 'companyShortNameEmail');

		if (value) setSearchValue(value.filterText);
	}, [tableMeta]);

	const resetFilters = () => {
		reset({ ...defaultSchema });
		handleChangeFilter({ ...defaultSchema });
	};

	const isFilterValues = () => {
		const values = Object.values(getValues()).filter(value => value);

		return !!values.length;
	};

	const filterButtonClasses = cn('show-filter-btn', {
		'active': isFilterValues(),
	});

	const handleClick = () => setIsFilter(!isFilter);

	const handleSubmitFilters = data => {
		handleChangeFilter(data);

		handleFilters(data);
	};

	const handleChangeGroupSelect = data => {
		setGroupActionsValue(data);
		handleGroupActions(data.value);
	};

	const onChange = fieldName => option => setValue(fieldName, option);

	return (
		<div className='startups-header'>
			<div className='table-filters-container'>
				<div className='actions-line'>
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
							placeholder='Brand or E-mail'
							onSearch={handleSearch}
							initialValue={searchValue}
							disabled={isLoading}
							isClearable
						/>
						<PrimaryButton
							className={filterButtonClasses}
							isDarkTheme={false}
							onClick={handleClick}
						>
							{filtersIcon} Filters
						</PrimaryButton>
						<PrimaryButton
							className={categoriesFilterClasses}
							isDarkTheme={false}
							onClick={toggleCategoriesFilter}
						>
							Categories
						</PrimaryButton>
					</div>
					<div
						className='table-settings'
						onClick={toggleManageColumns}
					>
						{settingIcon}
					</div>
				</div>
				<div className={`table-filters ${!isFilter ? 'closed' : ''}`}>
					{listOfFilters.map((filter, i) => {
						const { options, placeholder, property } = filter;
						const isFilterForStart = property === 'country';
						const selectOptions = isFilterForStart ? [ ...options, ...countries] : options;

						return (
							<Select
								name={property}
								control={control}
								key={`${property}-${i}`}
								options={selectOptions}
								placeholder={placeholder}
								onChange={onChange(property)}
								isClearable
								value={watch(property)}
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
		</div>
	);
};

StartupsHeader.propTypes = {
	listOfFilters: array.isRequired,
	selectedRows: array.isRequired,
	handleSearch: func.isRequired,
	handleChangeFilter: func.isRequired,
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
	isApprovePermission: bool,
	isChangeStatusPermission: bool,
	paymentPlanOptions: shape({
		label: string,
		value: string,
	}),
};

export default memo(StartupsHeader);
