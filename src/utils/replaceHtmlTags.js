export function replaceHtmlTags(value) {
	const regex = /(<([^>]+)>)/ig;

	return value?.replace(regex, '');
}

export const replaceTagP = text => text?.replaceAll('<p>', '').replaceAll('</p>', ' ');

export const replaceTagBr = text => text?.replaceAll('<p><br></p>', ' ');
