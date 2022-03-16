export const historyFilterHandler = (history, searchRequest) => {
	if (!searchRequest) return history;

	return history.filter(item => item.keyWord.toLowerCase()
		.startsWith(searchRequest.toLowerCase()));
};

export const savedHistoryFilterHandler = (history, searchRequest) => {
	if (!searchRequest) return history;

	return history.filter(item => item.title.toLowerCase()
		.startsWith(searchRequest.toLowerCase()));
};
