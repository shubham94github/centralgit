import React from 'react';
import { components } from 'react-select';
import { object, string } from 'prop-types';

import './CustomSelectOption.scss';

export const CustomOption = props => {
	const { label } = props;

	return <components.Option {...props}>
		<div className='actions-option'>{label}</div>
	</components.Option>;
};

CustomOption.propTypes = {
	value: string,
	label: string,
	props: object,
};
