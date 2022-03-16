export default function hideSomeFirstLevelCategories(categories) {
	return categories.filter(category => (category?.name !== 'Others' && category?.name !== 'Import'));
}
