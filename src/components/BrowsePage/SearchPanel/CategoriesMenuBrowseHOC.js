import React, { memo, useState } from 'react';
import { connect } from 'react-redux';
import CategoriesMenu from '@components/_shared/CategoriesMenu';
import { setFieldForFilter } from '@ducks/browse/action';
import { array, func } from 'prop-types';

const CategoriesMenuBrowseHOC = ({
	setFieldForFilter,
	selectedCategories,
}) => {
	const [categoriesIds, setCategoriesIds] = useState([]);
	const [idSHoverCategory, setIdSHoverCategory] = useState(selectedCategories);

	const onHoverCategoryHandler = idS => setIdSHoverCategory([...selectedCategories, ...idS]);

	const handleOpenCategories = categoriesIds => setCategoriesIds(categoriesIds);

	const setCategoriesHandler = idS => {
		const data = {
			field: 'categoryIds',
			data: idS,
		};

		setFieldForFilter(data);
	};

	const onCategoryClickHandler = idS => {
		setCategoriesHandler(idS);
		setIdSHoverCategory(idS);
	};

	const clearCategories = () => onCategoryClickHandler([]);

	return (
		<CategoriesMenu
			isOpenMenu
			categoriesIds={categoriesIds}
			handleOpenCategories={handleOpenCategories}
			toggleFullMenuHandler={clearCategories}
			onCategoryClickHandler={onCategoryClickHandler}
			onHoverCategoryHandler={onHoverCategoryHandler}
			idSHoverCategory={idSHoverCategory}
			isBrowseFullMenu
		/>
	);
};

CategoriesMenuBrowseHOC.propTypes = {
	setFieldForFilter: func.isRequired,
	selectedCategories: array.isRequired,
};

const mapStateToProps = ({ browse: { filterCategories: { categoryIds } } }) => ({
	selectedCategories: categoryIds,
});

export default connect(mapStateToProps, {
	setFieldForFilter,
})(memo(CategoriesMenuBrowseHOC));
