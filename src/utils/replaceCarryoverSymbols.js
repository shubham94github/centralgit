export function replaceCarryoverSymbols(value) {
	const regex = /\r?\n/g;

	return value?.replace(regex, ' ');
}
