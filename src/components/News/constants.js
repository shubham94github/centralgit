import news1 from '@assets/images/news/news1.jpg';
import news2 from '@assets/images/news/news2.jpg';
import news3 from '@assets/images/news/news3.jpg';
import news1Full from '@assets/images/news/news1-full.jpg';
import news2Full from '@assets/images/news/news2-full.jpg';
import news3Full from '@assets/images/news/news3-full.jpg';

import { firstNews, secondNews, thirdNews } from '@components/News/newsContent';

/* eslint-disable max-len */
export const newsFeedContent = [
	{
		id: 1,
		poster: news1,
		img: news1Full,
		title: 'Foot Locker to buy two footwear chains for 1.1 billion dollars',
		date: '08/03/2021 ',
		description: 'US sportswear and footwear retailer Foot Locker is spending 1.1 billion dollars to buy two companies as it looks to simultaneously accelerate its Asia-Pacific expansion and solidify its positioning in North America.'
			+ 'The New York-based company...',
		content: firstNews,
		source: {
			name: 'Fashion United',
			src: 'https://fashionunited.com/en/executive/management/foot-locker-to-buy-two-footwear-chains-for-1-1-billion-dollars/2021080241348',
		},
	},
	{
		id: 2,
		poster: news2,
		img: news2Full,
		title: 'Conversation and Customer Experience: How AI is Being Used in Retail',
		date: '07/23/2021 ',
		description: 'Retail has been around for centuries. So before we look into the future, let’s start by looking at the history of retail. In the 1770-1800s, Mom and Pop shops ruled the world.  Small, family owned businesses...',
		content: secondNews,
		source: {
			name: 'ReadSpeaker AI',
			src: 'https://www.readspeaker.ai/blog/how-ai-is-being-used-in-retail/',
		},
	},
	{
		id: 3,
		poster: news3,
		img: news3Full,
		title: 'Town centre ‘anchor’ department stores cut adrift in pandemic',
		date: '06/28/2021',
		description: 'In Émile Zola’s 1883 novel Au Bonheur des Dames, the department store that forms the backdrop for the intrigues expands steadily as the story unfolds. If Zola were writing today, it would probably be dressing the windows for a closing down sale...',
		content: thirdNews,
		source: {
			name: 'Financial Times',
			src: 'https://www.ft.com/content/784dbd8d-2d3f-477a-be1e-68ac2085ee5e?accessToken=zwAAAXpTu4Sgkc94Tb2NLT9HetO-HmisIIXuXg.MEUCIQDLNM4uCyeiy15uX8BGT9bx1X3uq9D4yGq0WjVH-GTYQAIgXXbSSW5I1V6IR5fGmpOkh5bVJoBe3gjjRzWu6FoQnXs&sharetype=gift?token=91fad225-dee4-4e44-84e9-df344c7a2648',
		},
	},
];
