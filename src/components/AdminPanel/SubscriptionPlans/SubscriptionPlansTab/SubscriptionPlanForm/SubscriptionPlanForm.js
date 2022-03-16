import React, { useEffect, useMemo, useState } from 'react';
import { array, arrayOf, bool, func, string } from 'prop-types';
import GridContainer from '@components/layouts/GridContainer';
import TextInput from '@components/_shared/form/TextInput';
import Select from '@components/_shared/form/Select';
import { P12 } from '@components/_shared/text';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { getSchema } from './schema';
import enums from '@constants/enums';
import PrimaryButton from '@components/_shared/buttons/PrimaryButton';
import { capitalizeFirstLetter, isEmpty } from '@utils/js-helpers';
import { normalizeString, separateCamelCase } from '@utils';
import { memberGroupType, priceType, subscriptionPlanType } from '@constants/types';
import { currencyFormatter } from '@utils/currencyFormatter';
import { intervalOptions, userRoleAllOptions } from './constants';
import { generateStripeName } from './utils';
import { generateId } from '@utils/generateId';
import Tooltip from '@components/_shared/Tooltip';

import './SubscriptionPlanForm.scss';

const SubscriptionPlanForm = ({
	onSubmit,
	isLoading,
	submitButtonText,
	paymentPlans,
	paymentPlanTypes,
	prices,
	memberGroups,
	plan,
	onClose,
}) => {
	const [chosenUserRole, setChosenUserRole] = useState();
	const [chosenPlanType, setChosenPlanType] = useState();
	const [formError, setFormError] = useState();

	const schema = getSchema(
		paymentPlans,
		{ planType: chosenPlanType?.value, userRole: chosenUserRole?.value },
		!!plan);

	const paymentPlanTypesOptions = useMemo(() => paymentPlanTypes.map(item => {
		return {
			label: item.split('_').map(word => capitalizeFirstLetter(word.toLowerCase())).join(' '),
			value: item,
		};
	}), [paymentPlanTypes]);

	const pricesOptions = useMemo(() => {
		if (!prices) return [];

		return prices.map(item => {
			return {
				label: `${item.name || `Price ${item.id}`} - ${currencyFormatter.format(item.unitAmount / 100)}`,
				value: item.id,
			};
		});
	}, [prices]);

	const memberGroupsOptions = useMemo(() => {
		if (!memberGroups) return [];

		return memberGroups.map(item => ({ label: item.name, value: item.id }));
	}, [memberGroups]);

	const planRole = userRoleAllOptions.find(role => role.value === plan?.role);

	const {
		control,
		register,
		setValue,
		handleSubmit,
		watch,
		setError,
		clearErrors,
		errors,
		getValues,
		formState: { dirtyFields },
	} = useForm({
		resolver: yupResolver(schema),
		mode: enums.validationMode.onTouched,
		defaultValues: plan
			? {
				memberGroupId: memberGroupsOptions.find(item => item.value === plan?.memberGroup?.id),
				planType: paymentPlanTypesOptions.find(item => item.value === plan?.planType),
				priceId: pricesOptions.find(item => item.value === plan?.price?.id),
				stripeName: plan.stripeName,
				stripePriceId: plan.stripePriceId,
				stripeProductId: plan.stripeProductId,
				trial: plan.trial,
				name: plan.uiName,
				enterpriseCode: plan.code,
				interval: intervalOptions.find(item => item.value === plan.interval),
				userRole: planRole ? { label: planRole.label, value: planRole.value } : null,
			}
			: schema.default(),
	});

	const values = getValues();

	useEffect(() => {
		if ((dirtyFields.priceId || dirtyFields.name) && values.stripeName && !plan)
			setValue('stripeName', '', { shouldValidate: false });
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [values.priceId, values.name]);

	const planTypeValue =  watch('planType');
	const userRoleValue =  watch('userRole');
	const isEnterprisePlanType = planTypeValue?.value === 'ENTERPRISE';
	const isSingleUserPlanType = planTypeValue?.value === 'SINGLE_USER';

	useEffect(() => {
		if (planTypeValue && isEnterprisePlanType) {
			setValue('userRole', null);
			clearErrors('userRole');
		} else if (isSingleUserPlanType) {
			setValue('memberGroupId', null);
			clearErrors('memberGroupId');
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [planTypeValue, isEnterprisePlanType, setValue, userRoleValue]);

	useEffect(() => {
		setChosenPlanType(planTypeValue);
		setChosenUserRole(userRoleValue);
	}, [planTypeValue, userRoleValue]);

	const generateEnterpriseCode = () => {
		const code = generateId();

		setValue('enterpriseCode', code, { shouldValidate: true });
	};

	const submit = values => {
		const {
			interval,
			memberGroupId,
			planType,
			priceId,
			userRole,
			stripeName,
			trial,
			name,
			enterpriseCode,
		} = values;

		onSubmit({
			id: plan && plan.id,
			interval: interval?.value,
			memberGroupId: +memberGroupId?.value,
			planType: planType?.value,
			priceId: +priceId?.value,
			role: userRole?.value,
			stripeName,
			trial: +trial,
			uiName: name,
			code: enterpriseCode || null,
		}, setFormError);
	};

	const onSelectChange = fieldName => option => {
		if (!option) {
			const separatedName = separateCamelCase(fieldName);

			setError(fieldName, { message: `${normalizeString(separatedName)}  is required field` });
		} else clearErrors(fieldName);

		setValue(fieldName, option, { shouldValidate: true });
	};

	const generateStripeProductName = () => {
		const chosenPrice = prices.find(item => values.priceId?.value === item.id);
		const priceName = chosenPrice?.name || values.priceId?.label.split(' - $')[0];
		const planName = values.name;

		if (!priceName) {
			setError('stripeName', { message: 'Can\'t generate stripe name. Please set price amount before' });
			return;
		}
		if (!planName) {
			setError('stripeName', { message: 'Can\'t generate stripe name. Please set plan name before' });
			return;
		}

		const name = generateStripeName({ planName, priceName });

		clearErrors('stripeName');
		setValue('stripeName', name, { shouldValidate: true });
	};

	const isDisabledGenerateStripeName = (!!watch('stripeName') && !errors.stripeName)
	|| !watch('name') || !watch('priceId') || !!plan;

	return (
		<div className='subscription-plans-form'>
			<GridContainer gap='0px'>
				<div className='field-container'>
					<TextInput
						name='name'
						id='name'
						register={register}
						type='text'
						isError={!!errors?.name}
						isLightTheme
						placeholder='Plan Name on the "Choose Plan" form'
					/>
					{!!errors.name && <P12 className='warning-text'>{errors.name.message}</P12>}
				</div>
			</GridContainer>
			<GridContainer columns={2} gap='0px 30px'>
				<div className='field-container'>
					<Select
						id='planType'
						name='planType'
						control={control}
						register={register}
						placeholder='Plan type'
						isFilter={false}
						isClearable
						isSearchable={false}
						options={paymentPlanTypesOptions}
						onChange={onSelectChange('planType')}
						value={watch('planType')}
						disabled={!!plan}
					/>
					{!!errors.planType && <P12 className='warning-text'>{errors.planType.message}</P12>}
				</div>
				<div className='field-container'>
					<Select
						name='priceId'
						control={control}
						register={register}
						placeholder='Price amount'
						isFilter={false}
						isSearchable={false}
						options={pricesOptions}
						onChange={onSelectChange('priceId')}
						isClearable
						value={watch('priceId')}
						disabled={!!plan}
					/>
					{!!errors.priceId && <P12 className='warning-text'>{errors.priceId.message}</P12>}
				</div>
			</GridContainer>
			<GridContainer gap='0px'>
				<div className='field-container'>
					<Select
						name='userRole'
						control={control}
						register={register}
						placeholder='User role'
						isFilter={false}
						isSearchable={false}
						options={userRoleAllOptions}
						isClearable
						onChange={onSelectChange('userRole')}
						value={watch('userRole')}
						isFilterForStart
						disabled={isEnterprisePlanType || !!plan}
						required={!isEnterprisePlanType}
					/>
					{!!errors.userRole && <P12 className='warning-text'>{errors.userRole.message}</P12>}
				</div>
			</GridContainer>
			{isEnterprisePlanType
				&& <GridContainer template='3fr 1fr' gap='0px 15px'>
					<div className='field-container'>
						<TextInput
							name='enterpriseCode'
							id='enterpriseCode'
							register={register}
							type='text'
							isError={!!errors?.enterpriseCode}
							isLightTheme
							placeholder='Enterprise сode'
							readOnly={!!plan}
						/>
						{!!errors.enterpriseCode && <P12 className='warning-text'>{errors.enterpriseCode.message}</P12>}
					</div>
					<div className='field-container'>
						<PrimaryButton
							className='filter-btn admin-primary full-width'
							onClick={generateEnterpriseCode}
							disabled={!!plan}
						>
							Generate
						</PrimaryButton>
					</div>
				</GridContainer>
			}
			<GridContainer gap='0px'>
				<div className='field-container'>
					<Select
						name='memberGroupId'
						control={control}
						register={register}
						isError={!!errors?.memberGroupId}
						placeholder='Group Name'
						isFilter={false}
						isSearchable={false}
						options={memberGroupsOptions}
						isClearable
						onChange={onSelectChange('memberGroupId')}
						value={watch('memberGroupId')}
						disabled={isSingleUserPlanType || !!plan}
					/>
					{!!errors.memberGroupId && <P12 className='warning-text'>{errors.memberGroupId.message}</P12>}
				</div>
			</GridContainer>
			<GridContainer columns={2} gap='0px 30px'>
				<div className='field-container'>
					<Select
						name='interval'
						control={control}
						register={register}
						placeholder='Payment period'
						isFilter={false}
						isSearchable={false}
						options={intervalOptions}
						isClearable
						onChange={onSelectChange('interval')}
						value={watch('interval')}
						disabled={!!plan}
					/>
					{!!errors.interval && <P12 className='warning-text'>{errors.interval.message}</P12>}
				</div>
				<div className='field-container'>
					<TextInput
						name='trial'
						type='number'
						register={register}
						isError={!!errors?.trial}
						placeholder='Trial period / days'
						isClearable
						isLightTheme
						readOnly={!!plan}
					/>
					{!!errors.trial && <P12 className='warning-text'>{errors.trial.message}</P12>}
				</div>
			</GridContainer>
			<GridContainer template='3fr 1fr' gap='0px 15px'>
				<div className='field-container'>
					<TextInput
						name='stripeName'
						register={register}
						isError={!!errors?.stripeName}
						placeholder='Enter the Product name on Stripe Side'
						isClearable
						isLightTheme
						readOnly={!!plan}
					/>
					{!!errors.stripeName && <P12 className='warning-text'>{errors.stripeName.message}</P12>}
				</div>
				<div className='field-container'>
					<Tooltip message='Generate name' placement='bottom'>
						<PrimaryButton
							disabled={isDisabledGenerateStripeName}
							className='filter-btn admin-primary full-width'
							onClick={generateStripeProductName}
						>
							Generate
						</PrimaryButton>
					</Tooltip>
				</div>
			</GridContainer>
			{formError && <GridContainer><P12 className='warning-text'>{formError}</P12></GridContainer>}
			<GridContainer columns={2} gap='0px 15px'>
				<PrimaryButton isOutline onClick={onClose}>Cancel</PrimaryButton>
				<PrimaryButton
					onClick={handleSubmit(submit)}
					isLoading={isLoading}
					disabled={!isEmpty(errors)}
				>
					{submitButtonText}
				</PrimaryButton>
			</GridContainer>
		</div>
	);
};

SubscriptionPlanForm.defaultValues = {
	prices: [],
	memberGroups: [],
	paymentPlans: [],
};

SubscriptionPlanForm.propTypes = {
	subscriptionPlans: array,
	onSubmit: func,
	isLoading: bool,
	submitButtonText: string,
	paymentPlanTypes: arrayOf(string),
	prices: arrayOf(priceType),
	memberGroups: arrayOf(memberGroupType),
	paymentPlans: arrayOf(subscriptionPlanType),
	plan: subscriptionPlanType,
	onClose: func,
};

export default SubscriptionPlanForm;
