import React, { memo, useCallback, useState, useRef, useEffect, useMemo } from 'react';
import { Range } from 'rc-slider';
import { array, func, number } from 'prop-types';
import { colors } from '@colors';

import 'rc-slider/assets/index.css';
import './Range.scss';

const RangeCustom = ({ min, max, defaultValue, onChangeHandler }) => {
	const setDefaultRange = useMemo(() =>
		({
			lowerBound: defaultValue[0],
			upperBound: defaultValue[1],
			value: [defaultValue[0], defaultValue[1]],
		})
	, [defaultValue]);
	const [rangeValues, setRangeValues] = useState(setDefaultRange);

	useEffect(() => setRangeValues(setDefaultRange), [setDefaultRange, setRangeValues]);

	const inputLeftRef = useRef(null);
	const inputRightRef = useRef(null);

	const onAfterChangeHandler = useCallback(value => onChangeHandler(value), [onChangeHandler]);

	const onSliderChange = useCallback(value =>
		setRangeValues({ lowerBound: value[0], upperBound: value[1], value: value }), []);

	const getValidValue = useCallback((value, item) =>
		(Number.isNaN(value) || value < min || value > max) ? [min, max][item] : value, [min, max]);

	const onInputChange = useCallback(() => {
		const { lowerBound, upperBound } = rangeValues;
		const validLowerValue = getValidValue(lowerBound, 0);
		const validUpperValue = getValidValue(upperBound, 1);
		const minValue = Math.min(validLowerValue, validUpperValue);
		const maxValue = Math.max(validLowerValue, validUpperValue);

		const data = {
			lowerBound: minValue,
			upperBound: maxValue,
			value: [minValue, maxValue],
		};

		setRangeValues(data);
		onAfterChangeHandler(data.value);
	}, [rangeValues, onAfterChangeHandler, getValidValue]);

	const onLowerBoundChange = e => {
		if (Number.isInteger(+e.target.value))
			setRangeValues({ ...rangeValues, lowerBound: +e.target.value });
	};

	const onUpperBoundChange = e => {
		if (Number.isInteger(+e.target.value))
			setRangeValues({ ...rangeValues, upperBound: +e.target.value });
	};

	const handleKeyDown = e => {
		if (e.code === 'Enter' || e.keyCode === 13) {
			inputRightRef.current.blur();
			inputLeftRef.current.blur();
		}
	};

	const dotStyle = {
		backgroundColor: colors.grass50,
		border: 'none',
		boxShadow: 'none',
	};

	return (
		<form
			className='range-container'
			onKeyDown={e => handleKeyDown(e)}
		>
			<div className='range-input-container'>
				<input
					value={rangeValues.lowerBound}
					className='range-input'
					type='tel'
					onChange={onLowerBoundChange}
					onBlur={onInputChange}
					ref={inputLeftRef}
				/>
				<input
					value={rangeValues.upperBound}
					className='range-input'
					type='tel'
					onChange={onUpperBoundChange}
					onBlur={onInputChange}
					ref={inputRightRef}
				/>
			</div>
			<div className='range'>
				<Range
					min={min}
					max={max}
					value={rangeValues.value}
					onChange={onSliderChange}
					onAfterChange={onAfterChangeHandler}
					trackStyle={[{ backgroundColor: colors.grass50 }]}
					handleStyle={[dotStyle, dotStyle]}
					railStyle={{ backgroundColor: colors.gray20 }}
					allowCross={false}
				/>
			</div>
		</form>
	);
}
;

RangeCustom.propTypes = {
	min: number,
	max: number,
	defaultValue: array,
	onChangeHandler: func,
};

RangeCustom.defaultProps = {
	min: 1,
	max: 29,
	defaultValue: [1, 29],
	onChangeHandler: () => {},
};

export default memo(RangeCustom);
