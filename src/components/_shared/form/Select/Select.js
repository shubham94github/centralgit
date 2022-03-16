import React, { memo, useEffect, useMemo, useRef, useState } from 'react';
import ReactSelect, { createFilter, components } from 'react-select';
import CreatableSelect from 'react-select/creatable';
import { Controller } from 'react-hook-form';
import { any, arrayOf, bool, func, object, shape, string, oneOfType, number } from 'prop-types';
import { P12 } from '@components/_shared/text';
import prepareSelectStyles from './prepareSelectStyles';
import { colors } from '@colors';
import { Icons } from '@icons';

import './Select.scss';

const closeIcon = Icons.close(colors.gray40);
const chevronDown = Icons.chevronDown(colors.gray40);

const DropdownIndicator = props => (
	<components.DropdownIndicator {...props}>
		{chevronDown}
	</components.DropdownIndicator>
);

const ClearIndicator = props => (
	<components.ClearIndicator {...props}>
		<span className='close'>{closeIcon}</span>
	</components.ClearIndicator>
);

const Select = ({
	name,
	value,
	placeholder,
	options,
	customStyles,
	disabled,
	control,
	register,
	isMulti,
	isClearable,
	isError,
	onChange,
	menuIsOpen,
	isSearchable,
	isCreatable,
	onMenuClose,
	components,
	handleCreateOpt,
	isFilter,
	menuPlacement,
	errorMessage,
	isFilterForStart,
	handleOptionsMessage,
	isBorder,
	contentEditable,
	createTitle,
	isTopPlaceholder,
	minMenuHeight,
}) => {
	const nodeRef = useRef();

	const [menuPlacementState, setMenuPlacementState] = useState('auto');

	const selectStyles = useMemo(() => prepareSelectStyles(isError, isBorder, isTopPlaceholder),
		[isError, isBorder, isTopPlaceholder]);
	const selectRef = useRef(null);

	const handleOnChange = opt => onChange(opt);

	const handleCreate = inputValue => handleCreateOpt(inputValue);

	const customFilter = createFilter({
		ignoreCase: true,
		ignoreAccents: true,
		matchFrom: isFilterForStart ? 'start' : 'any',
		trim: true,
	});

	const handleKeyDown = e => {
		if (e.keyCode === 32 && !selectRef.current.state.inputValue) e.preventDefault();
	};

	useEffect(() => {
		if (menuPlacement || !nodeRef.current) return;

		const space = window.innerHeight - nodeRef.current.offsetTop + nodeRef.current.offsetHeight;

		if (space < minMenuHeight) setMenuPlacementState('top');
	}, [menuPlacement, minMenuHeight]);

	return (
		<div className={`select-container${isError ? ' error' : ''}`} ref={nodeRef}>
			{isTopPlaceholder && !isMulti && !!value && (
				<div className='select-top-placeholder'>{value && placeholder}</div>
			)}
			{
				isFilter
					? <ReactSelect
						contentEditable={contentEditable}
						isMulti={isMulti}
						isClearable={isClearable}
						isCreatable={isCreatable}
						options={options}
						styles={{ ...selectStyles, ...(customStyles || {}) }}
						isDisabled={disabled}
						placeholder={placeholder}
						onChange={handleOnChange}
						menuIsOpen={menuIsOpen}
						isSearchable={isSearchable}
						onMenuClose={onMenuClose}
						components={{ ...components, DropdownIndicator, ClearIndicator }}
						value={value}
						menuPlacement={!!menuPlacement ? menuPlacement : menuPlacementState}
						filterOption={customFilter}
						noOptionsMessage={handleOptionsMessage}
						ref={selectRef}
						onKeyDown={handleKeyDown}
						minMenuHeight={minMenuHeight}
					/>
					: <Controller
						render={props => {
							const { onBlur, onChange } = props;

							const onChangeHandler = e => {
								handleOnChange(e);
								onChange(e);
							};

							const onBlurHandler = e => onBlur(e);

							return (
								!!isCreatable
									? <CreatableSelect
										contentEditable={contentEditable}
										{...props}
										onBlur={onBlurHandler}
										isMulti={isMulti}
										isClearable={true}
										isCreatable={isCreatable}
										options={options}
										styles={{ ...selectStyles, ...(customStyles || {}) }}
										isDisabled={disabled}
										placeholder={placeholder}
										onChange={onChangeHandler}
										menuIsOpen={menuIsOpen}
										onMenuClose={onMenuClose}
										components={{ ...components, DropdownIndicator, ClearIndicator }}
										onCreateOption={handleCreate}
										menuPlacement={menuPlacement}
										filterOption={customFilter}
										noOptionsMessage={handleOptionsMessage}
										ref={selectRef}
										onKeyDown={handleKeyDown}
										formatCreateLabel={userInput => `${createTitle} "${userInput}"`}
										minMenuHeight={minMenuHeight}
									/>
									: <ReactSelect
										contentEditable={contentEditable}
										{...props}
										onBlur={onBlurHandler}
										isMulti={isMulti}
										isClearable={isClearable}
										isCreatable={isCreatable}
										options={options}
										styles={{ ...selectStyles, ...(customStyles || {}) }}
										isDisabled={disabled}
										placeholder={placeholder}
										onChange={onChangeHandler}
										menuIsOpen={menuIsOpen}
										isSearchable={isSearchable}
										onMenuClose={onMenuClose}
										components={{ ...components, DropdownIndicator, ClearIndicator }}
										menuPlacement={menuPlacement}
										filterOption={customFilter}
										noOptionsMessage={handleOptionsMessage}
										ref={selectRef}
										onKeyDown={handleKeyDown}
										minMenuHeight={minMenuHeight}
									/>
							);
						}}
						name={name}
						control={control}
						register={register}
						defaultValue=''
					/>
			}
			{errorMessage
				&& <P12 className='error-text'>
					{errorMessage}
				</P12>
			}
		</div>
	);
};

Select.defaultProps = {
	name: '',
	isClearable: false,
	isFilter: false,
	isFilterForStart: false,
	handleOptionsMessage: () => null,
	isBorder: false,
	contentEditable: false,
	createTitle: 'Create',
	isTopPlaceholder: false,
};

Select.propTypes = {
	name: string.isRequired,
	value: any,
	placeholder: string,
	options: arrayOf(shape({ label: oneOfType([string, number]), value: any })),
	customStyles: any,
	disabled: bool,
	register: func,
	control: object,
	isMulti: bool,
	isClearable: bool,
	onChange: func,
	isError: bool,
	menuIsOpen: bool,
	isSearchable: bool,
	isCreatable: bool,
	components: object,
	onMenuClose: func,
	handleCreateOpt: func,
	isFilter: bool,
	isFilterForStart: bool,
	menuPlacement: string,
	errorMessage: string,
	handleOptionsMessage: func,
	isBorder: bool,
	contentEditable: bool,
	createTitle: string,
	onBlur: func,
	isTopPlaceholder: bool,
	minMenuHeight: number,
};

export default memo(Select);
