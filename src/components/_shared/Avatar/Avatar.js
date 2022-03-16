import React, { memo, useCallback } from 'react';
import { getCompanyIcon } from '@utils/getCompanyIcon';
import { getUserIcon } from '@utils/getUserIcon';
import { shape, string, bool } from 'prop-types';
import cn from 'classnames';

import './Avatar.scss';

const Avatar = ({ logo, isUser, className, isForTable }) => {
	const classes = cn('avatar-company-container', {
		'avatar-default': !logo.image,
		[className]: !!className,
	});
	const companyIcon = useCallback(logo =>
		isUser
			? getUserIcon(logo, logo.color, logo.firstName, logo.lastName)
			: getCompanyIcon(logo, logo.name, logo.color, isForTable), [isUser, isForTable]);

	return (
		<div className={classes}>
			{companyIcon(logo)}
		</div>
	);
};

Avatar.defaultProps = {
	isUser: false,
	className: '',
	isForTable: false,
};

Avatar.propTypes = {
	logo: shape({
		name: string,
		color: string,
	}).isRequired,
	isUser: bool,
	className: string,
	isForTable: bool,
};

export default memo(Avatar);
