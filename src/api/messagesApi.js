import { client } from './clientApi';
import { commonPartOfUrl } from '@constants/websocket';
import promiseMemoize from '@utils/promiseMemoize';

const { MESSAGES_SERVER_URL } = process.env;
const url = `${MESSAGES_SERVER_URL}${commonPartOfUrl}/messages`;
const defaultMeta = {
	page: 0,
	offset: 0,
	pageSize: 20,
	limit: 20,
	quantity: 20,
};

export const createRoom = (creatorId, participantId) =>
	client.get(`${url}/room/create/${participantId}`);

export const getChatMessages = id => client.get(`${url}/${id}/all`);

export const getNewMessagesCount = chatId =>
	client.get(`${url}/${chatId}/count`);

export const getMessageById = messageId => client.get(`${url}/${messageId}`);

export const getChannelById = promiseMemoize(chatId =>
	client.get(`${url}/room/${chatId}`));

export const getChatsByUserId = meta => {
	return client.post(`${url}/room/all-room`, {
		...meta,
		sort: {
			direction: 'ASC',
			fieldName: 'updatedAt',
		},
	});
};

export const getAllChatsByUserIdWithMessages = id => {
	return client.post(`${url}/room/all/prefilled/${id}`, {
		quantity: defaultMeta.quantity,
	});
};

export const getAllMessagesForChat = (chatId, offset = defaultMeta.offset, limit = defaultMeta.limit) => {
	return client.post(`${url}/${chatId}/all-messages`, {
		offset,
		limit,
	});
};

export const getChannelsWithPrefilledMessages = ({
	offset = defaultMeta.offset,
	limit = defaultMeta.limit,
}) => {
	return client.post(`${url}/room/all-room/prefilled`, {
		offset,
		limit,
		quantity: 20,
	}).then(res => {
		return new Promise(resolve => resolve(res
			.sort((prevItem, nexItem) => nexItem.lastMessageDate - prevItem.lastMessageDate)
			.reduce((acc, item) => {
				const channel = { ...item, lastMessage: item.lastMessages ? item.lastMessages[0] : null };
				acc.messages.push({
					chatId: channel.id,
					messages: channel.lastMessages,
				});

				delete channel.lastMessages;
				acc.channels.push(channel);

				return acc;
			}, { channels: [], messages: [] })));
	});
};

export const createNewChannel = participantId =>
	client.get(`${url}/room/create/${participantId}`);

export const findMessagesInChat = promiseMemoize(({ chatId, value, meta }) => {
	return client.post(`${url}/${chatId}/search`, {
		fields: [
			{
				fieldName: 'text',
				filterText: value,
			},
		],
		page: meta.page,
		size: meta.pageSize,
	});
});

export const getMessagesCounter = chatId =>
	client.post(`${url}/${chatId}/search/count`, { fields: [] });

export const getAllMessagesCounter = () => client.get(`${url}/user/count`);

export const deleteChatRoom = chatId => client.get(`${url}/room/${chatId}/delete`);
