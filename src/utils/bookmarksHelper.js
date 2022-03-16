export const replaceListOfStartups = (startups, id, isBookmarked) => {
	const editedItem = startups.find(item => item.id === id);

	if (!editedItem) return startups;

	const editedStartup = {
		...editedItem,
		isBookmarked,
	};

	return startups.map(startup => {
		if (startup.id === id) return editedStartup;
		return startup;
	});
};

export const replaceStartupProfile = (profile, isBookmarked) => ({ ...profile, isBookmarked });
