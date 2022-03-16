import {
	GET_CHANNELS,
	GET_CHANNELS_IN_FORK,
	SET_ACTIVE_CHANNEL,
	GET_ALL_MESSAGES_FOR_CHAT,
	SET_NEW_MESSAGE_IN_CHAT,
	OPEN_CHAT,
	CREATE_CHANNEL_AND_SEND_MESSAGE,
	SEND_CHANNEL_MESSAGE,
	LOAD_MORE_MESSAGES,
	SET_READ_MESSAGE_IN_CHAT,
	SEND_READ_MESSAGES,
	GET_ONLINE_STATUSES,
	SET_CONNECT_STATUS,
	FIND_MESSAGES_IN_CHAT,
	SET_FOUND_MESSAGES_IN_CHAT,
	SET_FOUND_MESSAGE,
	SET_IS_SHORT_PROFILE_OPEN,
	GET_NEW_MESSAGES_COUNTER,
	LOAD_MORE_CHANNELS,
	SET_NEW_CHAT,
	ON_NEW_COUNTERS,
	CHAT_RESTRICTION,
	DELETE_CHAT,
} from './index';

export const getChatsByUserId = data => ({
	type: GET_CHANNELS,
	payload: { data },
});

export const getChatsByUserIdInFork = data => ({
	type: GET_CHANNELS_IN_FORK,
	payload: { data },
});

export const getAllMessagesForChat = id => ({
	type: GET_ALL_MESSAGES_FOR_CHAT,
	payload: { id },
});

export const setActiveChannel = id => ({
	type: SET_ACTIVE_CHANNEL,
	payload: { activeChannelId: id },
});

export const onNewMessage = message => ({
	type: SET_NEW_MESSAGE_IN_CHAT,
	payload: { message },
});

export const openChat = participantId => ({
	type: OPEN_CHAT,
	payload: { participantId },
});

export const onReadMessage = ({
	messageIds,
	readerId,
	chatId,
}) => ({
	type: SET_READ_MESSAGE_IN_CHAT,
	payload: {
		messageIds,
		readerId,
		chatId,
	},
});

export const createChannelAndSendMessage = ({
	recipientId,
	message,
}) => ({
	type: CREATE_CHANNEL_AND_SEND_MESSAGE,
	payload: {
		recipientId,
		message,
	},
});

export const sendMessage = ({
	recipientId,
	message,
	channelId,
}) => ({
	type: SEND_CHANNEL_MESSAGE,
	payload: {
		recipientId,
		message,
		channelId,
	},
});

export const loadMoreMessages = data => ({
	type: LOAD_MORE_MESSAGES,
	payload: { ...data },
});

export const sendReadMessages = messages => ({
	type: SEND_READ_MESSAGES,
	payload: { messages },
});

export const getOnlineStatuses = userId => ({
	type: GET_ONLINE_STATUSES,
	payload: { userId },
});

export const setOnlineStatuses = connectionStatus => ({
	type: SET_CONNECT_STATUS,
	payload: {
		connectionStatus,
	},
});

export const onConnectionStatus = connectionStatus => ({
	type: SET_CONNECT_STATUS,
	payload: {
		connectionStatus,
	},
});

export const findMessagesInChat = (chatId, value, meta) => ({
	type: FIND_MESSAGES_IN_CHAT,
	payload: { chatId, value, meta },
});

export const clearFoundMessages = () => ({
	type: SET_FOUND_MESSAGES_IN_CHAT,
	payload: { foundMessages: [] },
});

export const setFoundMessage = foundMessage => ({
	type: SET_FOUND_MESSAGE,
	payload: {
		foundMessage,
	},
});

export const setIsShortProfileOpen = isShortProfileOpen => ({
	type: SET_IS_SHORT_PROFILE_OPEN,
	payload: { isShortProfileOpen },
});

export const getNewMessagesCounter = () => ({ type: GET_NEW_MESSAGES_COUNTER });

export const loadMoreChannels = data => ({
	type: LOAD_MORE_CHANNELS,
	payload: { ...data },
});

export const onNewChat = newChat => ({
	type: SET_NEW_CHAT,
	payload: { newChat },
});

export const onNewCounters = newMessagesCounter => ({
	type: ON_NEW_COUNTERS,
	payload: { newMessagesCounter },
});

export const setWarningOfChatRestriction = () => ({
	type: CHAT_RESTRICTION,
});

export const deleteChat = chatId => ({
	type: DELETE_CHAT,
	payload: { chatId },
});
