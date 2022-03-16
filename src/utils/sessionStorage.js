const { APP_NAME } = process.env;

export const setItemToSessionStorage = (name, item) => {
	return item && sessionStorage.setItem(`${APP_NAME}/${name}`, JSON.stringify(item));
};

export const getItemFromSessionStorage = name => JSON.parse(sessionStorage.getItem(`${APP_NAME}/${name}`));

export const clearSessionStorage = () => sessionStorage.clear();

export const removeItemFromSessionStorage = name => sessionStorage.removeItem(`${APP_NAME}/${name}`);
