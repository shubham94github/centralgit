import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { bool, func, number, string } from 'prop-types';
import { colors } from '@colors';
import cn from 'classnames';
import { Icons } from '@icons';

import './RatingStars.scss';

const RatingStars = ({ rate, starsCount, isClickable, name, value, register }) => {
	const ratingStarIconFill = Icons.ratingStarIcon(colors.orange40);
	const ratingStarIconEmpty = Icons.ratingStarIcon(colors.darkblue10);
	const defaultStars = useCallback(icon => new Array(starsCount).fill(icon), [starsCount]);
	const defaultExtendedStars = useCallback(icon => defaultStars(icon).map((star, index) => ({
		value: index + 1,
		icon: icon,
	})), [defaultStars]);
	const [starsCountClick, setStarsCountClick] = useState(defaultStars(ratingStarIconEmpty));
	const [selectedStars, setSelectedStars] = useState(defaultExtendedStars(ratingStarIconEmpty));
	const [isHover, setIsHover] = useState(false);
	const classes = cn('clickable', { 'z-2': isHover });

	const stars = useMemo(() => {
		return defaultStars(ratingStarIconFill)
			.map((star, index) => {
				if (rate <= index) return ratingStarIconEmpty;

				return star;
			});
	}, [rate, ratingStarIconFill, ratingStarIconEmpty, defaultStars]);

	const onHoverHandler = useCallback(rate => {
		const hoverStars = defaultExtendedStars(ratingStarIconFill).map((star, index) => {
			if (rate <= index) {
				return {
					value: index + 1,
					icon: ratingStarIconEmpty,
				};
			}
			return star;
		});

		setSelectedStars(hoverStars);
	}, [ratingStarIconFill, ratingStarIconEmpty, defaultExtendedStars]);

	const onLeaveHandler = () => setIsHover(false);

	const onEnterHandler = () => setIsHover(true);

	const onClickHandler = useCallback(rate => {
		const newStars = defaultStars(ratingStarIconFill).map((star, index) => {
			if (rate <= index) return ratingStarIconEmpty;

			return star;
		});
		setStarsCountClick(newStars);
	}, [setStarsCountClick, ratingStarIconFill, ratingStarIconEmpty, defaultStars]);

	useEffect(() => {
		onClickHandler(value);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [value]);

	return (
		<div
			className='rating-stars-container'
			onMouseLeave={onLeaveHandler}
			onMouseEnter={onEnterHandler}
		>
			{isClickable
				? (
					<>
						<div className='no-clickable'>
							{starsCountClick.map((star, index) => (
								<div
									key={index}
								>
									{star}
								</div>
							))}
						</div>
						<div className={classes}>
							{
								selectedStars.map((star, index) => (
									<label
										key={index}
										onMouseEnter={() => onHoverHandler(star.value)}
										onMouseOver={() => onHoverHandler(star.value)}
										onClick={() => onClickHandler(star.value)}
									>
										{star.icon}
										<input
											id={star.value + index}
											name={name}
											value={star.value}
											type='radio'
											defaultChecked={value === star.value}
											ref={register}
											className='d-none'
										/>
									</label>))
							}
						</div>
					</>
				)
				: stars.map((star, index) =>
					<div key={index}>
						{star}
					</div>)
			}
		</div>);
};

RatingStars.defaultProps = {
	rate: 0,
	starsCount: 5,
	isClickable: false,
	value: '0',
};

RatingStars.propTypes = {
	rate: number,
	starsCount: number,
	isClickable: bool,
	name: string,
	value: string,
	register: func,
};

export default memo(RatingStars);
