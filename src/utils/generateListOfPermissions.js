export function generateListOfPermissions(setPermissions, permissionTypes) {
	const arrayOfPermission = Object.entries(permissionTypes);

	return  arrayOfPermission.reduce((acc, permission) =>  (
		{ ...acc, [permission[0]]: setPermissions.includes(permission[1]) }
	), {});
};
