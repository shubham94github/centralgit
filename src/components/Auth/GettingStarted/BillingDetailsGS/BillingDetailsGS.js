import React, { memo, useEffect, useState } from 'react';
import { array, arrayOf, bool, func, number, object, shape, string } from 'prop-types';
import { connect } from 'react-redux';
import schema from './schema';
import { getCountries } from '@ducks/common/actions';
import { getPaymentPlans } from '@ducks/settings/actions';
import { getAllCardsInfo, sendBillingInfo } from '@ducks/auth/actions';
import { redirectToCorrectPageByStatus } from '@components/Auth/utils';
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
	sendBillingInfo,
	status,
	defaultPaymentMethodId,
	nextPaymentDate,
	trial,
	user,
}) => {
	const [isEditPaymentPlanModal, setIsEditPaymentPlanModal] = useState(false);
	const [paymentPlanId, setPaymentPlanId] = useState(paymentPlan.id);
	const activePaymentPlan = { uiName: paymentPlan.uiName, id: paymentPlan.id };
	const isRetailer = role !== userRoles.admin && role !== userRoles.startup;
	const oneDayMs = 24 * 60 * 60 * 1000;
	const nextPaymentDateTrial = new Date().getTime() + oneDayMs * trial;

	const formattedNextPaymentDate = nextPaymentDate
		? format(new Date(nextPaymentDate), 'MMM dd, yyyy')
		: trial
			? format(new Date(nextPaymentDateTrial), 'MMM dd, yyyy')
			: null;

	useEffect(() => {
		if (isEmpty(countries)) getCountries();
		if (isEmpty(paymentPlans)) getPaymentPlans();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (customerId) getAllCardsInfo(customerId);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const onSubmit = values => {
		if (isEditPaymentPlanModal) return;

		sendBillingInfo({
			...values,
			countryId: values.countryId.id,
			vatNumber: values.vatNumber || null,
			postZipCode: values.postZipCode || null,
			paymentPlanId,
		}, true);
	};

	if (!!user && status !== enums.gettingStartedStatuses.companyInfo)
		return redirectToCorrectPageByStatus(user);

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
				stepText={isRetailer ? 'Step 3 of 3' : 'Step 3 of 5'}
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
	trial: number,
};

const mapStateToProps = ({
	auth: {
		cardsInfo,
		companyInfo,
		isLoading,
		defaultPaymentMethodId,
		user,
	},
	common: {
		countries,
		paymentPlans,
		isLoading: isLoadingCommon,
	},
}) => {
	const localUser = getItemFromStorage('user');
	const {
		retailer,
		role,
		startup,
		status,
	} = user || localUser;
	const client = retailer || startup;

	return {
		cardsInfo,
		city: user?.city,
		client,
		companyLegalName: companyInfo?.companyLegalName,
		countries,
		countryId: user?.countryId,
		customerId: client?.customerId,
		isLoading: isLoading || isLoadingCommon,
		paymentPlan: client.paymentPlan,
		paymentPlans,
		role,
		status,
		defaultPaymentMethodId,
		nextPaymentDate: client?.stripePaymentSettings?.nextPaymentDate,
		trial: client?.paymentPlan?.trial,
		user: user || localUser,
	};
};

export default connect(mapStateToProps, {
	getAllCardsInfo,
	getCountries,
	getPaymentPlans,
	sendBillingInfo,
})(memo(BillingDetailsHOC));
