export function filterSideBarMenu(menuItems, isCategoryViewPermission, isStartupAnalysisPermission, userRole) {
	return menuItems.reduce((acc, item) => {
		switch (item.mainTitle) {
			case 'Categories': {
				if (isCategoryViewPermission)
					acc.push(item);
				break;
			}

			case 'Startup Companies': {
				if (!isStartupAnalysisPermission) {
					acc.push({
						...item,
						items: [
							item.items[0],
							{
								...item.items[1],
								isHidden: true,
							},
						],
					});
				} else acc.push(item);
				break;
			}

			default: {
				if (item.roles.includes(userRole))
					acc.push(item);
			}
		}

		return acc;
	}, []);
}
