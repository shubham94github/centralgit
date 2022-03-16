import { normalizeString, separateCamelCase } from './index';
import { MAX_INPUT_LENGTH } from '@constants/validationConstants';
import { MAX_INPUT_LENGTH_MESSAGE } from '@constants/validationMessages';

export const onSelectChange = ({ fieldName, setValue, setError, clearErrors }) => option => {
	if (!option?.length) {
		const separatedName = separateCamelCase(fieldName);

		setError(fieldName, { message: `${normalizeString(separatedName)}  is required field` });
	} else if (fieldName === 'categoryIds') {
		if (option[option.length - 1].value === 'Others') {
			const othersOption = option.find(item => item.value === 'Others');
			setValue(fieldName, [othersOption], { shouldValidate: true });
		} else {
			const notAllOptions = option.filter(item => item.value !== 'Others');
			setValue(fieldName, notAllOptions, { shouldValidate: true });
		}

		return;
	} else if (option.find(opt => opt.label.length > MAX_INPUT_LENGTH))
		return setError(fieldName, { message: MAX_INPUT_LENGTH_MESSAGE });
	else if (!!option.length) {
		setValue(fieldName, option);
		clearErrors(fieldName);
	}

	clearErrors(fieldName);
	setValue(fieldName, option);
};
