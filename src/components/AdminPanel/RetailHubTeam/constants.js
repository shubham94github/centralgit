import { Icons } from '@icons';
import { colors } from '@colors';

export const pageTitle = 'Manage RetailHub Team';
export const addNewUserBtnText = ' Add new User';
export const defaultTableMeta = {
	fields: [],
	page: 1,
	size: 10,
	sort: {
		direction: 'ASC',
		fieldName: 'createdAt',
	},
};

export const groupActions = [
	{ label: 'Activate', value: 'ACTIVATE' },
	{ label: 'Deactivate', value: 'DEACTIVATE' },
];

export const createNewUserModal = 'Account information';

export const activationSuccessText = 'Chosen users are activated successfully';
export const blockSuccessText = 'Chosen users are blocked successfully';

export const filtersIcon = Icons.filtersIcon(colors.white);
export const refreshIcon = Icons.refreshIcon(colors.white);
export const plusIcons = Icons.plus(colors.white);
