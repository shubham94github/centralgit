import React, { memo } from 'react';
import { array } from 'prop-types';
import { P16 } from '@components/_shared/text';
import { Icons } from '@icons';

import './TagButtons.scss';

const tagIcon = Icons.tagIcon();

const TagButtons = ({ tags }) => (
	<div className='tag-buttons-container'>
		{
			tags.map((tag, index) =>
				<div key={index+tag+index} className='tag-buttons_item'>
					<P16 className='tag-text text-uppercase'>
						<span>{tagIcon}</span>
						{tag}
					</P16>
				</div>,
			)
		}
	</div>
);

TagButtons.propTypes = {
	tags: array.isRequired,
};

export default memo(TagButtons);
