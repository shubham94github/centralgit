import React, { memo } from 'react';
import LoadingOverlay from '@components/_shared/LoadingOverlay';
import { P16 } from '@components/_shared/text';
import { bool, object, string } from 'prop-types';

const ItemCategory = ({
	icon,
	isLoading,
	category,
}) => {
	const { name, sameItems } = category;

	return (
		<div className='content-item-category'>
			{
				!icon && isLoading
					? <LoadingOverlay classNames='loader-slide'/>
					: !!icon
						&& <img
							src={icon}
							alt='icon'
						/>
			}
			<P16 className='title-slide'>
				{name}
				{sameItems.length > 1
				&& <>
					&nbsp;
					({sameItems.length})
				</>
				}
			</P16>
		</div>
	);
};

ItemCategory.propTypes = {
	icon: string,
	isLoading: bool.isRequired,
	category: object.isRequired,
};

export default memo(ItemCategory);
