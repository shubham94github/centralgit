import React, { memo, useCallback, useEffect } from 'react';
import { P16, P14 } from '@components/_shared/text';
import { useHistory } from 'react-router-dom';
import { Routes } from '@routes';
import { Icons } from '@icons';

import './UpdateCardSuccessfully.scss';

const checkPasswordUpdatedIcon = Icons.checkPasswordUpdatedIcon();

const UpdateCardSuccessfully = () => {
	const history = useHistory();
	const delay = 5000;
	const redirectHandler = useCallback(() => history.push(Routes.HOME), [history]);

	useEffect(() => {
		const timer = setTimeout(() => redirectHandler(), delay);

		return () => clearTimeout(timer);
	}, [redirectHandler]);

	return (
		<section className='update-card-successfully-section'>
			<div className='update-card-successfully-container'>
				<span className='check-icon'>
					{checkPasswordUpdatedIcon}
				</span>
				<P16
					className='label'
					bold
				>
					Update Card
				</P16>
				<P14 className='description'>
					Thank you! You have successfully updated your payment details.
					Your payment has been processed successfully.
					You will be redirected to home page in 5 seconds
				</P14>
			</div>
		</section>
	);
};

export default memo(UpdateCardSuccessfully);
