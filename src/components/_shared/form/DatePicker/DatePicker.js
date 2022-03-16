import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { string, func, number, bool, object, oneOfType, instanceOf } from 'prop-types';
import { startOfDay, endOfDay, getTime } from 'date-fns';
import DateRange from 'react-date-range/dist/components/DateRange';
import { colors } from '@colors';
import { useOnClickOutside } from '@utils/hooks/useOnClickOutside';
import { dateFormatCorrection, stopPropagation } from '@utils';
import Calendar from 'react-date-range/dist/components/Calendar';
import { S16 } from '@components/_shared/text';
import { Controller } from 'react-hook-form';
import InputMask from 'react-input-mask';
import { checkIsValidDate } from '@components/_shared/form/DatePicker/utils';
import cn from 'classnames';
import { Icons } from '@icons';

import './DatePicker.scss';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

const invalidDateError = 'Invalid Date';

const AppDatePicker = ({
	name,
	control,
	register,
	setDateRange,
	dateFrom,
	dateTo,
	isSingleDate,
	label,
	onChange,
	value,
	minDate,
	maxDate,
	isVisibleRange,
	setValue,
	clearErrors,
	isError,
	setError,
	isWithInput,
	errorMessage,
	isValidOrEmpty,
	isBorder,
	placeholder,
	disabled,
}) => {
	const appDatePickerNode = useRef(null);
	const inputRef = useRef(null);

	const [isOpen, setIsOpen] = useState(false);
	const defaultState = useMemo(() => [{
		startDate: dateFrom ? new Date(dateFrom) : undefined,
		endDate: dateTo ? new Date(dateTo) : undefined,
		color: colors.grass50,
		key: 'selection',
	}], [dateFrom, dateTo]);
	const [state, setState] = useState(defaultState);
	const [chosenDateCount, setChosenDateCount] = useState(0);
	const [singleDate, setSingleDate] = useState(null);
	const [rangeDate, setRangeDate] = useState(null);
	const [inputValue, setInputValue] = useState('');
	const calendarIcon = Icons.calendar(!isSingleDate && colors.white);

	const datePickerStyles = cn('input-settings text-input-light',
		{
			'date-picker-border': isBorder,
		});

	useEffect(() => setState(defaultState), [defaultState]);

	useEffect(() => {
		if (value) setInputValue(dateFormatCorrection(value, 'dd/MM/yyyy'));
	}, [value]);

	useEffect(() => {
		if (value) setSingleDate(value);
	}, [defaultState, inputValue, value]);

	useOnClickOutside([appDatePickerNode], () => {
		if (!isOpen) return;

		if (!isSingleDate && state[0].startDate && state[0].endDate)
			onChange(state[0]);

		setIsOpen(false);
	});

	useEffect(() => {
		if (!isNaN(getTime(state[0].startDate)) && !isNaN(getTime(state[0].endDate))
			&& !!dateFrom
			&& dateTo
			&& dateFormatCorrection(state[0].startDate) !== dateFormatCorrection(dateFrom)
			&& dateFormatCorrection(state[0].endDate) !== dateFormatCorrection(dateTo)
		)
			setState([{ ...state[0], startDate: new Date(dateFrom), endDate: new Date(dateTo) }]);
	}, [dateTo, dateFrom, state]);

	useEffect(() => {
		if (chosenDateCount >= 2) {
			setDateRange({
				startDate: getTime(startOfDay(state[0].startDate)),
				endDate: getTime(endOfDay(state[0].endDate)),
			});

			setChosenDateCount(0);
			setIsOpen(false);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [setDateRange, state, dateFrom, dateTo]);

	const onScroll = useCallback(() => {
		if (isOpen) setIsOpen(false);
	}, [isOpen]);

	useEffect(() => {
		window.addEventListener('scroll', onScroll);
	}, [onScroll]);

	useEffect(() => {
		if (value) setInputValue(dateFormatCorrection(value, 'dd/MM/yyyy'));

		return () => {
			window.removeEventListener('scroll', onScroll);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const toggleIsOpen = e => {
		stopPropagation(e);

		if (disabled) return;

		if (!!isOpen) {
			setDateRange({
				startDate: startOfDay(state[0].endDate),
				endDate: endOfDay(state[0].endDate),
			});
		}

		setIsOpen(!isOpen);
	};

	const onDateRangeChanged = item => {
		const dateInterval = {
			startDate: item.selection.startDate,
			endDate: item.selection.endDate,
		};

		setState([{
			...item.selection,
			...dateInterval,
		}]);

		setRangeDate(dateInterval);
	};

	const clearValue = useCallback(() => {
		onChange(null);
		setSingleDate(null);
		setIsOpen(false);
		setValue(name, null);
		setInputValue('');
	}, [name, onChange, setValue]);

	const onSingleValueChange = useCallback(date => {
		setSingleDate(date);
		onChange(date);
		setIsOpen(false);
	}, [onChange]);

	const textForRange = () => {
		const isVisibleYear = rangeDate?.startDate?.getFullYear() < rangeDate?.endDate?.getFullYear();
		const startDate = isVisibleYear
			? dateFormatCorrection(rangeDate?.startDate, 'MMM d, yyyy')
			: dateFormatCorrection(rangeDate?.startDate, 'MMM d');
		const endDate = dateFormatCorrection(rangeDate?.endDate, 'MMM d, yyyy');

		return (`< ${startDate} – ${endDate} >`);
	};

	const handleSetInputValue = ({ target: { value } }) => {
		const arrayOfDate = value.split('/');
		const newFormatDate = (`${arrayOfDate[1]}/${arrayOfDate[0]}/${arrayOfDate[2]}`);
		const date = new Date(newFormatDate);

		if (isValidOrEmpty) {
			if (!value)
				clearErrors(name);
			 else if (checkIsValidDate(newFormatDate)) {
				clearErrors(name);
				setValue(name, date);
			} else {
				setValue('');
				if (inputValue) setError(name, { message: errorMessage || invalidDateError });
			}
		} else {
			if (checkIsValidDate(newFormatDate) && date.toDateString() !== invalidDateError) {
				clearErrors(name);
				setValue(name, date);
			} else {
				setValue('');

				if (inputValue) setError(name, { message: errorMessage || invalidDateError });
			}
		}

		setInputValue(value);
	};

	return (
		<div
			className='app-date-picker'
			ref={appDatePickerNode}
		>
			{label && <S16 className='label'>{label}</S16>}
			<div className='value' onClick={toggleIsOpen}>
				{!isSingleDate && rangeDate && isVisibleRange
					&& <div className='range-text'>
						{textForRange()}
					</div>
				}
				{calendarIcon}
				{isSingleDate
					&& <Controller
						style={{ 'display': 'none' }}
						name={name}
						control={control}
						register={register}
						render={props => (
							<input
								style={{ 'display': 'none' }}
								{...props}
								name={name}
								value={value || ''}
								ref={inputRef}
							/>
						)}
					/>
				}
				{isWithInput
					&& <div className={`input-container${isError ? ' error' : ''}`}>
						{(placeholder && !inputValue) && <div className='input-placeholder'>{placeholder}</div>}
						<InputMask
							className={datePickerStyles}
							onChange={handleSetInputValue}
							value={inputValue}
							mask='99/99/9999'
							disabled={disabled}
						/>
						{value && !disabled
							&& <span onClick={clearValue} className='close'>
								{Icons.close()}
							</span>
						}
					</div>
				}
			</div>
			{isOpen && !isSingleDate
				&& <DateRange
					onChange={onDateRangeChanged}
					moveRangeOnFirstSelection={false}
					ranges={state}
					weekStartsOn={1}
					startDatePlaceholder='Day From'
					endDatePlaceholder='Day To'
					dateDisplayFormat='d-MM-yyyy'
					editableDateInputs={false}
					minDate={minDate}
					maxDate={maxDate}
				/>
			}
			{isOpen && isSingleDate
					&& <Calendar
						color={colors.grass50}
						onChange={onSingleValueChange}
						date={singleDate}
						dateDisplayFormat={'d-MM-yyyy'}
						editableDateInputs={false}
						angeColors={[colors.grass50]}
						minDate={minDate}
						maxDate={maxDate}
					/>
			}
		</div>
	);
};

AppDatePicker.defaultProps = {
	placeholder: '',
	setDateRange: () => {},
	onChange: () => {},
	setError: () => {},
	setValue: () => {},
	clearErrors: () => {},
	isWithInput: false,
	singleDate: true,
	isValidOrEmpty: false,
	isBorder: false,
	disabled: false,
};

AppDatePicker.propTypes = {
	name: string,
	control: object,
	register: func,
	placeholder: string,
	setDateRange: func,
	dateFrom: number,
	dateTo: number,
	isSingleDate: bool,
	isVisibleRange: bool,
	label: string,
	onChange: func,
	value: oneOfType([instanceOf(Date), string]),
	minDate: instanceOf(Date),
	maxDate: instanceOf(Date),
	isWithInput: bool,
	setValue: func,
	clearErrors: func,
	isError: bool,
	setError: func,
	errorMessage: string,
	isValidOrEmpty: bool,
	isBorder: bool,
	disabled: bool,
};

export default memo(AppDatePicker);
