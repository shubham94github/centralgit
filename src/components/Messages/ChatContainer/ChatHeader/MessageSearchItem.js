import React, { memo } from 'react';
import { func, object } from 'prop-types';
import { formatDateForMessages } from '@components/Messages/utils';
import Avatar from '@components/_shared/form/Avatar';
import { markDownToText, toColor } from '@utils';

function MessageSearchItem({ message, channel, onClick }) {
	const sender = message.senderId === channel.creator.id ? channel.creator : channel.participant;
	const senderName = `${sender.firstName} ${sender.lastName}`;

	const avatar = {
		image: sender.userAvatar,
		name: senderName,
		firstName: sender.firstName,
		lastName: sender.lastName,
		color: toColor(sender.id.toString()),
	};

	return (
		<div className='message-search-item' onClick={onClick}>
			<Avatar avatar={avatar}/>
			<div className='item-content'>
				<div className='channel-name'>
					<span className='name'>{senderName}</span>
					<span className='date'>{formatDateForMessages(message.createdAt)}</span>
				</div>
				<div className='message-text'><span>{markDownToText(message.text)}</span></div>
			</div>
		</div>
	);
}

MessageSearchItem.propTypes = {
	message: object,
	channel: object,
	onClick: func,
};

export default memo(MessageSearchItem);
