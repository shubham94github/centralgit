import React, { memo, useEffect, useMemo, useRef, useState } from 'react';
import { Controller } from 'react-hook-form';
import { colors } from '@colors';
import { func, instanceOf, number, object, string } from 'prop-types';
import cn from 'classnames';
import DateRange from 'react-date-range/dist/components/DateRange';
import { useOnClickOutside } from '@utils/hooks/useOnClickOutside';
import { dateFormatCorrection } from '@utils';
import { startOfDay, endOfDay, getTime } from 'date-fns';

import './DateRangePicker.scss';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

const DateRangePicker = ({
	name,
	control,
	register,
	dateFrom,
	dateTo,
	minDate,
	maxDate,
	onChange,
	placeholder,
	className,
}) => {
	const appDatePickerNode = useRef(null);
	const [isOpen, setIsOpen] = useState(false);
	const [rangeDate, setRangeDate] = useState(null);
	const [chosenDateCount, setChosenDateCount] = useState(0);
	const [inputValue, setInputValue] = useState('');
	const defaultState = useMemo(() => [{
		startDate: dateFrom ? new Date(dateFrom) : undefined,
		endDate: dateTo ? new Date(dateTo) : undefined,
		color: colors.grass50,
		key: 'selection',
	}], [dateFrom, dateTo]);
	const [state, setState] = useState(defaultState);
	const classes = cn('date-range-picker', { [className]: !!className });
	const [styles, setStyles] = useState();

	const open = () => setIsOpen(true);

	const close = () => setIsOpen(false);

	useEffect(() => setState(defaultState), [defaultState]);

	useEffect(() => {
		if (chosenDateCount >= 2) {
			onChange({
				startDate: getTime(startOfDay(state[0].startDate)),
				endDate: getTime(endOfDay(state[0].endDate)),
			});

			setChosenDateCount(0);
			close();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [onChange, state, dateFrom, dateTo]);

	useEffect(() => {
		if (!isNaN(getTime(state[0].startDate)) && !isNaN(getTime(state[0].endDate))
			&& !!dateFrom
			&& dateTo
			&& dateFormatCorrection(state[0].startDate) !== dateFormatCorrection(dateFrom)
			&& dateFormatCorrection(state[0].endDate) !== dateFormatCorrection(dateTo)
		)
			setState([{ ...state[0], startDate: new Date(dateFrom), endDate: new Date(dateTo) }]);
	}, [dateTo, dateFrom, state]);

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
		onChange(dateInterval);
	};

	useOnClickOutside([appDatePickerNode], () => {
		if (state[0].startDate && state[0].endDate)
			onChange(state[0]);

		close();
	});

	const textForRange = () => {
		if (!dateFrom && !dateTo) {
			setRangeDate(null);
			setInputValue('');
		} else {
			const isVisibleYear = rangeDate?.startDate?.getFullYear() < rangeDate?.endDate?.getFullYear();
			const startDate = isVisibleYear
				? dateFormatCorrection(rangeDate?.startDate, 'MMM d, yyyy')
				: dateFormatCorrection(rangeDate?.startDate, 'MMM d');
			const endDate = dateFormatCorrection(rangeDate?.endDate, 'MMM d, yyyy');

			setInputValue(`${startDate} – ${endDate}`);
		}
	};

	useEffect(() => {
		textForRange();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [dateFrom, dateTo]);

	useEffect(() => {
		if (appDatePickerNode.current) {
			const { bottom, left } = appDatePickerNode.current.getBoundingClientRect();

			setStyles({
				position: 'fixed',
				top: bottom - 35,
				left,
				zIndex: 100,
			});
		}
	}, []);

	return (
		<div
			className={classes}
			ref={appDatePickerNode}
		>
			<Controller
				name={name}
				control={control}
				register={register}
				render={() => (
					<div
						className='date-range-input'
						onClick={open}
					>
						<input
							value={inputValue}
							placeholder={placeholder}
							readOnly={true}
						/>
						{isOpen
							&& <div
								style={styles}
							>
								<DateRange
									onChange={onDateRangeChanged}
									ranges={state}
									weekStartsOn={1}
									startDatePlaceholder='Day From'
									endDatePlaceholder='Day To'
									dateDisplayFormat='d-MM-yyyy'
									editableDateInputs={false}
									minDate={minDate}
									maxDate={maxDate}
									preventSnapRefocus={true}
									ref={register}
								/>
							</div>
						}
					</div>
				)}
			/>
		</div>
	);
};

DateRangePicker.propTypes = {
	name: string,
	control: object,
	register: func,
	placeholder: string,
	dateFrom: number,
	dateTo: number,
	minDate: instanceOf(Date),
	maxDate: instanceOf(Date),
	onChange: func.isRequired,
	className: string,
};

export default memo(DateRangePicker);
