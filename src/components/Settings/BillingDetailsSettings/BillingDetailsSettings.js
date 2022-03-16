import React, { memo, useEffect, useState } from 'react';
import { array, arrayOf, bool, func, number, object, shape, string } from 'prop-types';
import { connect } from 'react-redux';
import schema from './schema';
import { getCountries } from '@ducks/common/actions';
import { getAllCardsInfo } from '@ducks/auth/actions';
import { updateBillingDetails, getPaymentPlans } from '@ducks/settings/actions';
import enums from '@constants/enums';
import { userType } from '@constants/types';
import BillingDetails from '@components/Auth/GettingStarted/BillingDetails';
import { format } from 'date-fns';
import { getItemFromStorage } from '@utils/storage';
import { isEmpty } from '@utils/js-helpers';

const { userRoles } = enums;

const BillingDetailsHOC = ({
	cardsInfo,
	city,
	client,
	companyLegalName,
	countries,
	countryId,
	customerId,
	getAllCardsInfo,
	getCountries,
	getPaymentPlans,
	isLoading,
	paymentPlan,
	paymentPlans,
	role,
	updateBillingDetails,
	defaultPaymentMethodId,
	nextPaymentDate,
	address,
	postZipCode,
	vatNumber,
	user,
}) => {
	const [isEditPaymentPlanModal, setIsEditPaymentPlanModal] = useState(false);
	const [paymentPlanId, setPaymentPlanId] = useState(paymentPlan?.id);
	const [activePaymentPlan, setActivePaymentPlan] = useState({ uiName: paymentPlan?.uiName, id: paymentPlan?.id });

	const isRetailer = role !== userRoles.admin && role !== userRoles.startup;

	const formattedNextPaymentDate = nextPaymentDate && format(new Date(nextPaymentDate), 'MMM dd, yyyy');

	useEffect(() => {
		if (isEmpty(countries)) getCountries();
		if (isEmpty(paymentPlans)) getPaymentPlans();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (isEmpty(paymentPlans) || !paymentPlanId) return;

		const currentPlan = paymentPlans.find(item => item.id === paymentPlanId);

		setActivePaymentPlan({ uiName: currentPlan?.uiName, id: currentPlan?.id });
	}, [paymentPlanId, paymentPlans]);

	useEffect(() => {
		if (customerId) getAllCardsInfo(customerId);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const onSubmit = values => {
		if (isEditPaymentPlanModal) return;

		const chosenPaymentPlan = paymentPlans.find(item => item.id === paymentPlanId);

		updateBillingDetails({
			...values,
			countryId: values?.countryId.id,
			vatNumber: values.vatNumber || null,
			postZipCode: values.postZipCode || null,
			discountCode: chosenPaymentPlan?.discountCode,
			enterpriseCode: chosenPaymentPlan?.enterpriseCode,
			paymentPlanId,
		});
	};

	return (
		<div>
			<BillingDetails
				schema={schema}
				onSubmit={onSubmit}
				isEditPaymentPlanModal={isEditPaymentPlanModal}
				setIsEditPaymentPlanModal={setIsEditPaymentPlanModal}
				companyLegalName={companyLegalName}
				city={city}
				countries={countries}
				isLoading={isLoading}
				countryId={countryId}
				role={role}
				paymentPlanId={paymentPlanId}
				client={client}
				setPaymentPlanId={setPaymentPlanId}
				cardsInfo={cardsInfo}
				defaultPaymentMethodId={defaultPaymentMethodId}
				activePaymentPlan={activePaymentPlan}
				isRetailer={isRetailer}
				formattedNextPaymentDate={formattedNextPaymentDate}
				address={address}
				postZipCode={postZipCode}
				vatNumber={vatNumber}
				isResetButton
				user={user}
			/>
		</div>
	);
};

BillingDetailsHOC.propTypes = {
	cardsInfo: arrayOf(shape({
		brand: string,
		last4: string,
		paymentMethodId: string,
	})),
	city: string,
	client: object,
	companyLegalName: string,
	countries: array,
	countryId: number,
	customerId: string,
	getAllCardsInfo: func.isRequired,
	getCountries: func.isRequired,
	getPaymentPlans: func,
	isCompanyInfo: bool,
	isLoading: bool,
	paymentPlan: object,
	paymentPlans: array,
	role: string,
	sendBillingInfo: func,
	status: string,
	defaultPaymentMethodId: string,
	nextPaymentDate: number,
	user: userType,
	stepText: string,
	address: string.isRequired,
	postZipCode: string,
	vatNumber: string,
	updateBillingDetails: func.isRequired,
};

const mapStateToProps = ({
	auth: {
		cardsInfo,
		defaultPaymentMethodId,
		user,
	},
	common: {
		countries,
		paymentPlans,
		isLoading: isLoadingCommon,
	},
	settings: {
		isLoading,
	},
}) => {
	const localUser = getItemFromStorage('user');
	const {
		retailer,
		role,
		startup,
		status,
		city,
		country,
	} = user || localUser;
	const client = retailer || startup;

	return {
		cardsInfo,
		city,
		client,
		companyLegalName: client.companyLegalName,
		address: client.address,
		postZipCode: client.postZipCode,
		vatNumber: client.vatNumber,
		countries,
		countryId: country?.id,
		customerId: client.customerId,
		isLoading: isLoading || isLoadingCommon,
		paymentPlan: client.paymentPlan,
		paymentPlans,
		role,
		status,
		defaultPaymentMethodId,
		nextPaymentDate: client?.stripePaymentSettings?.nextPaymentDate,
		user: user || localUser,
	};
};

export default connect(mapStateToProps, {
	getAllCardsInfo,
	getCountries,
	getPaymentPlans,
	updateBillingDetails,
})(memo(BillingDetailsHOC));
