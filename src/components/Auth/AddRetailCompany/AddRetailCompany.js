import React, { memo } from 'react';
import PaymentForm from '@components/Auth/AddRetailCompany/PaymentForm';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { Routes } from '@routes';
import { bool } from 'prop-types';
import enums from '@constants/enums';

import './AddRetailCompany.scss';

const { STRIPE_LICENCE_KEY } = process.env;

export const stripePromise = loadStripe(
	STRIPE_LICENCE_KEY,
);

const AddRetailCompany = ({ isSubscriptionPaid, isTrial, isCompletedGettingStarted }) => {
	if (isCompletedGettingStarted && (isSubscriptionPaid || isTrial)) return <Redirect to={Routes.HOME}/>;

	return (
		<section className='add-retail-company-section'>
			<Elements stripe={stripePromise}>
				<PaymentForm/>
			</Elements>
		</section>
	);
};

AddRetailCompany.propTypes = {
	isSubscriptionPaid: bool,
	isTrial: bool,
	isCompletedGettingStarted: bool,
};

const mapStateToProps = ({ auth }) => {
	const propName = !!auth.user ? 'retailer' : 'member';

	return {
		isSubscriptionPaid: auth.user && auth.user[propName].stripePaymentSettings.isSubscriptionPaid,
		isTrial: auth.user && auth.user[propName].stripePaymentSettings.isTrial,
		isCompletedGettingStarted: auth.user?.status === enums.gettingStartedStatuses.completedGettingStarted,
	};
};

export default connect(mapStateToProps)(memo(AddRetailCompany));
