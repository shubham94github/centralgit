import { validationErrMessages } from '@constants/common';
import { bool, object, string } from 'yup';

const schema = object({
	name: string()
		.default('')
		.required(validationErrMessages.name)
		.trim(),
	email: string()
		.email('Invalid e-mail')
		.required(validationErrMessages.email)
		.default('')
		.trim(),
	agreement: bool()
		.required('Required')
		.oneOf([true, false])
		.default(false),
});

export default schema;
