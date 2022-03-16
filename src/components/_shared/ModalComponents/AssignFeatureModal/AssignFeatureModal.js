import React, { memo, useState } from 'react';
import { arrayOf, func, shape, string } from 'prop-types';
import { featureType } from '@constants/types';
import { getColumns } from '@components/_shared/ModalComponents/AssignFeatureModal/columns';
import MainTable from '@components/_shared/MainTable';
import PrimaryButton from '@components/_shared/buttons/PrimaryButton';
import GridContainer from '@components/layouts/GridContainer';

import './AssignFeatureModal.scss';

const AssignFeatureModal = ({
	assignType,
	features,
	onClose,
	editFeature,
}) => {
	const [tableData, setTableData] = useState(features);

	const handleChangeTableData = (id, checked) => setTableData(prevTableData => prevTableData.map(item => {
		if (item.id === id) {
			return {
				...item,
				[assignType.property]: checked,
			};
		}

		return item;
	}));

	const columns = getColumns({
		assignType,
		handleChangeTableData,
	});

	const handleSave = () => {
		const featuresData = tableData.reduce((acc, item, index) => {
			if (item[assignType.property] !== features[index][assignType.property]) acc.push(item);

			return acc;
		}, []);

		editFeature({
			featuresData,
			onClose,
		});
	};

	return (
		<div className='assign-feature-modal'>
			<MainTable
				columns={columns}
				data={tableData}
				selectableRows={false}
				withPagination={false}
				withFilters={false}
			/>
			<GridContainer
				customClassName='custom-line'
				columns={2}
			>
				<PrimaryButton
					text='Cancel'
					isOutline={true}
					isDarkTheme={false}
					onClick={onClose}
					isFullWidth={true}
				/>
				<PrimaryButton
					text='Update'
					isDarkTheme={false}
					onClick={handleSave}
					isFullWidth={true}
				/>
			</GridContainer>
		</div>
	);
};

AssignFeatureModal.propTypes = {
	assignType: shape({
		property: string,
		label: string,
	}),
	features: arrayOf(featureType),
	onClose: func.isRequired,
	editFeature: func.isRequired,
};

export default memo(AssignFeatureModal);
