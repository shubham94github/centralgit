import React, { useMemo } from 'react';
import { array, func } from 'prop-types';
import MainTable from '@components/_shared/MainTable';
import { generateColumns } from './utils';

import './PricesTable.scss';

const PricesTable = ({ handleEdit, handleDelete, prices }) => {
	const columns = useMemo(
		() => generateColumns({ handleEdit, handleDelete }),
		[handleDelete, handleEdit]);

	return (
		<div className='prices-table'>
			<MainTable
				columns={columns}
				data={prices}
				withPagination={false}
				sortServer={false}
			/>
		</div>
	);
};

PricesTable.propTypes = {
	handleEdit: func.isRequired,
	handleDelete: func.isRequired,
	prices: array,
};

export default PricesTable;
