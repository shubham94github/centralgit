import { MAX_INPUT_LENGTH } from '@constants/validationConstants';
import { MAX_INPUT_LENGTH_MESSAGE } from '@constants/validationMessages';
import { separateCamelCase } from '@utils';
import { capitalizeFirstLetter } from '@utils/js-helpers';

export function handleCreateSelectOption({
	setValue = () => {},
	getValues = () => {},
	setError = () => {},
	clearErrors,
	fieldName = '',
	isMulti = true,
}) {
	return inputValue => {
		if (inputValue.length > MAX_INPUT_LENGTH) {
			setError(fieldName, { message: MAX_INPUT_LENGTH_MESSAGE });
			return;
		}
		if (!inputValue.trim()) {
			const separatedName = separateCamelCase(fieldName);

			setError(fieldName, { message: `${capitalizeFirstLetter(separatedName)} can't be blank text.` });

			return;
		}

		const prevValue = getValues()[fieldName] || [];

		const value = isMulti && prevValue.find(opt => opt.label === inputValue.trim())
			? prevValue
			: isMulti
				? prevValue.concat({ label: inputValue.trim(), value: inputValue.trim() })
				: { label: inputValue.trim(), value: inputValue.trim() };

		clearErrors(fieldName);
		setValue(fieldName, value, { shouldDirty: true });
	};
}
