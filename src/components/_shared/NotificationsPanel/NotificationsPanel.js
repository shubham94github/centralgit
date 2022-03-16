import React, { memo, useCallback, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { P14 } from '@components/_shared/text';
import { array, bool, func, string } from 'prop-types';
import ItemNotification from './ItemNotification';
import {
	readAllNotifications,
	removeAllNotifications,
	getMoreNotifications,
} from '@ducks/notifications/actions';
import LoadingOverlay from '@components/_shared/LoadingOverlay';
import { isEmpty } from '@utils/js-helpers';
import { emptyNotificationsMessage, titleOfNotifications } from './constants';

import './NotificationsPanel.scss';

const minScrollBottomHeight = 200;

export const NotificationsPanel = ({
	notificationsList,
	removeAllNotifications,
	readAllNotifications,
	isShow,
	isLoading,
	getMoreNotifications,
	userRole,
}) => {
	const notificationNode = useRef(null);

	const onScrollHandler = useCallback(e => {
		const allVisibleHeightWithScroll = e.currentTarget.scrollTop + e.currentTarget.clientHeight;
		const heightForScroll = e.currentTarget.scrollHeight - minScrollBottomHeight;

		if (!isLoading && allVisibleHeightWithScroll > heightForScroll)
			getMoreNotifications();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isLoading, getMoreNotifications]);

	useEffect(() => {
		if (!isShow && !!notificationsList.length)
			readAllNotifications();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isShow]);

	useEffect(() => {
		if (isShow && !!notificationsList.length)
			notificationNode.current.scrollTop = 0;
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isShow]);

	return (
		<div
			className='notifications-panel'
			onScroll={onScrollHandler}
			ref={notificationNode}
		>
			<div className='title'>
				<P14 bold>
					{titleOfNotifications}
				</P14>
				{
					!isLoading && !isEmpty(notificationsList)
						&& <span onClick={removeAllNotifications} className='blue-link'>
							Clear all
						</span>
				}
			</div>
			<div>
				{
					 <>
						{
							notificationsList.map(({
								id,
								text,
								isRead,
								title,
								createdAt,
								notificationType,
								avatar,
								shortProfile,
							}) => (
								<ItemNotification
									key={id}
									id={id}
									text={text}
									isRead={isRead}
									title={title}
									createdAt={createdAt}
									notificationType={notificationType}
									isShowNotifications={isShow}
									avatar={avatar}
									shortProfile={shortProfile}
									userRole={userRole}
								/>
							))
						}
						 {
							!isLoading && isEmpty(notificationsList)
								&& <P14 className='empty-notifications-message'>
									{emptyNotificationsMessage}
								</P14>
						}
					</>
				}
			</div>
			{
				isLoading
					&& <LoadingOverlay classNames='loader-notifications'/>
			}
		</div>
	);
};

NotificationsPanel.propTypes = {
	notificationsList: array.isRequired,
	removeAllNotifications: func.isRequired,
	readAllNotifications: func.isRequired,
	isShow: bool.isRequired,
	isLoading: bool.isRequired,
	getMoreNotifications: func.isRequired,
	userRole: string.isRequired,
};

export default connect(({ notifications, auth }) => {
	const { notificationsList, isLoading } = notifications;
	const { user } = auth;

	return {
		notificationsList,
		isLoading,
		userRole: user.role,
	};
}, {
	removeAllNotifications,
	readAllNotifications,
	getMoreNotifications,
})(memo(NotificationsPanel));
