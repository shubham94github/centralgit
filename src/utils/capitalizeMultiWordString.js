import { separateCamelCase } from './index';
import { capitalizeFirstLetter } from '@utils/js-helpers';

export function capitalizeMultiWordString (string) {
	if (!string) return string;

	return string.split((/_|-|\s/)).reduce((acc, word) => {
		acc += ` ${separateCamelCase(capitalizeFirstLetter(word.toLowerCase()))}`;

		return acc;
	}, '');
}
