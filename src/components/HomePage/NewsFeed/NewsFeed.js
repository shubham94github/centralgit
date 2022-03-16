import React, { memo } from 'react';
import { H1 } from '@components/_shared/text';

import './NewsFeed.scss';

const NewsFeed = () => {
	return (
		<div className='news-feed-wrapper'>
			<div className='news-feed-container'>
				<H1 className='title' bold>News</H1>
				<div className='news-feed-greed'>
					Coming soon!
				</div>
			</div>
		</div>
	);
};

export default memo(NewsFeed);
