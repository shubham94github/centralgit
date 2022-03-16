export default function incrementNameCount(value, existingNames) {
	let existingNamesCounter = 0;

	if (existingNames.find(item => item === value)
		&& !existingNames.filter(item => item !== value).find(item => item.includes(value)))
		return `${value}(${existingNamesCounter + 1})`;

	const namesWithValue = existingNames.filter(item => item.includes(value));

	existingNamesCounter = namesWithValue.length + 1;

	// eslint-disable-next-line no-loop-func
	while (existingNames.find(item => item === `${value}(${existingNamesCounter})`))
		existingNamesCounter += 1;

	return `${value}(${existingNamesCounter})`;
}
