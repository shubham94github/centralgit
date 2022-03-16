import React, { memo, useEffect, useRef } from 'react';
import { S14 } from '@components/_shared/text';
import MessageSearchItem from '@components/Messages/ChatContainer/ChatHeader/MessageSearchItem';
import { arrayOf, object, func, bool } from 'prop-types';
import { chatMessageType } from '@constants/types';

const minScrollBottomHeight = 100;

function MessagesSearchResultDropdown({
	messages,
	channel,
	chooseFoundMessage,
	onLoadMoreSearchResults,
	isLoadingMessages,
}) {
	const messageListNode = useRef(null);
	const onScrollHandler = e => {
		if (e.currentTarget.scrollTop !== 0 && e.currentTarget.scrollTop + e.currentTarget.clientHeight
			> e.currentTarget.scrollHeight - minScrollBottomHeight
			&& !isLoadingMessages)
			onLoadMoreSearchResults();
	};

	useEffect(() => {
		if (messageListNode?.current) messageListNode.current.addEventListener('scroll', onScrollHandler);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<div className='messages-search-result' ref={messageListNode}>
			<S14 className='title' bold>Found in messages</S14>
			{/* eslint-disable-next-line react/prop-types */}
			{messages.map(message => {
				const handleClick = () => chooseFoundMessage(message);

				return <MessageSearchItem
					onClick={handleClick}
					message={message}
					key={message.id}
					channel={channel}
				/>;
			}) }
		</div>
	);
}

MessagesSearchResultDropdown.propTypes = {
	messages: arrayOf(chatMessageType),
	channel: object,
	chooseFoundMessage: func,
	onLoadMoreSearchResults: func,
	isLoadingMessages: bool,
};

export default memo(MessagesSearchResultDropdown);
