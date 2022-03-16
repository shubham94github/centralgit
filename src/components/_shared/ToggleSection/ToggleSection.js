import React, { memo, useMemo, useState } from 'react';
import { bool, func, node, string } from 'prop-types';
import { Accordion } from 'react-bootstrap';
import CustomToggle from './CustomToggle';

const ToggleSection = ({
	button,
	children,
	isFullWidth,
	eventKey,
	onChangeHandler,
	isWhiteArrow,
}) => {
	const defaultActiveKey = useMemo(() => eventKey !== 'defaultKey' ? eventKey : '', [eventKey]);
	const [isOpen, setIsOpen] = useState(!!defaultActiveKey);
	const onSelectHandler = select => {
		setIsOpen(!!select);
		onChangeHandler(!!select);
	};

	return (
		<Accordion onSelect={onSelectHandler} defaultActiveKey={defaultActiveKey}>
			<CustomToggle
				isOpen={isOpen}
				isFullWidth={isFullWidth}
				eventKey={eventKey}
				isWhiteArrow={isWhiteArrow}
			>
				{button}
			</CustomToggle>
			<Accordion.Collapse eventKey={eventKey}>
				<div>
					{children}
				</div>
			</Accordion.Collapse>
		</Accordion>
	);
};

ToggleSection.propTypes = {
	button: node.isRequired,
	children: node.isRequired,
	isFullWidth: bool.isRequired,
	eventKey: string,
	onChangeHandler: func,
	isWhiteArrow: bool,
};

ToggleSection.defaultProps = {
	isFullWidth: false,
	eventKey: 'defaultKey',
	onChangeHandler: () => {},
	isWhiteArrow: false,
};

export default memo(ToggleSection);
