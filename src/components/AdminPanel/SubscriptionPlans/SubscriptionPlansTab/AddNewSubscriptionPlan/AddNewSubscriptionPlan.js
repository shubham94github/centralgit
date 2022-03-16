import React, { memo } from 'react';
import { array, arrayOf, bool, func, string } from 'prop-types';
import SubscriptionPlanForm from '@components/AdminPanel/SubscriptionPlans/SubscriptionPlansTab/SubscriptionPlanForm';
import { memberGroupType, priceType } from '@constants/types';

const AddNewSubscriptionPlan = ({
	saveNewSubscriptionPlan,
	cancel,
	isLoading,
	paymentPlanTypes,
	prices,
	memberGroups,
	paymentPlans,
	onClose,
}) => (
	<div className='add-new-price'>
		<SubscriptionPlanForm
			onCancel={cancel}
			onSubmit={saveNewSubscriptionPlan}
			submitButtonText='Add'
			isLoading={isLoading}
			paymentPlanTypes={paymentPlanTypes}
			prices={prices}
			memberGroups={memberGroups}
			paymentPlans={paymentPlans}
			onClose={onClose}
		/>
	</div>
);

AddNewSubscriptionPlan.propTypes = {
	saveNewSubscriptionPlan: func.isRequired,
	cancel: func.isRequired,
	isLoading: bool,
	paymentPlanTypes: arrayOf(string),
	prices: arrayOf(priceType),
	memberGroups: arrayOf(memberGroupType),
	paymentPlans: array,
	onClose: func,
};

export default memo(AddNewSubscriptionPlan);
