import React from 'react';
import { components } from 'react-select';
import RatingStars from '@components/_shared/RatingStars';
import { object, string, number, oneOfType, shape } from 'prop-types';

export const CustomOption = ({ value, label, ...props }) =>
	<components.Option {...props}>
		{
			value === 0
				? <div>{label}</div>
				: <RatingStars rate={5} starsCount={value}/>
		}
	</components.Option>;

export const SingleValue = ({ ...props }) => {
	const { data: { value, label } } = props;

	return (
		<components.SingleValue {...props}>
			{
				value === 0
					? <div>{label}</div>
					: <RatingStars rate={5} starsCount={value}/>
			}
		</components.SingleValue>
	);
};

CustomOption.propTypes = {
	value: oneOfType([number, string]),
	label: oneOfType([number, string]),
	props: object,
};

SingleValue.propTypes = {
	props: object,
	data: shape({
		value: oneOfType([number, string]),
		label: oneOfType([number, string]),
	}),
};
