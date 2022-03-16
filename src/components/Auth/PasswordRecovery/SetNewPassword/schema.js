import { validationErrMessages } from '@constants/common';
import { object, string } from 'yup';
import { MAX_INPUT_LENGTH } from '@constants/validationConstants';
import { PASSWORD_LENGTH } from '@constants/validationMessages';
import { validatePassword } from '@utils/validation';
import { newPasswordName } from './constants';

export const schema = object({
	newPassword: string()
		.required(validationErrMessages.password)
		.max(MAX_INPUT_LENGTH, PASSWORD_LENGTH)
		.test(validatePassword(newPasswordName))
		.default('')
		.trim(),
	confirmPassword: string()
		.required(validationErrMessages.confirmPassword)
		.max(MAX_INPUT_LENGTH, PASSWORD_LENGTH)
		.default('')
		.trim(),
});

