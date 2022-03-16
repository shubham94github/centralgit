import { customAlphabet } from 'nanoid';
const rulesForGenerationCode= 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
const minRandomNumber = 1;
const maxRandomNumber = 20;

const generateRandomNumber = () => Math.floor(Math.random() * maxRandomNumber) + minRandomNumber;

export const generateIdCodeCoupon = (existedIds=[]) => {
	const randomNumber = generateRandomNumber();
	const nanoid = customAlphabet(rulesForGenerationCode, randomNumber);
	const uniqueKey = nanoid();

	if (existedIds.includes(uniqueKey))
		return generateIdCodeCoupon(existedIds);

	return uniqueKey;
};
