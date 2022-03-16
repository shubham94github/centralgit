import React, { memo, useEffect, useState } from 'react';
import { bool, func, number, object, oneOfType, string } from 'prop-types';
import cn from 'classnames';
import { Icons } from '@icons';
import ReactQuill from 'react-quill';
import { overwriteDefaultQuillIcons } from '@components/_shared/form/EditorTextArea/utils';
import { colors } from '@colors';
import { modules } from './constants';

import 'react-quill/dist/quill.snow.css';
import './EditorTextArea.scss';

const icons = ReactQuill.Quill.import('ui/icons');
overwriteDefaultQuillIcons(icons);

const formats = ['bold', 'italic', 'underline', 'list', 'bullet' ];

const EditorTextArea = ({
	placeholder,
	classNames,
	id,
	onChange,
	value,
	readOnly,
	isBorder,
	isControlsDisabled,
	onBlur,
	onFocus,
	isClearInput,
}) => {
	const [isStyleControlsOpen, setIsStyleControlsOpen] = useState('');
	const [text, setText] = useState('');

	useEffect(() => {
		setText(value);
	}, [value]);

	const handleChange = value => {
		setText(value);

		if (onChange) onChange(value);
	};

	const handleBlur = () => {
		if (onBlur) onBlur();
	};

	const handleFocus = () => {
		if (onFocus) onFocus();
	};

	const rootClassNames = cn('RichEditor-root', {
		'controls-opened': isStyleControlsOpen,
		'read-only': readOnly,
		'with-border': isBorder,
	});

	const toggleStyleControlPanel = () => {
		if (readOnly) return;

		setIsStyleControlsOpen(prevState => !prevState);
	};

	const controlsIcon = Icons.settingIcon(isStyleControlsOpen ? colors.grass50 : colors.darkblue50);

	useEffect(() => {
		if (!isClearInput) return;

		setText('');
	}, [isClearInput]);

	return (
		<div className={rootClassNames}>
			{!isControlsDisabled
				&& <span
					className='editor-controls-icon'
					onClick={toggleStyleControlPanel}
				>
					{controlsIcon}
				</span>
			}
			<ReactQuill
				readOnly={readOnly}
				onFocus={handleFocus}
				className={classNames}
				onBlur={handleBlur}
				id={id}
				placeholder={placeholder}
				value={text}
				onChange={handleChange}
				modules={modules}
				formats={formats}
				theme={'snow'}
			/>
		</div>
	);
};

EditorTextArea.defaultProps = {
	EditorTextArea: false,
	isClearInput: false,
};

EditorTextArea.propTypes = {
	placeholder: string,
	classNames: string,
	id: oneOfType([number, string]),
	name: string,
	isError: bool,
	value: oneOfType([string, object]),
	onChange: func,
	onBlur: func,
	trigger: func,
	readOnly: bool,
	isBorder: bool,
	isControlsDisabled: bool,
	keyBindingFn: func,
	isClearInput: bool,
	onFocus: func,
};

export default memo(EditorTextArea);
