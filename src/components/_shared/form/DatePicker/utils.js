import { isFuture } from 'date-fns';

export const checkIsValidDate = value => {
	if (isFuture(new Date(value))) return false;

	const reGoodDate = /^((0?[1-9]|1[012])[- /.](0?[1-9]|[12][0-9]|3[01])[- /.](19|20)?[0-9]{2})*$/;

	return reGoodDate.test(value);
};
