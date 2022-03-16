import React, { useEffect, useRef, useState } from 'react';
import { bool, func, number, oneOfType, string, node } from 'prop-types';
import { colors } from '@constants/colors';
import cn from 'classnames';
import { Spinner } from 'react-bootstrap';
import { useOnClickOutside } from '@utils/hooks/useOnClickOutside';
import SearchHistory from '@components/BrowsePage/SearchForStartups/SearchHistory';
import { Icons } from '@icons';

import './SearchInput.scss';

const delayForSendValue = 1000;

const searchIcon = Icons.searchIcon(colors.gray50);

function SearchInput({
	placeholder,
	isFilter,
	onFilterClick,
	onSearch,
	initialValue,
	disabled,
	className,
	children,
	value,
	sendValue,
	isOuterValue,
	isClearable,
	onFocusIn,
	isLoading,
	isAutoFocus,
	isSearchHistory,
}) {
	const [isOpenSearchHistory, setIsOpenSearchHistory] = useState(false);
	const [localValue, seLocalValue] = useState(isOuterValue ? value : initialValue);
	const timerId = useRef(null);
	const inputRef = useRef(null);
	const classes = cn('search-input', { [className]: !!className });
	const searchNode = useRef(null);
	const editNode = useRef(null);

	const handleOpenSearchHistory = isOpen => setIsOpenSearchHistory(isOpen);

	const openSearchHistory = () => handleOpenSearchHistory(true);

	useOnClickOutside([searchNode, editNode], () => handleOpenSearchHistory(false));

	useEffect(
		() => !isOuterValue && seLocalValue(initialValue),
		[initialValue, isOuterValue],
	);

	useEffect(() => {
		if (!isLoading && isAutoFocus) inputRef.current.focus();
	}, [isLoading, isAutoFocus]);

	const onInputChange = e => {
		clearTimeout(timerId.current);

		if (isOuterValue) sendValue(e.target.value);
		else seLocalValue(e.target.value);

		timerId.current = setTimeout(() => {
			if (e.target.value.length > 1) onSearch(e.target.value);
			if (e.target.value.length === 0) onSearch(e.target.value);
		}, delayForSendValue);
	};

	const clearValue = () => {
		if (isOuterValue) {
			sendValue('');
			onSearch('');
		} else {
			seLocalValue('');
			onSearch('');
		}
	};

	return (
		<div ref={searchNode} className='search-input-container'>
			<div className='icon'>{searchIcon}</div>
			<input
				onChange={onInputChange}
				className={classes}
				type='text'
				value={isOuterValue ? value : localValue}
				placeholder={placeholder}
				disabled={disabled || isLoading}
				onFocus={onFocusIn}
				ref={inputRef}
				onClick={openSearchHistory}
			/>
			{isFilter && <div className='filter' onClick={onFilterClick}>{Icons.filter()}</div>}
			{ (isOuterValue ? !!value.length : !!localValue.length) && children}
			{ isClearable
				&& (isOuterValue ? !!value?.length : !!localValue?.length)
				&& <span onClick={clearValue} className='clear-value'>{Icons.close()}</span>
			}
			{isLoading
				&& <div className='spinner'>
					<Spinner
						animation='border'
						variant='danger'
						className='spinner-border-xs'
						size='sm'
					/>
				</div>
			}
			{isSearchHistory
				&& <SearchHistory
					isOpenSearchHistory={isOpenSearchHistory}
					localValue={localValue}
					editNode={editNode}
					handleOpenSearchHistory={handleOpenSearchHistory}
				/>
			}
		</div>
	);
}

SearchInput.defaultProps = {
	placeholder: 'Search...',
	initialValue: '',
	disabled: false,
	className: '',
	isClearable: false,
	isLoading: false,
	isAutoFocus: true,
	isSearchHistory: false,
};

SearchInput.propTypes = {
	value: oneOfType([string, number]),
	placeholder: oneOfType([string, number]),
	isFilter: bool,
	onFilterClick: func,
	onSearch: func,
	initialValue: string,
	className: string,
	disabled: bool,
	children: node,
	sendValue: func,
	isOuterValue: bool,
	isClearable: bool,
	onFocusIn: func,
	isLoading: bool,
	isAutoFocus: bool,
	isSearchHistory: bool,
};

export default SearchInput;
