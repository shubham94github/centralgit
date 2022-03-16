import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { schema } from './filterSchema';
import Select from '@components/_shared/form/Select';
import { onSelectChange } from '@utils/onSelectChange';
import GridContainer from '@components/layouts/GridContainer';
import PrimaryButton from '@components/_shared/buttons/PrimaryButton';
import { Icons } from '@icons';
import enums from '@constants/enums';
import { arrayOf, func, number, oneOfType, shape, string } from 'prop-types';
import { memberGroupType, priceType } from '@constants/types';

const refreshIcon = Icons.refreshIcon();
const statuses = [
	{ label: 'Enabled', value: false },
	{ label: 'Disabled', value: true },
];

const SubscriptionPlansTableHeader = ({
	handleSetFilter,
	userRoles,
	members,
	prices,
	filters,
}) => {
	const {
		handleSubmit,
		errors,
		register,
		watch,
		setValue,
		setError,
		clearErrors,
		control,
		reset,
	} = useForm({
		resolver: yupResolver(schema),
		mode: enums.validationMode.onBlur,
	});

	useEffect(() => {
		reset({ ...filters });
	}, [filters, reset]);

	const handleApply = ({ memberGroupId, paymentPlanPriceIds, role, isHidden }) => handleSetFilter({
		memberGroupId: memberGroupId || null,
		paymentPlanPriceIds: paymentPlanPriceIds || null,
		role: role || null,
		isHidden: isHidden || null,
	});

	const handleReset = () => {
		handleSetFilter(null);
		reset({
			memberGroupId: null,
			paymentPlanPriceIds: null,
			role: null,
			isHidden: null,
		});
	};

	return (
		<GridContainer
			customClassName='subscription-plans-table-header'
			gap='15px'
			columns={4}
		>
			<div className='field-container'>
				<Select
					isMulti={false}
					control={control}
					name='role'
					value={watch('role')}
					register={register}
					isClearable
					isError={!!errors.role}
					placeholder='User Role'
					onChange={onSelectChange({
						fieldName: 'role',
						setValue,
						setError,
						clearErrors,
					})}
					options={userRoles}
					isBorder
				/>
			</div>
			<div className='field-container'>
				<Select
					isMulti={false}
					control={control}
					name='memberGroupId'
					value={watch('memberGroupId')}
					register={register}
					isClearable
					isError={!!errors.memberGroupId}
					placeholder='Bands'
					onChange={onSelectChange({
						fieldName: 'memberGroupId',
						setValue,
						setError,
						clearErrors,
					})}
					options={members}
					isBorder
				/>
			</div>
			<div className='field-container'>
				<Select
					isMulti={false}
					control={control}
					name='paymentPlanPriceIds'
					value={watch('paymentPlanPriceIds')}
					register={register}
					isClearable
					isError={!!errors.paymentPlanPriceIds}
					placeholder='Price'
					onChange={onSelectChange({
						fieldName: 'paymentPlanPriceIds',
						setValue,
						setError,
						clearErrors,
					})}
					options={prices}
					isBorder
				/>
			</div>
			<div className='field-container'>
				<Select
					isMulti={false}
					control={control}
					name='isHidden'
					value={watch('isHidden')}
					register={register}
					isClearable
					isError={!!errors.isHidden}
					placeholder='Status'
					onChange={onSelectChange({
						fieldName: 'isHidden',
						setValue,
						setError,
						clearErrors,
					})}
					options={statuses}
					isBorder
				/>
			</div>
			<div className='field-container'>
				<PrimaryButton className='admin-primary' onClick={handleSubmit(handleApply)}>Apply</PrimaryButton>
				<PrimaryButton className='admin-primary' onClick={handleReset}>{refreshIcon} Reset</PrimaryButton>
			</div>
		</GridContainer>
	);
};

SubscriptionPlansTableHeader.propTypes = {
	handleSetFilter: func.isRequired,
	userRoles: arrayOf(shape({ label: string, value: oneOfType([string, number]) })),
	members: arrayOf(memberGroupType),
	prices: arrayOf(priceType),
	filters: shape({
		paymentPlanPriceIds: string,
		memberGroupId: string,
		role: string,
	}),
};

export default SubscriptionPlansTableHeader;
