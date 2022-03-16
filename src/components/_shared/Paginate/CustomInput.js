import React, { useEffect, useState } from 'react';
import { components } from 'react-select';

const validChars = [
	'0', '1', '2', '3', '4', '5',
	'6', '7', '8', '9', '.', ',',
	'Backspace', 'Delete', 'ArrowLeft', 'ArrowRight',
];

const CustomInput = props => {
	const [isInputActive, setIsInputActive] = useState(false);

	const handleFocus = () => setIsInputActive(true);
	const handleBlur = () => setIsInputActive(false);

	useEffect(() => {
		const preventNonDigitKeyDown = e => {
			if (!validChars.includes(e.key) && isInputActive) e.preventDefault();
		};

		document.addEventListener('keydown', preventNonDigitKeyDown);

		return () => document.removeEventListener('keydown', preventNonDigitKeyDown);
	}, [isInputActive]);

	return (
		<components.Input
			{...props}
			onFocus={handleFocus}
			onBlur={handleBlur}
		/>
	);
};

export default CustomInput;
