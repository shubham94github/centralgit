import React, { memo, useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import cn from 'classnames';
import { colors } from '@colors';
import { bool, func, instanceOf, number, object, oneOfType, string } from 'prop-types';
import { removeNotification } from '@ducks/notifications/actions';
import { formatDistanceToNowStrict } from 'date-fns';
import enums from '@constants/enums';
import adminLogo from '@assets/images/admin-logo.jpg';
import { isEmpty } from '@utils/js-helpers';
import Avatar from '@components/_shared/Avatar';
import { useHistory } from 'react-router-dom';
import { Icons } from '@icons';
import Markdown from 'markdown-to-jsx';

const { adminNotification, systemNotification, notificationWithAdditionalInfo } = enums.notificationTypes;
const removeIcon = Icons.removeSmallIcon(colors.darkblue70);
const downArrowIcon = Icons.downArrowIcon(colors.darkblue70);
const upArrowIcon = Icons.upArrowIcon(colors.darkblue70);
const stringLimit = 4;
const fontSize = 12;

const ItemNotification = ({
	id,
	text,
	isRead,
	title,
	removeNotification,
	createdAt,
	notificationType,
	isShowNotifications,
	avatar,
	shortProfile,
	userRole,
}) => {
	const history = useHistory();
	const [isFullSize, setIsFullSize] = useState(null);
	const [isOpen, setIsOpen] = useState(false);
	const targetRef = useRef();
	const classes = cn('notification-item', { 'green-notification': !isRead });
	const truncateClasses = cn('truncate-notification', { 'hide': !isOpen && !isFullSize });
	const timeAgo = `${formatDistanceToNowStrict(createdAt)} ago`;
	const isSystemLogo = notificationType === adminNotification || notificationType === systemNotification;
	const isAdditionalLogo = !isEmpty(avatar) && notificationType === notificationWithAdditionalInfo;
	const isRetailerProfile = !!shortProfile?.role && shortProfile.role.includes('RETAILER');
	const isStartupProfile = !!shortProfile?.role && shortProfile.role.includes('STARTUP');
	const isLoggedAdmin = userRole.includes('ADMIN');
	const isLoggedStartup = userRole.includes('STARTUP');

	const handleOnClick = () => setIsOpen(prevState => !prevState);

	const calculateFullSize = (text, offsetWidth, fontSize) =>
		Math.ceil(text.length * fontSize / 2 / offsetWidth);

	useEffect(() => {
		if (!text?.length || !targetRef.current || !isShowNotifications) return;

		const fullSize = calculateFullSize(text, targetRef.current.offsetWidth, fontSize);
		setIsFullSize(fullSize <= stringLimit);
	}, [text, isShowNotifications]);

	const removeHandler = () => removeNotification(id);

	const openProfileHandler = () => {
		if (isLoggedAdmin)
			history.push(`/admin-panel/profile/${isStartupProfile ? 'startup' : 'user'}/${shortProfile.userId}`);

		if (isLoggedStartup && isRetailerProfile)
			history.push(`/profile/retailer/${shortProfile.userId}`);
	};

	return (
		<div className={classes}>
			{
				isSystemLogo
					&& <img
						className='image-style'
						src={adminLogo}
						alt='admin-avatar'
					/>
			}
			{
				isAdditionalLogo
					&& <span onClick={openProfileHandler}>
						<Avatar
							logo={avatar}
							className='avatar-for-notification'
						/>
					</span>
			}
			<div className='notification-content'>
				<span
					className='item-title'
				>
					{title}
					<span onClick={removeHandler} className='clickable'>
						{removeIcon}
					</span>
				</span>
				<p ref={targetRef} className={truncateClasses}>
					<Markdown options={{ forceInline: true, wrapper: 'div' }}>{text}</Markdown>
				</p>
				<div className='d-flex justify-content-between align-items-center'>
					<span className='time-ago'>
						{timeAgo}
					</span>
					{
						!isFullSize
							&& <span
								onClick={handleOnClick}
								className='clickable'
							>
								{isOpen ? upArrowIcon : downArrowIcon}
							</span>
					}
				</div>
			</div>
		</div>
	);
};

ItemNotification.propTypes = {
	id: oneOfType(([number, string])).isRequired,
	createdAt: oneOfType([instanceOf(Date), number]).isRequired,
	text: string.isRequired,
	isRead: bool.isRequired,
	title: string,
	removeNotification: func.isRequired,
	notificationType: string.isRequired,
	isShowNotifications: bool.isRequired,
	avatar: object,
	shortProfile: object.isRequired,
	userRole: string.isRequired,
};

ItemNotification.defaultProps = {
	avatar: {},
};

export default connect(null, {
	removeNotification,
})(memo(ItemNotification));
