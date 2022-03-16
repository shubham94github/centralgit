import enums from '@constants/enums';
import React from 'react';
import { Icons as icons } from '@icons';
import { colors } from '@colors';

const checkedIcon = icons.checkboxCheckedLight();
const editIcon = icons.editIcon(colors.darkblue70);
const removeIcon = icons.removeIcon(colors.darkblue70);

export function generateColumns({ userRoles, editRoles, removeRole, redirectToAdminsPage, counts }) {
	return userRoles.reduce((acc, role) => {
		if (role.name !== 'Support Chat') {
			acc.push({
				id: role.id,
				name: <div className='truncate-text'><span>{role.name}</span></div>,
				selector: role.name,
				minWidth: '150px',
				cell: row => {
					const handleEditRole = () => editRoles(role.id);
					const handleRemoveRole = () => removeRole(role.id);
					const handleRedirectToAdminsPage = () => redirectToAdminsPage(role.name);
					const isProtectedRole = !role.mutable;

					if (row.title === 'Users')
						return <div className='users-count' onClick={handleRedirectToAdminsPage}>{row[role.name]}</div>;

					if (row.title === 'Actions') {
						return (
							<div className='actions'>
								{!isProtectedRole
									&& <span onClick={ handleEditRole }>
										{editIcon}
									</span>
								}
								{(!isProtectedRole && counts?.find(item => item.id === role.id)?.count === 0)
									&& <span onClick={ handleRemoveRole }>
										{removeIcon}
									</span>
								}
							</div>
						);
					}

					if (row.isCategory) return <div className='title category-cell'/>;

					if (row[role.name]) return <div className='checked-permission'>{checkedIcon}</div>;
				},
			});
		}

		return acc;
	}, [
		{
			id: 'permission',
			name: 'Permission',
			selector: 'title',
			minWidth: '350px',
			cell: row => {
				if (row.title === 'Actions') return <div className='title'>Actions</div>;

				if (row.title === 'Users')
					return <div className='title'>Users</div>;

				if (row.isCategory)
					return <div className='title category-cell'>{row.title}</div>;

				return <div className='title'>{row.title}</div>;
			},
		},
	]);
}

export function generateTableData({ permissions, userRoles, counts }) {
	const actionsRow = {
		title: 'Actions',
		isChecked: false,
		isCategory: false,
	};
	const usersRow = {
		title: 'Users',
		isChecked: false,
		isCategory: false,
	};

	userRoles.forEach(role => {
		if (role.permissions) actionsRow[role.name] = role.id;

		usersRow[role.name] = counts && counts.find(item => item.id === role.id)?.count;
	});

	const predefinedRows = [ actionsRow, usersRow ];

	return Object.keys(permissions).reduce((acc, key) => {
		const row = {
			title: enums.permissions[key].title,
			isChecked: false,
			isCategory: true,
		};

		acc.push(row);

		if (permissions[key].items?.length) {
			permissions[key].items.forEach(item => {
				if (item.isHidden) return;

				const rowItem = {
					title: item.label,
				};

				userRoles.forEach(role => {
					if (role.permissions)
						rowItem[role.name] = role.permissions.some(permission => permission === item.value);
				});

				acc.push(rowItem);
			});

		}

		return acc;
	}, [...predefinedRows]);
}
