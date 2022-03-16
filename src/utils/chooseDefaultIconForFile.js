import { Icons } from '@icons';

export default function chooseDefaultIconForFile(fileName) {
	const extension = fileName.split('.').pop();

	return Icons.defaultDocuments[extension.toLowerCase()]();
}
