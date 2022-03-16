import enums from '@constants/enums';
import Checkbox from '@components/_shared/form/Checkbox';
import React from 'react';

export const generateTableData = userRole => {
	return Object.keys(enums.permissions).reduce((acc, key) => {
		acc.push({
			title: enums.permissions[key].title,
			isChecked: false,
			isCategory: true,
		});

		if (enums.permissions[key].items.length) {
			enums.permissions[key].items.forEach(({ label, value, disabled, isHidden }) => {
				if (!isHidden) {
					acc.push({
						title: label,
						value: value,
						isChecked: !!userRole && userRole.permissions?.some(item => item === value),
						isCategory: false,
						disabled,
					});
				}
			});
		}

		return acc;
	}, []);
};

export const generateColumns = ({ setPermission }) => {
	return [
		{
			id: 'permission',
			name: 'Permission',
			cell: row => {
				const onPermissionChange = () => {
					if (row.disabled) return;

					setPermission(row.value);
				};

				if (row.isCategory) return <div className='title category-cell'>{row.title}</div>;

				return <div className='title' onClick={onPermissionChange}>{row.title}</div>;
			},
		},
		{
			id: 'check',
			name: 'Check',
			width: '200px',
			cell: row => {
				if (row.isCategory) return <div className='category-cell'/>;

				const onPermissionChange = () => setPermission(row.value);

				return (
					<div className='check-container'>
						<Checkbox
							checked={row.isChecked}
							name={row.value}
							readOnly={row.disabled}
							disabled={row.disabled}
							value={row.isChecked}
							onChange={onPermissionChange}
						/>
					</div>
				);
			},
		},
	];
};

export const generateNameOptions = (userRoles = []) => userRoles.map(role => ({
	label: role.name,
	value: role.id,
}));

export const findExistingRole = (userRoles, chosenPermissions) => {
	const clearedPermissions = chosenPermissions.filter(item => !item.isCategory);

	return userRoles.find(userRole => {
		const isAllUserPermissionChecked = clearedPermissions
			.filter(item => item.isChecked)
			.every(item => userRole.permissions.includes(item.value));

		if (!isAllUserPermissionChecked) return false;

		const isRestPermissionsNoChecked = clearedPermissions
			.filter(item => !item.isChecked)
			.every(item => !userRole.permissions.includes(item.value));

		return isAllUserPermissionChecked && isRestPermissionsNoChecked;
	});
};
