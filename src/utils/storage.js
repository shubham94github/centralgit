import { getItemFromLocalStorage, setItemToLocalStorage } from '@utils/localStorage';
import { getItemFromSessionStorage, setItemToSessionStorage } from '@utils/sessionStorage';

export const setItemToStorage = (name, item, rememberMe) => {
	const isRememberMe = rememberMe || getItemFromLocalStorage('rememberMe');

	if (isRememberMe) setItemToLocalStorage(name, item);
	else setItemToSessionStorage(name, item);
};

export const getItemFromStorage = (name, rememberMe) => {
	const isRememberMe = rememberMe || getItemFromLocalStorage('rememberMe');

	return isRememberMe ? getItemFromLocalStorage(name) : getItemFromSessionStorage(name);
};
