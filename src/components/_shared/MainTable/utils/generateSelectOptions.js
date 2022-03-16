import { groupActionsTypes } from '@constants/common';

export const getSelectData = count => groupActionsTypes.map(item => ({
	label: count === 0 ? `${item.label}` : `${item.label} (${count})`,
	value: item.value,
}));
