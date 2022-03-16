import { object, string } from 'yup';
import { validationErrMessages } from '@constants/common';
import { MAX_INPUT_LENGTH, MIN_INPUT_LENGTH } from '@constants/validationConstants';
import { PASSWORD_LENGTH } from '@constants/validationMessages';
import { validatePassword } from '@utils/validation';

export const schema = object({
	currentPassword: string()
		.required(validationErrMessages.currentPassword)
		.test(validatePassword('currentPassword'))
		.min(MIN_INPUT_LENGTH, PASSWORD_LENGTH)
		.max(MAX_INPUT_LENGTH, PASSWORD_LENGTH)
		.default('')
		.trim(),
	newPassword: string()
		.required(validationErrMessages.password)
		.test(validatePassword('newPassword'))
		.min(MIN_INPUT_LENGTH, PASSWORD_LENGTH)
		.max(MAX_INPUT_LENGTH, PASSWORD_LENGTH)
		.default('')
		.trim(),
	confirmPassword: string()
		.required(validationErrMessages.confirmPassword)
		.test(validatePassword('confirmPassword'))
		.min(MIN_INPUT_LENGTH, PASSWORD_LENGTH)
		.max(MAX_INPUT_LENGTH, PASSWORD_LENGTH)
		.default('')
		.trim(),
});

