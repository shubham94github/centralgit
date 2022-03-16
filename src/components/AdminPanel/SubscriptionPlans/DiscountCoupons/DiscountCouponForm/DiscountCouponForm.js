import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { percentOffSchema, amountOffSchema, editSchema } from './schema';
import { yupResolver } from '@hookform/resolvers/yup';
import enums from '@constants/enums';
import GridContainer from '@components/layouts/GridContainer';
import TextInput from '@components/_shared/form/TextInput';
import { P12 } from '@components/_shared/text';
import { isEmpty } from '@utils/js-helpers';
import PrimaryButton from '@components/_shared/buttons/PrimaryButton';
import { generateIdCodeCoupon } from '@utils/generateIdCodeCoupon';
import { generateListOfIdCodeCoupon } from '../utils';
import { array, arrayOf, bool, func, oneOfType, oneOf } from 'prop-types';
import {
	durationValues,
	errorMessageIdCodeCoupon,
	errorMessageRedeemBy,
	saleValues,
} from '../constants';
import RadioButton from '@components/_shared/form/RadioButton';
import SaleInput from './SaleInput';
import { currencyOptions } from './SaleInput/constants';
import { onSelectChange } from '@utils/onSelectChange';
import Select from '@components/_shared/form/Select/Select';
import DatePicker from '@components/_shared/form/DatePicker';
import { connect } from 'react-redux';
import { getPaymentPlansOptions } from '@ducks/common/actions';
import { discountCouponType } from '@constants/types';
import { validationErrMessages } from '@constants/common';

const DiscountCouponForm = ({
	discountCoupons,
	closeDiscountCouponModal,
	selectedCoupon,
	createDiscountCoupon,
	editDiscountCoupon,
	isDiscountCouponChanging,
	getPaymentPlansOptions,
	paymentPlansForCoupons,
	isLoadingPaymentPlans,
}) => {
	const isEditMode = useMemo(() => !!selectedCoupon, [selectedCoupon]);
	const isEditPercentOff = useMemo(() => !!selectedCoupon?.percentOff, [selectedCoupon]);
	const minFutureDate = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
	const [saleType, setSaleType] = useState(saleValues[0].value);
	const [selectedCurrency, setSelectedCurrency] = useState(currencyOptions[0]);

	useEffect(() => {
		if (!paymentPlansForCoupons.length) getPaymentPlansOptions();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (!isEditMode) return;

		setSelectedCurrency(currencyOptions.find(({ value }) => value === selectedCoupon?.currency));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isEditMode]);

	useEffect(() => {
		if (!isEditMode) return;
		setSaleType(saleValues[isEditPercentOff ? 0 : 1].value);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isEditMode]);

	const schema = useMemo(() => (
		isEditMode
			? editSchema
			: saleType === saleValues[0].value
				? percentOffSchema
				: amountOffSchema
	), [saleType, isEditMode]);

	const {
		control,
		handleSubmit,
		setValue,
		setError,
		errors,
		register,
		clearErrors,
		watch,
		reset,
		getValues,
	} = useForm({
		resolver: yupResolver(schema),
		mode: enums.validationMode.onTouched,
		validationMode: enums.validationMode.onTouched,
		defaultValues: isEditMode
			? {
				...schema.default(),
				name: selectedCoupon?.name,
				idCodeCoupon: selectedCoupon?.code,
				percentOff: isEditPercentOff
					? selectedCoupon?.percentOff
					: schema.default().percentOff,
				amountOff: isEditPercentOff
					? schema.default().amountOff
					: selectedCoupon?.amountOff,
				duration: durationValues.find(duration =>
					duration.value === selectedCoupon.duration),
				durationInMonths: selectedCoupon?.durationInMonths || schema.default().durationInMonths,
				maxRedemptions: selectedCoupon?.maxRedemptions
					? selectedCoupon?.maxRedemptions.toString()
					: schema.default().maxRedemptions,
				redeemBy: new Date(selectedCoupon?.redeemBy * 1000),
			}
			: schema.default(),
	});

	const planIds = watch('planIds');
	const duration = watch('duration');
	const durationInMonths = watch('durationInMonths');

	useEffect(() => {
		if (isEditMode && !isEmpty(selectedCoupon)) {
			reset({
				...getValues(),
				planIds: paymentPlansForCoupons
					.filter(coupon =>
						selectedCoupon?.paymentPlans.map(({ id }) => id)
							.includes(coupon.id)),
			});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedCoupon, paymentPlansForCoupons, isEditMode]);

	const handleChangeCurrencySelect = option => setSelectedCurrency(option);

	// eslint-disable-next-line react-hooks/exhaustive-deps
	const listOfIdCodeCoupon = useCallback(generateListOfIdCodeCoupon(discountCoupons), [discountCoupons]);

	const trimValues = fieldName => value => setValue(fieldName, value?.trim(), { shouldValidate: true });

	const changeSaleType = value => () => {
		setSaleType(value);
		clearErrors('percentOff');
		clearErrors('amountOff');
	};

	const onDateChange = fieldName => date => {
		if (!date)
			setError(fieldName, { message: errorMessageRedeemBy });
		else
			clearErrors(fieldName);

		setValue(fieldName, date ? new Date(date) : date);
	};

	const generateKey = () => {
		const code = generateIdCodeCoupon(listOfIdCodeCoupon);

		setValue('idCodeCoupon', code, { shouldValidate: true });
	};

	const revalidatePlanIds = plans => {
		if (!!plans && !plans?.length)
			setValue('planIds', null, { shouldValidate: true });
	};

	useEffect(() => {
		revalidatePlanIds(planIds);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [planIds]);

	const onSubmit = values => {
		const isDurationRepeating = duration === durationValues[2];

		if (listOfIdCodeCoupon.includes(values.idCodeCoupon)) {
			setError('idCodeCoupon',
				{ message: errorMessageIdCodeCoupon });
		} else if (isDurationRepeating && !durationInMonths?.trim().length)
			setError('durationInMonths', { message: validationErrMessages.durationInMonths });
		else {
			const isPercentOff = saleType === saleValues[0].value;

			const redeemByInSeconds = values.redeemBy / 1000;

			const discountCouponFormDate = isEditMode
				? {
					name: values.name,
					codeId: selectedCoupon.id,
				}
				:{
					name: values.name,
					amountOff: isPercentOff ? null : values.amountOff,
					percentOff: isPercentOff ? values.percentOff : null,
					code: values.idCodeCoupon,
					currency: selectedCurrency.value,
					duration: values.duration.value,
					durationInMonths: values.durationInMonths,
					maxRedemptions: values.maxRedemptions || schema.default().maxRedemptions,
					redeemBy: redeemByInSeconds,
					planIds: values.planIds.map(({ id }) => id),
				};

			if (isEditMode) editDiscountCoupon(discountCouponFormDate);
			else createDiscountCoupon(discountCouponFormDate);
		}
	};

	return (
		<GridContainer gap='15px'>
			<div>
				<TextInput
					control={control}
					isError={!!errors.name}
					register={register}
					isLightTheme
					name='name'
					placeholder='Coupon name'
					onBlur={trimValues('name')}
				/>
				{!!errors.name && <P12 className='warning-text'>{errors.name.message}</P12>}
			</div>
			<GridContainer
				template='415px auto'
				gap='15px'
				customClassName='align-items-start'
			>
				<div>
					<TextInput
						control={control}
						isError={!!errors.idCodeCoupon}
						register={register}
						isLightTheme
						name='idCodeCoupon'
						placeholder='Id code'
						onBlur={trimValues('idCodeCoupon')}
						setValue={setValue}
						disabled={isEditMode}
					/>
					{!!errors.idCodeCoupon && <P12 className='warning-text'>{errors.idCodeCoupon.message}</P12>}
				</div>
				<PrimaryButton
					text='Generate'
					isLoading={false}
					onClick={generateKey}
					disabled={isEditMode}
					isAdmin
				/>
			</GridContainer>
			<GridContainer columns={2} gap='30px'>
				{saleValues.map(({ value, label, id }) => (
					<RadioButton
						isFilter={true}
						id={id}
						key={id}
						label={label}
						checked={saleType === value}
						value={value}
						onChange={changeSaleType}
						disabled={isEditMode}
					/>
				))
				}
			</GridContainer>
			<GridContainer columns={2} gap='15px 30px'>
				<div>
					<SaleInput
						control={control}
						isError={!!errors.percentOff}
						register={register}
						name='percentOff'
						placeholder='Percent off'
						onBlur={trimValues('percentOff')}
						setValue={setValue}
						disabled={saleType === saleValues[1].value || isEditMode}
					/>
					{!!errors.percentOff && <P12 className='warning-text'>{errors.percentOff.message}</P12>}
				</div>
				<div>
					<SaleInput
						control={control}
						isError={!!errors.amountOff}
						register={register}
						name='amountOff'
						placeholder='Amount off'
						onBlur={trimValues('amountOff')}
						setValue={setValue}
						disabled={saleType === saleValues[0].value || isEditMode}
						selectedCurrency={selectedCurrency}
						handleChangeCurrencySelect={handleChangeCurrencySelect}
					/>
					{!!errors.amountOff && <P12 className='warning-text'>{errors.amountOff.message}</P12>}
				</div>
				<div>
					<Select
						control={control}
						isCreatable={false}
						isError={!!errors.duration}
						isSearchable
						name='duration'
						onChange={onSelectChange({
							fieldName: 'duration',
							setError,
							setValue,
							clearErrors,
						})}
						options={durationValues}
						placeholder='Duration'
						register={register}
						value={watch('duration')}
						isFilterForStart
						isTopPlaceholder
						disabled={isEditMode}
						minMenuHeight={150}
					/>
					{!!errors.duration && <P12 className='warning-text'>{errors.duration.message}</P12>}
				</div>
				<div>
					<TextInput
						control={control}
						isError={!!errors.durationInMonths}
						register={register}
						isLightTheme
						name='durationInMonths'
						placeholder='Duration in months'
						onBlur={trimValues('durationInMonths')}
						setValue={setValue}
						disabled={isEditMode || duration !== durationValues[2]}
					/>
					{!!errors.durationInMonths && <P12 className='warning-text'>{errors.durationInMonths.message}</P12>}
				</div>
				<div>
					<TextInput
						control={control}
						isError={!!errors.maxRedemptions}
						register={register}
						isLightTheme
						name='maxRedemptions'
						placeholder='Max redemptions'
						onBlur={trimValues('maxRedemptions')}
						setValue={setValue}
						disabled={isEditMode}
					/>
					{!!errors.maxRedemptions && <P12 className='warning-text'>{errors.maxRedemptions.message}</P12>}
				</div>
				<div className='custom-date-picker'>
					<DatePicker
						control={control}
						isSingleDate={true}
						label='Redeem by'
						minDate={minFutureDate}
						name='redeemBy'
						placeholder='MM/DD/YYYY'
						onChange={onDateChange('redeemBy')}
						register={register}
						value={watch('redeemBy')}
						isWithInput
						setValue={setValue}
						reset={reset}
						clearErrors={clearErrors}
						isError={!!errors.redeemBy}
						setError={setError}
						disabled={isEditMode}
					/>
					{!!errors.redeemBy && <P12 className='warning-text'>{errors.redeemBy.message}</P12>}
				</div>
			</GridContainer>
			<div>
				<Select
					control={control}
					isCreateable={false}
					isMulti={true}
					isSearchable={true}
					name='planIds'
					onChange={onSelectChange({
						fieldName: 'planIds',
						setValue,
						setError,
						clearErrors,
					})}
					menuPlacement='auto'
					options={paymentPlansForCoupons}
					placeholder='Apply to Payment Plans'
					register={register}
					value={watch('planIds')}
					isError={!!errors.planIds}
					disabled={isEditMode || isLoadingPaymentPlans}
				/>
				{!!errors.planIds && <P12 className='warning-text'>{errors.planIds.message}</P12>}
			</div>
			<GridContainer columns={2}>
				<PrimaryButton
					onClick={closeDiscountCouponModal}
					text='Cancel'
					isLoading={false}
					isOutline
				/>
				<PrimaryButton
					disabled={!isEmpty(errors)}
					onClick={handleSubmit(onSubmit)}
					text='Add'
					isLoading={isDiscountCouponChanging}
				/>
			</GridContainer>
		</GridContainer>
	);
};

DiscountCouponForm.propTypes = {
	discountCoupons: arrayOf(discountCouponType),
	closeDiscountCouponModal: func.isRequired,
	selectedCoupon: oneOfType([oneOf([null]), discountCouponType]),
	createDiscountCoupon: func.isRequired,
	editDiscountCoupon: func.isRequired,
	getPaymentPlansOptions: func.isRequired,
	isDiscountCouponChanging: bool,
	paymentPlansForCoupons: array.isRequired,
	isLoadingPaymentPlans: bool.isRequired,
};

export default connect(({ common: { paymentPlansForCoupons, isLoading } }) => ({
	paymentPlansForCoupons,
	isLoadingPaymentPlans: isLoading,
}), {
	getPaymentPlansOptions,
})(memo(DiscountCouponForm));
