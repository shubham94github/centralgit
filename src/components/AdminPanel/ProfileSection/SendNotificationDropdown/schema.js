import { object, string } from 'yup';
import { MAX_NOTIFICATION_LENGTH } from '@constants/validationConstants';
import { MAX_NOTIFICATION_MESSAGE } from '@constants/validationMessages';

export const schema = object({
	message: string()
		.trim()
		.max(MAX_NOTIFICATION_LENGTH, MAX_NOTIFICATION_MESSAGE)
		.default(''),
});
