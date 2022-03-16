import React, { memo, useState } from 'react';
import { bool, func, number, object, oneOfType, string } from 'prop-types';
import cn from 'classnames';
import { connect } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { Routes } from '@routes';
import { createChannelAndSendMessage, sendMessage } from '@ducks/messages/actions';
import { S12 } from '@components/_shared/text';
import { colors } from '@colors';
import EditorTextArea from '@components/_shared/form/EditorTextArea';
import { Icons } from '@icons';
import PrimaryButton from '@components/_shared/buttons/PrimaryButton';
import { removeBlankLinesInMessage } from '@components/Messages/ChatContainer/ChatInput/utils';

import './ChatInput.scss';

const clearInputValueDelay = 100;

function ChatInput({
	channelId,
	participantId,
	userId,
	creatorId,
	createChannelAndSendMessage,
	newChannel,
	sendMessage,
	isEnableMailing,
	isBlocked,
}) {
	const location = useLocation();
	const [message, setMessage] = useState('');
	const [isClearChatInput, setIsClearChatInput] = useState(false);

	const warningIcon = Icons.infoIcon(colors.orange50);

	const handleSendMessage = messageContent => {
		if (location.pathname === Routes.MESSAGES.NEW && newChannel) {
			createChannelAndSendMessage({
				recipientId: userId === participantId ? creatorId : participantId,
				message: messageContent,
			});
		} else {
			sendMessage({
				recipientId: userId === participantId ? creatorId : participantId,
				message: messageContent,
				channelId,
			});
		}
	};

	const handleOnInputChange = message => {
		setMessage(message.trim());
	};

	const classNames = cn('chat-editor-input', {
		'empty-message': !!message.length,
	});

	const onSendMessageClick = () => {
		const formattedMessage = removeBlankLinesInMessage(message);

		if (!formattedMessage) return;

		setIsClearChatInput(true);
		handleSendMessage(formattedMessage);

		setTimeout(() => {
			setIsClearChatInput(false);
		}, clearInputValueDelay);
	};

	const onKeyDown = (e, messageContent) => {
		if (e.key === 'Enter' && !e.shiftKey) handleSendMessage(messageContent.trim());
	};

	const classNamesContainer = cn('chat-input', {
		'blocked': !isEnableMailing || isBlocked,
	});

	return (
		<div className={classNamesContainer}>
			{!isEnableMailing
				? <div className='blocked-message'>
					{warningIcon}
					<S12>
						You can’t send the message to this Startup.
						If you have any questions please contact RetailHub team for assistance.
					</S12>
				</div>
				: isBlocked
					? <div className='blocked-message'>
						{warningIcon}
						<S12>
							This Startup has been blocked.
							If you have any questions please contact RetailHub team for assistance.
						</S12>
					</div>
					: <div className='actions-container'>
						<EditorTextArea
							placeholder='Type your message here'
							onChange={handleOnInputChange}
							classNames={classNames}
							keyBindingFn={onKeyDown}
							isClearInput={isClearChatInput}
						/>
						<PrimaryButton
							onClick={onSendMessageClick}
							text='Send'
							className='send-button'
						/>
					</div>
			}
		</div>
	);
}

ChatInput.propTypes = {
	channelId: oneOfType([string, number]),
	participantId: oneOfType([string, number]),
	userId: oneOfType([string, number]),
	creatorId: oneOfType([string, number]),
	createChannelAndSendMessage: func,
	newChannel: object,
	sendMessage: func,
	isEnableMailing: bool.isRequired,
	isBlocked: bool.isRequired,
};

const mapStateToProps = ({ auth: { user },  messaging: {  activeChannelId, channels, newChannel } }) =>  {
	const channel = activeChannelId === 'new' ? newChannel : channels.find(channel => channel.id === activeChannelId);
	const { startup: { isEnableMailing }, isBlocked } = channel.participant;

	return {
		userId: user.id,
		creatorId: channel?.creator.id,
		newChannel,
		isEnableMailing,
		isBlocked,
	};
};

export default connect(mapStateToProps, {
	createChannelAndSendMessage,
	sendMessage,
})(memo(ChatInput));
