import { getItemFromStorage } from '@utils/storage';

export function singleTonWrapper(CreatableClass) {
	let instance;

	const createInstance = function (role) {
		let localRole;

		if (!role)
			localRole = getItemFromStorage(role);

		instance = new CreatableClass(role || localRole);

		return instance;
	};

	return {
		getInstance: role => instance || (instance = createInstance(role)),
		createInstance,
	};
}
