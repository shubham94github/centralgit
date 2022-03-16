export const getOptions = () => {
	const array = [];
	const numberOfOptions = 90;

	for (let i = 0; i <= numberOfOptions; i ++) array.push({ label: i, value: i });

	return array;
};
