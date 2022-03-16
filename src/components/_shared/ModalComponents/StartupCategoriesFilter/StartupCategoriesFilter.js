import React, { memo, useCallback, useEffect, useState } from 'react';
import { array, func, object } from 'prop-types';
import FormWithAccordion from '@components/Auth/GettingStarted/FormWithAccordion';
import { connect } from 'react-redux';
import { getStartups } from '@ducks/admin/actions';
import { isEmpty } from '@utils/js-helpers';

import './StartupCategoriesFilter.scss';

const StartupCategoriesFilter = ({
	categories,
	onClose,
	setCategoriesFilter,
	categoriesFilter,
	getStartups,
	startupsTableMeta,
}) => {
	const [selectedFullCategories, setSelectedFullCategories] = useState([]);
	const isExistCategoriesIds = startupsTableMeta.fields.find(field => field.fieldName === 'categoryIds');
	const isExistAreasIds = startupsTableMeta.fields.find(field => field.fieldName === 'areaIds');

	const goInside = (selectedFilters, category, acc) => {
		if (selectedFilters.includes(category.id))
			acc.push(category);

		category.items?.forEach(subCategory => {
			if (!subCategory.items?.length) return;

			const chosenItems = subCategory.items?.filter(item => selectedFilters.includes(item.id));

			acc = acc.concat(chosenItems);

			goInside(selectedFilters, subCategory, acc);
		});

		return acc;
	};

	const getFullValues = useCallback((selectedFilters, currentCategories) => {
		return currentCategories.reduce((acc, category) => {
			if (!category.items?.length) return acc;

			return goInside(selectedFilters, category, acc);
		}, []);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (categoriesFilter.length) {
			const selectedFullCategories = getFullValues(categoriesFilter, categories);

			setSelectedFullCategories(selectedFullCategories);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [categoriesFilter, getFullValues]);

	const reset = () => {
		setCategoriesFilter([]);
		getStartups({
			...startupsTableMeta,
			page: 1,
			fields: startupsTableMeta.fields.filter(field => field.fieldName === 'categoryIds'
				&& field.fieldName === 'areaIds'),
		});
		onClose();
	};

	const apply = categoriesIds => {
		if (!isEmpty(categoriesIds.categoryIds)) setCategoriesFilter(categoriesIds.categoryIds);
		else setCategoriesFilter(categoriesIds.areaIds);

		let fields = [...startupsTableMeta.fields];

		if (!isExistCategoriesIds && !isEmpty(categoriesIds.categoryIds))
			fields.push({ fieldName: 'categoryIds', filterCategories: categoriesIds.categoryIds });
		else if (isExistCategoriesIds && !isEmpty(categoriesIds.categoryIds)) {
			fields = fields.map(field => {
				if (field.fieldName === 'categoryIds')
					return { fieldName: 'categoryIds', filterCategories: categoriesIds.categoryIds };

				return field;
			});
		} else fields = fields.filter(field => field.fieldName !== 'categoryIds');

		if (!isExistAreasIds && !isEmpty(categoriesIds.areaIds))
			fields.push({ fieldName: 'areaIds', filterCategories: categoriesIds.areaIds });
		else if (isExistAreasIds && !isEmpty(categoriesIds.areaIds)) {
			fields = fields.map(field => {
				if (field.fieldName === 'areaIds')
					return { fieldName: 'areaIds', filterCategories: categoriesIds.areaIds };

				return field;
			});
		} else fields = fields.filter(field => field.fieldName !== 'areaIds');

		getStartups({
			...startupsTableMeta,
			page: 1,
			fields,
		});
		onClose();
	};

	return (
		<div className='startup-filter-categories'>
			<FormWithAccordion
				isAdminPanel={true}
				submitTitle='Apply Selected'
				itemsName='sectors'
				categories={categories}
				sendChosenItems={apply}
				onClose={reset}
				selectedFullValues={selectedFullCategories}
				applyFilter={apply}
				narrowCategoriesDefaultValues={startupsTableMeta.fields}
			/>
		</div>
	);
};

StartupCategoriesFilter.propTypes = {
	onClose: func.isRequired,
	categories: array.isRequired,
	setCategoriesFilter: func.isRequired,
	categoriesFilter: array,
	getStartups: func.isRequired,
	startupsTableMeta: object,
};

StartupCategoriesFilter.defaultProps = {
	categories: [],
	categoriesFilter: [],
};

export default connect(({ admin }) => {
	const { startupsTableMeta } = admin;

	return {
		startupsTableMeta,
	};
}, {
	getStartups,
})(memo(StartupCategoriesFilter));
