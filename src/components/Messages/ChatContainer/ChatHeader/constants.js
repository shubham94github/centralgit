import { Icons } from '@icons';
import { colors } from '@colors';

export const defaultMeta = {
	page: 1,
	pageSize: 10,
};

export const confirmTitle = 'Are you sure you want to delete this chat?';
export const confirmMessage = `The chat will be removed from the list.
If you text this startup again, the chat will be restored.`;

export const infoProfileIcon = Icons.infoProfile();
export const deleteIcon = Icons.trash(colors.darkblue70);
