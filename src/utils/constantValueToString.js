export const constantValueToString = constant => {
	const lowerCaseString = constant.toLowerCase();
	const withFirstCapitalLetter = lowerCaseString.charAt(0).toUpperCase() + lowerCaseString.slice(1);

	return withFirstCapitalLetter.replaceAll('_', ' ');
};
