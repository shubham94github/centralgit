import React, { memo, useEffect } from 'react';
import { connect } from 'react-redux';
import { getSimilarStartups } from '@ducks/profile/actions';
import { array, bool, func, string } from 'prop-types';
import SwiperCore, { Navigation } from 'swiper/core';
import { Swiper, SwiperSlide } from 'swiper/react';
import ProfileSimilarStartup from './ProfileSimilarStartup';
import { H1 } from '@components/_shared/text';
import LoadingOverlay from '@components/_shared/LoadingOverlay';
import { Icons } from '@icons';

import 'swiper/swiper.min.css';
import 'swiper/components/pagination/pagination.min.css';
import 'swiper/components/navigation/navigation.min.css';

import './SimilarStartups.scss';

SwiperCore.use([Navigation]);

const leftArrowIcon = Icons.leftArrowIconSwiper();
const rightArrowIcon = Icons.rightArrowIconSwiper();

const SimilarStartups = ({
	getSimilarStartups,
	isLoadingSimilarStartups,
	similarStartups,
	startupId,
}) => {
	const classNextEl = `swiper-button-next-unique-similar-startups`;
	const classPrevEl = `swiper-button-prev-unique-similar-startups`;

	useEffect(() => {
		getSimilarStartups({ data: { startupId } });
	}, [getSimilarStartups, startupId]);

	return ( !isLoadingSimilarStartups && !!similarStartups.length
		&& <div className='similar-startups-wrapper'>
			<H1 className='title-section' bold>Similar</H1>
			{isLoadingSimilarStartups && <LoadingOverlay/>}
			{!!similarStartups.length
				&& <div className='similar-startups-swiper'>
					<div className={`${classPrevEl} swiper-button-prev-unique`}>{leftArrowIcon}</div>
					<Swiper
						slidesPerView={3}
						longSwipesMs={300}
						shortSwipes={false}
						slidesPerGroup={3}
						loop
						watchOverflow
						spaceBetween={10}
						navigation={{
							nextEl: `.${classNextEl}`,
							prevEl: `.${classPrevEl}`,
						}}
						className='swiper'
						allowTouchMove={false}
					>
						{
							similarStartups.map(({
								id,
								companyShortName,
								companyDescription,
								logo120,
							}) => {
								return (
									<SwiperSlide key={companyShortName + id}>
										<ProfileSimilarStartup
											id={id}
											companyShortName={companyShortName}
											companyDescription={companyDescription}
											logo120={logo120}
										/>
									</SwiperSlide>
								);
							})
						}
					</Swiper>
					<div className={`${classNextEl} swiper-button-next-unique`}>{rightArrowIcon}</div>
				</div>
			}
		</div>
	);
};

SimilarStartups.propTypes = {
	getSimilarStartups: func.isRequired,
	isLoadingSimilarStartups: bool.isRequired,
	similarStartups: array.isRequired,
	startupId: string.isRequired,
};

const mapStateToProps = ({
	profile: {
		isLoadingSimilarStartups,
		similarStartups,
	},
}) => {
	return {
		isLoadingSimilarStartups,
		similarStartups,
	};
};

export default connect(mapStateToProps, {
	getSimilarStartups,
})(memo(SimilarStartups));
