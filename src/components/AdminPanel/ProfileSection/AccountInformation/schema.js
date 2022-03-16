import { bool, object } from 'yup';

const schema = object({
	isEnabled2fa: bool(),
});

export default schema;
