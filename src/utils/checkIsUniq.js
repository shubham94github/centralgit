export function checkIsUniq({
	value,
	existingItems,
	byField,
}) {
	if (!value || !existingItems) return true;

	if (existingItems && byField) return existingItems.every(item => item[byField].trim() !== value.trim());
	else if (typeof value === 'string' && existingItems.every(item => typeof item === 'string'))
		return existingItems.every(item => item.trim() !== value.trim());
}
