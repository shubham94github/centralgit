export const resetCountry = (field, setValue, countries) => {
	setValue('countryId',
		field && countries.find(country => field.id === country.id),
	);
};
