import React, { memo } from 'react';
import { node, string, arrayOf, bool, elementType, object } from 'prop-types';
import cn from 'classnames';
import { Popover, OverlayTrigger } from 'react-bootstrap';
import { v4 as uuid } from 'uuid';

import './TooltipForPassword.scss';

const TooltipForPassword = ({
	children,
	component: Component,
	componentProps,
	isVisibleTooltip,
	message,
	placement,
	trigger,
}) => {
	const classes = cn('popover-container', {
		'popover-mt': placement === 'top-start',
		'popover-ml': placement === 'right',
		'bs-popover-end': placement === 'right',
	});

	return (
		<OverlayTrigger
			trigger={trigger}
			placement={placement}
			show={isVisibleTooltip}
			overlay={
				<Popover
					className={classes}
					id={uuid()}
				>
					<Popover.Body>
						{message || <Component {...componentProps}/>}
					</Popover.Body>
				</Popover>
			}
		>
			{children}
		</OverlayTrigger>
	);
};

TooltipForPassword.defaultProps = {
	placement: 'top-start',
	message: '',
	trigger: ['hover', 'focus'],
	isVisibleTooltip: true,
};

TooltipForPassword.propTypes = {
	children: node,
	component: elementType,
	componentProps: object,
	isVisibleTooltip: bool,
	message: node,
	placement: string,
	trigger: arrayOf(string),
};

export default memo(TooltipForPassword);
