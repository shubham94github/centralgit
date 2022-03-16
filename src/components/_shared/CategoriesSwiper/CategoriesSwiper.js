import React, { memo, useEffect } from 'react';
import { connect } from 'react-redux';
import SwiperCore, { Navigation } from 'swiper/core';
import { array, bool, func, string } from 'prop-types';
import { Swiper, SwiperSlide } from 'swiper/react';
import { P12 } from '@components/_shared/text';
import Tooltip from '@components/_shared/Tooltip';
import ItemCategory from './ItemCategory';
import { getCategories } from '@ducks/common/actions';
import { isEmpty } from '@utils/js-helpers';
import combineCategoriesByName from '@utils/combineCategoriesByName';
import { colors } from '@colors';
import { Icons } from '@icons';

import 'swiper/swiper.min.css';
import 'swiper/components/pagination/pagination.min.css';
import 'swiper/components/navigation/navigation.min.css';

import './CategoriesSwiper.scss';

SwiperCore.use([Navigation]);

const leftArrowIcon = Icons.leftArrowIcon(colors.gray90);
const rightArrowIcon = Icons.rightArrowIcon(colors.gray90);

const areasType = 'areasOfInterest';

const CategoriesSwiper = ({
	selectedCategories,
	categories,
	isLoading,
	getCategories,
	isWithoutTooltip,
	id,
}) => {
	const sortedCategories = combineCategoriesByName(selectedCategories);
	const classNextEl = `swiper-button-next-unique-${id}`;
	const classPrevEl = `swiper-button-prev-unique-${id}`;
	const isAreas = areasType === id;

	useEffect(() => {
		if (isEmpty(categories)) getCategories();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (sortedCategories
		&& <div className='categories-swiper-wrapper'>
			<div className={`${classPrevEl} swiper-button-prev-unique`}>{leftArrowIcon}</div>
			<Swiper
				slidesPerView='auto'
				watchOverflow
				spaceBetween={50}
				navigation={{
					nextEl: `.${classNextEl}`,
					prevEl: `.${classPrevEl}`,
				}}
				className='swiper'
			>
				{
					sortedCategories.map((category, i) => {
						const currentCategory = categories
							.find(categoryItem => categoryItem.name === category.name);
						const icon = isAreas ? currentCategory?.areasLogo?.svg : currentCategory?.logo?.svg;

						return (
							<SwiperSlide key={category.id + i + category.name}>
								{
									isWithoutTooltip
										? <ItemCategory
											icon={icon}
											isLoading={isLoading}
											category={category}
										/>
										: <Tooltip
											trigger={['hover', 'focus']}
											message={
												<P12 className='parent-paths'>
													<>
														{
															category.sameItems.map(item => (
																<span key={item}>
																	{item}
																	<br/>
																</span>
															))
														}
													</>
												</P12>
											}
										>
											<ItemCategory
												icon={icon}
												isLoading={isLoading}
												category={category}
											/>
										</Tooltip>
								}
							</SwiperSlide>
						);
					})
				}
			</Swiper>
			<div className={`${classNextEl} swiper-button-next-unique`}>{rightArrowIcon}</div>
		</div>
	);
};

const mapStateToProps = ({ common: { categories, isLoading } }) => ({
	categories,
	isLoading,
});

CategoriesSwiper.propTypes = {
	categories: array.isRequired,
	selectedCategories: array.isRequired,
	getCategories: func.isRequired,
	isLoading: bool.isRequired,
	isWithoutTooltip: bool,
	id: string.isRequired,
};

CategoriesSwiper.defaultProps = {
	isWithoutTooltip: false,
};

export default connect(mapStateToProps, {
	getCategories,
})(memo(CategoriesSwiper));
