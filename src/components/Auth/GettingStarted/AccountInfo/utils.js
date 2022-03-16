export const valuesMapper = ({ accountInfo, currentFormValues }) => ({
	firstName: currentFormValues.firstName || accountInfo.firstName,
	lastName: currentFormValues.lastName || accountInfo.lastName,
	position: currentFormValues.position || accountInfo.position,
	department: currentFormValues.department || accountInfo.department,
	phoneNumber: currentFormValues.phoneNumber || accountInfo.phoneNumber,
	isEnabled2fa: accountInfo?.isEnabled2fa === undefined
		? currentFormValues.isEnabled2fa
		: accountInfo.isEnabled2fa,
	city: accountInfo.city,
	country: accountInfo.country,
	email: accountInfo.email || '',
});
