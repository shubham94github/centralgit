import React, { memo } from 'react';
import { arrayOf, func } from 'prop-types';
import { generateColumns } from './utils';
import MainTable from '@components/_shared/MainTable';
import { subscriptionPlanType } from '@constants/types';

const EnterpriseTable = ({
	handleEdit,
	enterpriseCodes,
}) => {
	const columns = generateColumns({ handleEdit });

	return (
		<div className='enterprise-table'>
			<MainTable
				columns={columns}
				data={enterpriseCodes}
				withPagination={false}
				sortServer={false}
			/>
		</div>
	);
};

EnterpriseTable.propTypes = {
	handleEdit: func,
	enterpriseCodes: arrayOf(subscriptionPlanType),
};

export default memo(EnterpriseTable);
