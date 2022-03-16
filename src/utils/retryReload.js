export const retryLoad = (fn, attemptsLeft = 5, interval = 1000) => {
	return new Promise((resolve, reject) => {
		fn()
			.then(resolve)
			.catch(err => {
				setTimeout(() => {
					if (attemptsLeft === 1) {
						reject(err);

						return;
					}

					retryLoad(fn, attemptsLeft - 1, interval)
						.then(resolve, reject);
				}, interval);
			});
	});
};
