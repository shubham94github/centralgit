import React from 'react';
import { bool, func } from 'prop-types';
import PriceForm from '@components/AdminPanel/SubscriptionPlans/Prices/PriceForm';

const AddNewPrice = ({
	saveNewPrice,
	cancel,
	isLoading,
}) => {
	return (
		<div className='add-new-price'>
			<PriceForm
				onCancel={cancel}
				onSubmit={saveNewPrice}
				submitButtonText='Add'
				isLoading={isLoading}
			/>
		</div>
	);
};

AddNewPrice.propTypes = {
	saveNewPrice: func,
	cancel: func,
	isLoading: bool,
};

export default AddNewPrice;
