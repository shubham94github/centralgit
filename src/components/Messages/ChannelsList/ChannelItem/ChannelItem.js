import React, { memo } from 'react';
import { arrayOf, bool, func, number, object, oneOfType, shape, string } from 'prop-types';
import cn from 'classnames';
import { S14 } from '@components/_shared/text';
import { formatDateForMessages } from '@components/Messages/utils';
import PillCounter from '@components/_shared/Notifications/PillCounter';
import Avatar from '@components/_shared/form/Avatar';
import { toColor, markDownToText } from '@utils';
import Tooltip from '@components/_shared/Tooltip';

import './ChannelItem.scss';

const maxStringLength = 42;

function ChannelItem({
	channel,
	onClick,
	isActiveChannel,
	participant,
	userId,
	newMessagesCounter,
}) {
	const isYourLastMessage = channel.lastMessage?.senderId === userId;
	const handleOnClick = () => onClick(channel.id);
	const classNames = cn('channel-item-container', {
		'active': !!isActiveChannel,
	});
	const channelItemClassnames = cn( {
		'unread': channel.lastMessage?.messageStatus === 'READ' && !isYourLastMessage,
	});

	const avatar = {
		image: participant.userAvatar,
		name: `${participant.firstName} ${participant.lastName}`,
		firstName: participant.firstName,
		lastName: participant.lastName,
		color: toColor(participant.id.toString()),
	};

	const channelName = `${participant.firstName} ${participant.lastName}`;

	return (
		<div
			onClick={handleOnClick}
			className={classNames}
		>
			<div className='channel-avatar'>
				<Avatar
					avatar={avatar}
					isUser={true}
					connectionStatus={participant.onlineStatus?.onlineStatus}
				/>
			</div>
			<div className='channel-info'>
				<div className='channel-info-header'>
					<Tooltip
						placement='bottom-start'
						isVisibleTooltip={channelName?.length > maxStringLength}
						message={channelName}
					>
						<S14 className='channel-name'>
							{participant.firstName} {participant.lastName}
						</S14>
					</Tooltip>
					<div className='actions'>
						<span className='last-message-date'>
							{channel.lastMessage && formatDateForMessages(channel.lastMessage.createdAt)}
						</span>
					</div>
				</div>
				{channel.lastMessage
					&& <div className='last-message-text'>
						<span
							className={channelItemClassnames}
						>
							{isYourLastMessage && !!channel.lastMessage
								? `You: ${markDownToText(channel.lastMessage?.text)}`
								: markDownToText(channel.lastMessage.text)
							}
						</span>
						{newMessagesCounter?.count > 0 && <PillCounter counter={newMessagesCounter.count}/>}
					</div>
				}
			</div>
		</div>
	);
}

ChannelItem.propTypes = {
	channel: object,
	participants: arrayOf(oneOfType([string, number])),
	onClick: func,
	isActiveChannel: bool,
	newMessagesCounter: shape({
		chatId: number,
		counter: number,
	}),
	participant: object,
	userId: number,
};

export default memo(ChannelItem);
