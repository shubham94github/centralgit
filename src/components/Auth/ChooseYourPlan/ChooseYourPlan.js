import React, { memo, useEffect, useState } from 'react';
import { arrayOf, bool, func, number, string } from 'prop-types';
import cn from 'classnames';
import FormWrapper from '@components/_shared/form/FormWrapper';
import PrimaryButton from '@components/_shared/buttons/PrimaryButton';
import { connect } from 'react-redux';
import {
	savePaymentPlan,
	sendBillingInfo,
	sendDiscountCode,
	sendEnterpriseCode,
} from '@ducks/auth/actions';
import { columns, featurePoints } from './constants';
import {
	removeItemFromSessionStorage,
	setItemToSessionStorage,
} from '@utils/sessionStorage';
import { useHistory, useLocation } from 'react-router-dom';
import { Routes } from '@routes';
import { P16 } from '@components/_shared/text';
import { redirectToCorrectPageByStatus } from '@components/Auth/utils';
import { featureType, paymentPlanType, userType } from '@constants/types';
import enums from '@constants/enums';
import { getItemFromLocalStorage } from '@utils/localStorage';
import { Icons } from '@icons';
import { getItemFromStorage } from '@utils/storage';
import { isEmpty } from '@utils/js-helpers';
import GridContainer from '@components/layouts/GridContainer';
import PlanCard from '@components/Auth/ChooseYourPlan/PlanCard';
import { sendDiscount, sendEnterprise, getPaymentPlans } from '@ducks/settings/actions';
import { updatePaymentPlanForUnpaidUser, getPaymentPlans as getCommonPaymentPlans } from '@ducks/common/actions';

import './ChooseYourPlan.scss';

const enterpriseType = 'ENTERPRISE';
const checkedIcon = Icons.checked();

const ChooseYourPlan = ({
	getPaymentPlans,
	paymentPlans,
	savePaymentPlan,
	sendBillingInfo,
	isLoading,
	countryId,
	address,
	city,
	companyLegalName,
	postZipCode,
	taxId,
	title,
	isModal,
	setPaymentPlanId,
	closeModal,
	submitButtonText,
	withCancelButton,
	activePaymentPlan,
	user,
	plansFeatures,
	sendDiscountCode,
	sendEnterpriseCode,
	sendDiscount,
	sendEnterprise,
	updatePaymentPlanForUnpaidUser,
	rememberMe,
	getCommonPaymentPlans,
}) => {
	const [selectedPlanId, setSelectedPlanId] = useState();
	const [planIdIsChanged, setPlanIdIsChanged] = useState(false);

	const location = useLocation();
	const history = useHistory();

	const isRetailer = !!user?.retailer;
	const isChangeSubscription = location.pathname === Routes.SUBSCRIPTION.CHANGE_PLAN;
	const isUnpaidUser = (isRetailer
		? !!user?.retailer?.stripePaymentSettings
		: !!user?.member?.stripePaymentSettings)
		&& !user?.retailer?.stripePaymentSettings?.isSubscriptionPaid
		&& !user?.retailer?.stripePaymentSettings?.isTrial;

	useEffect(() => {
		if (isEmpty(paymentPlans) && !isModal) {
			const token = user?.token ? user?.token : getItemFromStorage('resendVerificationToken', rememberMe);

			if (user?.status === enums.registrationStatuses.accountRegistration && !!token)
				getCommonPaymentPlans({ token });
			else getPaymentPlans();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (activePaymentPlan)
			setSelectedPlanId(activePaymentPlan.id);

		if (isUnpaidUser && !activePaymentPlan && user?.retailer?.paymentPlan?.id)
			setSelectedPlanId(user?.retailer?.paymentPlan?.id);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const handleUpdatePaymentPlanFromModal = () => {
		setPaymentPlanId(selectedPlanId);

		if (!isLoading) closeModal();
	};

	const onSubmit = () => {
		if (!isChangeSubscription) {
			removeItemFromSessionStorage('paymentPlan');
			setItemToSessionStorage('paymentPlan', selectedPlanId);
			const chosenPlan = paymentPlans.find(paymentPlan => paymentPlan.id === selectedPlanId);

			savePaymentPlan({
				enterpriseCode: chosenPlan?.enterpriseCode || null,
				discountCode: chosenPlan?.discountCode || null,
				paymentPlanId: selectedPlanId,
				token: getItemFromLocalStorage('resendVerificationToken') || user?.token,
			});
		} else {
			sendBillingInfo({
				countryId,
				address,
				city,
				companyLegalName,
				postZipCode,
				taxId,
				paymentPlanId: selectedPlanId,
			}, true);
		}
	};

	const setPlanForUnpaidUser = () => {
		updatePaymentPlanForUnpaidUser(selectedPlanId);

		if (closeModal) closeModal();
	};

	const submitMethod = isModal && !isUnpaidUser
		? handleUpdatePaymentPlanFromModal
		: isUnpaidUser
			? setPlanForUnpaidUser
			: onSubmit;

	if (!!user
		&& user.status !== enums.registrationStatuses.accountRegistration
		&& user.status !== enums.gettingStartedStatuses.companyInfo
		&& !isModal
		&& user.status !== enums.gettingStartedStatuses.completedGettingStarted
		&& (!!user?.retailer?.stripePaymentSettings?.paymentPlanId
			&& !user?.retailer?.stripePaymentSettings?.isSubscriptionPaid)
	) return redirectToCorrectPageByStatus(user);

	const cancelPlanChoosing = () => history.push(Routes.SUBSCRIPTION.UPDATE_CARD);

	const handleCancel = () => closeModal ? closeModal() : cancelPlanChoosing();

	const classNames = cn('choose-your-plan', {
		'unpaid': isUnpaidUser,
	});

	const handleSelectedPlanId = planId => {
		setSelectedPlanId(planId);

		if (planId !== activePaymentPlan?.id) setPlanIdIsChanged(true);
		else setPlanIdIsChanged(false);
	};

	return (
		<FormWrapper className={classNames}>
			<GridContainer customClassName='form-header'>
				<P16 className='title' bold>
					{!isModal && title}
				</P16>
			</GridContainer>
			<div className='plans'>
				<GridContainer
					columns={3}
					gap='10px 20px'
				>
					{columns.map((column, index) => {
						const isEnterprise = column.type === enterpriseType;
						const plans = paymentPlans.filter(paymentPlan => paymentPlan.planType === column.type);
						const features = plansFeatures.filter(plansFeature => plansFeature[column.featureType]);

						return (
							<PlanCard
								key={`${column.type}-${index}`}
								column={column}
								plans={plans}
								selectedPlanId={selectedPlanId}
								setSelectedPlanId={handleSelectedPlanId}
								features={features}
								sendDiscountCode={isEnterprise ? sendEnterpriseCode : sendDiscountCode}
								sendDiscount={isEnterprise ? sendEnterprise : sendDiscount}
								userToken={user?.token}
								isModal={isModal}
							/>
						);
					})}
				</GridContainer>
				{!isUnpaidUser
					&& <div className='points'>
						{featurePoints.map((featurePoint, i) => (
							<div className='points-item' key={i}>
								{checkedIcon}
								<span className='points-text'>{featurePoint}</span>
							</div>
						))}
					</div>
				}
			</div>
			{isUnpaidUser
				&& <GridContainer>
					<div className='points'>
						{featurePoints.map((featurePoint, i) => (
							<div className='points-item' key={i}>
								{checkedIcon}
								<span className='points-text'>{featurePoint}</span>
							</div>
						))}
					</div>
				</GridContainer>
			}
			<div className='buttons centered'>
				{(withCancelButton || isUnpaidUser)
					&& <PrimaryButton
						text='Cancel'
						isOutline
						onClick={handleCancel}
						isFullWidth
						className='pe-3'
					/>
				}
				<PrimaryButton
					onClick={submitMethod}
					isDarkTheme={false}
					text={submitButtonText}
					isLoading={isLoading}
					disabled={!selectedPlanId || (isUnpaidUser && !planIdIsChanged)}
				/>
			</div>
		</FormWrapper>
	);
};

ChooseYourPlan.propTypes = {
	paymentPlans: arrayOf(paymentPlanType),
	getPaymentPlans: func.isRequired,
	paymentPlanToken: string,
	savePaymentPlan: func.isRequired,
	sendBillingInfo: func.isRequired,
	isLoading: bool,
	countryId: number,
	address: string,
	city: string,
	companyLegalName: string,
	postZipCode: string,
	taxId: string,
	title: string.isRequired,
	isModal: bool,
	setPaymentPlanId: func,
	closeModal: func,
	submitButtonText: string,
	withCancelButton: bool,
	activePaymentPlan: paymentPlanType,
	user: userType,
	plansFeatures: arrayOf(featureType),
	sendDiscountCode: func.isRequired,
	sendEnterpriseCode: func.isRequired,
	updatePaymentPlanForUnpaidUser: func,
	sendDiscount: func.isRequired,
	sendEnterprise: func.isRequired,
	rememberMe: bool,
	getCommonPaymentPlans: func,
};

ChooseYourPlan.defaultProps = {
	title: 'Choose your plan',
	submitButtonText: 'Continue',
	withCancelButton: false,
};

const mapStateToProps = ({ common: { paymentPlans, plansFeatures }, auth }) => {
	const user = auth.user || getItemFromStorage('user');
	const {
		retailer: {
			country: { id: countryId } = {},
			address,
			city,
			companyLegalName,
			postZipCode,
			taxId,
		} = {},
	} = user || {};

	return {
		paymentPlans,
		isLoading: auth.isLoading,
		countryId,
		address,
		city,
		companyLegalName,
		postZipCode,
		taxId,
		user,
		plansFeatures,
		rememberMe: auth.rememberMe,
	};
};

export default connect(mapStateToProps, {
	getPaymentPlans,
	savePaymentPlan,
	sendBillingInfo,
	sendDiscountCode,
	sendEnterpriseCode,
	updatePaymentPlanForUnpaidUser,
	sendDiscount,
	sendEnterprise,
	getCommonPaymentPlans,
})(memo(ChooseYourPlan));
