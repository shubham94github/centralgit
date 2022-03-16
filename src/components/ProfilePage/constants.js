export const defaultPageSize = 5;

export const setRateOptions = feedbackCount => {
	const rateOptions = new Array(5).fill(0)
		.map((star, index) => ({
			label: index + 1,
			value: index + 1,
		}),
		);
	rateOptions.reverse().unshift({ label: `All Stars (${feedbackCount})`, value: 0 });

	return rateOptions;
};
