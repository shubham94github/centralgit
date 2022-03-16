export const imageConverter = blob => {
	const reader = new FileReader();
	reader.readAsDataURL(blob);

	return new Promise(resolve => {
		reader.onloadend = () => {
			resolve(reader.result);
		};
	});
};

export const svgConverter = svgString => {
	const base64Data = window.btoa(svgString);

	return new Promise(resolve => {
		resolve(`data:image/svg+xml;base64,${base64Data}`);
	});
};
