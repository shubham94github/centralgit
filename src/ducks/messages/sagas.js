import {
	SEND_READ_MESSAGES,
	SET_ACTIVE_CHANNEL,
	SET_ALL_MESSAGES,
	SET_CHANNELS,
	SET_CHANNELS_META,
	SET_COUNT_OF_MESSAGES_IN_CHAT,
	SET_FOUND_MESSAGE,
	SET_FOUND_MESSAGES_IN_CHAT,
	SET_IS_CREATE_CHANNEL_LOADING,
	SET_IS_LOADING,
	SET_IS_LOADING_CHANNELS,
	SET_IS_LOADING_MESSAGES,
	SET_IS_SEARCH_MESSAGES_LOADING,
	SET_IS_SHORT_PROFILE_OPEN,
	SET_MESSAGES_FOR_CHAT,
	SET_META,
	SET_NEW_CHANNEL,
	SET_NEW_MESSAGES_COUNTER,
} from './index';
import { all, call, cancel, fork, put, select } from 'redux-saga/effects';
import {
	createNewChannel as createNewChannelRequest,
	findMessagesInChat,
	getAllMessagesForChat,
	getChatsByUserId,
	getMessagesCounter,
	getChannelById,
	getAllMessagesCounter,
	getChannelsWithPrefilledMessages,
	deleteChatRoom,
} from '@api/messagesApi';
import { sendMessage, sendMessagesAsRead } from '@api/websocketApi';
import {
	selectActiveChannelId,
	selectChannels,
	selectChannelsMeta,
	selectMessages,
	selectMeta,
	selectUser,
} from '../../redux/selectors';
import { onServerErrorHandler, setSnackbar } from '@ducks/common/sagas';
import { Routes } from '@routes';
import history from '../../history';
import { downloadUserAvatar } from '@api/fileUploadingApi';
import enums from '@constants/enums';
import { toColor } from '@utils';
import { getUserProfileById } from '@api/auth';
import { setIsLoading as setIsLoadingProfile } from '../profile/sagas';
import { moveScrollBellow } from '@components/Messages/MessagesList/utils';
import {
	removeItemFromSessionStorage,
	setItemToSessionStorage,
} from '@utils/sessionStorage';
import { setIsLoading as setIsLoadingBrowse } from '../browse/sagas';
import { trialPeriodChatFail } from '@ducks/messages/constants';
import { getItemFromStorage } from '@utils/storage';

const defaultChatsMeta = { page: 1, size: 20 };

export function* setIsLoading(isLoading) {
	yield put({
		type: SET_IS_LOADING,
		payload: { isLoading },
	});
}

export function* setIsLoadingMessages(isLoading) {
	yield put({
		type: SET_IS_LOADING_MESSAGES,
		payload: { isLoadingMessages: isLoading },
	});
}

export function* setIsLoadingChannels(isLoading) {
	yield put({
		type: SET_IS_LOADING_CHANNELS,
		payload: { isLoadingChannels: isLoading },
	});
}

export function* setIsCreateChannelLoading(isLoading) {
	yield put({
		type: SET_IS_CREATE_CHANNEL_LOADING,
		payload: { isCreateChannelLoading: isLoading },
	});
}

export function* getChannelsWithAvatars(channels) {
	const channelsWithAvatars = yield all(
		channels.map(channel => downloadAvatarForChannel(channel)),
	);

	yield put({
		type: SET_CHANNELS,
		payload: {
			channels: channelsWithAvatars,
		},
	});
}

export function* getChannelsByUserIdWorker({ payload: { data } }) {
	try {
		yield setIsLoading(true);
		const { pageSize } = yield select(selectChannelsMeta);
		const channelsWithMessages = yield call(getChannelsWithPrefilledMessages, { ...data });

		yield fork(getNewMessagesCounterWorker);
		yield fork(getChannelsWithAvatars, channelsWithMessages.channels);

		yield all([
			put({
				type: SET_CHANNELS_META,
				payload: {
					channelsMeta: {
						page: Math.ceil(channelsWithMessages.channels.length / pageSize) - 1,
						pageSize,
					},
				},
			}),
			put({
				type: SET_ALL_MESSAGES,
				payload: { messages: channelsWithMessages.messages },
			}),
		]);
	} catch (e) {
		yield all([
			onServerErrorHandler(e),
		]);
	} finally {
		yield setIsLoading(false);
	}
}

export function* getChannelsByUserIdInForkWorker({ payload: { data } }) {
	yield fork(getChannelsByUserIdWorker, { payload: { data } });
}

export function* sendMessageWorker({ payload: {
	recipientId,
	message,
	channelId,
} }) {
	try {
		yield call(sendMessage, { recipientId, message, channelId });
		const countOfMessagesInChat = yield call(getMessagesCounter, channelId);

		yield put({
			type: SET_COUNT_OF_MESSAGES_IN_CHAT,
			payload: {
				countOfMessagesInChat,
			},
		});

	} catch (e) {
		yield all([
			onServerErrorHandler(e),
		]);
	}
}

export function* getNewMessagesCounterWorker() {
	try {
		const newMessagesCounters = yield call(getAllMessagesCounter);

		yield put({
			type: SET_NEW_MESSAGES_COUNTER,
			payload: {
				newMessagesCounters: newMessagesCounters.items,
			},
		});
	} catch (e) {
		yield fork(onServerErrorHandler, e);
	}
}

export function* getAllMessagesForChatWorker({ payload: { id } }) {
	try {
		const stateMessages = yield select(selectMessages);
		const messages = yield call(getAllMessagesForChat, id);
		const pageSize = yield select(state => state.messaging.meta.pageSize);

		yield all([
			put({
				type: SET_MESSAGES_FOR_CHAT,
				payload: {
					messages: stateMessages.some(item => item.chatId === id)
						? stateMessages.map(channelMessages => {
							if (channelMessages.chatId === id) {
								return {
									chatId: channelMessages.chatId,
									messages,
								};
							}

							return channelMessages;
						})
						: [...stateMessages, { chatId: id, messages }],
					page: Math.ceil(messages.length / pageSize),
				},
			}),
		]);
	} catch (e) {
		yield all([
			onServerErrorHandler(e),
		]);
	}
}

export function* createNewChannel(participantId) {
	try {
		yield setIsLoadingProfile(true);

		const user = yield select(selectUser);
		const participant = yield call(getUserProfileById, participantId);

		const [
			creatorLogo60,
			creatorAvatar60,
			participantLogo60,
			participantAvatar60,
		] = yield all([
			call(downloadUserAvatar, user?.retailer?.logo60?.id),
			call(downloadUserAvatar, user.avatar60?.id),
			call(downloadUserAvatar, participant.startup?.logo60?.id),
			call(downloadUserAvatar, participant.avatar60?.id),
		]);

		const newChannel = {
			id: 'new',
			creator: {
				...user,
				retailer: {
					...user?.retailer,
					logo60: {
						image: user?.retailer?.logo60?.id ? creatorLogo60 : '',
						name: !user?.retailer?.logo60?.id ? user?.retailer?.companyShortName : '',
						color: !user?.retailer?.logo60?.id
							? toColor(user?.retailer?.id?.toString())
							: '',
					},
				},
				userAvatar: user.avatar60?.id ? creatorAvatar60 : '',
			},
			participant: {
				...participant,
				startup: {
					...participant.startup,
					logo60: {
						image: participant.startup?.logo60?.id ? participantLogo60 : '',
						name: !participant.startup?.logo60?.id
							? participant.startup?.companyShortName
							: '',
						color: !participant.startup?.logo60?.id
							? toColor(participant.startup?.id?.toString())
							: '',
					},
				},
				userAvatar: participant.avatar60?.id ? participantAvatar60 : '',
			},
		};

		yield all([
			put({
				type: SET_NEW_CHANNEL,
				payload: { newChannel },
			}),
			put({
				type: SET_ACTIVE_CHANNEL,
				payload: { activeChannelId: newChannel.id },
			}),
		]);

		history.push(Routes.MESSAGES.NEW);
	} catch (e) {
		yield fork(onServerErrorHandler, e);
	} finally {
		yield setIsLoadingProfile(false);
	}
}

export function* downloadAvatarForChannel(channel) {
	try {
		const [
			creatorLogo60,
			creatorMemberLogo60,
			creatorAvatar60,
			participantLogo60,
			participantAvatar60,
		] = yield all([
			call(downloadUserAvatar, channel.creator?.retailer?.logo60?.id),
			call(downloadUserAvatar, channel.creator?.member?.logo60?.id),
			call(downloadUserAvatar, channel.creator?.avatar60?.id),
			call(downloadUserAvatar, channel.participant?.startup?.logo60?.id),
			call(downloadUserAvatar, channel.participant?.avatar60?.id),
		]);

		return {
			...channel,
			creator: {
				...channel.creator,
				retailer: channel.creator?.retailer
					? {
						...channel.creator?.retailer,
						logo60: {
							...channel.creator.retailer?.logo60,
							image: channel.creator.retailer?.logo60?.id ? creatorLogo60 : '',
							name: !channel.creator.retailer?.logo60?.id
								? channel.creator.retailer?.companyShortName
								: '',
							color: !channel.creator.retailer?.logo60?.id
								? toColor(channel.creator?.retailer?.id?.toString())
								: '',
						},
					}
					: null,
				member: channel.creator.member
					? {
						...channel.creator?.member,
						logo60: {
							...channel.creator?.member.logo60,
							image: channel.creator.member?.logo60?.id ? creatorMemberLogo60 : '',
							name: !channel.creator.member?.logo60?.id ? channel.creator.member?.companyShortName : '',
							color: !channel.creator.member?.logo60?.id
								? toColor(channel.creator?.member?.id?.toString())
								: '',
						},
					}
					: null,
				userAvatar: channel.creator.avatar60?.id ? creatorAvatar60 : '',
			},
			participant: {
				...channel.participant,
				startup: {
					...channel.participant.startup,
					logo60: {
						...channel.participant.startup?.logo60,
						image: channel.participant.startup?.logo60?.id ? participantLogo60 : '',
						name: !channel.participant.startup?.logo60?.id
							? channel.participant.startup?.companyShortName
							: '',
						color: !channel.participant.startup?.logo60?.id
							? toColor(channel.participant.startup?.id?.toString())
							: '',
					},
				},
				userAvatar: channel.participant.avatar60?.id ? participantAvatar60 : '',
			},
		};
	} catch (e) {
		yield fork(onServerErrorHandler, e);
	}
}

export function* openChatWorker({ payload: { participantId } }) {
	try {
		yield setIsLoadingBrowse(true);
		yield setIsLoading(true);

		const { role, id } = yield select(selectUser);
		let fetchedChannels;
		const stateChannels = yield select(selectChannels);
		const channelMeta = yield select(selectChannelsMeta);

		if (!stateChannels.length) {
			fetchedChannels = yield call(getChatsByUserId, { page: 1, size: channelMeta.pageSize });

			yield put({
				type: SET_CHANNELS,
				payload: { channels: fetchedChannels },
			});
		}

		const channel = (!!stateChannels.length ? stateChannels : fetchedChannels).find(channel => {
			if (role.includes('RETAIL') || role.includes('MEMBER')) return channel.participant.id === participantId;

			return channel.creator.id === participantId;
		});

		if (!channel) {
			yield createNewChannel(participantId);

			return;
		}

		const route = Routes.MESSAGES.CHAT.split('/');
		history.push(`/${route[1]}/${route[2]}/${channel.id}`);

		const stateMessages = yield select(selectMessages);
		const messages = yield call(getAllMessagesForChat, channel.id);
		const pageSize = yield select(state => state.messaging.meta.pageSize);

		yield put({
			type: SET_MESSAGES_FOR_CHAT,
			payload: {
				messages: stateMessages.find(channelMessages => channelMessages.chatId === channel.id)
					? stateMessages.map(channelMessages => {
						if (channelMessages.chatId === id) {
							return {
								chatId: channelMessages.chatId,
								messages,
							};
						}

						return channelMessages;
					})
					: [ ...stateMessages, { chatId: channel.id, messages } ],
				page: Math.ceil(messages.length / pageSize),
			},
		});
	} catch (e) {
		yield fork(onServerErrorHandler, e);
	} finally {
		yield setIsLoading(false);
		yield setIsLoadingBrowse(false);
	}
}

export function* downloadAvatarsForChannels(channels) {
	return yield all(
		channels.map(channel => downloadAvatarForChannel(channel)),
	);
}

export function* createChannelAndSendMessageWorker({ payload: {
	recipientId,
	message,
} }) {
	try {
		yield setIsCreateChannelLoading(true);

		const newChannelId = yield createNewChannelRequest(recipientId);
		const stateMessages = yield select(selectMessages);
		const stateChannels = yield select(selectChannels);
		const pageSize = yield select(state => state.messaging.meta.pageSize);
		const channels = yield call(getChatsByUserId, defaultChatsMeta);
		const messages = yield call(getAllMessagesForChat, newChannelId);
		const newChannelWithAvatar = yield downloadAvatarForChannel(channels.find(item => item.id === newChannelId));
		const isOpenedNewShortProfileChatId = getItemFromStorage('openedShortProfileChatId');

		if (isOpenedNewShortProfileChatId === 'new') {
			removeItemFromSessionStorage('openedShortProfileChatId');
			setItemToSessionStorage('openedShortProfileChatId', newChannelId);
		}

		yield all([
			put({
				type: SET_CHANNELS,
				payload: {
					channels: [
						...stateChannels,
						...channels
							.map(channel => channel.id === newChannelId ? newChannelWithAvatar : channel)
							.filter(item => !stateChannels.some(channel => channel.id === item.id)),
					],
				},
			}),
			put({
				type: SET_MESSAGES_FOR_CHAT,
				payload: {
					messages: [
						...stateMessages.filter(channel => channel.id !== 'new'),
						{ chatId: newChannelId, messages },
					],
					page: Math.ceil(messages.length / pageSize),
				},
			}),
			put({
				type: SET_ACTIVE_CHANNEL,
				payload: {
					activeChannelId: newChannelId,
				},
			}),
			put({
				type: SET_NEW_CHANNEL,
				payload: { newChannel: null },
			}),
			call(sendMessage, { recipientId, message, channelId: newChannelId }),
			call(history.push, `${Routes.MESSAGES.INDEX}/chat/${newChannelId}`),
		]);
	} catch (e) {
		yield fork(onServerErrorHandler, e);
	} finally {
		yield setIsCreateChannelLoading(false);
	}
}

export function* loadMoreMessagesWorker({ payload: { node } }) {
	try {
		yield setIsLoadingMessages(true);

		const activeChannelId = yield select(selectActiveChannelId);
		const channelMessages = yield select(state =>
			state.messaging.messages.find(item => item.chatId === activeChannelId).messages);
		const { pageSize } = yield select(state => state.messaging.meta);
		const offset = channelMessages.length;
		const messagesChunk = yield call(getAllMessagesForChat, activeChannelId, offset);
		const stateMessages = yield select(selectMessages);

		const messages = stateMessages.map(channelMessages => {
			if (channelMessages.chatId === activeChannelId) {
				return {
					...channelMessages,
					messages: [ ...channelMessages.messages, ...messagesChunk],
				};
			}

			return channelMessages;
		});
		const activeChannelMessages = messages.find(channelMessages =>
			channelMessages.chatId === activeChannelId).messages;

		yield all([
			put({
				type: SET_MESSAGES_FOR_CHAT,
				payload: {
					messages,
				},
			}),
			put({
				type: SET_META,
				payload: { meta: { page: Math.ceil(activeChannelMessages.length / pageSize) } },
			}),
		]);

		moveScrollBellow(node);
	} catch (e) {
		yield fork(onServerErrorHandler, e);
	} finally {
		yield setIsLoadingMessages(false);
	}
}

export function* onReadMessageWorker({ payload: {
	messageIds,
	chatId,
} }) {
	try {
		const messages = yield select(selectMessages);
		const channels = yield select(selectChannels);
		const lastMessageId = messages.find(channelMessages => channelMessages.chatId === chatId).messages[0].id;
		const newChannels = channels.map(channel => {
			if (channel.id === chatId
				&& messageIds.includes(lastMessageId)) {
				return {
					...channel,
					lastMessage: {
						...channel.lastMessage,
						messageStatus: 'READ',
					},
				};
			}

			return channel;
		});

		const updatedMessages = messages.map(channelMessages => {
			if (channelMessages.chatId === chatId) {
				return {
					...channelMessages,
					messages: channelMessages.messages.map(message => {
						if (messageIds.includes(message.id)) {
							return {
								...message,
								messageStatus: 'READ',
							};
						}

						return message;
					}),
				};
			}

			return channelMessages;
		});

		yield all([
			put({
				type: SET_MESSAGES_FOR_CHAT,
				payload: { messages: updatedMessages },
			}),
			put({
				type: SET_CHANNELS,
				payload: {
					channels: newChannels,
				},
			}),
		]);

	} catch (e) {
		yield all([
			onServerErrorHandler(e),
		]);
	}
}

export function* onNewMessageWorker({ payload: { message } }) {
	let channels;
	let messages;

	try {
		const activeChannelId = yield select(selectActiveChannelId);
		const user = yield select(selectUser);
		const oldChannels = yield select(selectChannels);
		const oldMessages = yield select(selectMessages);
		const isExistChannel = oldChannels?.some(channel => channel.id === message.chatRoomId);
		const openedShortProfileChatId = getItemFromStorage('openedShortProfileChatId');

		if (!isExistChannel) {
			const [ newChannel, newChannelMessages ] = yield all([
				call(getChannelById, message.chatRoomId),
				call(getAllMessagesForChat, message.chatRoomId),
			]);

			const newChannelWithAvatar = yield downloadAvatarForChannel(newChannel);

			channels = [ ...oldChannels, newChannelWithAvatar ];
			messages = [ ...oldMessages, { chatId: message.chatRoomId, messages: newChannelMessages } ];
		} else {
			const channelsWithAvatars = yield downloadAvatarsForChannels(oldChannels);

			channels = channelsWithAvatars.map(channel => {
				if (channel.id === message.chatRoomId)
					return { ...channel, lastMessage: message };

				return channel;
			});

			messages = oldMessages.map(chatMessages => {
				if (chatMessages.chatId === message.chatRoomId) {
					return {
						...chatMessages,
						messages:
							chatMessages.messages.find(oldMessage => oldMessage.id === message.id)
								? chatMessages.messages
								: [message, ...chatMessages.messages],
					};
				}

				return chatMessages;
			});

			if (!messages.some(channelMessages => channelMessages.chatId === message.chatRoomId))
				messages.push({ chatId: message.chatRoomId, messages: [message] });
		}

		const sortedChannels = [ ...channels ].sort((prevChannel, nextChannel) => !prevChannel?.lastMessage
			? 1
			: nextChannel?.lastMessage?.createdAt - prevChannel?.lastMessage?.createdAt);

		yield all([
			put({
				type: SET_MESSAGES_FOR_CHAT,
				payload: {
					messages: messages.map(chatMessages => {
						if (chatMessages.chatId === message.chatRoomId) {
							return {
								...chatMessages,
								messages:
									chatMessages.messages.find(oldMessage => oldMessage.id === message.id)
										? chatMessages.messages
										: [message, ...chatMessages.messages],
							};
						}

						if (chatMessages.chatId !== message.chatRoomId)
							return chatMessages;
					}).sort((prevMessage, nextMessage) => nextMessage.createdAt - prevMessage.createdAt),
				},
			}),
			put({
				type: SET_CHANNELS,
				payload: {
					channels: sortedChannels,
				},
			}),
			put({
				type: SET_IS_SHORT_PROFILE_OPEN,
				payload: { isShortProfileOpen: openedShortProfileChatId === activeChannelId },
			}),
		]);

		if (message.senderId !== user.id
			&& message.messageStatus !== enums.chatMessagesStatuses.read
			&& activeChannelId === messages.chatRoomId) {

			yield put({
				type: SEND_READ_MESSAGES,
				payload: {
					messages: [message],
				},
			});
		}
	} catch (e) {
		yield all([
			onServerErrorHandler(e),
		]);
	}
}

const getMessagesCounterInChat = function* (activeChannelId) {
	const counters = yield call(getMessagesCounter, activeChannelId);

	yield put({
		type: SET_COUNT_OF_MESSAGES_IN_CHAT,
		payload: {
			countOfMessagesInChat: counters,
		},
	});
};

export function* setActiveChannelWorker({
	type,
	payload,
}) {
	const messages = yield select(selectMessages);
	const meta = yield select(selectMeta);

	yield put({
		type,
		payload,
	});

	if (payload.activeChannelId && payload.activeChannelId !== 'new') {
		yield fork(getMessagesCounterInChat, payload.activeChannelId);

		yield put({
			type: SET_META,
			payload: {
				page: Math.ceil(messages / meta.pageSize ),
			},
		});
	} else {
		yield put({
			type: SET_META,
			payload: {
				page: Math.ceil(messages / meta.pageSize ),
			},
		});
	}
}

export function* sendReadMessagesWorker({ payload: { messages } }) {
	try {
		const activeChannelId = yield select(state => state.messaging.activeChannelId);
		const user = yield select(selectUser);

		yield call(sendMessagesAsRead, {
			chatId: activeChannelId,
			messageIds: messages.map(message => message.id),
			userId: user.id,
		});
	} catch (e) {
		onServerErrorHandler(e);
	}
}

export function* setConnectionStatusWorker({ payload: { connectionStatus } }) {
	const channels = yield select(selectChannels);
	const updatedChannels = channels.map(channel => {
		if (channel?.creator.id === connectionStatus.userId) {
			return {
				...channel,
				creator: {
					...channel.creator,
					onlineStatus: connectionStatus,
				},
			};
		}

		if (channel.participant.id === connectionStatus.userId) {
			return {
				...channel,
				participant: {
					...channel.participant,
					onlineStatus: connectionStatus,
				},
			};
		}

		return channel;
	});

	yield put({
		type: SET_CHANNELS,
		payload: {
			channels: updatedChannels,
		},
	});
}

export function* setIsSearchMessagesLoading(isSearchMessagesLoading) {
	yield put({
		type: SET_IS_SEARCH_MESSAGES_LOADING,
		payload: { isSearchMessagesLoading },
	});
}

export function* findMessagesInChatWorker({ payload: { chatId, value, meta } }) {
	try {
		yield setIsSearchMessagesLoading(true);

		if (!value?.length) {
			yield put({
				type: SET_FOUND_MESSAGES_IN_CHAT,
				payload: { foundMessages: [] },
			});

			return;
		}

		const foundMessages = yield call(findMessagesInChat, { chatId, value, meta });

		yield put({
			type: SET_FOUND_MESSAGES_IN_CHAT,
			payload: { foundMessages },
		});
	} catch (e) {
		onServerErrorHandler(e);
	} finally {
		yield setIsSearchMessagesLoading(false);
	}
}

export function* setFoundMessageWorker({ payload: { foundMessage } }) {
	try {
		const stateMessages = yield select(selectMessages);
		const activeChannelId = yield select(selectActiveChannelId);

		if (!foundMessage || activeChannelId !== foundMessage.chatRoomId) {
			yield all([
				put({
					type: SET_FOUND_MESSAGES_IN_CHAT,
					payload: { foundMessage: [] },
				}),
				put({
					type: SET_FOUND_MESSAGE,
					payload: { foundMessage: null },
				}),
			]);
			return;
		}

		const isFoundMessageInChat = stateMessages.some(channelMessage => {
			return channelMessage.chatId === activeChannelId
				&& channelMessage.messages.some(message => message.id === foundMessage.id);
		});

		if (isFoundMessageInChat) {
			yield put({
				type: SET_FOUND_MESSAGE,
				payload: { foundMessage },
			});
			return;
		}

		yield put({
			type: SET_IS_SEARCH_MESSAGES_LOADING,
			payload: { isSearchMessagesLoading: true },
		});

		const messagesCounterInChat = yield call(getMessagesCounter, foundMessage.chatRoomId);
		const allChatMessages = yield call(getAllMessagesForChat, foundMessage.chatRoomId, 0, messagesCounterInChat);

		yield all([
			put({
				type: SET_MESSAGES_FOR_CHAT,
				payload: {
					messages: stateMessages.map(channelMessages => {
						if (channelMessages.chatId === foundMessage.chatRoomId) {
							return {
								chatId: channelMessages.chatId,
								messages: allChatMessages,
							};
						}

						return channelMessages;
					}),
				},
			}),
			put({
				type: SET_FOUND_MESSAGE,
				payload: { foundMessage },
			}),
		]);
	} catch (e) {
		onServerErrorHandler(e);
	} finally {
		yield put({
			type: SET_IS_SEARCH_MESSAGES_LOADING,
			payload: { isSearchMessagesLoading: false },
		});
	}
}

export function* loadMoreChannelsWorker() {
	let allSagas;

	try {
		yield setIsLoadingChannels(true);

		const oldChannels = yield select(selectChannels);
		const oldMessages = yield select(selectMessages);
		const offset = oldChannels.length;

		const { channels, messages } = yield call(getChannelsWithPrefilledMessages, {
			offset,
		});

		allSagas = yield all([
			put({
				type: SET_CHANNELS,
				payload: {
					channels: [
						...oldChannels,
						...channels.filter(channel => !oldChannels.some(item => item.id === channel.id)),
					],
				},
			}),
			put({
				type: SET_ALL_MESSAGES,
				payload: { messages: [ ...oldMessages.filter(item =>
					!messages.some(chatMessages => chatMessages.chatId === item.chatId)), ...messages ] },
			}),
		]);
	} catch (e) {
		yield all([
			cancel(allSagas),
			onServerErrorHandler(e),
		]);
	} finally {
		yield setIsLoadingChannels(false);
	}
}

export function* setNewChatWorker({ payload: { newChat } }) {
	try {
		const channels = yield select(selectChannels);

		yield put({
			type: SET_CHANNELS,
			payload: {
				channels: [newChat, ...channels].sort((prev, next) =>
					next.lastMessageDate - prev.lastMessageDate),
			},
		});
	} catch (e) {
		yield fork(onServerErrorHandler, e);
	}
}

export function* onNewCountersWorker({ payload: { newMessagesCounter: counter } }) {
	const oldCounters = yield select(state => state.messaging.newMessagesCounters);

	const newMessagesCounters = oldCounters.reduce((acc, item) => {
		if (item.chatId !== counter.chatId)
			acc.push(item);

		return acc;
	}, [counter]);

	yield put({
		type: SET_NEW_MESSAGES_COUNTER,
		payload: { newMessagesCounters },
	});
}

export function* displayChatRestrictionWorker() {
	try {
		yield setIsLoading(true);

		yield setSnackbar({
			text: trialPeriodChatFail,
			type: enums.snackbarTypes.warning,
		});
	} catch (e) {
		yield onServerErrorHandler(e);
	} finally {
		yield setIsLoading(false);
	}
}

export function* deleteChatWorker({ payload: { chatId } }) {
	try {
		yield setIsLoading(true);

		const reqData = { payload: { data: { offset: 0, size: 20 } } };

		if (chatId) yield call(deleteChatRoom, chatId);

		yield all([
			put({
				type: SET_ACTIVE_CHANNEL,
				payload: { activeChannelId: null },
			}),
			call(getChannelsByUserIdWorker, reqData),
			call(history.push, Routes.MESSAGES.INDEX),
		]);
	} catch (e) {
		yield onServerErrorHandler(e);
	} finally {
		yield setIsLoading(false);
	}
}
