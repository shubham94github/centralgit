import React, { memo, useEffect } from 'react';
import { connect } from 'react-redux';
import { getCategories } from '@ducks/common/actions';
import { colors } from '@colors';
import FullCategoryMenu from './FullCategoryMenu';
import hideSomeFirstLevelCategories from '@utils/hideSomeFirstLevelCategories';
import { array, bool, func } from 'prop-types';
import LoadingOverlay from '@components/_shared/LoadingOverlay';
import { Icons } from '@icons';
import { getStartupFilterInFork } from '@ducks/browse/action';

import './CategoriesMenu.scss';

const categoriesHomeIcon = Icons.categoriesHomeIcon(colors.grass50);

const CategoriesMenu = ({
	categories,
	isLoading,
	getCategories,
	isOpenMenu,
	categoriesIds,
	handleOpenCategories,
	toggleFullMenuHandler,
	isBrowseFullMenu,
	onCategoryClickHandler,
	onHoverCategoryHandler,
	idSHoverCategory,
	getStartupFilterInFork,
}) => {
	const filteredCategories = hideSomeFirstLevelCategories(categories).filter(item => !!item?.logo?.svg);

	useEffect(() => {
		if (!categories.length) getCategories();

		getStartupFilterInFork();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		isOpenMenu
			? <FullCategoryMenu
				categories={categories}
				handleOpenCategories={handleOpenCategories}
				categoriesIds={categoriesIds}
				toggleFullMenuHandler={toggleFullMenuHandler}
				isBrowseFullMenu={isBrowseFullMenu}
				onCategoryClickHandler={onCategoryClickHandler}
				onHoverCategoryHandler={onHoverCategoryHandler}
				idSHoverCategory={idSHoverCategory}
				isLoading={isLoading}
			/>
			: <div className='categories-menu-wrapper'>
				<div
					onClick={toggleFullMenuHandler}
					className='categories-menu-icon'
				>
					{categoriesHomeIcon}
				</div>
				{isLoading && <LoadingOverlay classNames='loader'/>}
				{filteredCategories.map(({ id, logo }) => {
					const onClickHandler = () => {
						handleOpenCategories([id]);
						toggleFullMenuHandler();
					};

					return (
						<div
							onClick={onClickHandler}
							className='categories-menu-icon'
							key={id}
						>
							<img src={logo?.svg} alt='icon'/>
						</div>
					 );
				})
				}
			</div>
	);
};

CategoriesMenu.propTypes = {
	categories: array.isRequired,
	isLoading: bool.isRequired,
	getCategories: func.isRequired,
	isOpenMenu: bool.isRequired,
	categoriesIds: array.isRequired,
	handleOpenCategories: func.isRequired,
	toggleFullMenuHandler: func.isRequired,
	isBrowseFullMenu: bool.isRequired,
	onCategoryClickHandler: func.isRequired,
	onHoverCategoryHandler: func.isRequired,
	idSHoverCategory: array.isRequired,
	getStartupFilterInFork: func.isRequired,
};

const mapStateToProps = ({ common: { categories, isLoading } }) => ({
	categories,
	isLoading,
});

export default connect(mapStateToProps, {
	getCategories,
	getStartupFilterInFork,
})(memo(CategoriesMenu));
