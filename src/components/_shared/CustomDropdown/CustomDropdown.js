import React, { memo, useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import { string, node, bool, elementType, object } from 'prop-types';
import { Dropdown } from 'react-bootstrap';
import CustomToggleDropdown from './CustomToggleDropdown';
import { useHistory } from 'react-router-dom';
import { useOnClickOutside } from '@utils/hooks/useOnClickOutside';

import './CustomDropdown.scss';

const CustomDropdown = ({
	button,
	children,
	className,
	drop,
	isHoverMode,
	component: Component,
	outerProps,
}) => {
	const history = useHistory();
	const classes = cn({ [className]: !!className });
	const [isHovered, setIsHovered] = useState(false);
	const [isClicked, setIsClicked] = useState(false);
	const [currentPath, setCurrentPath] = useState('');
	const [styles, setStyles] = useState({});
	const icon = useRef(null);
	const dropdownRef = useRef(null);

	useOnClickOutside([dropdownRef], () => setIsClicked(false));

	const handleMouseEnter = () => setIsHovered(true);
	const handleMouseLeave = () => setIsHovered(false);
	const toggleClickDropdown = () => setIsClicked(!isClicked);

	useEffect(() => {
		if (!currentPath) setCurrentPath(history.location.pathname);

		const listener = history.listen(location => {
			setCurrentPath(location.pathname);
			setIsClicked(false);
		});

		return () => {
			listener();
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [history]);

	useEffect(() => {
		if (icon.current) {
			const { bottom, left } = icon.current.getBoundingClientRect();

			setStyles({
				position: 'fixed',
				top: bottom,
				left,
				zIndex: 3,
			});
		}
	}, []);

	return (
		<Dropdown
			drop={drop}
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}
			onToggle={toggleClickDropdown}
			show={isHoverMode ? isHovered : isClicked}
			ref={dropdownRef}
		>
			<span ref={icon}>
				<Dropdown.Toggle as={CustomToggleDropdown}>
					{button}
				</Dropdown.Toggle>
			</span>
			<div style={styles}>
				<Dropdown.Menu className={classes}>
					<div className='customize-menu'>
						{children || <Component
							{...outerProps}
							toggleClickDropdown={toggleClickDropdown}
							isShow={isClicked}
						/>}
					</div>
				</Dropdown.Menu>
			</div>
		</Dropdown>
	);
};

CustomDropdown.propTypes = {
	children: node,
	button: node,
	className: string,
	drop: string,
	isHoverMode: bool,
	component: elementType,
	outerProps: object,
};

CustomDropdown.defaultProps = {
	drop: 'down',
	isHoverMode: false,
	outerProps: {},
};

export default memo(CustomDropdown);
