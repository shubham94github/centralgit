export function generateFilterForStartups (field, meta, selectedFilter) {
	let filterStartups;

	switch (field) {
		case 'page':
			filterStartups = { ...selectedFilter, [field]: meta };
			break;

		case 'pageSize':
			filterStartups = { ...selectedFilter, [field]: meta, page: 1 };
			break;

		case 'fieldName': {
			const direction = (meta === 'A-Z') ? 'ASC' : 'DESC';
			const sort = {
				direction,
				[field]: meta,
			};

			filterStartups = {
				...selectedFilter,
				page: 1,
				sort,
			};
			break;
		}
		default: filterStartups = selectedFilter;
	}

	return filterStartups;
}
