import { format } from 'date-fns';
import { userBackgroundColors } from '@constants/colors';
import { converter } from '@components/_shared/form/EditorTextArea/constants';
import { replaceCarryoverSymbols } from '@utils/replaceCarryoverSymbols';
import { replaceHtmlTags } from '@utils/replaceHtmlTags';

export const isValidDate = date => {
	const newDate = new Date(date);

	return (date instanceof Date || newDate instanceof Date) && !isNaN(date);
};

export const dateFormatCorrection = (date, template = 'dd / MM / yyyy', options) => {
	try {
		const newDate = new Date(date);

		if (!(newDate instanceof Date) || !isValidDate(date))
			return;

		return format(date, template, options);
	} catch {
		return 'Invalid Date';
	}
};

export const stopPropagation = e => e.stopPropagation();

export const separateCamelCase = string => string.replace(/([a-z])([A-Z])/g, '$1 $2');

export const normalizeString = str => {
	return str.split(' ').reduce((acc, item) => {
		acc += item[0].toUpperCase() + item.substr(1, item.length - 1).toLowerCase();

		return acc;
	}, '');
};

export const getEmailDomain = email => (`@${email.split('@')[1]}`);

export const toColor = string => {
	let hashCode = 0;

	if (!string?.length || string.length === 0) return userBackgroundColors[0];

	for (let i = 0; i < string.length; i++) {
		hashCode = string.charCodeAt(i) + ((hashCode << 5) - hashCode);
		hashCode &= hashCode;
	}

	hashCode = ((hashCode % userBackgroundColors.length) + userBackgroundColors.length) % userBackgroundColors.length;

	return userBackgroundColors[hashCode];
};

export const getUserDefaultIconName = (firstName, lastName) => {
	const regExp = /[№&/\\#,;`+=|@!_\-–—()$~%.'":[*\]?<>{}0-9]/g;
	const selectFirstLetter = text => text
		.trim()
		.replace(regExp, '')
		.charAt(0)
		.toUpperCase();

	return `${selectFirstLetter(firstName)}${selectFirstLetter(lastName)}`;
};

export const getCompanyDefaultIconName = shortName => {
	const regExp = /[№&/\\#,;`+=|@!_\-–—()$~%.'":[*\]?<>{}]/g;
	const arrayOfFilteredWorlds = shortName
		.trim()
		.replace(regExp, '')
		.toUpperCase()
		.split(' ')
		.filter(world => world);

	if (arrayOfFilteredWorlds.length > 1)
		return `${arrayOfFilteredWorlds[0].charAt(0)}${arrayOfFilteredWorlds[1].charAt(0)}`;

	return `${arrayOfFilteredWorlds[0].charAt(0)}${arrayOfFilteredWorlds[0].charAt(arrayOfFilteredWorlds[0].length - 1)}`;
};

export const makeArray = (length, generator) => Array.from({ length }, generator);

export const markDownToText = markdown => {
	const html = converter.makeHtml(markdown);
	const string = replaceHtmlTags(html);

	return replaceCarryoverSymbols(string);
};
