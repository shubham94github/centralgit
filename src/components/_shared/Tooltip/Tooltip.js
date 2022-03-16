import React, { memo, useEffect, useState } from 'react';
import { node, string, arrayOf, bool, elementType, object } from 'prop-types';
import cn from 'classnames';
import { Popover, OverlayTrigger } from 'react-bootstrap';
import { v4 as uuid } from 'uuid';

import './Tooltip.scss';

const Tooltip = ({
	children,
	component: Component,
	componentProps,
	isVisibleTooltip,
	message,
	placement,
	trigger,
	isDisableTooltip,
	className,
	isCustomShow,
	width,
}) => {
	const classes = cn('popover-container', {
		'popover-mt': placement === 'top-start',
		'popover-mb': placement === 'bottom',
		'popover-ml': placement === 'right',
		'bs-popover-end': placement === 'right',
		[className]: !!className,
	});

	const [isVisible, setIsVisible] = useState(false);

	const hideTooltip = () => setIsVisible(false);

	const showTooltip = () => {
		if (!isDisableTooltip && isVisibleTooltip) setIsVisible(true);
	};

	useEffect(() => {
		if (isDisableTooltip) hideTooltip();
	}, [isDisableTooltip]);

	return (
		<OverlayTrigger
			trigger={trigger}
			placement={placement}
			show={isCustomShow
				? isCustomShow
				: trigger.includes('hover')
					? isVisible
					: undefined
			}
			overlay={
				<Popover
					className={classes}
					id={uuid()}
					onMouseEnter={showTooltip}
					onMouseLeave={hideTooltip}
				>
					{isVisibleTooltip
						&& <Popover.Body style={{ width }}>
							{message || <Component {...componentProps}/>}
						</Popover.Body>
					}
				</Popover>
			}
		>
			<span
				onMouseEnter={showTooltip}
				onMouseLeave={hideTooltip}
				className='tooltip-children'
			>
				{children}
			</span>
		</OverlayTrigger>
	);
};

Tooltip.defaultProps = {
	placement: 'top-start',
	message: '',
	trigger: ['hover', 'focus'],
	isVisibleTooltip: true,
	isDisableTooltip: false,
	isCustomShow: false,
	width: 'auto',
};

Tooltip.propTypes = {
	children: node,
	component: elementType,
	componentProps: object,
	isVisibleTooltip: bool,
	message: node,
	placement: string,
	trigger: arrayOf(string),
	isDisableTooltip: bool,
	className: string,
	isCustomShow: bool,
	width: string,
};

export default memo(Tooltip);
