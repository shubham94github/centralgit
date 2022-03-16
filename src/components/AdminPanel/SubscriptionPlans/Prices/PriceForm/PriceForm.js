import React, { useState } from 'react';
import { bool, func, number, oneOfType, string } from 'prop-types';
import PrimaryButton from '@components/_shared/buttons/PrimaryButton';
import { useForm } from 'react-hook-form';
import enums from '@constants/enums';
import { schema } from './schema';
import TextInput from '@components/_shared/form/TextInput';
import GridContainer from '@components/layouts/GridContainer';
import Select from '@components/_shared/form/Select';
import TextArea from '@components/_shared/form/TextArea';
import { P12 } from '@components/_shared/text';
import { isEmpty } from '@utils/js-helpers';
import { yupResolver } from '@hookform/resolvers/yup';
import { currencyDefaultValue } from '@components/AdminPanel/SubscriptionPlans/Prices/PriceForm/constants';

import './PriceForm.scss';

const PriceForm = ({
	name,
	unitAmount,
	comment,
	id,
	onSubmit,
	onCancel,
	submitButtonText,
	isLoading,
	usingCount,
}) => {
	const [formError, setFormError] = useState();

	const {
		handleSubmit,
		register,
		errors,
		control,
		trigger,
		watch,
		setValue,
	} = useForm({
		mode: enums.validationMode.onTouched,
		resolver: yupResolver(schema),
		defaultValues: { name: name || '', unitAmount: (unitAmount / 100) || '', comment: comment || '' },
	});

	const submit = async values => {
		const res = await onSubmit({
			...values,
			unitAmount: +values.unitAmount * 100,
			currency: currencyDefaultValue.value,
			id,
		});

		if (res?.error) setFormError(res.error);
	};

	const clearFormError = () => setFormError(null);

	return (
		<div className='price-form'>
			<GridContainer>
				<div className='form-field'>
					<TextInput
						onChange={clearFormError}
						isLightTheme
						name='name'
						register={register}
						placeholder='Price name'
						id='price-name'
						isError={!!errors.name}
						isBorder={false}
					/>
					{!!errors.name && <P12 className='warning-text'>{errors.name.message}</P12>}
				</div>
			</GridContainer>
			<GridContainer columns={2}>
				<div className='form-field'>
					<TextInput
						onChange={clearFormError}
						isLightTheme
						name='unitAmount'
						register={register}
						placeholder='Amount'
						id='unitAmount'
						isError={!!errors.unitAmount}
						isBorder={false}
						value={watch('unitAmount')}
						type='text'
						setValue={setValue}
						readOnly={!!usingCount}
					/>
					{!!errors.unitAmount
						&& <P12 className='warning-text'>{errors.unitAmount.message}</P12>
					}
				</div>
				<div className='form-field'>
					<div className='form-field'>
						<Select
							name='currency'
							placeholder='USD'
							register={register}
							value={currencyDefaultValue}
							isBorder={false}
							isError={!!errors.currency}
							options={[currencyDefaultValue]}
							isMulti={false}
							isCreatable={false}
							disabled={true}
							control={control}
						/>
						{!!errors.currency
							&& <P12 className='warning-text'>{errors.currency.message}</P12>}
					</div>
				</div>
			</GridContainer>
			<GridContainer>
				<div className='form-field'>
					<TextArea
						onChange={clearFormError}
						isEditText={false}
						rows={2}
						classNames='full-width'
						name='comment'
						id='price-comment'
						register={register}
						control={control}
						isError={!!errors.comment}
						placeholder='Comments'
						trigger={trigger}
					/>
					{!!errors.comment && <P12 className='warning-text'>{errors.comment.message}</P12>}
				</div>
			</GridContainer>
			{formError
				&& <GridContainer>
					<P12 className='warning-text centered'>{formError}</P12>
				</GridContainer>
			}
			<GridContainer columns={2}>
				<PrimaryButton
					disabled={isLoading}
					isOutline
					onClick={onCancel}
				>
					Cancel
				</PrimaryButton>
				<PrimaryButton
					onClick={handleSubmit(submit)}
					disabled={!isEmpty(errors)}
					isLoading={isLoading}
				>
					{submitButtonText}
				</PrimaryButton>
			</GridContainer>
		</div>
	);
};

PriceForm.defaultProps = {
	submitButtonText: 'Ok',
};

PriceForm.propTypes = {
	name: string,
	unitAmount: number,
	comment: string,
	onSubmit: func.isRequired,
	onCancel: func.isRequired,
	submitButtonText: string,
	id: oneOfType([number, string]),
	isLoading: bool,
	usingCount: number,
};

export default PriceForm;
