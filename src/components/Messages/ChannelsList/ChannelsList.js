import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { array, bool, func, number, object, oneOfType, string } from 'prop-types';
import ChannelItem from '@components/Messages/ChannelsList/ChannelItem';
import { connect } from 'react-redux';
import { loadMoreChannels, setActiveChannel } from '@ducks/messages/actions';
import SearchInput from '@components/_shared/form/SearchInput';
import { useLocation, useHistory } from 'react-router-dom';
import { Routes } from '@routes';
import { removeItemFromSessionStorage } from '@utils/sessionStorage';
import { getItemFromStorage } from '@utils/storage';
import { Spinner } from 'react-bootstrap';

import './ChannelsList.scss';

const channelsNodeOffset = 400;

function ChannelsList({
	channels,
	setActiveChannel,
	activeChannelId,
	newChannel,
	isCreator,
	userId,
	newMessagesCounters,
	isLoadingChannels,
	loadMoreChannels,
}) {
	const history = useHistory();
	const location = useLocation();
	const channelListNode = useRef(null);
	const scrollTop = useRef(null);

	const [searchValue, setSearchValue] = useState('');

	const handleSetActiveChannel = channelId => {
		if (channelId === 'new' || channelId === activeChannelId) return;

		if (!!activeChannelId && location.pathname !== `messages/chat/${activeChannelId}`)
			history.push(`/messages/chat/${channelId}`);

		setActiveChannel(channelId);
		removeItemFromSessionStorage('openedShortProfileChatId');
	};

	const isAvailableForLoadMoreChannels = e => !isLoadingChannels && channelListNode.current.clientHeight
		+ e.currentTarget.scrollTop >= e.currentTarget.scrollHeight - channelsNodeOffset;

	const onScrollHandler = useCallback(e => {
		if (e.currentTarget.scrollTop <= scrollTop.current) {
			scrollTop.current = e.currentTarget.scrollTop;

			return;
		}

		if (isAvailableForLoadMoreChannels(e))
			loadMoreChannels({ node: channelListNode.current });

		scrollTop.current = e.currentTarget.scrollTop;
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isLoadingChannels, loadMoreChannels]);

	useEffect(() => {
		if (location.pathname === Routes.MESSAGES.NEW && !!newChannel)
			setActiveChannel('new');
	}, [activeChannelId, location, newChannel, setActiveChannel]);

	const loweredSearchValue = searchValue.toLowerCase();
	const filteredChannels = [...channels]
		.filter(channel => {
			if (searchValue?.length <= 1) return true;

			return channel[isCreator ? 'participant' : 'creator'].firstName.toLowerCase().includes(loweredSearchValue)
					|| channel[isCreator ? 'participant' : 'creator']
						.lastName.toLowerCase()
						.includes(loweredSearchValue)
					|| channel[isCreator ? 'participant' : 'creator'][isCreator ? 'startup' : 'retailer']
						.companyLegalName.toLowerCase().includes(loweredSearchValue);
		});

	return (
		<div className='channels-list-container'>
			<div className='channels-list-header'>
				<SearchInput
					isFilter={false}
					onSearch={setSearchValue}
					placeholder='Find a contact'
				/>
			</div>
			<div
				className='channels'
				ref={channelListNode}
				onScroll={onScrollHandler}
			>
				{(activeChannelId === 'new' && !!newChannel
					? [newChannel, ...filteredChannels]
					: filteredChannels)
					.sort((prev, next) => next.lastMessage?.createdAt - prev.lastMessage?.createdAt)
					.map(channel =>
						<ChannelItem
							isActiveChannel={channel.id === activeChannelId}
							onClick={handleSetActiveChannel}
							channel={channel}
							participant={userId === channel.creator.id ? channel.participant : channel.creator}
							key={channel.id}
							userId={userId}
							newMessagesCounter={newMessagesCounters.find(item => item.chatId === channel.id)}
						/>)
				}
				{isLoadingChannels
					&& <div className='spinner'>
						<Spinner
							animation='border'
							variant='danger'
							className='spinner-border-lg'
						/>
					</div>
				}
			</div>
		</div>
	);
}

ChannelsList.defaultProps = {
	channels: [],
};

ChannelsList.propTypes = {
	channels: array,
	participants: array,
	setActiveChannel: func,
	activeChannelId: oneOfType([number, string]),
	location: object,
	newChannel: object,
	isCreator: bool,
	userId: number,
	newMessagesCounters: array,
	isLoadingChannels: bool,
	loadMoreChannels: func,
};

const mapStateToProps = ({
	messaging: {
		activeChannelId,
		newChannel,
		newMessagesCounters,
		isLoadingChannels,
	},
	auth,
}, {
	channels,
}) => {
	const user = auth.user || getItemFromStorage('user');
	const activeChannel = channels.find(channel => channel.id === activeChannelId);
	const isCreator = activeChannel
		? activeChannel.creator.id === user.id
		: user.role.includes('RETAIL');

	return {
		activeChannelId,
		newChannel,
		isCreator,
		userId: user?.id,
		newMessagesCounters,
		isLoadingChannels,
	};
};

export default connect(mapStateToProps, {
	setActiveChannel,
	loadMoreChannels,
})(memo(ChannelsList));
