import React, { memo } from 'react';
import { bool, node, string } from 'prop-types';
import { useAccordionButton } from 'react-bootstrap';
import { colors } from '@colors';
import cn from 'classnames';
import { Icons } from '@icons';

import './ToggleSection.scss';

const CustomToggle = ({ children, eventKey, isOpen, isFullWidth, isWhiteArrow }) => {
	const decoratedOnClick = useAccordionButton(eventKey);
	const classes = cn('button-toggle', { 'full-width': isFullWidth });
	const upArrowIcon = Icons.upArrowIcon(isWhiteArrow ? colors.white : colors.darkblue70);
	const downArrowIcon = Icons.downArrowIcon(isWhiteArrow ? colors.white : colors.darkblue70);

	return (
		<div onClick={decoratedOnClick} className={classes}>
			{children}
			<span className='ps-2 arrow-toggle'>
				{isOpen ? upArrowIcon : downArrowIcon}
			</span>
		</div>
	);
};

CustomToggle.propTypes = {
	eventKey: string.isRequired,
	children: node.isRequired,
	isOpen: bool.isRequired,
	isFullWidth: bool.isRequired,
	isWhiteArrow: bool.isRequired,
};

export default memo(CustomToggle);
