import React, { memo, useEffect, useState } from 'react';
import GridContainer from '@components/layouts/GridContainer';
import FormWrapper from '@components/_shared/form/FormWrapper';
import { arrayOf, bool, func, object } from 'prop-types';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import enums from '@constants/enums';
import TextInput from '@components/_shared/form/TextInput';
import { P12, S12 } from '@components/_shared/text';
import Select from '@components/_shared/form/Select';
import { countryType, departmentType, positionType, userType } from '@constants/types';
import { handleCreateSelectOption } from '@utils/hooks/handleCreateSelectOption';
import TooltipForPassword from '@components/Auth/SignUp/TooltipForPassword';
import PasswordHint from '@components/Auth/SignUp/SignUpCompany/PasswordHint';
import TextArea from '@components/_shared/form/TextArea';
import { Icons } from '@icons';
import AppModal from '@components/Common/AppModal';
import UploadAvatar from '@components/_shared/ModalComponents/UploadAvatar';
import { toColor } from '@utils';
import PrimaryButton from '@components/_shared/buttons/PrimaryButton';
import { isEmpty } from '@utils/js-helpers';
import { downloadUserAvatar, uploadCroppedUserLogo } from '@api/fileUploadingApi';
import { getUserIcon } from '@utils/getUserIcon';
import { noteText } from '@constants/common';
import SliderCheckbox from '@components/_shared/form/SliderCheckbox';
import LoadingOverlay from '@components/_shared/LoadingOverlay';

import './MemberForm.scss';

const editIcon = Icons.editIcon();

const MemberForm = ({
	onSubmit,
	schema,
	countries,
	departments,
	positions,
	onClose,
	memberUser,
	changeMemberStatus,
	settingsLoading,
}) => {
	const {
		register,
		errors,
		control,
		setValue,
		watch,
		clearErrors,
		getValues,
		setError,
		handleSubmit,
	} = useForm({
		resolver: yupResolver(schema),
		mode: enums.validationMode.onTouched,
		defaultValues: {
			...schema.default(),
			...memberUser,
		},
	});
	const [iconWithText, setIconWithText] = useState();
	const [isPasswordFieldActive, setIsPasswordFieldActive] = useState(false);
	const [isUploadAvatarModal, setIsUploadAvatarModal] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [logosIds, setLogosIds] = useState();
	const [memberAvatar, setMemberAvatar] = useState();
	const [formError, setFormError] = useState();
	const firstName = getValues('firstName');
	const lastName = getValues('lastName');
	const userIcon = getUserIcon(memberAvatar, iconWithText?.color, iconWithText?.firstName, iconWithText?.lastName);

	const togglePasswordFieldState = state => () => setIsPasswordFieldActive(state);

	const trimValues = fieldName => value => setValue(fieldName, value.trim(), { shouldValidate: true });

	const clearFormError = () => setFormError(null);

	const onSelectChange = fieldName => option => {
		clearErrors(fieldName);
		setValue(fieldName, option);
		clearFormError();
	};

	const toggleUploadAvatarModal = () => setIsUploadAvatarModal(prevState => !prevState);

	const uploadLogo = async image => {
		try {
			setIsLoading(true);

			const resp = await uploadCroppedUserLogo(image);
			const logo = await downloadUserAvatar(resp.avatar60Id);

			setLogosIds(resp);
			setMemberAvatar({ image: logo });
			setIsLoading(false);
		} catch (e) {
			setFormError(e.message);
		} finally {
			setIsLoading(false);
		}
	};

	const submit = values => {
		const memberData =  {
			...logosIds,
			...values,
			userId: memberUser?.id || null,
			countryId: values.country?.id,
			department: values.department?.label,
			position: values.position?.label,
			note: values.note ? values.note : null,
		};

		onSubmit({ memberData, setFormError, setIsLoading, onClose });
	};

	useEffect(() => {
		if (memberUser?.firstName && memberUser?.lastName) {
			const backColor = toColor(`${memberUser.firstName}-${memberUser.lastName}`);

			setIconWithText({
				firstName: memberUser.firstName,
				lastName: memberUser.lastName,
				color: backColor,
			});
			return;
		}

		if (!firstName || !lastName) return;

		const backColor = toColor(`${firstName}-${lastName}`);

		setIconWithText({ firstName, lastName, color: backColor });
	}, [firstName, lastName, memberUser]);

	useEffect(() => {
		if (memberUser?.avatar60?.image && !memberAvatar)
			setMemberAvatar({ image: memberUser?.avatar60?.image });
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [memberUser?.avatar60, memberUser]);

	const handleChangeMemberStatus = () => changeMemberStatus({
		memberId: memberUser.member.id,
		setFormError,
		setIsLoading,
		isBlocked: !memberUser.isBlocked,
	});

	return (
		<FormWrapper
			className='add-member-modal'
			onSubmit={handleSubmit(submit)}
		>
			<GridContainer
				columns={2}
				gap='15px'
			>
				<div>
					<TextInput
						onChange={clearFormError}
						id='firstName'
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
						onChange={clearFormError}
						id='lastName'
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
			<GridContainer
				columns={2}
				customClassName='line'
				gap='15px'
			>
				<div>
					<Select
						id='country'
						name='country'
						control={control}
						register={register}
						options={countries}
						placeholder='Country'
						value={watch('country')}
						onChange={onSelectChange('country')}
						isClearable
						isError={!!errors?.country?.message}
						isFilterForStart
					/>
					<P12 className='warning-text'>{errors.country && errors.country.message}</P12>
				</div>
				<div>
					<TextInput
						onChange={clearFormError}
						id='city'
						type='text'
						name='city'
						placeholder='City'
						register={register}
						isLightTheme
						isError={!!errors.city}
						control={control}
						onBlur={trimValues('city')}
						setValue={setValue}
					/>
					<P12 className='warning-text'>
						{errors.city && errors.city.message}
					</P12>
				</div>
			</GridContainer>
			<GridContainer
				columns={2}
				customClassName='line'
				gap='15px'
			>
				<div>
					<Select
						control={control}
						isCreatable={true}
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
				<div>
					<Select
						control={control}
						isCreatable={true}
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
			</GridContainer>
			<GridContainer
				template={!memberUser ? '270px 270px' : 'auto'}
				customClassName='line'
				gap='15px'
			>
				<div>
					<TextInput
						onChange={clearFormError}
						id='email'
						type='email'
						name='email'
						placeholder='E-mail'
						register={register}
						isLightTheme
						isError={!!errors.email}
						control={control}
						onBlur={trimValues('email')}
					/>
					<P12 className='warning-text'>
						{!!errors.email && errors.email.message}
					</P12>
				</div>
				{!memberUser
					&& <div>
						<TooltipForPassword
							placement='top'
							component={PasswordHint}
							isVisibleTooltip={!!errors.password?.message && isPasswordFieldActive}
						>
							<TextInput
								onChange={clearFormError}
								id='password'
								type='password'
								name='password'
								isLightTheme
								placeholder='Password'
								register={register}
								error={errors.password?.message}
								control={control}
								onBlur={togglePasswordFieldState(false)}
								onFocus={togglePasswordFieldState(true)}
							/>
						</TooltipForPassword>
						<P12 className='warning-text'>{errors.password && errors.password.message}</P12>
					</div>
				}
			</GridContainer>
			<div className='line'>
				<TextArea
					onChange={clearFormError}
					id='note'
					name='note'
					placeholder='Note'
					isVisibleLabel={false}
					register={register}
					isError={!!errors.note}
					classNames='textarea-full-width'
					value={watch('note')}
					withTopPlaceholder
					rows={3}
				/>
				<P12 className='warning-text'>{errors.note && errors.note.message}</P12>
			</div>
			<GridContainer customClassName='line'>
				<span className='upload-user-logo'>
					{memberAvatar || iconWithText
						? <div className='edit-logo-container'>
							<div onClick={toggleUploadAvatarModal}>{userIcon}</div>
							<div className='text'>Edit Member’s photo</div>
						</div>
						: <div className='edit-logo-container'>
							<div
								className='edit-logo'
								onClick={toggleUploadAvatarModal}
							>
								<div className='icon'>{editIcon}</div>
							</div>
							<div className='text'>
								{memberUser ? 'Edit Member’s photo' : 'Upload Member’s photo'}
							</div>
						</div>
					}
				</span>
			</GridContainer>
			{!!memberUser
				&& <GridContainer template='repeat(1, 0.2fr)'>
					<SliderCheckbox
						id='status'
						onChange={handleChangeMemberStatus}
						label='Status'
						isLabelBefore
						checked={!memberUser.isBlocked}
					/>
				</GridContainer>
			}
			<GridContainer customClassName='line'>
				<S12>{noteText}</S12>
			</GridContainer>
			<GridContainer
				customClassName='line'
				template={!!memberUser ? '270px 270px' : 'auto'}
				gap='15px'
			>
				{!!memberUser
					&& <PrimaryButton
						isOutline
						onClick={onClose}
						isDarkTheme={false}
						text='Cancel'
						disabled={false}
					/>
				}
				<div className='submit-actions-container'>
					<PrimaryButton
						onClick={handleSubmit(submit)}
						isDarkTheme={false}
						text={memberUser ? 'Update' : 'Add a new member'}
						disabled={!isEmpty(errors)}
						isLoading={settingsLoading}
					/>
				</div>
			</GridContainer>
			{formError && <div className='warning-text'>{formError}</div>}
			{isUploadAvatarModal
				&& <AppModal
					component={UploadAvatar}
					onClose={toggleUploadAvatarModal}
					outerProps={{
						uploadLogo,
					}}
				/>
			}
			{isLoading && <LoadingOverlay/>}
		</FormWrapper>
	);
};

MemberForm.propTypes = {
	onSubmit: func.isRequired,
	onClose: func.isRequired,
	schema: object,
	countries: arrayOf(countryType),
	departments: arrayOf(departmentType),
	positions: arrayOf(positionType),
	memberUser: userType,
	changeMemberStatus: func,
	settingsLoading: bool,
};

export default memo(MemberForm);
