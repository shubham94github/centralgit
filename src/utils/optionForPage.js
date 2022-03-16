export const optionForPageCreator = count => {
	return new Array(count).fill({})
		.map((opt, index) => ({ label: index+1, value: index }));
};
