const { APP_NAME } = process.env;

export const setItemToLocalStorage = (name, item) => {
	return item && localStorage.setItem(`${APP_NAME}/${name}`, JSON.stringify(item));
};

export const getItemFromLocalStorage = name => JSON.parse(localStorage.getItem(`${APP_NAME}/${name}`));

export const clearLocalStorage = () => localStorage.clear();

export const removeItemFromLocalStorage = name => localStorage.removeItem(`${APP_NAME}/${name}`);
