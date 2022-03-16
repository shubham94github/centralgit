import React, { useMemo } from 'react';
import { array, func } from 'prop-types';
import { generateColumns } from './utils';
import MainTable from '@components/_shared/MainTable';

const SubscriptionPlansTable = ({
	handleEdit,
	handleDelete,
	subscriptionPlans,
	handleChangePaymentPlanStatus,
}) => {
	const columns = useMemo(
		() => generateColumns({ handleEdit, handleDelete, handleChangePaymentPlanStatus }),
		[handleDelete, handleEdit, handleChangePaymentPlanStatus]);

	return (
		<div className='subscription-plans-table'>
			<MainTable
				columns={columns}
				data={subscriptionPlans}
				withPagination={false}
				sortServer={false}
			/>
		</div>
	);
};

SubscriptionPlansTable.propTypes = {
	handleEdit: func,
	handleDelete: func,
	subscriptionPlans: array,
	handleChangePaymentPlanStatus: func.isRequired,
};

export default SubscriptionPlansTable;
