import React, { memo, useState } from 'react';
import { bool, func, number, object, oneOf, oneOfType, string } from 'prop-types';
import { useForm } from 'react-hook-form';
import { connect } from 'react-redux';
import { Col, Row } from 'react-bootstrap';

import enums from '@constants/enums';
import { P12, P14 } from '@components/_shared/text';
import { colors } from '@colors';
import {
	approveUserProfile,
	changeUserTwoFa,
	handleMailingProfile,
	handleStartupProfileActivation,
	handleUploadUserAvatarProfile,
	handleVerifyProfile,
} from '@ducks/admin/actions';
import PrimaryButton from '@components/_shared/buttons/PrimaryButton';
import Checkbox from '@components/_shared/form/Checkbox';
import { yupResolver } from '@hookform/resolvers/yup';
import schema from './schema';
import Avatar from '@components/_shared/Avatar';
import Tooltip from '@components/_shared/Tooltip';
import AppModal from '@components/Common/AppModal';
import RadioButton from '@components/_shared/form/RadioButton';
import { enableMailingTypes } from '@components/AdminPanel/ProfileSection/AccountInformation/constants';
import UploadAvatar from '@components/_shared/ModalComponents/UploadAvatar';
import AccountInformationEditStartupHOC from './AccountInformationEditForm/AccountInformationEditStartupHOC';
import AccountInformationEditRetailerHOC from './AccountInformationEditForm/AccountInformationEditRetailerHOC';
import { Icons } from '@icons';

import './AccountInformation.scss';

const editIcon = Icons.editIcon();
const editIconDarkblue = Icons.editIcon(colors.darkblue70);

const AccountInformation = ({
	firstName,
	lastName,
	position,
	department,
	email,
	phoneNumber,
	isVerified,
	isEnabled2fa,
	avatar60,
	isEnableMailing,
	handleMailingProfile,
	userId,
	handleUploadUserAvatarProfile,
	accountType,
	handleVerifyProfile,
	isStartup,
	isEditPermission,
	changeUserTwoFa,
}) => {
	const [isEditAccountInformation, setIsEditAccountInformation] = useState(false);
	const [isAvatarModal, setIsAvatarModal] = useState(false);
	const isStandard = accountType === enums.accountTypesAdminPanel.STANDARD;
	const accountInformationNote = `The ${isStartup ? 'startup' : 'user'} is registered under following account`;

	const { register, handleSubmit, errors } = useForm({
		resolver: yupResolver(schema),
		mode: enums.validationMode.onBlur,
		defaultValues: {
			isEnabled2fa,
		},
	});

	const [enableMailing, setEnableMailing] = useState(isEnableMailing ? 'true' : 'false');

	const onSubmit = ({ isEnabled2fa }) => changeUserTwoFa({ userId, isEnabled2fa });

	const changeTwoFaHandler = () => handleSubmit(onSubmit)();

	const toggleAccountInfoEditModal = () => setIsEditAccountInformation(prevState => !prevState);

	const onChangeEnableMailingHandler = value => () => {
		handleMailingProfile({ ids: [userId], isEnableMailing: value === 'true' });
		setEnableMailing(value);
	};

	const toggleAvatarModal = () => setIsAvatarModal(prevState => !prevState);

	const uploadAvatarByAdmin = file => handleUploadUserAvatarProfile({ file });

	const handleVerify = () => handleVerifyProfile();

	return (
		<>
			{isAvatarModal
				&& <AppModal
					component={UploadAvatar}
					onClose={toggleAvatarModal}
					outerProps={{
						isAdmin: true,
						uploadLogoByAdmin: uploadAvatarByAdmin,
					}}
				/>
			}
			{
				isEditAccountInformation
					&& <AppModal
						component={isStartup ? AccountInformationEditStartupHOC : AccountInformationEditRetailerHOC}
						className='account-information-pop-up'
						onClose={toggleAccountInfoEditModal}
						title='Account information'
						outerProps={{
							onClose: toggleAccountInfoEditModal,
						}}
					/>
			}
			<Row className='account-information-wrapper'>
				<Col xs={4}>
					<Col xs={12} className='d-flex flex-column'>
						<div className='d-flex align-items-center'>
							<P12 bold>{accountInformationNote}</P12>
							{isEditPermission
								&& <span className='clickable px-3' onClick={toggleAccountInfoEditModal}>
									{editIconDarkblue}
								</span>
							}
						</div>
					</Col>
					<Col xs={12} className='d-flex mt-2'>
						<Tooltip
							placement='bottom-start'
							message={<P12 className='black-tooltip'>Change profile photo</P12>}
							isVisibleTooltip={isEditPermission}
						>
							{isEditPermission
								? <span
									onClick={toggleAvatarModal}
									className='user-logo'
								>
									<Avatar
										logo={avatar60}
										className='avatar-for-profile'
									/>
									<span className='startup-logo-icon'>
										{editIcon}
									</span>
								</span>
								: <span className='user-logo-without-permissions'>
									<Avatar
										logo={avatar60}
										className='avatar-for-profile'
									/>
								</span>
							}
						</Tooltip>
						<div className='mx-3 first-last-name-wrapper'>
							<Tooltip
								placement='bottom-start'
								message={
									<P12 className='first-last-name'>
										{!!firstName && firstName}&nbsp;
										{!!lastName && lastName}
									</P12>
								}
							>
								<P14 bold className='first-last-name'>
									{!!firstName && firstName}&nbsp;
									{!!lastName && lastName}
								</P14>
							</Tooltip>
							<P14 className='word-break'>{department?.name}</P14>
							<P12 className='word-break'>{position?.name}</P12>
						</div>
					</Col>
					<Col xs={12} className='mt-2'>
						<div className='d-flex align-items-center'>
							<P12 className='pe-1'>
								<span className='bold'>E-mail: </span>
								{email}
							</P12>
							{!isVerified
								&& <PrimaryButton
									className='small-button'
									text='Verify'
									onClick={handleVerify}
									disabled={!isEditPermission}
								/>
							}
						</div>
						<P12 className='mt-1'>
							<span className='bold'>Phone: </span>
							{phoneNumber}
						</P12>
					</Col>
					<Col className='mt-1'>
						<Tooltip
							placement='bottom-start'
							message={<P12 className='black-tooltip'>Please enter a phone number to enable 2FA</P12>}
							isVisibleTooltip={!phoneNumber}
						>
							<Checkbox
								name='isEnabled2fa'
								label='Enable 2FA'
								register={register}
								isError={errors.isEnabled2fa}
								disabled={!phoneNumber || !isEditPermission}
								onChange={changeTwoFaHandler}
							/>
						</Tooltip>
					</Col>
				</Col>
				{isStandard && isStartup
					&& <Col xs={6} className='receive-messages-container'>
						<P14 bold>
							This startup can receive and reply on messages
						</P14>
						<div className='mt-2 d-flex flex-column'>
							{enableMailingTypes.map(({ id, value, label }) => (
								<RadioButton
									isFilter={true}
									id={id}
									key={id}
									label={label}
									name={value}
									checked={enableMailing === value}
									value={value}
									onChange={onChangeEnableMailingHandler}
									disabled={!isEditPermission}
								/>
							))}
						</div>
					</Col>
				}
			</Row>
		</>
	);
};

AccountInformation.propTypes = {
	phoneNumber: string,
	firstName: oneOfType([string, oneOf([null])]),
	lastName: oneOfType([string, oneOf([null])]),
	position: object,
	department: object,
	email: string,
	isVerified: bool.isRequired,
	isEnabled2fa: bool,
	avatar60: object.isRequired,
	isEnableMailing: bool,
	handleMailingProfile: func.isRequired,
	handleUploadUserAvatarProfile: func.isRequired,
	userId: number.isRequired,
	accountType: string,
	handleVerifyProfile: func.isRequired,
	isStartup: bool.isRequired,
	isEditPermission: bool,
	changeUserTwoFa: func.isRequired,
};

AccountInformation.defaultProps = {
	phoneNumber: '',
	firstName: '',
	lastName: '',
	email: '',
	isEnabled2fa: false,
	isEnableMailing: false,
	accountType: '',
};

export default connect(({ admin: { profile }, auth }) => {
	const isStartup = !!profile?.startup;
	const profileData = isStartup ? profile.startup : profile.retailer;
	const { listOfPermissions } = auth;
	const isEditPermission = isStartup
		? listOfPermissions?.isStartupsEditDetailsPermission
		: listOfPermissions.isRetailersEditDetailsInfoPermission;

	const {
		id,
		fullName,
		position,
		department,
		email,
		phoneNumber,
		isVerified,
		isEnabled2fa,
		avatar60,
		isEnableMailing,
		firstName,
		lastName,
	} = profile;

	const {
		accountType,
	} = profileData;

	return {
		userId: id,
		fullName,
		position,
		department,
		email,
		phoneNumber,
		isVerified,
		isEnabled2fa,
		avatar60,
		isEnableMailing,
		accountType,
		firstName,
		lastName,
		isStartup,
		isEditPermission,
	};
},
{
	approveUserProfile,
	handleStartupProfileActivation,
	handleMailingProfile,
	handleUploadUserAvatarProfile,
	handleVerifyProfile,
	changeUserTwoFa,
})(memo(AccountInformation));
