import React, { memo, useEffect, useRef } from 'react';
import { array, bool, func } from 'prop-types';
import hideSomeFirstLevelCategories from '@utils/hideSomeFirstLevelCategories';
import { colors } from '@colors';
import { useOnClickOutside } from '@utils/hooks/useOnClickOutside';
import cn from 'classnames';
import { Icons } from '@icons';
import LoadingOverlay from '@components/_shared/LoadingOverlay';

import './FullCategoryMenu.scss';

const { categoriesPlusIcon, categoriesMinusIcon } = Icons;
const categoriesHomeIcon = Icons.categoriesHomeIcon(colors.grass50);

const FullCategoryMenu = ({
	categories,
	handleOpenCategories,
	categoriesIds,
	toggleFullMenuHandler,
	isBrowseFullMenu,
	onCategoryClickHandler,
	onHoverCategoryHandler,
	idSHoverCategory,
	isLoading,
}) => {
	const fullMenuNode = useRef();
	const selectedFirstCategoryNode = useRef(null);
	const wrapperClasses = cn('categories-full-menu-wrapper', {
		'fixed': !isBrowseFullMenu,
	});

	const textCategoriesClasses = cn('text-categories', {
		'bold': isBrowseFullMenu,
	});

	useOnClickOutside([fullMenuNode], () => {
		if (!isBrowseFullMenu) toggleFullMenuHandler();
	});

	useEffect(() => {
		if (categoriesIds[0] && !categoriesIds[1])
			selectedFirstCategoryNode.current.scrollIntoView({ block: 'center' });
	}, [categoriesIds]);

	const changeColorToGreenMenuIcon = id => onHoverCategoryHandler([id]);

	const changeColorToWhiteMenuIcon = () => onHoverCategoryHandler([]);

	return (
		<div
			ref={fullMenuNode}
			className={wrapperClasses}
		>
			<div
				onClick={toggleFullMenuHandler}
				className='menu-toggle'
			>
				{categoriesHomeIcon}
				<span className={textCategoriesClasses}>
					{isBrowseFullMenu ? 'All Categories' : 'Categories'}
				</span>
			</div>
			{isLoading && <LoadingOverlay classNames='loader'/>}
			{
				hideSomeFirstLevelCategories(categories).map(({ id, logo, name, items: secondLevel }) => {
					const isOpenSecondCategory = categoriesIds[0] === id;
					const expandSecondLevelCategory = () => {
						if (categoriesIds[0] === id)
							handleOpenCategories([]);
						 else handleOpenCategories([id]);
					};
					const classes = cn('categories-second-level-wrapper', { 'hide': !isOpenSecondCategory });
					const onClickHandler = () => onCategoryClickHandler([id]);
					const colorForHover = idSHoverCategory.includes(id) ? colors.grass50 : colors.white;
					const menuIcon = isOpenSecondCategory
						? categoriesMinusIcon(colorForHover)
						: categoriesPlusIcon(colorForHover);
					const onMouseOver = () => changeColorToGreenMenuIcon(id);

					return (
						<div key={id}>
							<div
								ref={isOpenSecondCategory ? selectedFirstCategoryNode : null}
								className='categories-item-first-level'
								key={id}
							>
								<span onClick={onClickHandler} className='category-item clickable'>
									{!!logo?.svg
										&& <img
											src={logo.svg}
											alt='icon'
										/>
									}
									<span
										className='full-menu-name'
										style={{ color: colorForHover }}
										onMouseOver={onMouseOver}
										onMouseOut={changeColorToWhiteMenuIcon}
									>
										{name}
									</span>
								</span>
								{
									!!secondLevel
										&& <span
											onMouseOver={onMouseOver}
											onMouseOut={changeColorToWhiteMenuIcon}
											onClick={expandSecondLevelCategory}
											className='clickable'
										>
											{menuIcon}
										</span>
								}
							</div>
							{!!secondLevel
								&& <div className={classes}>
									{!!secondLevel
										&& secondLevel.map(({ name, items: thirdLevel, id }) => {
											const isOpenThirdCategory = categoriesIds[1] === id;
											const expandThirdLevelCategory = () => {
												if (categoriesIds[1] === id)
													handleOpenCategories([categoriesIds[0]]);
												else handleOpenCategories([categoriesIds[0], id]);
											};
											const classes = cn('categories-third-level-wrapper',
												{ 'hide': !isOpenThirdCategory });
											const onClickHandler = () =>
												onCategoryClickHandler([...categoriesIds, id]);
											const colorForHover = idSHoverCategory.includes(id)
												? colors.grass50
												: colors.white;
											const menuIcon = isOpenThirdCategory
												? categoriesMinusIcon(colorForHover)
												: categoriesPlusIcon(colorForHover);
											const onMouseOver = () => changeColorToGreenMenuIcon(id);

											return (
												<div key={id}>
													<div className='categories-item-second-level'>
														<span
															onMouseOver={onMouseOver}
															onMouseOut={changeColorToWhiteMenuIcon}
															onClick={onClickHandler}
															className='full-menu-name'
															style={{ color: colorForHover }}
														>
															&#183;&nbsp;{name}
														</span>
														{
															!!thirdLevel
																&& <span
																	onMouseOver={onMouseOver}
																	onMouseOut={changeColorToWhiteMenuIcon}
																	onClick={expandThirdLevelCategory}
																	className='clickable'
																>
																	{menuIcon}
																</span>
														}
													</div>
													{!!thirdLevel
														&& <div className={classes}>
															{
																thirdLevel.map(({ name, id }) => {
																	const onClickHandler = () =>
																		onCategoryClickHandler([...categoriesIds, id]);
																	const colorForHover = idSHoverCategory.includes(id)
																		? colors.grass50
																		: colors.white;
																	const onMouseOver = () =>
																		changeColorToGreenMenuIcon(id);

																	return (
																		<div
																			key={id}
																			className='categories-item-third-level'
																		>
																			<span
																				onClick={onClickHandler}
																				className='full-menu-name'
																				style={{ color: colorForHover }}
																				onMouseOver={onMouseOver}
																				onMouseOut={changeColorToWhiteMenuIcon}
																			>
																				&#183;&nbsp;{name}
																			</span>
																		</div>
																	);
																})
															}
														</div>
													}
												</div>
											);
										})}
								</div>
							}
						</div>
					);
				})
			}
		</div>
	);
};

FullCategoryMenu.propTypes = {
	categories: array.isRequired,
	categoriesIds: array.isRequired,
	handleOpenCategories: func.isRequired,
	toggleFullMenuHandler: func.isRequired,
	isBrowseFullMenu: bool.isRequired,
	onCategoryClickHandler: func.isRequired,
	onHoverCategoryHandler: func.isRequired,
	idSHoverCategory: array.isRequired,
	isLoading: bool.isRequired,
};

export default memo(FullCategoryMenu);
