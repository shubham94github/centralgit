export const trimString = string => {
	if (typeof string !== 'string') return;

	return string.replace(/ +?/g, '');
};
