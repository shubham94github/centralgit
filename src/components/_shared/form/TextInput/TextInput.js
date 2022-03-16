import React, { memo, useEffect, useRef, useState } from 'react';
import { bool, func, string, object, oneOfType, number } from 'prop-types';
import { colors } from '@colors';
import cn from 'classnames';
import InputMask from 'react-input-mask';
import { Controller } from 'react-hook-form';
import PhoneNumberInput from '@components/_shared/form/PhoneNumberInput';
import { Icons } from '@icons';
import { removeSpecialCharacters } from '@utils/removeSpecialCharacters';
import { replaceAllDotsExceptFirst } from '@utils/replaceAllDotsExceptFirst';
import {
	regExpCity,
	regExpNumbersAndLetters,
	regExpOnlyLettersAndDash,
	regExpOnlyNumber,
	regExpOnlyNumbersAndDot,
} from '@utils/regExp';

import './TextInput.scss';

const blackNoEyeIcon = Icons.noEyeIconPass(colors.gray40);
const darkUnionIcon = Icons.unionIconPass(colors.gray60);
const lightUnionIcon = Icons.unionIconPass(colors.gray40);
const darkNoEyeIcon = Icons.unionIconPass(colors.gray60);
const lightNoEyeIcon = Icons.noEyeIconPass(colors.gray40);

const TextInput = ({
	id,
	type,
	name,
	isError,
	warning,
	success,
	placeholder,
	disabled,
	onChange,
	className,
	isLightTheme,
	onBlur,
	onFocus,
	register,
	mask,
	readOnly,
	control,
	value,
	isEditable,
	onSetEdit,
	isBorder,
	isWithoutTopPlaceholder,
	setValue,
}) => {
	const [visibility, setVisibility] = useState(false);
	const [isEdit, setIsEdit] = useState(false);

	const nodeRefContainer = useRef();

	const classes = cn({
		'text-input-light': isLightTheme,
		'text-input-border': isBorder,
		'text-input-dark': !isLightTheme,
		'pass-theme': type === 'password',
		'text-input__error': isError,
		'text-input__warring': !!warning,
		'text-input__success': success,
		'text-input__readonly': isEditable ? !isEdit : readOnly,
		'text-input__empty': !value?.length,
		'without-top-placeholder': isWithoutTopPlaceholder,
		[className]: !!className,
	});

	useEffect(() => {
		const inputNode = nodeRefContainer?.current?.querySelector('.text-input-container');

		if (inputNode?.value) setVisibility(true);
	}, []);

	const onFocusHandler = () => {
		if (onFocus) onFocus();
	};

	const onBlurHandler = e => {
		if (onBlur) onBlur(e.target.value.trim());
	};

	const onChangeHandlerPassword = () => {
		if (!disabled)
			setVisibility(prevState => !prevState);

		onChange();
	};

	const onKeyDown = e => {
		const invalidChars = ['-', 'e', '+'];

		if (type === 'number' && invalidChars.includes(e.key))
			e.preventDefault();
	};

	const onChangeHandler = e => {
		const { value } = e.target;

		switch (name) {
			case 'city':
				removeSpecialCharacters(value, name, setValue, regExpCity);
				break;
			case 'postZipCode':
				removeSpecialCharacters(value, name, setValue, regExpNumbersAndLetters);
				break;
			case 'budget':
				removeSpecialCharacters(value.slice(0, 15), name, setValue, regExpOnlyNumber);
				break;
			case 'idCodeCoupon':
				removeSpecialCharacters(value.slice(0, 20), name, setValue, regExpNumbersAndLetters);
				break;
			case 'percentOff':
			case 'durationInMonths':
				removeSpecialCharacters(value.slice(0, 3), name, setValue, regExpOnlyNumber);
				break;
			case 'amountOff':
				removeSpecialCharacters(value.slice(0, 4), name, setValue, regExpOnlyNumber);
				break;
			case 'unitAmount':
				const cutValue = replaceAllDotsExceptFirst(value).slice(0, 6);

				removeSpecialCharacters(cutValue, name, setValue, regExpOnlyNumbersAndDot);
				break;
			case 'maxRedemptions':
				removeSpecialCharacters(value.slice(0, 5), name, setValue, regExpOnlyNumber);
				break;

			case 'firstName':
			case 'lastName':
			case 'owner':
				removeSpecialCharacters(value, name, setValue, regExpOnlyLettersAndDash);
				break;
			default: if (onChange) onChange(e);
		}
	};

	const getInputIcon = () => {
		return isLightTheme
			? (visibility ? blackNoEyeIcon : lightUnionIcon)
			: (
				disabled
					? darkUnionIcon
					: visibility
						? lightNoEyeIcon
						: darkNoEyeIcon
			);
	};

	const onEditHandler = () => {
		setIsEdit(prevState => {
			if (!prevState) onSetEdit(prevState);

			return !prevState;
		});
	};

	const inputType = type === 'password'
		? (isEditable
			? isEdit
				? 'text'
				: visibility
					? 'text'
					: 'password'
			: visibility
				? 'text'
				: 'password')
		: type;

	const handleSetVisibility = () => setVisibility(!visibility);

	if (type === 'tel') {
		return (
			<PhoneNumberInput
				inputType={type}
				onChange={onChange}
				placeholder={placeholder}
				onBlurHandler={onBlurHandler}
				onFocusHandler={onFocusHandler}
				disabled={disabled}
				value={value}
				readOnly={readOnly}
				id={id}
				name={name}
				register={register}
				isEditable={isEditable}
				isEdit={isEdit}
				classes={classes}
				control={control}
				className={classes}
			/>
		);
	}

	return (
		<div className={`text-input-container${isError ? ' error' : ''}`} ref={nodeRefContainer}>
			{
				mask
					? <Controller
						id={id}
						name={name}
						register={register}
						control={control}
						render={props => (
							<InputMask
								id={id}
								{...props}
								name={name}
								className={classes}
								disabled={disabled}
								placeholder={placeholder}
								ref={register}
								onChange={onChange}
								onFocus={onFocusHandler}
								onBlur={onBlurHandler}
								mask={mask}
								value={value}
							>
								{({ innerProps }) => (
									<input
										id={id}
										type={inputType}
										name={name}
										className={classes}
										disabled={disabled}
										onChange={onChange}
										placeholder={placeholder}
										ref={register}
										onFocus={onFocusHandler}
										onBlur={onBlurHandler}
										value={value}
										{...innerProps}
									/>
								)}
							</InputMask>
						)}
					/>
					: <input
						id={id}
						type={inputType}
						name={name}
						className={classes}
						disabled={disabled}
						onChange={onChangeHandler}
						onBlur={onBlurHandler}
						onFocus={onFocusHandler}
						placeholder={placeholder}
						ref={register}
						readOnly={isEditable ? !isEdit : readOnly}
						value={value}
						onKeyDown={onKeyDown}
					/>
			}
			{!isWithoutTopPlaceholder && <label htmlFor={id}>{placeholder}</label>}
			{
				type === 'password'
					&& <label htmlFor={id} onClick={handleSetVisibility}>
						{ isEditable ? Icons.edit(colors.gray60) : getInputIcon() }
						<input
							name='show-password-icon'
							id={`${id}checkbox`}
							value={!!visibility}
							type='checkbox'
							className='password-checkbox'
							onChange={isEditable ? onEditHandler : onChangeHandlerPassword}
							onBlur={onBlurHandler}
							onFocus={onFocusHandler}
						/>
					</label>
			}
		</div>
	);
};

TextInput.defaultProps = {
	id: '',
	type: 'text',
	disabled: false,
	isError: false,
	warning: '',
	success: '',
	className: '',
	isLightTheme: false,
	readOnly: false,
	isEditable: false,
	isBorder: false,
	isWithoutTopPlaceholder: false,
};

TextInput.propTypes = {
	id: oneOfType([string, number]),
	type: string,
	name: string,
	value: oneOfType([string, number]),
	isError: bool,
	warning: string,
	success: string,
	placeholder: string,
	disabled: bool,
	onChange: func,
	onBlur: func,
	onFocus: func,
	className: string,
	isLightTheme: bool,
	register: func,
	mask: string,
	readOnly: bool,
	control: object,
	isEditable: bool,
	onSetEdit: func,
	isBorder: bool,
	isWithoutTopPlaceholder: bool,
	setValue: func,
};

export default memo(TextInput);
