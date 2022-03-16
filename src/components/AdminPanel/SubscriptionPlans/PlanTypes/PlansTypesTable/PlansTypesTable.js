import React from 'react';
import DataTable from 'react-data-table-component';
import { subscriptionPlansColumns, subscriptionPlansData } from './constants';

const PlansTypesTable = () => (
	<div className='subscription-plans-types-table main-table'>
		<DataTable
			noHeader
			withFilters={false}
			withPagination={false}
			columns={subscriptionPlansColumns}
			data={subscriptionPlansData}
		/>
	</div>
);

export default PlansTypesTable;
