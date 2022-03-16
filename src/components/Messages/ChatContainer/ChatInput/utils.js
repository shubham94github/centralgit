export const removeBlankLinesInMessage = message => {
	let firstIndex = null;
	let lastIndex = null;
	const splitToArray = message.replaceAll('</p>', '</p>,').split(',');

	splitToArray.unshift('');

	splitToArray.map((item, i) => {
		if (item && item !== '<p><br></p>' && !firstIndex) firstIndex = i;
		else if (item && item !== '<p><br></p>' && firstIndex) lastIndex = i;
	});

	if (firstIndex && !lastIndex) return splitToArray[firstIndex];

	return splitToArray.slice(firstIndex, lastIndex + 1).join('');
};
