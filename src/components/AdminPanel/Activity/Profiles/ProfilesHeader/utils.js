export const makeTitleByRole = (prefix, options) => options.map(option => ({
	...option,
	label: `${prefix} ${option.label}`,
}));
