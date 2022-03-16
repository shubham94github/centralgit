import { datatype, commerce, date } from 'faker';
import { makeArray } from '@utils';
export const emptyNotificationsMessage = 'You don’t have new notifications';
export const titleOfNotifications = 'Notifications';

const notificationSchema = () => ({
	id: datatype.uuid(),
	text: commerce.productDescription(),
	isRead: datatype.boolean(),
	title: commerce.productName(),
	createdAt: date.past(),
	notificationType: 'ADMIN_NOTIFICATION',
	recipientId: datatype.uuid(),
	shortProfile: {},
});

export const mockedNotifications = makeArray(datatype.number({
	'min': 10,
	'max': 20,
}), () => notificationSchema());
