import React, { memo } from 'react';
import { array, arrayOf, bool, func, string } from 'prop-types';
import SubscriptionPlanForm from '@components/AdminPanel/SubscriptionPlans/SubscriptionPlansTab/SubscriptionPlanForm';
import { memberGroupType, priceType, subscriptionPlanType } from '@constants/types';

const EditSubscriptionPlan = ({
	updateSubscriptionPlan,
	cancel,
	isLoading,
	paymentPlanTypes,
	prices,
	memberGroups,
	paymentPlans,
	plan,
	onClose,
}) => (
	<div className='edit-subscription-plan'>
		<SubscriptionPlanForm
			onCancel={cancel}
			onSubmit={updateSubscriptionPlan}
			submitButtonText='Edit'
			isLoading={isLoading}
			paymentPlanTypes={paymentPlanTypes}
			prices={prices}
			memberGroups={memberGroups}
			paymentPlans={paymentPlans}
			plan={plan}
			onClose={onClose}
		/>
	</div>
);

EditSubscriptionPlan.propTypes = {
	updateSubscriptionPlan: func.isRequired,
	cancel: func.isRequired,
	isLoading: bool,
	paymentPlanTypes: arrayOf(string),
	prices: arrayOf(priceType),
	memberGroups: arrayOf(memberGroupType),
	paymentPlans: array,
	plan: subscriptionPlanType,
	onClose: func,
};

export default memo(EditSubscriptionPlan);
