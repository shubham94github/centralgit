import { generateId } from '@utils/generateId';

export const generateStripeName = ({
	planName,
	priceName,
}) => {
	const randomNumber = generateId(8, '1234567890');

	return `${planName
		.trim()
		.replace(/\s/g, '-')
		.replace(/-{2,}/g, '-')}_${randomNumber}_${
		priceName
			.trim()
			.replace(/\s/g, '-')
			.replace(/-{2,}/g, '-')}`;
};
