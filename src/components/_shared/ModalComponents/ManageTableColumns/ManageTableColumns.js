import React, { memo, useEffect, useState } from 'react';
import PrimaryButton from '@components/_shared/buttons/PrimaryButton';
import { array, func } from 'prop-types';
import Checkbox from '@components/_shared/form/Checkbox';

import './ManageTableColumns.scss';

const ManageTableColumns = ({
	columns,
	setSelected,
	onClose,
}) => {
	const [selectableColumns, setSelectableColumns] = useState([...columns]);
	const [isAllSelected, setIsAllSelected] = useState(false);

	useEffect(() => {
		setIsAllSelected(selectableColumns.filter(column => !column.omit).length === selectableColumns.length);
	}, [selectableColumns]);

	const selectAll = e => {
		const selectedColumns = selectableColumns.reduce((acc, column) => {
			acc.push({
				...column,
				omit: !column.disableOmit && !e.target.checked,
			});

			return acc;
		}, []);

		setSelectableColumns(selectedColumns);
	};

	const selectColumn = (checked, property) => {
		const selectedColumns = selectableColumns.map(column => {
			if (property === column.property) {
				return {
					...column,
					omit: !checked,
				};
			}

			return column;
		});

		setSelectableColumns(selectedColumns);
	};

	const onClick = () => {
		setSelected(selectableColumns);
		onClose();
	};

	return (
		<div className='manage-table-columns'>
			<ul className='columns-list'>
				<li>
					<Checkbox
						name='all'
						label='All'
						checked={isAllSelected}
						value={isAllSelected}
						onChange={selectAll}
					/>
				</li>
				{selectableColumns.map(({ name, property, omit, disableOmit }, i) => {
					const onChange = () => selectColumn(omit, property);
					const isSelectedAndDisabled = disableOmit || !omit;

					return (
						<li key={`${property}-${i}`}>
							<Checkbox
								name={property}
								label={name}
								checked={isSelectedAndDisabled}
								isSelectedAndDisabled={disableOmit}
								onChange={onChange}
							/>
						</li>
					);
				})}
			</ul>
			<div className='actions'>
				<PrimaryButton
					text='Apply'
					onClick={onClick}
				/>
			</div>
		</div>
	);
};

ManageTableColumns.propTypes = {
	onClose: func.isRequired,
	columns: array.isRequired,
	setSelected: func.isRequired,
};

ManageTableColumns.defaultProps = {
	onClose: () => {},
	columns: [],
	setSelected: () => {},
};

export default memo(ManageTableColumns);
