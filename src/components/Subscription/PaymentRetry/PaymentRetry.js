import React, { memo, useCallback, useEffect } from 'react';
import { P16, P14 } from '@components/_shared/text';
import { useHistory } from 'react-router-dom';
import { Routes } from '@routes';
import { Icons } from '@icons';

import './PaymentRetry.scss';

const checkPasswordUpdatedIcon = Icons.checkPasswordUpdatedIcon();

const PaymentRetry = () => {
	const history = useHistory();
	const delay = 5000;
	const redirectHandler = useCallback(() => {
		history.push(Routes.HOME);
	}, [history]);

	useEffect(() => {
		const timer = setTimeout(() => redirectHandler(), delay);

		return () => clearTimeout(timer);
	}, [redirectHandler]);

	return (
		<section className='payment-retry-section'>
			<div className='payment-retry-container'>
				<span className='check-icon'>
					{checkPasswordUpdatedIcon}
				</span>
				<P16
					className='label'
					bold
				>
					Payment Retry - Successful!
				</P16>
				<P14 className='description'>
					Thank you! Your payment has been processed successfully.
					You will be redirected to home page in 5 seconds.
				</P14>
			</div>
		</section>
	);
};

export default memo(PaymentRetry);
