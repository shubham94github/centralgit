export const removeSpecialCharacters = (value, name, setValue, regExp) => setValue(name, value.replace(regExp, ''));
