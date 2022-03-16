export const getOptions = () => {
	const array = [];
	const numberOfOptions = 90;

	for (let i = 1; i <= numberOfOptions; i++) array.push({ label: i, value: i });

	return array;
};
