import React, { memo } from 'react';
import { arrayOf, bool, func, number, object, string } from 'prop-types';
import { Col, Row } from 'react-bootstrap';
import parsePhoneNumber from 'libphonenumber-js';
import { useForm } from 'react-hook-form';
import enums from '@constants/enums';
import Tooltip from '@components/_shared/Tooltip';
import { P12 } from '@components/_shared/text';
import PrimaryButton from '@components/_shared/buttons/PrimaryButton';
import { yupResolver } from '@hookform/resolvers/yup';
import TextInput from '@components/_shared/form/TextInput';
import { isEmpty } from '@utils/js-helpers';
import Select from '@components/_shared/form/Select';
import { handleCreateSelectOption } from '@utils/hooks/handleCreateSelectOption';
import { departmentType, positionType } from '@constants/types';

import './AccountInformationEditForm.scss';

const AccountInformationEditForm = ({
	isLoading,
	onClose,
	firstName,
	lastName,
	email,
	position,
	department,
	phoneNumber,
	checkEmailForExistingAccountInformation,
	handleUpdateAccountInformation,
	positions,
	departments,
	id,
	schema,
	isEnabled2fa,
}) => {
	const {
		register,
		handleSubmit,
		errors,
		watch,
		control,
		setValue,
		setError,
		clearErrors,
		getValues,
	} = useForm({
		resolver: yupResolver(schema),
		mode: enums.validationMode.onBlur,
		defaultValues: {
			...schema.default(),
			firstName,
			lastName,
			email,
			position,
			department,
			phoneNumber,
		},
	});

	const onSelectChange = fieldName => option => {
		clearErrors(fieldName);
		setValue(fieldName, option);
	};

	const onSubmit = async values => {
		const sendValues = {
			data: {
				...values,
				position: values.position ? values.position.label : null,
				department: values.department ? values.department.label : null,
				phoneNumber: values.phoneNumber ? parsePhoneNumber(values.phoneNumber).number : null,
				firstName: values.firstName ? values.firstName : null,
				lastName: values.lastName ? values.lastName : null,
				isEnabled2fa,
			}, id,
		};

		if (values.email === email) {
			onClose();
			handleUpdateAccountInformation(sendValues);
		} else {
			const resp = await checkEmailForExistingAccountInformation({ email: values.email });
			if (resp?.status === 200) {
				onClose();
				handleUpdateAccountInformation(sendValues);
			} else setError('email', { message: 'Email already exists' });
		}
	};

	const trimValues = fieldName => value => setValue(fieldName, value?.trim(), { shouldValidate: true });

	return (
		<div className='account-information-edit-form'>
			<Row>
				<Col>
					<TextInput
						type='text'
						name='firstName'
						placeholder='First name'
						register={register}
						isLightTheme
						isError={!!errors.firstName}
						control={control}
						onBlur={trimValues('firstName')}
						setValue={setValue}
					/>
					<P12 className='warning-text'>{!!errors.firstName && errors.firstName.message}</P12>
				</Col>
				<Col>
					<TextInput
						type='text'
						name='lastName'
						placeholder='Last name'
						register={register}
						isLightTheme
						isError={!!errors.lastName}
						control={control}
						onBlur={trimValues('lastName')}
						setValue={setValue}
					/>
					<P12 className='warning-text'>{!!errors.lastName && errors.lastName.message}</P12>
				</Col>
			</Row>
			<Row>
				<Col sm={12} md={6}>
					<Select
						control={control}
						isCreatable
						isError={!!errors.position}
						isSearchable={false}
						name='position'
						onChange={onSelectChange('position')}
						options={positions}
						placeholder='Position'
						register={register}
						value={watch('position')}
						handleCreateOpt={handleCreateSelectOption({
							setValue,
							getValues,
							setError,
							clearErrors,
							fieldName: 'position',
							isMulti: false,
						})}
					/>
					<P12 className='warning-text'>{!!errors.position && errors.position.message}</P12>
				</Col>
				<Col sm={12} md={6}>
					<Select
						control={control}
						isCreatable
						isError={!!errors.department}
						isSearchable={false}
						name='department'
						onChange={onSelectChange('department')}
						options={departments}
						placeholder='Department'
						register={register}
						value={watch('department')}
						handleCreateOpt={handleCreateSelectOption({
							setValue,
							getValues,
							setError,
							clearErrors,
							fieldName: 'department',
							isMulti: false,
						})}
					/>
					<P12 className='warning-text'>{!!errors.department && errors.department.message}</P12>
				</Col>
			</Row>
			<Row>
				<Col sm={12} md={6}>
					<Tooltip
						message={'Please disable 2FA to edit the phone'}
						isVisibleTooltip={isEnabled2fa}
					>
						<TextInput
							type='tel'
							name='phoneNumber'
							placeholder='Phone number'
							value={watch('phoneNumber')}
							register={register}
							isLightTheme
							isError={!!errors.phoneNumber}
							control={control}
							onBlur={trimValues('phoneNumber')}
							disabled={isEnabled2fa}
						/>
					</Tooltip>
					<P12 className='warning-text'>
						{!!errors.phoneNumber && errors.phoneNumber.message}
					</P12>
				</Col>
				<Col sm={12} md={6}>
					<TextInput
						type='email'
						name='email'
						placeholder='E-mail'
						register={register}
						isLightTheme
						isError={!!errors.email}
						control={control}
						value={watch('email')}
						onBlur={trimValues('email')}
					/>
					<P12 className='warning-text'>
						{!!errors.email && errors.email.message}
					</P12>
				</Col>
			</Row>
			<Row>
				<Col>
					<PrimaryButton
						onClick={onClose}
						text='Cancel'
						isOutline
						isFullWidth
					/>
				</Col>
				<Col>
					<PrimaryButton
						isLoading={isLoading}
						onClick={handleSubmit(onSubmit)}
						disabled={!isEmpty(errors)}
						text='Update'
						isFullWidth
					/>
				</Col>
			</Row>
		</div>
	);
};

AccountInformationEditForm.propTypes = {
	handleUpdateAccountInformation: func.isRequired,
	onClose: func.isRequired,
	checkEmailForExistingAccountInformation: func.isRequired,
	firstName: string,
	lastName: string,
	email: string,
	position: positionType,
	department: departmentType,
	phoneNumber: string,
	id: number.isRequired,
	isLoading: bool,
	positions: arrayOf(positionType),
	departments: arrayOf(departmentType),
	schema: object.isRequired,
	isEnabled2fa: bool,
};

AccountInformationEditForm.defaultProps = {
	firstName: '',
	lastName: '',
	email: '',
	position: '',
	phoneNumber: '',
	isLoading: false,
};

export default memo(AccountInformationEditForm);
