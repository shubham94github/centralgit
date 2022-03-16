import React, { memo } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { newsFeedContent } from '@components/News/constants';
import { H1, H2, P16 } from '@components/_shared/text';

import('./News.scss');

const News = () => {
	const history = useHistory();
	const { id } = useParams();
	const {
		content,
		title,
		date,
		img,
		source,
	} = newsFeedContent.find(item => item.id.toString() === id);
	const lastNews = newsFeedContent.filter(item => item.id.toString() !== id);

	return (
		<div className='news-wrapper'>
			<div className='news-container'>
				<H1 className='header' bold>News</H1>
				<div className='separator-horizontal'/>
				<div className='content'>
					<div className='main-news'>
						<H2 className='title' bold>{title}</H2>
						<div className='date'>{date}</div>
						<img
							className='main-img'
							src={img}
							alt={title}
						/>
						{content}
						<div className='source'>
								Source:&nbsp;
							<a
								target='_blank'
								href={source.src}
								rel='noreferrer'
							>
								{source.name}
							</a>
						</div>
					</div>
					<div className='separator-vertical'/>
					<div className='last-news'>
						<H2 className='title' bold>Last News:</H2>
						{
							lastNews.map(({
								title,
								poster,
								date,
								id,
							}) => {
								const onRedirectHandler = () => history.push(`/news/${id}`);

								return (
									<div key={id}>
										<img
											src={poster}
											alt={title}
											className='clickable'
											onClick={onRedirectHandler}
										/>
										<P16
											onClick={onRedirectHandler}
											className='clickable'
											bold
										>
											{title}
										</P16>
										<div className='date'>{date}</div>
									</div>
								);
							})
						}
					</div>
				</div>
			</div>
		</div>
	);
};

export default memo(News);
