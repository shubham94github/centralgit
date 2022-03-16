import React, { memo } from 'react';
import { array, arrayOf, number, oneOfType, string, object, bool } from 'prop-types';
import ChatHeader from '@components/Messages/ChatContainer/ChatHeader';
import ChatContent from '@components/Messages/ChatContainer/ChatContent';
import { connect } from 'react-redux';
import { useLocation, Redirect } from 'react-router-dom';
import { Routes } from '@routes';
import LoadingOverlay from '@components/_shared/LoadingOverlay';
import { toColor } from '@utils';
import { isEmpty } from '@utils/js-helpers';
import { chatMessageType } from '@constants/types';
import Profile from '@components/ProfilePage/Profile';
import { Spinner } from 'react-bootstrap';
import { S18 } from '@components/_shared/text';
import { getItemFromStorage } from '@utils/storage';

import './ChatContainer.scss';

function ChatContainer({
	messages,
	channel,
	newChannel,
	isLoading,
	user,
	foundMessages,
	isSearchMessagesLoading,
	isLoadingMessages,
	isProfileOpen,
}) {
	const location = useLocation();
	const isNewChannel = location.pathname === Routes.MESSAGES.NEW;

	if (isNewChannel && !newChannel)
		return <Redirect to={Routes.HOME}/>;

	const activeChannel = isNewChannel ? newChannel : channel;
	const { participant, creator } = activeChannel;
	const member = user.id === participant?.id ? creator : participant;
	const memberName = `${member?.firstName} ${member?.lastName}`;

	const avatar = {
		firstName: member?.firstName,
		lastName: member?.lastName,
		image: member?.userAvatar,
		color: toColor(member?.id.toString()),
	};

	return isLoading
		? <div className='messages-spinner'>
			<div className='spinner'>
				<Spinner
					animation='border'
					variant='danger'
					className='spinner-border-lg'
				/>
			</div>
		</div>
		: !isEmpty(activeChannel)
			? <div className='chat-container'>
				<ChatHeader
					name={memberName}
					position={member?.position?.name}
					department={member?.department?.name}
					wasOnline={member?.onlineStatus}
					isBlocked={member.isBlocked}
					avatar={avatar}
					foundMessages={foundMessages}
					channel={channel}
					isSearchMessagesLoading={isSearchMessagesLoading}
					isLoadingMessages={isLoadingMessages}
					companyName={member.startup?.companyShortName
						|| member.retailer?.companyShortName
						|| member?.member?.companyShortName}
				/>
				<ChatContent
					channelId={channel?.id}
					messages={messages}
					participantId={member?.id}
				/>
				{isProfileOpen && <Profile/>}
				{isLoading && <LoadingOverlay centered/>}
			</div>
			: <div className='messages-shutter'><S18>Select a chat to continue messaging</S18></div>;
}

ChatContainer.defaultProps = {
	channel: {},
};

ChatContainer.propTypes = {
	name: string,
	participants: arrayOf(oneOfType([string, number])),
	messages: array,
	channel: object,
	newChannel: object,
	isLoading: bool,
	user: object,
	foundMessages: arrayOf(chatMessageType),
	isSearchMessagesLoading: bool,
	isLoadingMessages: bool,
	isProfileOpen: bool,
};

const mapStateToProps = ({
	messaging: {
		channels,
		activeChannelId,
		messages,
		newChannel,
		isLoading,
		foundMessages,
		isSearchMessagesLoading,
		isLoadingMessages,
	},
	auth: {
		user,
	},
}) => {
	const currentChannel = channels.find(channel => channel.id === activeChannelId);
	const currentMessages = messages.find(channelMessages => channelMessages.chatId === activeChannelId)?.messages
		|| [];
	const currentUser = user || getItemFromStorage('user');

	return {
		newChannel,
		messages: currentMessages,
		channel: currentChannel,
		isLoading,
		user: currentUser,
		foundMessages,
		isSearchMessagesLoading,
		isLoadingMessages,
	};
};

export default connect(mapStateToProps)(memo(ChatContainer));
