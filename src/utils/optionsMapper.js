export const optionsMapper = (data = []) => data.map(item => ({ ...item, label: item.name, value: item.name }));

export const optionsMapperForStartups = (data = []) =>
	data.map(item => ({ ...item, label: item.brandName, value: item.startupId }));

export const singleOptionsMapper = data => data.map(item => ({ label: item, value: item, name: item }));

export const optionsMapperForRetailers = data => data.map(({ brandName, email, retailerId }) => {
	const fullNameOption = `${brandName} / ${email}`;

	return ({
		label: fullNameOption,
		value: retailerId,
		name: fullNameOption,
		email,
	});
});
