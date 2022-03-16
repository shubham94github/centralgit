import React from 'react';
import { bool, func, number, oneOfType, shape, string } from 'prop-types';
import PriceForm from '@components/AdminPanel/SubscriptionPlans/Prices/PriceForm';

const EditPrice = ({
	price,
	updatePrice,
	cancel,
	isLoading,
}) => {
	return (
		<div className='edit-price'>
			<PriceForm
				isLoading={isLoading}
				unitAmount={price.unitAmount}
				name={price.name}
				submitButtonText='Update'
				onSubmit={updatePrice}
				comment={price.comment}
				onCancel={cancel}
				id={price.id}
				usingCount={price.usingCount}
			/>
		</div>
	);
};

EditPrice.propTypes = {
	price: shape({
		unitAmount: oneOfType([string, number]),
		name: string,
		comment: string,
	}),
	updatePrice: func.isRequired,
	cancel: func.isRequired,
	isLoading: bool,
};

export default EditPrice;
