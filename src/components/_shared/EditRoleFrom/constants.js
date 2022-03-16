export const fieldNames = {
	name: 'name',
	permissions: 'permissions',
	copyRightFrom: 'copyRightFrom',
};

export const placeHolders = {
	name: 'Name',
	copyRightFrom: 'Copy Rights From',
};

export const errorMessages = {
	existingRoleName: 'A role with this Name already exists',
};

export const hintText = 'As a Super Admin, you can create a new role with limited access rights.\n\nSelect an existing '
	+ 'Role from the drop-down list if you want to reuse\n\nthe rights of this Role.';

export const alreadyExistRoleText = 'A role with the same rights already exists.';
export const protectedRoleText = 'This is a default Role. You can\'t change it.';
export const roleWithSameNameErrorText = errorMessages.existingRoleName;
