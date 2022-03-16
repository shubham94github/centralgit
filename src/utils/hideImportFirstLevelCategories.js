export default function hideImportFirstLevelCategories(categories) {
	return categories.filter(category => category.name !== 'Import');
}
