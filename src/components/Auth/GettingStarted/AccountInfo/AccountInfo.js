import React, { memo, useEffect, useState } from 'react';
import { arrayOf, bool, func, number, object, string } from 'prop-types';
import enums from '@constants/enums';
import FormWrapper from '@components/_shared/form/FormWrapper';
import { P12, P14, P16 } from '@components/_shared/text';
import TextInput from '@components/_shared/form/TextInput';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Checkbox from '@components/_shared/form/Checkbox';
import PrimaryButton from '@components/_shared/buttons/PrimaryButton';
import { isEmpty } from '@utils/js-helpers';
import LoadingOverlay from '@components/_shared/LoadingOverlay';
import { getUserIcon } from '@utils/getUserIcon';
import AppModal from '@components/Common/AppModal';
import UploadAvatar from '@components/_shared/ModalComponents/UploadAvatar';
import ChangePasswordModal from '@components/_shared/ModalComponents/ChangePasswordModal';
import Tooltip from '@components/_shared/Tooltip';
import Select from '@components/_shared/form/Select';
import { handleCreateSelectOption } from '@utils/hooks/handleCreateSelectOption';
import GridContainer from '@components/layouts/GridContainer';
import { countryType, departmentType, positionType, userAvatarType, userType } from '@constants/types';
import { Icons } from '@icons';
import { connect } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { Routes } from '@routes';
import TwoFAForm from '@components/_shared/TwoFAForm';
import { sendTwoFaCodeToPhone, submitTwoFaCodeFromPhone } from '@api/settingsApi';
import { valuesMapper } from './utils';
import { toColor } from '@utils';
import { trimString } from '@utils/trimString';
import { getItemFromStorage } from '@utils/storage';

import './AccountInfo.scss';

const {
	INDEX,
} = Routes.AUTH.GETTING_STARTED;

function AccountInfo({
	schema,
	onSubmit,
	isLoading,
	user,
	departments,
	positions,
	emailForSignUp,
	userAvatar,
	isResetButton,
	stepText,
	handleChangePassword,
	uploadLogo,
	isMember,
	countries,
	getUser,
	switchOffTwoFa,
	isGettingStarted,
	isRetailer,
	userId,
	isAvatarChanged,
	userPhoneNumberFromDB,
	userLogo,
}) {
	const defaultValues = schema.default();

	const {
		register,
		handleSubmit,
		errors,
		watch,
		control,
		setValue,
		reset,
		clearErrors,
		getValues,
		setError,
		formState: { isDirty },
	} = useForm({
		resolver: yupResolver(schema),
		mode: enums.validationMode.onTouched,
		defaultValues: {
			...defaultValues,
			email: emailForSignUp,
		},
	});
	const location = useLocation();

	const userIcon = getUserIcon(
		userLogo?.image ? userLogo : user?.avatar60,
		userAvatar?.color || toColor(userId?.toString()),
		user?.firstName,
		user?.lastName,
	);
	const [isModal, setIsModal] = useState(false);
	const [isTwoFaFormModal, setIsTwoFaFormModal] = useState(false);
	const [isChangePasswordModal, setIsChangePasswordModal] = useState(false);
	const [newPasswords, setNewPasswords] = useState(null);
	const [isUpdatedValues, setIsUpdatedValues] = useState(false);
	const submitValidationRule = location.pathname.includes(INDEX) ? !isEmpty(errors) : !isEmpty(errors) || !isDirty;
	const isPhoneNumber = !!watch('phoneNumber') && !errors?.phoneNumber;
	const isActive2Fa = !!watch('isEnabled2fa');

	useEffect(() => {
		if (!user || isUpdatedValues) return;

		const currentFormValues = getValues();
		const formValues = valuesMapper({
			accountInfo: user,
			currentFormValues,
		});

		reset(formValues);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [user]);

	const trimValues = fieldName => value => setValue(fieldName, value?.trim(), { shouldValidate: true });

	const toggleModal = () => setIsModal(prevState => !prevState);

	const toggleChangePasswordModal = () => setIsChangePasswordModal(prevState => !prevState);

	const submitValues = values => {
		setIsUpdatedValues(true);
		onSubmit(values);
	};

	const showTwoFaModal = e => {
		if (e.target.checked) setIsTwoFaFormModal(true);
		else {
			if (isGettingStarted) {
				switchOffTwoFa({
					accountInfo: { ...user, isEnabled2fa: false },
					isMember,
					isRetailer,
				});
			} else submitValues({ ...user, isEnabled2fa: false });
		}
	};

	const closeTwoFaModal = isEnableTwoFa => () => {
		setValue('isEnabled2fa', isEnableTwoFa);
		setIsTwoFaFormModal(false);
	};

	const onSelectChange = fieldName => option => {
		clearErrors(fieldName);
		setValue(fieldName, option);
	};

	const resetValues = () => reset(user);

	const outerProps = {
		handleChangePassword,
		isActive2Fa,
		setNewPasswords,
		showTwoFaModal,
	};

	const trimmedPhoneNumber = trimString(watch('phoneNumber'));
	const is2FACheckboxActive = trimmedPhoneNumber && trimmedPhoneNumber === userPhoneNumberFromDB;

	const changePassword = () => handleChangePassword(newPasswords);

	return (
		<FormWrapper
			className='account-info-container'
			onSubmit={submitValues}
		>
			{stepText
				&& <GridContainer>
					<P14 className='step-style'>
						{stepText}
					</P14>
				</GridContainer>
			}
			<GridContainer>
				<P16 bold={true} className='mb-3'>
					Account information
				</P16>
			</GridContainer>
			<GridContainer template='570px 60px'>
				<div>
					<GridContainer gap='0px 30px' columns={2}>
						<div>
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
							<P12 className='warning-text'>{errors.firstName && errors.firstName.message}</P12>
						</div>
						<div>
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
							<P12 className='warning-text'>{errors.lastName && errors.lastName.message}</P12>
						</div>
					</GridContainer>
					{isMember
						&& <GridContainer gap='0px 30px' columns={2}>
							<div>
								<Select
									control={control}
									isCreatable
									isError={!!errors.position}
									isSearchable={false}
									name='country'
									onChange={onSelectChange('country')}
									options={countries}
									placeholder='Country'
									register={register}
									value={watch('country')}
									handleCreateOpt={handleCreateSelectOption({
										setValue,
										getValues,
										setError,
										clearErrors,
										fieldName: 'country',
										isMulti: false,
									})}
								/>
								<P12 className='warning-text'>{errors.country && errors.country.message}</P12>
							</div>
							<div>
								<TextInput
									setValue={setValue}
									type='text'
									name='city'
									placeholder='City'
									register={register}
									isLightTheme
									isError={!!errors.city}
									control={control}
									onBlur={trimValues('city')}
								/>
								<P12 className='warning-text'>{errors.city && errors.city.message}</P12>
							</div>
						</GridContainer>
					}
					<GridContainer gap='0px 30px' columns={2}>
						<div>
							<Select
								control={control}
								isCreatable
								isError={!!errors.position}
								isSearchable={false}
								name='position'
								onChange={onSelectChange('position')}
								options={positions}
								placeholder='Position (role)'
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
							<P12 className='warning-text'>{errors.position && errors.position.message}</P12>
						</div>
						<div>
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
							<P12 className='warning-text'>{errors.department && errors.department.message}</P12>
						</div>
					</GridContainer>
					<GridContainer gap='0px 30px' template={isMember ? 'auto' : '270px 270px'}>
						{!isMember
							&& <div>
								<TextInput
									type='tel'
									name='phoneNumber'
									placeholder='Phone number'
									value={watch('phoneNumber')}
									register={register}
									isLightTheme
									isError={!!errors?.phoneNumber}
									control={control}
									onBlur={trimValues('phoneNumber')}
									disabled={isActive2Fa}
								/>
								<P12 className='warning-text'>
									{!!errors.phoneNumber && errors.phoneNumber.message}
								</P12>
							</div>
						}
						<div>
							<TextInput
								type='email'
								name='email'
								placeholder='E-mail'
								register={register}
								isLightTheme
								isError={!!errors.email}
								readOnly={true}
								control={control}
								value={watch('email')}
								onBlur={trimValues('email')}
							/>
							<P12 className='warning-text'>
								{!!errors.email && errors.email.message}
							</P12>
						</div>
					</GridContainer>
				</div>
				<GridContainer customClassName='upload-file'>
					<Tooltip
						placement='bottom-start'
						message={<P12 className='black-tooltip'>Change profile photo</P12>}
					>
						<span
							className='user-icon'
							onClick={toggleModal}
						>
							{userIcon}
							<span className='user-logo-icon'>
								{Icons.editIcon()}
							</span>
						</span>
					</Tooltip>
				</GridContainer>
			</GridContainer>
			<GridContainer
				gap={isMember ? '0px 30px' : '0px 180px'}
				template={isMember ? '270px 270px' : '120px 270px'}
			>
				{(!isMember && !isGettingStarted)
					&& <Tooltip
						placement='bottom-start'
						message={<P12 className='black-tooltip'>Please enter a phone number to enable 2FA</P12>}
						isVisibleTooltip={!isPhoneNumber}
					>
						<Checkbox
							name='isEnabled2fa'
							label='Enable 2FA'
							register={register}
							isError={errors.isEnabled2fa}
							disabled={!is2FACheckboxActive}
							onChange={showTwoFaModal}
							checked={isActive2Fa}
						/>
					</Tooltip>
				}
				{!stepText
					&& <div className='change-password-link'>
						<P14
							className='blue-link underline'
							onClick={toggleChangePasswordModal}
						>
							Change the password
						</P14>
					</div>
				}
			</GridContainer>
			<GridContainer template={isResetButton ? '270px 270px' : 'auto 270px'}>
				{isResetButton
					? <PrimaryButton
						onClick={resetValues}
						isDarkTheme={false}
						text='Reset'
						disabled={isEmpty(getValues())}
						isOutline
					/>
					: <div/>
				}
				<PrimaryButton
					onClick={handleSubmit(submitValues)}
					isDarkTheme={false}
					text='Save'
					disabled={submitValidationRule && !isAvatarChanged}
				/>
			</GridContainer>
			{isLoading && <LoadingOverlay isCentered={false}/>}
			{isModal
				&& <AppModal
					component={UploadAvatar}
					onClose={toggleModal}
					outerProps={{
						uploadLogo,
					}}
				/>
			}
			{isChangePasswordModal
				&& <AppModal
					component={ChangePasswordModal}
					onClose={toggleChangePasswordModal}
					width='390px'
					isDarkModal
					outerProps={outerProps}
					title='Change your password'
				/>
			}
			{isTwoFaFormModal
				&& <AppModal
					className='two-fa-app-modal'
					component={TwoFAForm}
					onClose={closeTwoFaModal(false)}
					width='330px'
					isDarkModal
					isDisableClickOutside
					outerProps={{
						// eslint-disable-next-line no-warning-comments
						// TODO: Potential fix of bug RH-2329 might be because of getValues, as it gets value only once
						// when this method is executed. Need to check with watch() method
						phoneNumber: getValues('phoneNumber'),
						userPhoneNumberFromDB,
						createdAt: new Date(),
						availableAt: new Date(),
						closeAfterSubmit: closeTwoFaModal(true),
						sendTwoFaCodeToPhone,
						submitTwoFaCodeFromPhone,
						submitCallback: newPasswords ? changePassword : getUser,
						userId,
					}}
					title='Enter verification code'
				/>
			}
		</FormWrapper>
	);
}

AccountInfo.defaultProps = {
	isRetailer: false,
	emailForSignUp: '',
	isResetButton: false,
	isMember: false,
	isGettingStarted: false,
	isAvatarChanged: false,
	userPhoneNumberFromDB: '',
};

AccountInfo.propTypes = {
	schema: object.isRequired,
	onSubmit: func.isRequired,
	uploadLogo: func.isRequired,
	isLoading: bool.isRequired,
	user: userType.isRequired,
	departments: arrayOf(departmentType).isRequired,
	positions: arrayOf(positionType).isRequired,
	emailForSignUp: string,
	userAvatar: userAvatarType,
	isResetButton: bool,
	stepText: string,
	handleChangePassword: func,
	isMember: bool,
	countries: arrayOf(countryType),
	getUser: func,
	switchOffTwoFa: func,
	isGettingStarted: bool,
	isRetailer: bool.isRequired,
	userId: number,
	isAvatarChanged: bool,
	userPhoneNumberFromDB: string,
	userLogo: object,
};

export default connect(({ auth }) => {
	const user = auth.user || getItemFromStorage('user');

	return { userPhoneNumberFromDB: user.phoneNumber };
}, null)(memo(AccountInfo));
