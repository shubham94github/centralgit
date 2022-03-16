import React from 'react';
import DataTable from 'react-data-table-component';
import { userTypesAndPlansAssociationColumns, userTypesAndPlansAssociationData } from './constants';

const UserTypesAndPlansAssociationTable = () => (
	<div className='main-table plans-association-table'>
		<DataTable
			noHeader
			withFilters={false}
			withPagination={false}
			columns={userTypesAndPlansAssociationColumns}
			data={userTypesAndPlansAssociationData}
		/>
	</div>
);

export default UserTypesAndPlansAssociationTable;
