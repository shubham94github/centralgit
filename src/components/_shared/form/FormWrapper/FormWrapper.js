import React, { memo } from 'react';
import { func, node, string } from 'prop-types';
import cn from 'classnames';

import './FormWrapper.scss';

const FormWrapper = ({
	children,
	className,
	onSubmit,
}) => {
	const classes = cn('form-wrapper', {
		[className]: !!className,
	});

	return (
		<form
			className={classes}
			onSubmit={onSubmit}
		>
			{children}
		</form>
	);
};

FormWrapper.defaultProps = {
	className: '',
};

FormWrapper.propTypes = {
	children: node,
	className: string,
	onSubmit: func,
};

export default memo(FormWrapper);
