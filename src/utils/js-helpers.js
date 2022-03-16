export const isEmpty = obj => [Object, Array].includes((obj || {}).constructor) && !Object.entries((obj || {})).length;

export const replaceAll = (initialString, substr, newSubstr) => {
	if (!initialString) return;

	return initialString.toString().replace(new RegExp(substr, 'g'), newSubstr);
};

export const capitalizeFirstLetter = string => string.charAt(0).toUpperCase() + string.slice(1);

export const deepEqual = (x, y) => {
	if (x === y) return true;
	else if ((typeof x == 'object' && x != null) && (typeof y == 'object' && y != null)) {
		if (Object.keys(x).length !== Object.keys(y).length) return false;

		for (const prop in x) {
			if (y.hasOwnProperty(prop)) {
				if (!deepEqual(x[prop], y[prop])) return false;
			} else return false;
		}

		return true;
	}

	return false;
};

export const uniqWith = (arr, fn) => arr.filter((element, index) => arr.findIndex(step => fn(element, step)) === index);
