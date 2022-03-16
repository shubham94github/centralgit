import React, { useState } from 'react';
import { P14 } from '@components/_shared/text';
import PrimaryButton from '@components/_shared/buttons/PrimaryButton';
import { linkToCookiePolicy } from './constants';

import './Cookie.scss';

const Cookie = () => {
	const cookieDate = localStorage.getItem('cookieDate');
	const [isAgree, setIsAgree] = useState(!!cookieDate);

	const onClickHandler = () => {
		localStorage.setItem('cookieDate', Date.now().toString());
		setIsAgree(true);
	};

	return !isAgree && (
		<div className='cookie-wrapper'>
			<P14 className='message-cookie' bold>
				We use our own and third-party cookies to obtain data on the navigation of our users and improve our
				services. If you accept or continue browsing, we consider that you accept their use.
				You can change the settings or&nbsp;
				<a
					className='cookie-link'
					href={linkToCookiePolicy}
					target='_blank'
					rel='noreferrer'
				>
					get more information here.
				</a>
			</P14>
			<PrimaryButton
				text='I agree'
				onClick={onClickHandler}
			/>
		</div>
	);
};

export default Cookie;
