import { Record } from 'immutable';
import {
	SET_ACTIVE_CHANNEL,
	SET_CHANNELS,
	SET_IS_LOADING,
	SET_MESSAGES_FOR_CHAT,
	SET_NEW_CHANNEL,
	SET_ALL_MESSAGES,
	SET_META,
	SET_IS_LOADING_MESSAGES,
	SET_NEW_MESSAGES_COUNTER,
	SET_FOUND_MESSAGES_IN_CHAT,
	SET_IS_SEARCH_MESSAGES_LOADING,
	SET_FOUND_MESSAGE,
	SET_IS_SHORT_PROFILE_OPEN,
	CLEAR_MESSAGES_STORE,
	SET_IS_CREATE_CHANNEL_LOADING,
	SET_IS_LOADING_CHANNELS,
	SET_CHANNELS_META,
	SET_COUNT_OF_MESSAGES_IN_CHAT,
} from '@ducks/messages/index';

const InitialState = Record({
	channels: [],
	messages: [],
	isLoading: false,
	isLoadingMessages: false,
	isCreateChannelLoading: false,
	isLoadingChannels: false,
	activeChannelId: null,
	newChannel: null,
	newMessagesCounters: [],
	meta: {
		page: 1,
		pageSize: 20,
	},
	foundMessages: [],
	isSearchMessagesLoading: false,
	foundMessage: null,
	isShortProfileOpen: false,
	channelsMeta: {
		page: 0,
		pageSize: 20,
	},
	countOfMessagesInChat: null,
});

const messagesReducer = (state = new InitialState(), action) => {
	const { payload, type } = action;

	switch (type) {
		case SET_IS_LOADING:
			return state.set('isLoading', payload.isLoading);

		case SET_IS_LOADING_MESSAGES:
			return state.set('isLoadingMessages', payload.isLoadingMessages);

		case SET_IS_CREATE_CHANNEL_LOADING:
			return state.set('isCreateChannelLoading', payload.isCreateChannelLoading);

		case SET_IS_LOADING_CHANNELS:
			return state.set('isLoadingChannels', payload.isLoadingChannels);

		case SET_CHANNELS:
			return state.merge({
				channels: payload.channels,
				newMessagesCounters: payload.newMessagesCounters || state.get('newMessagesCounters'),
			});

		case SET_ACTIVE_CHANNEL:
			return state.merge({
				'activeChannelId': payload.activeChannelId,
				'isShortProfileOpen': false,
			});

		case SET_MESSAGES_FOR_CHAT:
			return state.merge({
				'messages': payload.messages,
				'meta': { ...state.get('meta'), page: payload.page || state.get('meta').page },
			});

		case SET_NEW_CHANNEL:
			return state.set('newChannel', payload.newChannel);

		case SET_META:
			return state.set('meta', { ...state.get('meta'), ...payload.meta });

		case SET_ALL_MESSAGES:
			return state.set('messages', payload.messages);

		case SET_NEW_MESSAGES_COUNTER:
			return state.set('newMessagesCounters', payload.newMessagesCounters);

		case SET_FOUND_MESSAGES_IN_CHAT:
			return state.set('foundMessages', payload.foundMessages);

		case SET_IS_SEARCH_MESSAGES_LOADING:
			return state.set('isSearchMessagesLoading', payload.isSearchMessagesLoading);

		case SET_FOUND_MESSAGE:
			return state.set('foundMessage', payload.foundMessage);

		case SET_IS_SHORT_PROFILE_OPEN:
			return state.set('isShortProfileOpen', payload.isShortProfileOpen);

		case SET_CHANNELS_META:
			return state.set('channelsMeta', { ...state.get('channelsMeta'), ...payload.channelsMeta });

		case SET_COUNT_OF_MESSAGES_IN_CHAT:
			return state.set('countOfMessagesInChat', payload.countOfMessagesInChat);

		case CLEAR_MESSAGES_STORE:
			return new InitialState();

		default: return state;
	}
};

export default messagesReducer;
