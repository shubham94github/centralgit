export default function combineCategoriesByName(categories) {
	return categories
		.reduce((acc, currentItem) => {
			if (currentItem.name === 'Others') {
				if (currentItem.parentNames.length > 1) {
					const parentNames = currentItem.parentNames.filter(patent => patent !== 'Others');
					const name = parentNames[0];

					acc.push({ ...currentItem, parentNames, name });
				} else return acc;
			}
			else if (currentItem.name !== 'Import') {
				const name = currentItem.parentNames[0];

				acc.push({ ...currentItem, name });
			}

			return acc;
		}, [])
		.reduce((acc, item) => {
			const indexSameName = acc.some(accItem => accItem.name === item.name);

			if (indexSameName) {
				return acc.map(accItem => {
					if (accItem.name === item.name) {
						return {
							...item,
							sameItems: [
								...accItem.sameItems,
								item.parentNames.join(' > '),
							].filter((value, index, arr) => arr.indexOf(value) === index),
						};
					}

					return accItem;
				});
			}

			acc.push({ ...item, sameItems: [ item.parentNames.join(' > ') ] });

			return acc;
		}, []);
}
