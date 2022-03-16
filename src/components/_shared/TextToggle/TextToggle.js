import React, { memo, useState, useRef, useLayoutEffect, useCallback } from 'react';
import { number, string } from 'prop-types';
import cn from 'classnames';
import { P14 } from '@components/_shared/text';
import { colors } from '@colors';
import Markdown from 'markdown-to-jsx';
import { Icons } from '@icons';
import replaceBreakLinesWithAsterisk from '@utils/replaceBreakLinesWithAsterisk';

import './TextToggle.scss';

const TextToggle = ({ text, stringLimit }) => {
	const targetRef = useRef();
	const [isFullSize, setIsFullSize] = useState(null);
	const [isOpen, setIsOpen] = useState(false);
	const classes = cn('truncate-overflow', { 'hide-text': !isOpen && !isFullSize });
	const arrowLinkIcon = isOpen
		? Icons.arrowLinkIconLess(colors.darkblue50)
		: Icons.arrowLinkIconMore(colors.darkblue50);
	let movementTimer = null;

	const handleOnClick = () => setIsOpen(prevState => !prevState);

	const getDimensions = useCallback(() => {
		if (!text?.length) return;

		const fontSize = 12;

		if (targetRef.current) {
			const isFullSize = Math.ceil(text.length * fontSize / 2 / targetRef.current.offsetWidth) <= stringLimit;

			setIsFullSize(isFullSize);
		}

	}, [text?.length, stringLimit]);

	window.addEventListener('resize', () => {
		clearInterval(movementTimer);
		movementTimer = setTimeout(getDimensions, 100);
	});

	useLayoutEffect(() => {
		if (text?.length) getDimensions();
	}, [getDimensions, text]);

	return text && (
		<div className='text-toggle-container'>
			<div ref={targetRef} className={classes}>
				{text
					&& <Markdown
						options={{ forceInline: true, wrapper: 'div' }}
					>
						{replaceBreakLinesWithAsterisk(text || '')}
					</Markdown>
				}
			</div>
			{
				!isFullSize && text
					&& <P14 onClick={handleOnClick} className='button-toggle-text'>
						{isOpen ? 'Show less' : 'Show more'}
						<span className='ps-2'>{arrowLinkIcon}</span>
					</P14>
			}
		</div>
	);
};

TextToggle.defaultProps = {
	text: '',
	stringLimit: 4,
};

TextToggle.propTypes = {
	stringLimit: number,
	text: string,
};

export default memo(TextToggle);
