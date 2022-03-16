import React, { memo, useEffect, useRef } from 'react';
import Message from '@components/Messages/MessagesList/Message';
import { array, bool, func, number, object, oneOfType, shape, string } from 'prop-types';
import { connect } from 'react-redux';
import { scrollChatBottom } from '@components/Messages/MessagesList/utils';
import { loadMoreMessages, sendReadMessages, setFoundMessage } from '@ducks/messages/actions';
import { Spinner } from 'react-bootstrap';
import { isSameDay } from 'date-fns';
import { toColor } from '@utils';
import { formatDateForSeparateMessages } from '@components/Messages/utils';
import usePrevious from '@utils/hooks/usePrevious';
import { chatMessageType } from '@constants/types';
import LoadingOverlay from '@components/_shared/LoadingOverlay';

import './MessagesList.scss';

function MessagesList({
	messages,
	activeChannelId,
	channel,
	isLoading,
	isLoadingMessages,
	loadMoreMessages,
	userId,
	sendReadMessages,
	foundMessage,
	setFoundMessage,
	isCreateChannelLoading,
	countOfMessagesInChat,
}) {
	const messageListNode = useRef(null);
	const prevMessagesCount = usePrevious(messages?.length);

	const onScrollHandler = e => {
		if (activeChannelId === 'new') return;

		if (messages.length === countOfMessagesInChat) return;

		if (e.currentTarget.scrollTop === 0 && !isLoadingMessages)
			loadMoreMessages({ node: messageListNode.current });
	};

	useEffect(() => {
		if (!messageListNode.current || isLoading) return;

		scrollChatBottom(messageListNode.current);
	}, [activeChannelId, isLoading]);

	useEffect(() => {
		if (messages?.length - prevMessagesCount === 1) scrollChatBottom(messageListNode.current);
	}, [messages, prevMessagesCount]);

	useEffect(() => {
		const messagesWithNonReadStatus = messages.filter(message =>
			message.senderId !== userId && message.messageStatus !== 'READ');

		if (messagesWithNonReadStatus.length)
			sendReadMessages(messagesWithNonReadStatus);
	}, [messages, sendReadMessages, userId]);

	return (
		<div
			className='message-list-container'
			ref={messageListNode}
			onScroll={onScrollHandler}
		>
			{isLoadingMessages
				? <div className='spinner'>
					<Spinner
						animation='border'
						variant='danger'
						className='spinner-border-lg'
					/>
				</div>
				: <div className='reserve-loading'/>
			}
			{isCreateChannelLoading
				? <LoadingOverlay classNames='create-chat-loading'/>
				: [...messages].reverse().map((message, i, array) => {
					const sender = channel?.creator.id === message.senderId ? channel.creator : channel.participant;
					const senderName = `${sender.firstName} ${sender.lastName}`;

					const avatar = {
						image: sender.userAvatar,
						name: senderName,
						firstName: sender.firstName,
						lastName: sender.lastName,
						color: toColor(sender.id.toString()),
					};

					return (
						<div className='message-container' key={`${message.id}${i}${sender.firstName}`}>
							{ !isSameDay(message.createdAt, array[i - 1]?.createdAt)
								&& <div className='date-separator'>
									<span>{formatDateForSeparateMessages(message.createdAt)}</span>
								</div>
							}
							<Message
								message={message}
								avatar={avatar}
								isUserMessage={userId === message.senderId}
								connectionStatus={userId !== message.senderId && sender.onlineStatus.onlineStatus}
								foundMessage={foundMessage}
								messageListNode={messageListNode.current}
								setFoundMessage={setFoundMessage}
							/>
						</div>
					);
				})
			}
		</div>
	);
}

MessagesList.propTypes = {
	messages: array,
	activeChannelId: oneOfType([string, number]),
	userId: oneOfType([string, number]),
	channel: object,
	isLoadingMessages: bool,
	isLoading: bool,
	isCreateChannelLoading: bool,
	loadMoreMessages: func,
	meta: shape({
		page: number,
		pageSize: number,
	}),
	sendReadMessages: func.isRequired,
	foundMessage: chatMessageType,
	setFoundMessage: func,
	countOfMessagesInChat: number,
};

const mapStateToProps = ({
	auth: {
		user,
	},
	messaging: {
		activeChannelId,
		channels,
		isLoading,
		isLoadingMessages,
		meta,
		foundMessage,
		isCreateChannelLoading,
		countOfMessagesInChat,
	},
}) => {
	return {
		activeChannelId,
		channel: channels.find(channel => channel.id === activeChannelId),
		isLoadingMessages,
		meta,
		userId: user.id,
		isLoading,
		foundMessage,
		isCreateChannelLoading,
		countOfMessagesInChat,
	};
};

export default connect(mapStateToProps, {
	loadMoreMessages,
	sendReadMessages,
	setFoundMessage,
})(memo(MessagesList));
