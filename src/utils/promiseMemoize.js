let timer;
const cacheTimout = 60 * 60 * 1000;

export const clearCache = 'clearCache';

const promiseMemoize = fn => {
	let cache = {};

	if (!timer) {
		timer = setInterval(() => {
			cache = {};
		}, cacheTimout);
	}

	return (...args) => {
		const strX = JSON.stringify(args);

		if (args.includes(clearCache)) {
			cache = {};

			return;
		}

		return strX in cache
			? cache[strX]
			: (cache[strX] = fn(...args)
				.catch(e => {
					delete cache[strX];

					return new Promise((_, reject) => reject(e));
				}));
	};
};

export default promiseMemoize;
