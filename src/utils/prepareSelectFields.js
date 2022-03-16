import { isEmpty } from '@utils/js-helpers';

export function prepareSelectFields(values) {
	return Object.keys(values).reduce((acc, key) => {
		if (!values[key] || !values[key].length || isEmpty(values[key]))
			acc[key] = null;
		else if (!!values[key]) {
			if (typeof acc[key] === 'number')
				acc[key] = +values[key];
			else
				acc[key] = values[key];
		}

		return acc;
	}, {});
}
