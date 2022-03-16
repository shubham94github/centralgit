import React, { memo, useEffect } from 'react';
import ChannelsList from '@components/Messages/ChannelsList';
import { connect } from 'react-redux';
import {
	getChatsByUserId,
	getAllMessagesForChat,
	setActiveChannel,
	onNewMessage,
	onReadMessage,
	onConnectionStatus,
	onNewChat,
	onNewCounters,
} from '@ducks/messages/actions';
import { array, bool, func, number, oneOfType, string } from 'prop-types';
import { connectToWebsocket } from '@api/websocketApi';
import ChatContainer from '@components/Messages/ChatContainer';
import { Redirect, Route, Switch, useLocation } from 'react-router-dom';
import { Routes } from '@routes';
import ShortProfile from '@components/Messages/ShortProfile';
import { onNotifications } from '@ducks/notifications/actions';
import { getItemFromStorage } from '@utils/storage';
import { onSubscriptionPaidSuccess } from '@ducks/auth/actions';

import './MessagesPage.scss';

function MessagesPage({
	userId,
	channels,
	getChatsByUserId,
	newParticipantId,
	activeChannelId,
	getAllMessagesForChat,
	onNewMessage,
	onReadMessage,
	setActiveChannel,
	onConnectionStatus,
	isShortProfileOpen,
	onNotifications,
	onNewChat,
	onNewCounters,
	onSubscriptionPaidSuccess,
}) {
	const location = useLocation();

	useEffect(() => {
		const activeChannelIdFromLocation = +location.pathname.split('/').reverse()[0];

		if (activeChannelIdFromLocation && (!activeChannelId || activeChannelId !== activeChannelIdFromLocation))
			setActiveChannel(activeChannelIdFromLocation);

		connectToWebsocket(
			userId, {
				onNewMessage,
				onReadMessage,
				onConnectionStatus,
				onNotifications,
				onNewChat,
				onNewCounters,
				onSubscriptionPaidSuccess,
			});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (!channels?.length) getChatsByUserId({ offset: 0, limit: 20 });
	}, [activeChannelId, channels?.length, getChatsByUserId, getAllMessagesForChat, newParticipantId, userId]);

	if (location.pathname === Routes.MESSAGES.INDEX && activeChannelId)
		return <Redirect to={`${Routes.MESSAGES.INDEX}/chat/${activeChannelId}`}/>;

	return (
		<div className='messages-page-container'>
			<ChannelsList channels={channels}/>
			<Switch>
				<Route path={Routes.MESSAGES.INDEX} component={ChatContainer}/>
				<Route path={Routes.MESSAGES.CHAT} component={ChatContainer}/>
				<Route path={Routes.MESSAGES.NEW} component={ChatContainer}/>
			</Switch>
			{isShortProfileOpen && activeChannelId && <ShortProfile/>}
		</div>
	);
}

MessagesPage.propTypes = {
	userId: oneOfType([string, number]),
	channels: array,
	getChatsByUserId: func.isRequired,
	newParticipantId: oneOfType([number, string]),
	activeChannelId: oneOfType([number, string]),
	getAllMessagesForChat: func.isRequired,
	onNewMessage: func.isRequired,
	setActiveChannel: func.isRequired,
	onReadMessage: func.isRequired,
	onConnectionStatus: func.isRequired,
	isShortProfileOpen: bool,
	onNotifications: func.isRequired,
	onNewChat: func.isRequired,
	onNewCounters: func.isRequired,
	onSubscriptionPaidSuccess: func.isRequired,
};

const mapStateToProps = state => {
	const {
		auth: { user },
		messaging: {
			channels,
			newChannel,
			activeChannelId,
			isShortProfileOpen,
		},
	} = state;

	return {
		userId: user?.id || getItemFromStorage('user').id,
		channels,
		newParticipantId: newChannel?.participantId,
		activeChannelId,
		isShortProfileOpen,
	};
};

export default connect(mapStateToProps, {
	getChatsByUserId,
	getAllMessagesForChat,
	onNewMessage,
	setActiveChannel,
	onReadMessage,
	onConnectionStatus,
	onNotifications,
	onNewChat,
	onNewCounters,
	onSubscriptionPaidSuccess,
})(memo(MessagesPage));
