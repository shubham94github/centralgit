import React, { memo } from 'react';
import { bool, func, node, object, oneOfType, string } from 'prop-types';
import cn from 'classnames';

import './PrimaryButton.scss';

const PrimaryButton = ({
	text,
	disabled,
	isFullWidth,
	className,
	onClick,
	isDarkTheme,
	children,
	type,
	isOutline,
	isLoading,
	buttonRef,
	isAdmin,
}) => {
	const classes = cn('primary-button', {
		'full-width': isFullWidth,
		'dark-theme': isDarkTheme,
		'light-theme': !isDarkTheme,
		'btn-outline-primary': isOutline,
		'admin-primary': isAdmin,
		[className]: !!className,
	});

	return (
		<button
			ref={buttonRef ? buttonRef : null}
			className={classes}
			onClick={onClick}
			type={type}
			disabled={isLoading ? isLoading : disabled}
		>
			{ isLoading && <span
				className='spinner-border spinner-border-sm'
				role='status'
				aria-hidden='true'
			/> }
			{text || children}
		</button>
	);
};

PrimaryButton.defaultProps = {
	disabled: false,
	isFullWidth: false,
	className: '',
	isDarkTheme: false,
	type: 'button',
	isOutline: false,
	onClick: () => {},
	isLoading: false,
	isAdmin: false,
};

PrimaryButton.propTypes = {
	text: oneOfType([string, node]),
	disabled: bool,
	isFullWidth: bool,
	className: string,
	onClick: func,
	isDarkTheme: bool,
	children: node,
	type: string,
	isOutline: bool,
	isLoading: bool,
	buttonRef: object,
	isAdmin: bool,
};

export default memo(PrimaryButton);
