import React, { memo, useRef, useState } from 'react';
import { connect } from 'react-redux';
import { Col, Row } from 'react-bootstrap';
import Avatar from '@components/_shared/Avatar';
import { H3, P12, P14, S12 } from '@components/_shared/text';
import { colors } from '@colors';
import enums from '@constants/enums';
import Tooltip from '@components/_shared/Tooltip';
import { bool, object, string, number, func } from 'prop-types';
import PrimaryButton from '@components/_shared/buttons/PrimaryButton';
import { dateFormatCorrection } from '@utils';
import SliderCheckbox from '@components/_shared/form/SliderCheckbox';
import {
	approveUserProfile,
	handleStartupProfileActivation,
	handleUploadStartupLogoProfile,
	sendAdminNotification,
} from '@ducks/admin/actions';
import AppModal from '@components/Common/AppModal';
import UploadAvatar from '@components/_shared/ModalComponents/UploadAvatar';
import SendNotificationDropdown from '@components/AdminPanel/ProfileSection/SendNotificationDropdown';
import { useOnClickOutside } from '@utils/hooks/useOnClickOutside';
import { Icons } from '@icons';
import { maxLengthName } from './constants';
import { retailerTypes } from '@constants/common';

import './ShortInfo.scss';

const {
	retailerCompany,
	retailerBrand,
	retailerConsultant,
	retailerServiceProvider,
	retailerVentureCapital,
} = enums.userRoles;

const editIcon = Icons.editIcon();

const ShortInfo = ({
	logo60,
	companyShortName,
	city,
	foundedAt,
	country,
	companyLegalName,
	accountType,
	urlOfCompanyWebsite,
	isApprovedByAdmin,
	visitedAt,
	approvedAt,
	approvedByAdminAt,
	isBlocked,
	approveUserProfile,
	handleStartupProfileActivation,
	handleUploadStartupLogoProfile,
	userID,
	profileId,
	isEnableMailing,
	isAdminNotificationSending,
	sendAdminNotification,
	status,
	isStartup,
	role,
	createdAt,
	isApprovePermission,
	isChangeStatusPermission,
	isEditPermission,
	isDirectNotificationsPermission,
	isChatPermission,
}) => {
	const chatIcon = Icons.chatIcon(colors.darkblue70);
	const locationIcon = Icons.locationIcon(colors.darkblue70);
	const notificationIcon = Icons.notificationProfileIcon(colors.darkblue70);
	const getYearFounded = date => new Date(date).getFullYear();
	const isDemoStartup = accountType === enums.accountTypesAdminPanel.DEMO;
	const isStandardStartup = accountType === enums.accountTypesAdminPanel.STANDARD;
	const isCompletedGettingStarted = status === enums.gettingStartedStatusesAdminPanel.completedGettingStarted;
	const lastSeen = visitedAt && dateFormatCorrection(visitedAt, 'MMM d, yyyy');
	const isCompanyRetailer = role === retailerCompany || role === retailerBrand
		|| role === retailerConsultant || role === retailerServiceProvider || role === retailerVentureCapital;
	const dateOfApprove = isCompanyRetailer ? createdAt : isStartup ? approvedAt : approvedByAdminAt;
	const activeSince = dateOfApprove && dateFormatCorrection(dateOfApprove, 'MMM d, yyyy');
	const isVisibleChatIcon = ((!isDemoStartup && isEnableMailing) || !isStartup) && isChatPermission;
	const profileType = isStartup ? accountType : retailerTypes.find(item => item.value === role).label;
	const isVisibleCompanyLegalName = companyShortName !== companyLegalName;

	const [isLogoModal, setIsLogoModal] = useState(false);
	const [isMessageDropdownOpen, setIsMessageDropdownOpen] = useState(false);
	const [isDisableNotificationTooltip, setIsDisableNotificationTooltip] = useState(false);
	const notificationDropdownNode = useRef();

	const onClickApprove = () => approveUserProfile({ ids: [userID] });

	const handleActivation = () => handleStartupProfileActivation({ ids: [userID], isBlocked });

	const toggleLogoModal = () => setIsLogoModal(prevState => !prevState);

	const uploadLogoByAdmin = file => handleUploadStartupLogoProfile({ file, profileId });

	const toggleSendNotificationDropdown = () => {
		setIsMessageDropdownOpen(isMessageDropdownOpen => {
			setIsDisableNotificationTooltip(!isMessageDropdownOpen);

			return !isMessageDropdownOpen;
		});
	};

	const hideSendNotificationDropdown = () => {
		setIsDisableNotificationTooltip(false);
		setIsMessageDropdownOpen(false);
	};

	const handleSendNotification = ({ recipientId, message }) => {
		sendAdminNotification({ recipientId, message });
	};

	useOnClickOutside([notificationDropdownNode], () => hideSendNotificationDropdown());

	const openWebsiteLink = () => {
		const isWwwUrl = !urlOfCompanyWebsite.includes('https://') || !urlOfCompanyWebsite.includes('http://');

		window.open(isWwwUrl ? `https://${urlOfCompanyWebsite}` : urlOfCompanyWebsite, '_blank');
	};

	const truncateCompanyName = name => {
		if (name?.length > maxLengthName) {
			const truncateName = name.substr(0, maxLengthName);

			return (
				<Tooltip
					placement='bottom'
					message={
						<P12>
							{name}
						</P12>
					}
				>
					<span className='pb-1'>
						{truncateName}...
					</span>
				</Tooltip>
			);
		}
		return name;
	};

	return (
		<>
			{isLogoModal
				&& <AppModal
					component={UploadAvatar}
					onClose={toggleLogoModal}
					outerProps={{
						isAdmin: true,
						uploadLogoByAdmin,
					}}
				/>
			}
			<Row className='short-info-wrapper g-3'>
				<Col xs={isApprovedByAdmin ? 8 : 5} className='d-flex'>
					<div className='img-profile-wrapper me-3'>
						<Tooltip
							placement='bottom-start'
							message={<P12 className='black-tooltip'>Change company photo</P12>}
							isVisibleTooltip={isEditPermission}
						>
							{isEditPermission
								? <span
									onClick={toggleLogoModal}
									className='startup-logo'
								>
									<Avatar
										logo={logo60}
										className='avatar-for-profile'
									/>
									<span className='startup-logo-icon'>
										{editIcon}
									</span>
								</span>
								: <Avatar
									logo={logo60}
									className='avatar-for-profile'
								/>
							}
						</Tooltip>
					</div>
					<div>
						<div className='pb-1 d-flex flex-column'>
							<H3 className='text__darkblue text-start mb-1' bold>
								{truncateCompanyName(companyShortName)}
								<>
									{isVisibleChatIcon && (
										<span className='ms-2 clickable'>
											{chatIcon}
										</span>
									)}
									<Tooltip
										isVisibleTooltip={true}
										placement='right'
										message={
											<P12>
													Send direct notification
											</P12>
										}
										isDisableTooltip={isDisableNotificationTooltip}
									>
										{isDirectNotificationsPermission
												&& <span
													onClick={toggleSendNotificationDropdown}
													className='ms-2 clickable notification-icon'
													ref={notificationDropdownNode}
												>
													{notificationIcon}
													{isMessageDropdownOpen
														&& <SendNotificationDropdown
															recipientId={userID}
															sendAdminNotification={handleSendNotification}
															isAdminNotificationSending={isAdminNotificationSending}
															onClose={hideSendNotificationDropdown}
														/>
													}
												</span>
										}
									</Tooltip>
								</>
							</H3>
							{isVisibleCompanyLegalName
								&& <H3 className='text__darkblue text-start' bold>
									{truncateCompanyName(companyLegalName)}
								</H3>
							}
						</div>
						<div>
							<P12 className='word-wrap'>
								<span className='pe-2'>{locationIcon}</span>
								{country.name}
								{city && <>, {city}</>}
								{isStartup
									&& <>
										&#44;&nbsp;Founded&nbsp;in&nbsp;{getYearFounded(foundedAt)}
									</>
								}
								<br/>
								{isStartup
									&& <span
										className='blue-link truncate mx-3'
										onClick={openWebsiteLink}
										rel='noreferrer'
									>
										{urlOfCompanyWebsite}
									</span>
								}
							</P12>
						</div>
					</div>
				</Col>
				<Col className='d-flex justify-content-end'>
					{!isApprovedByAdmin
						&& <div className='d-flex justify-content-center align-items-center me-4'>
							{isStartup && (
								<P14 className='me-3'>
									{!isCompletedGettingStarted
										? `To Approve Startup should finish all getting started steps`
										: 'Account approval is required'
									}
								</P14>
							)}
							{isApprovePermission && (
								isStartup
									? <Tooltip
										placement='bottom'
										isVisibleTooltip={!isCompletedGettingStarted}
										message={
											<P12>
														To Approve Startup should
												<br/>
														finish all getting started
												<br/>
														steps
											</P12>
										}
									>
										<div className='pb-2'>
											<PrimaryButton
												text='Approve'
												onClick={onClickApprove}
												disabled={!isCompletedGettingStarted}
											/>
										</div>
									</Tooltip>
									: <PrimaryButton
										text='Approve'
										onClick={onClickApprove}
										disabled={!isCompletedGettingStarted}
									/>
							)}
						</div>
					}
					<div>
						{dateOfApprove
							&& <S12>
								Active since {activeSince}
								<br/>
							</S12>
						}
						{(isStandardStartup || !isStartup) && visitedAt
							&& <S12>
								Last seen {lastSeen}
								<br/>
							</S12>
						}
						{profileType
							&& <S12>
								Account type: {profileType}
								<br/>
							</S12>
						}
						{status
							&& <S12>
								Status: {status}
							</S12>
						}
						{isChangeStatusPermission
							&& <div className='d-flex align-items-center'>
								<P12 className='pe-2 pb-2'>
									Account status
								</P12>
								<SliderCheckbox
									id={'isBlocked'}
									checked={!isBlocked}
									onChange={handleActivation}
								/>
							</div>
						}
					</div>
				</Col>
			</Row>
		</>
	);
};

ShortInfo.propTypes = {
	logo60: object.isRequired,
	companyShortName: string,
	companyLegalName: string,
	country: object,
	city: string,
	foundedAt: string,
	accountType: string,
	urlOfCompanyWebsite: string,
	isApprovedByAdmin: bool.isRequired,
	visitedAt: number,
	approvedAt: number,
	approvedByAdminAt: number,
	isBlocked: bool.isRequired,
	isEnableMailing: bool,
	userID: number.isRequired,
	profileId: number.isRequired,
	approveUserProfile: func.isRequired,
	handleStartupProfileActivation: func.isRequired,
	handleUploadStartupLogoProfile: func.isRequired,
	sendAdminNotification: func.isRequired,
	isAdminNotificationSending: bool,
	status: string,
	isStartup: bool.isRequired,
	role: string.isRequired,
	createdAt: number,
	isApprovePermission: bool,
	isChangeStatusPermission: bool,
	isEditPermission: bool,
	isDirectNotificationsPermission: bool,
	isChatPermission: bool,
};

ShortInfo.defaultProps = {
	companyShortName: '',
	companyLegalName: '',
	country: object,
	city: '',
	foundedAt: '',
	accountType: '',
	urlOfCompanyWebsite: '',
	visitedAt: null,
	approvedAt: null,
	approvedByAdminAt: null,
	status: '',
	isEnableMailing: false,
};

export default connect(({ admin: { profile, isAdminNotificationSending }, auth }) => {
	const isStartup = !!profile?.startup;
	const profileData = isStartup ? profile.startup : profile.retailer;
	const { country } = profile.startup || profile.retailer;
	const { listOfPermissions } = auth;
	const isApprovePermission = isStartup
		? listOfPermissions?.isStartupsApprovePermission
		: listOfPermissions?.isRetailersApprovePermission;
	const isChangeStatusPermission = isStartup
		? listOfPermissions?.isStartupsChangeStatusPermission
		: listOfPermissions?.isRetailersChangeStatusPermission;
	const isEditPermission = isStartup
		? listOfPermissions?.isStartupsEditDetailsPermission
		: listOfPermissions.isRetailersEditDetailsInfoPermission;
	const isDirectNotificationsPermission = isStartup
		? listOfPermissions?.isStartupsDirectNotificationsPermission
		: listOfPermissions?.isRetailersDirectNotificationsPermission;
	const isChatPermission = isStartup
		? listOfPermissions?.isStartupsChatPermission
		: listOfPermissions?.isRetailersChatPermission;

	const {
		isApprovedByAdmin,
		onlineStatus,
		isBlocked,
		status,
		id,
		approvedByAdminAt,
		role,
	} = profile;

	const {
		logo60,
		companyShortName,
		companyLegalName,
		city,
		accountType,
		urlOfCompanyWebsite,
		approvedAt,
		isEnableMailing,
		createdAt,
	} = profileData;

	return {
		isStartup,
		logo60,
		companyShortName,
		companyLegalName,
		country,
		city,
		foundedAt: profile.startup?.foundedAt,
		accountType,
		urlOfCompanyWebsite,
		isApprovedByAdmin,
		visitedAt: onlineStatus?.visitedAt,
		approvedAt,
		approvedByAdminAt,
		isBlocked,
		userID: id,
		profileId: profileData?.id,
		isEnableMailing,
		isAdminNotificationSending,
		status,
		role,
		createdAt,
		isApprovePermission,
		isChangeStatusPermission,
		isEditPermission,
		isDirectNotificationsPermission,
		isChatPermission,
	};
},
{
	approveUserProfile,
	handleStartupProfileActivation,
	handleUploadStartupLogoProfile,
	sendAdminNotification,
})(memo(ShortInfo));
