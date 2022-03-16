import { customAlphabet } from 'nanoid';

const defaultIdLength = 10;
const defaultAlphabet = '1234567890abcdefghigklmnopqrstuvwxyz';

export const generateId = (length = defaultIdLength, alphabet = defaultAlphabet) => {
	return customAlphabet(alphabet, length)();
};
