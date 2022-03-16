import React, { memo, useEffect, useRef, useState } from 'react';
import { func, number, string } from 'prop-types';
import Markdown from 'markdown-to-jsx';
import cn from 'classnames';

import './TextToggleForHeight.scss';

const maxHeight = 120;

const TextToggleForHeight = ({ text, onClickToggleTextHandler, textHeight }) => {
	const [isFullSize, setIsFullSize] = useState(true);
	const [isOpenText, setIsOpenText] = useState(true);

	const classesText = cn('text-content', {
		'hide-text': !isOpenText,
		's16': textHeight === 16,
		's14': textHeight === 14,
	});

	const toggleText = () => {
		setIsOpenText(prevState => !prevState);

		if (onClickToggleTextHandler) onClickToggleTextHandler();
	};

	const textRef = useRef(null);

	useEffect(() => {
		const { clientHeight } = textRef.current;
		if (clientHeight > maxHeight) {
			setIsFullSize(false);
			setIsOpenText(false);
		}
	}, []);

	return (
		<div className='text-toggle-for-height-container'>
			<div ref={textRef} className={classesText}>
				{text && <Markdown options={{ forceInline: true, wrapper: 'div' }}>{text}</Markdown>}
			</div>
			{
				!isFullSize
					&& <div
						onClick={toggleText}
						className='toggle-text-button'
					>
						{
							isOpenText
								? 'Show less'
								: 'Read more...'
						}
					</div>
			}
		</div>
	);
};

TextToggleForHeight.defaultProps = {
	text: '',
	textHeight: 16,
};

TextToggleForHeight.propTypes = {
	text: string,
	onClickToggleTextHandler: func,
	textHeight: number,
};

export default memo(TextToggleForHeight);
