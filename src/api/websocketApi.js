import { uint8ArrayToUtf8 } from '@utils/uint8ArrayToUtf8';
import { setSnackbar } from '@ducks/common/sagas';
import enums from '@constants/enums';
import {
	commonPartOfUrl,
	heartbeatIncoming,
	heartbeatOutgoing,
	reconnectDelay,
} from '@constants/websocket';
import { getItemFromStorage } from '@utils/storage';

const { WEBSOCKET_SERVER_URL } = process.env;
let stompClient;
const websocketURL = `${commonPartOfUrl}/user`;

export const onMessageReceived = onNewMessage => message => {
	const decodedMessage = uint8ArrayToUtf8(message._binaryBody);

	onNewMessage(decodedMessage);
};

export const onReadMessageReceived = onReadMessage => message => {
	const decodedMessage = uint8ArrayToUtf8(message._binaryBody);

	onReadMessage(decodedMessage);
};

export const onNotificationReceived = onNotifications => notification => {
	const decodedNotification = uint8ArrayToUtf8(notification._binaryBody);

	onNotifications(decodedNotification);
};

export const onUserStatusReceived = onConnectionStatus => status => {
	const decodedStatus = uint8ArrayToUtf8(status._binaryBody);

	onConnectionStatus(decodedStatus);
};

export const onNewChatReceived = onNewChat => newChat => {
	const decodedChannel = uint8ArrayToUtf8(newChat._binaryBody);

	onNewChat(decodedChannel);
};

export const onCounterReceived = onNewCounters => counter => {
	const decodedCounter = uint8ArrayToUtf8(counter._binaryBody);

	onNewCounters(decodedCounter);
};

const onSubscriptionPaid = ({ onSubscriptionPaidSuccess, onSubscriptionPaidFailed }) => message => {
	const decodedMessage = uint8ArrayToUtf8(message._binaryBody);

	if (!decodedMessage.isSubscriptionPaid) onSubscriptionPaidFailed(decodedMessage.isSubscriptionPaid);

	onSubscriptionPaidSuccess(decodedMessage.isSubscriptionPaid);
};

export const onStatusReceived = onNewReportStatus => () => onNewReportStatus();

export const onReportCanceled = onNewReportStatus => () => onNewReportStatus();

export const onConnected = (userId, actions) => {
	const {
		onNewMessage,
		onReadMessage,
		onConnectionStatus,
		onNotifications,
		onNewChat,
		onNewCounters,
		onNewReportStatus,
		onSubscriptionPaidFailed,
		onSubscriptionPaidSuccess,
	} = actions;
	const urlsCommonPart = `${websocketURL}/${userId}`;

	stompClient.subscribe(`${urlsCommonPart}/chat`, onMessageReceived(onNewMessage));
	stompClient.subscribe(`${urlsCommonPart}/read`, onReadMessageReceived(onReadMessage));
	stompClient.subscribe(`${urlsCommonPart}/notification`, onNotificationReceived(onNotifications));
	stompClient.subscribe(`${urlsCommonPart}/contact/status`, onUserStatusReceived(onConnectionStatus));
	stompClient.subscribe(`${urlsCommonPart}/new-channel`, onNewChatReceived(onNewChat));
	stompClient.subscribe(`${urlsCommonPart}/count`, onCounterReceived(onNewCounters));
	stompClient.subscribe(`${urlsCommonPart}/reports/report-by-words/notification`, onStatusReceived(onNewReportStatus));
	stompClient.subscribe(`${urlsCommonPart}/reports/report-by-words/cancel`, onReportCanceled(onNewReportStatus));
	stompClient.subscribe(`${urlsCommonPart}/info/is-paid`,
		onSubscriptionPaid({ onSubscriptionPaidFailed, onSubscriptionPaidSuccess }));
};

export const sendMessage = ({ recipientId, message, channelId }) => {
	if (message.trim() === '') return;

	const payload = {
		text: message,
		recipientId,
	};

	stompClient.publish({
		destination: `${commonPartOfUrl}/app/messages/chat/${channelId}`,
		body: JSON.stringify(payload),
	});
};

export const generateReport = data => stompClient.publish({
	destination: `${commonPartOfUrl}/app/reports/report-by-words`,
	body: JSON.stringify(data),
});

export const cancelReport = id => stompClient.publish({
	destination: `${commonPartOfUrl}/app/reports/report-by-words/cancel/${id}`,
});

export const sendMessagesAsRead = ({ chatId, messageIds, userId }) => {
	const payload = {
		messageIds,
		chatId,
		readerId: userId,
	};

	stompClient.publish({
		destination: `${commonPartOfUrl}/app/messages/chat/${chatId}/read`,
		body: JSON.stringify(payload),
	});
};

export const connectToWebsocket = (userId, actions) => {
	if (stompClient) return;

	const StompJs = require('@stomp/stompjs');

	const sessionToken = getItemFromStorage('accessToken');

	const brokerURL = `${WEBSOCKET_SERVER_URL}?access_token=${sessionToken}`;

	stompClient = new StompJs.Client({
		brokerURL,
		reconnectDelay,
		heartbeatIncoming,
		heartbeatOutgoing,
		forceBinaryWSFrames: false,
		onWebSocketError: () => {
			setSnackbar({
				text: 'We are sorry, chat is not available at this moment. Please try again a bit later',
				type: enums.snackbarTypes.info,
			});
		},
	});

	stompClient.onConnect = () => {
		onConnected(userId, actions);
	};

	stompClient.activate();
};

export const disconnectWebsocket = () => {
	if (stompClient) {
		stompClient.deactivate();
		stompClient.forceDisconnect();

		stompClient = undefined;
	}
};
