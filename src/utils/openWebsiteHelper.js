export const openWebsite = url => {
	const isWwwUrl = !url.includes('https://') && !url.includes('http://');

	window.open(isWwwUrl ? `https://${url}` : url, '_blank');
};
