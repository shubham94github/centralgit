import React, { memo, useEffect, useState } from 'react';
import { Icons } from '@icons';
import { colors } from '@colors';
import { P14 } from '@components/_shared/text';
import { func, object, bool, array } from 'prop-types';
import SearchInput from '@components/_shared/form/SearchInput';
import PrimaryButton from '@components/_shared/buttons/PrimaryButton';
import DateRangePicker from '@components/_shared/form/DateRange';
import Select from '@components/_shared/form/Select';
import cn from 'classnames';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import enums from '@constants/enums';
import { useGetAuthorities } from '@utils/hooks/useGetAuthorities';
import { tableMetaType } from '@constants/types';
import { isToday, endOfDay } from 'date-fns';
import { makeTitleByRole } from '@components/AdminPanel/Activity/Profiles/ProfilesHeader/utils';
import { CustomOption } from './CustomSelectOption';

import './ProfilesHeader.scss';

const { permissions } = enums;

const infoIcon = Icons.infoIcon(colors.grass50);
const filtersIcon = Icons.filtersIcon(colors.white);
const refreshIcon = Icons.refreshIcon(colors.white);

const ProfilesHeader = ({
	handleSearch,
	tableMeta,
	isLoading,
	filtersSchema,
	listOfFilters,
	handleChangeFilter,
}) => {
	const defaultValues = filtersSchema.default();
	const [searchValue, setSearchValue] = useState('');
	const [isFilter, setIsFilter] = useState(true);
	const [wasUpdatedBackend, setWasUpdatedBackend] = useState();
	const [authoritiesList, setAuthoritiesList] = useState();

	const { handleSubmit, control, watch, setValue, reset, getValues, register } = useForm({
		resolver: yupResolver(filtersSchema),
		defaultValues,
		mode: enums.validationMode.onBlur,
	});

	const dateRange = getValues('createdAt');
	const dateFrom = dateRange ? dateRange[0] : null;
	const dateTo = dateRange ? dateRange[1] : null;

	const { authorities } = useGetAuthorities({
		wasUpdatedBackend,
		setWasUpdatedBackend,
	});

	useEffect(() => {
		if (!authorities) return;

		const { items: authoritiesList } = authorities;
		const list = authoritiesList.map(authority => ({ label: authority.name, value: authority.name }));

		setAuthoritiesList(list);
	}, [authorities]);

	useEffect(() => {
		if (!tableMeta?.fields) return;

		const value = tableMeta?.fields.find(field => field.fieldName === 'companyShortName');

		if (value) setSearchValue(value.filterText);
	}, [tableMeta]);

	const getFilterValues = () => Object.values(getValues()).filter(value => value);

	const filterButtonClasses = cn('show-filter-btn', {
		'active': getFilterValues().length,
	});

	const handleClick = () => setIsFilter(!isFilter);

	const handleSubmitFilters = data => handleChangeFilter(data);

	const resetFilters = () => {
		reset({ ...defaultValues });
		handleChangeFilter({ ...defaultValues });
	};

	const filterClasses = cn('table-filters', {
		'closed': !isFilter,
	});

	const onChange = fieldName => option => setValue(fieldName, option);

	const onDateChange = dateRange => {
		if (isToday(dateRange.endDate)) setValue('createdAt', [+dateRange.startDate, Date.now()]);
		else setValue('createdAt', [+dateRange.startDate, +endOfDay(dateRange.endDate)]);
	};

	return (
		<div className='activity-profiles-header'>
			<div className='description'>
				{infoIcon}
				<P14>
					Super Admin can be able to monitor the activities of all admins that made changes with the Startup
					and User profiles.
				</P14>
			</div>
			<div className='search-container'>
				<SearchInput
					placeholder='Search'
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
			</div>
			<div className={filterClasses}>
				{listOfFilters.map((filter, i) => {
					const { placeholder, property, type, options } = filter;

					const listOfOptions = !!options?.length
						? options
						: property === 'adminRole'
							? authoritiesList
							: [
								...makeTitleByRole('Startup:', permissions.manageStartups.items),
								...makeTitleByRole('User:', permissions.manageUsers.items),
							];

					return (
						type === 'date'
							? <DateRangePicker
								key={`${property}-${i}`}
								name={property}
								control={control}
								register={register}
								dateFrom={dateFrom}
								dateTo={dateTo}
								onChange={onDateChange}
								placeholder={placeholder}
								maxDate={new Date()}
								value={watch('createdAt')}
							/>
							: <Select
								name={property}
								control={control}
								register={register}
								key={`${property}-${i}`}
								options={listOfOptions}
								placeholder={placeholder}
								onChange={onChange(property)}
								isClearable
								value={watch(property)}
								isBorder
								components={{ Option: CustomOption }}
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
	);
};

ProfilesHeader.propTypes = {
	handleSearch: func.isRequired,
	handleChangeFilter: func.isRequired,
	tableMeta: tableMetaType.isRequired,
	isLoading: bool.isRequired,
	listOfFilters: array.isRequired,
	filtersSchema: object,
};

export default memo(ProfilesHeader);
