import React  from 'react';
import Masonry from 'react-masonry-css';
import { breakpointColumnsObj } from './constants';
import { isEmpty } from '@utils/js-helpers';
import { any, arrayOf, bool, elementType, object } from 'prop-types';

import './MasonryLayout.scss';

const MasonryLayout = ({
	items,
	itemProps,
	brickComponent: BrickComponent,
	lastBrickComponent: LastBrickComponent,
	lastBrickProps,
	isMemberEditPermission,
}) => (
	<div className='masonry-wrapper'>
		<Masonry
			breakpointCols={breakpointColumnsObj}
			className='my-masonry-grid'
			columnClassName='my-masonry-grid_column'
		>
			{!isEmpty(items) && items.map(item => {
				return <BrickComponent
					{...itemProps}
					item={item}
					key={item.id}
					isMemberEditPermission={isMemberEditPermission}
				/>;
			})}
			{isMemberEditPermission
				&& <LastBrickComponent {...lastBrickProps}/>
			}
		</Masonry>
	</div>
);

MasonryLayout.defaultProps = {
	isMemberEditPermission: true,
};

MasonryLayout.propTypes = {
	items: arrayOf(any),
	itemProps: object,
	brickComponent: elementType,
	lastBrickComponent: elementType,
	lastBrickProps: object,
	isMemberEditPermission: bool,
};

export default MasonryLayout;
