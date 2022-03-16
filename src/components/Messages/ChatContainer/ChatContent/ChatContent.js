import React, { memo } from 'react';
import ChatInput from '@components/Messages/ChatContainer/ChatInput';
import MessagesList from '@components/Messages/MessagesList';
import { array, number, oneOfType, string } from 'prop-types';

import './ChatContent.scss';

function ChatContent({ messages, channelId, participantId }) {
	return (
		<>
			<div className='chat-content'>
				<MessagesList messages={messages}/>
			</div>
			<ChatInput
				channelId={channelId}
				participantId={participantId}
			/>
		</>
	);
}

ChatContent.propTypes = {
	messages: array,
	channelId: oneOfType([string, number]),
	participantId: oneOfType([string, number]),
};

export default memo(ChatContent);
