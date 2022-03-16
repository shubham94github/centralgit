import React, { useMemo } from 'react';
import TextInput from '@components/_shared/form/TextInput';
import { S16 } from '@components/_shared/text';
import { bool, func, object, string } from 'prop-types';
import Select from '@components/_shared/form/Select';
import { currencyOptions } from './constants';
import prepareSelectStyles from './prepareSelectStyles';
import { saleValues } from '@components/AdminPanel/SubscriptionPlans/DiscountCoupons/constants';

import './SaleInput.scss';

const SaleInput = ({
	control,
	isError,
	register,
	name,
	placeholder,
	onBlur,
	setValue,
	disabled,
	handleChange,
	selectedCurrency,
}) => {
	const selectStyles = useMemo(() => prepareSelectStyles(), []);
	const isAmountOf = name === saleValues[0].id;

	return (
		<div className='sale-input'>
			<TextInput
				control={control}
				isError={isError}
				register={register}
				isLightTheme
				name={name}
				placeholder={placeholder}
				onBlur={onBlur}
				setValue={setValue}
				disabled={disabled}
			/>
			{isAmountOf
				? <div className='percent-wrapper'>
					<S16>%</S16>
				</div>
				: <div className='amount-wrapper'>
					<Select
						options={currencyOptions}
						onChange={handleChange}
						isSearchable={false}
						isFilter={true}
						isCreateable={false}
						customStyles={selectStyles}
						value={selectedCurrency}
						disabled={disabled}
					/>
				</div>
			}
		</div>
	);
};

SaleInput.propTypes = {
	control: object,
	isError: bool,
	register: func,
	name: string,
	placeholder: string,
	onBlur: func,
	setValue: func,
	disabled: bool,
	handleChange: func,
	selectedCurrency: object,
};

export default SaleInput;
