import React, { memo, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { array, arrayOf, bool, func, string } from 'prop-types';
import { selectValueType, userType } from '@constants/types';
import LoadingOverlay from '@components/_shared/LoadingOverlay';
import schema from './schema';
import { useForm } from 'react-hook-form';
import GridContainer from '@components/layouts/GridContainer';
import TextInput from '@components/_shared/form/TextInput';
import { fields } from './constants';
import Select from '@components/_shared/form/Select';
import { onSelectChange } from '@utils/onSelectChange';
import { P12 } from '@components/_shared/text';
import enums from '@constants/enums';
import PasswordHint from '@components/Auth/SignUp/SignUpCompany/PasswordHint';
import TooltipForPassword from '@components/Auth/SignUp/TooltipForPassword';
import PrimaryButton from '@components/_shared/buttons/PrimaryButton';
import Tooltip from '@components/_shared/Tooltip/Tooltip';
import { Icons } from '@icons';
import AppModal from '@components/Common/AppModal';
import UploadAvatar from '@components/_shared/ModalComponents/UploadAvatar';
import { yupResolver } from '@hookform/resolvers/yup';
import { downloadUserAvatar, uploadUserLogo } from '@api/fileUploadingApi';
import { isEmpty } from '@utils/js-helpers';
import { parsePhoneNumber } from 'libphonenumber-js';
import { setSnackbar } from '@ducks/common/actions';

import './NewAdminUserForm.scss';

const editIcon = Icons.editIcon();
const userUpdatedMessage = 'Admin user successfully updated';
const userCreatedMessage = 'Admin user successfully created';

const NewAdminUserForm = ({
	submitHandler,
	countries,
	roles,
	cancelHandler,
	adminUser,
	submitBtnTitle,
	setSnackbar,
}) => {
	const [isUploadAvatarModal, setIsUploadAvatarModal] = useState(false);
	const [avatarId, setAvatarId] = useState(null);
	const [avatarImage, setAvatarImage] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const [formError, setFormError] = useState();
	const [isEditIconShow, setIsEditIconShow] = useState(false);

	const showEditIcon = () => setIsEditIconShow(true);
	const hideEditIcon = () => setIsEditIconShow(false);

	const userCountry = adminUser?.country && countries.find(country => country.id === adminUser.country?.id);

	const {
		control,
		handleSubmit,
		setValue,
		setError,
		clearErrors,
		errors,
		register,
		watch,
	} = useForm({
		resolver: yupResolver(schema),
		mode: enums.validationMode.onTouched,
		validationMode: enums.validationMode.onTouched,
		defaultValues: !!adminUser
			? {
				...schema.default(),
				...adminUser,
				countryId: userCountry && {
					label: userCountry?.name,
					value: userCountry?.id,
				},
				role: adminUser ? { label: adminUser.authority.name, value: adminUser.authority.id } : null,
			}
			: schema.default(),
	});

	useEffect(() => {
		if (!isEmpty(roles) && !adminUser) setValue(fields.role.name, roles.find(item => item.name === 'Guest'));
		if (adminUser?.avatar?.image) setAvatarImage(adminUser.avatar.image);
		if (adminUser?.avatar120?.id) setAvatarId(adminUser.avatar120.id);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const onSubmit = async ({
		role,
		email,
		firstName,
		lastName,
		password,
		phoneNumber,
		countryId,
		city,
	}) => {
		try {
			setIsLoading(true);

			await submitHandler({
				authorityId: +role.id || +role.value,
				avatarId,
				email,
				firstName,
				lastName,
				password,
				phoneNumber: phoneNumber ? parsePhoneNumber(phoneNumber)?.number : null,
				countryId: countryId.id || countryId.value,
				city,
			});

			setSnackbar({
				text: adminUser ? userUpdatedMessage : userCreatedMessage,
				type: enums.snackbarTypes.info,
			});

			cancelHandler();
		} catch (e) {
			setFormError(e.message);
		} finally {
			setIsLoading(false);
		}
	};

	const trimValues = fieldName => value => setValue(fieldName, value.trim(), { shouldValidate: true });

	const [isPasswordFieldActive, setIsPasswordFieldActive] = useState(false);

	const togglePasswordFieldState = state => setIsPasswordFieldActive(state);

	const toggleAvatarModal = () => setIsUploadAvatarModal(prevState => !prevState);

	const closeAvatarModal = () => setIsUploadAvatarModal(false);

	const onPasswordBlur = () => togglePasswordFieldState(false);

	const onPasswordFocus = () => togglePasswordFieldState(true);

	const handleUploadUserLogo = async logo => {
		try {
			setIsLoading(true);

			const file = await uploadUserLogo(logo);

			const avatar = await downloadUserAvatar(file.id);

			setAvatarId(file.id);
			setAvatarImage(avatar);
		} catch (e) {
			setFormError('Error while file uploading');
		} finally {
			setIsLoading(false);
		}
	};

	const clearError = fieldName => () => {
		clearErrors(fieldName);
		setFormError(null);
	};

	return (
		<form className='add-new-user-form' onSubmit={handleSubmit(onSubmit)}>
			<GridContainer template='10fr 1fr'>
				<GridContainer>
					<GridContainer template='263px 263px'>
						<div className='field'>
							<TextInput
								onChange={clearError(fields.password.name)}
								control={control}
								isError={!!errors.firstName}
								id={fields.firstName.name}
								register={register}
								isLightTheme
								name={fields.firstName.name}
								placeholder={fields.firstName.placeholder}
								onBlur={trimValues('firstName')}
								setValue={setValue}
							/>
							{!!errors.firstName && <P12 className='warning-text'>{errors.firstName.message}</P12>}
						</div>
						<div className='field'>
							<TextInput
								onChange={clearError(fields.password.name)}
								control={control}
								isError={!!errors.lastName}
								id={fields.lastName.name}
								isLightTheme
								register={register}
								name={fields.lastName.name}
								placeholder={fields.lastName.placeholder}
								setValue={setValue}
							/>
							{!!errors.lastName &&<P12 className='warning-text'>{errors.lastName.message}</P12>}
						</div>
					</GridContainer>
					<GridContainer template='263px 263px'>
						<div className='field'>
							<Select
								id={fields.countryId.name}
								isMulti={false}
								value={watch('countryId')}
								options={countries}
								onChange={onSelectChange({
									fieldName: fields.countryId.name,
									setValue,
									setError,
									clearErrors: clearError(fields.countryId.name),
								})}
								control={control}
								name={fields.countryId.name}
								placeholder={fields.countryId.placeholder}
								isCreatable={false}
								register={register}
								isError={!!errors.countryId}
								isTopPlaceholder
							/>
							{!!errors.countryId && <P12 className='warning-text'>{errors.countryId.message}</P12>}
						</div>
						<div className='field'>
							<TextInput
								onChange={clearError(fields.password.name)}
								control={control}
								isError={!!errors.city}
								id={fields.city.name}
								isLightTheme
								register={register}
								name={fields.city.name}
								placeholder={fields.city.placeholder}
								setValue={setValue}
							/>
							{!!errors.city && <P12 className='warning-text'>{errors.city.message}</P12>}
						</div>
					</GridContainer>
					<GridContainer template='263px 263px'>
						<div className='field'>
							<TextInput
								onChange={clearError(fields.password.name)}
								type='email'
								name={fields.email.name}
								placeholder={fields.email.placeholder}
								register={register}
								isLightTheme
								isError={!!errors.email}
								control={control}
								onBlur={trimValues(fields.email.name)}
								setValue={setValue}
							/>
							{!!errors.email && <P12 className='warning-text'>{errors.email.message}</P12>}
						</div>
						<div className='field'>
							<Select
								id={fields.role.name}
								isMulti={false}
								options={roles}
								onChange={onSelectChange({
									fieldName: fields.role.name,
									setValue,
									setError,
									clearErrors: clearError(fields.role.name),
								})}
								control={control}
								name={fields.role.name}
								placeholder={fields.role.placeholder}
								isCreatable={false}
								setValue={setValue}
							/>
							{!!errors.role && <P12 className='warning-text'>{errors.role.message}</P12>}
						</div>
					</GridContainer>
					<GridContainer template='263px 263px'>
						<div className='field'>
							<TooltipForPassword
								placement='top'
								component={PasswordHint}
								isVisibleTooltip={!!errors.password?.message && isPasswordFieldActive}
							>
								<TextInput
									onChange={clearError(fields.password.name)}
									id={fields.password.name}
									type='password'
									name={fields.password.name}
									register={register}
									isLightTheme
									placeholder={fields.password.placeholder}
									isError={!!errors.password?.message}
									onBlur={onPasswordBlur}
									onFocus={onPasswordFocus}
									setValue={setValue}
								/>
							</TooltipForPassword>
							{!!errors.password && <P12 className='warning-text'>{errors.password.message}&nbsp;</P12>}
						</div>
						<div className='field'>
							<TextInput
								id={fields.phone.name}
								onChange={clearError(fields.phone.name)}
								type='tel'
								name={fields.phone.name}
								placeholder={fields.phone.placeholder}
								register={register}
								isLightTheme
								isError={!!errors.phone}
								control={control}
								onBlur={trimValues(fields.phone.name)}
								setValue={setValue}
							/>
							{!!errors.phoneNumber && <P12 className='warning-text'>{errors.phoneNumber.message}</P12>}
						</div>
					</GridContainer>
				</GridContainer>
				<GridContainer customClassName='upload-file'>
					<div onMouseLeave={hideEditIcon}>
						<Tooltip
							placement='bottom-start'
							message={<P12 className='black-tooltip'>Change profile photo</P12>}
						>
							<div className='logo-container'>
								<div
									className={`user-icon${avatarImage ? ' image-avatar' : ''}`}
									onClick={toggleAvatarModal}
								>
									{avatarImage
										? <>
											<img
												onMouseEnter={showEditIcon}
												onMouseLeave={hideEditIcon}
												src={avatarImage} alt='avatar'
											/>
											{isEditIconShow
												&& <div
													onMouseEnter={showEditIcon}
													onMouseLeave={hideEditIcon}
													className='user-logo-icon'
												>
													{editIcon}
												</div>
											}
										</>
										: <div className='user-logo-icon'>
											{editIcon}
										</div>
									}
								</div>
							</div>
						</Tooltip>
					</div>
				</GridContainer>
				<GridContainer template='263px 263px'>
					<PrimaryButton
						text='Cancel'
						isOutline
						onClick={cancelHandler}
					/>
					<PrimaryButton
						disabled={!isEmpty(errors) || !!formError}
						type='submit'
						text={submitBtnTitle}
						isLoading={isLoading}
					/>
				</GridContainer>
			</GridContainer>
			{!!formError
				&& <div className='form-error-container'>
					<P12 className='warning-text form-error'>{formError}&nbsp;</P12>
				</div>
			}
			{isUploadAvatarModal
				&& <AppModal
					component={UploadAvatar}
					onClose={closeAvatarModal}
					outerProps={{
						uploadLogoByAdmin: handleUploadUserLogo,
						isAdmin: true,
					}}
				/>
			}
			{isLoading && <LoadingOverlay/>}
		</form>
	);
};

NewAdminUserForm.propTypes = {
	isLoading: bool,
	submitHandler: func,
	countries: arrayOf(selectValueType),
	roles: array,
	cancelHandler: func.isRequired,
	adminUser: userType,
	submitBtnTitle: string,
	setSnackbar: func.isRequired,
};

export default connect(null, {
	setSnackbar,
})(memo(NewAdminUserForm));
