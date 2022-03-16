import React, { memo } from 'react';
import { stripePromise } from '@components/Auth/AddRetailCompany/AddRetailCompany';
import PaymentForm from '@components/Auth/AddRetailCompany/PaymentForm';
import { Elements } from '@stripe/react-stripe-js';

const PaymentFormWithProvider = props => {
	return (
		<Elements stripe={stripePromise}>
			<PaymentForm {...props}/>
		</Elements>
	);
};

export default memo(PaymentFormWithProvider);
