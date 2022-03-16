import React, { memo, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { arrayOf, bool, func } from 'prop-types';
import { createNewFeature, deleteFeature, editFeature, getFeatures } from '@ducks/admin/actions';
import { isEmpty } from '@utils/js-helpers';
import { getColumns } from './columns';
import MainTable from '@components/_shared/MainTable';
import AppModal from '@components/Common/AppModal';
import FeaturesHeader from '@components/AdminPanel/SubscriptionPlans/Features/FeaturesHeader';
import FeatureModal from '@components/_shared/ModalComponents/FeatureModal';
import { featureType } from '@constants/types';
import Confirm from '@components/_shared/ModalComponents/Confirm';
import AssignFeatureModal from '@components/_shared/ModalComponents/AssignFeatureModal';
import { assignFeatureModalTitle, confirmMessage } from '@components/AdminPanel/SubscriptionPlans/Features/constants';

import './Features.scss';

const Features = ({
	getFeatures,
	features,
	isLoading,
	createNewFeature,
	editFeature,
	deleteFeature,
}) => {
	const [isShowFeatureModal, setIsShowFeatureModal] = useState(false);
	const [isShowConfirm, setIsShowConfirm] = useState(false);
	const [selectedFeature, setSelectedFeature] = useState(null);
	const [selectedFeatureId, setSelectedFeatureId] = useState(null);
	const [assignType, setAssignType] = useState(null);
	const [isAssignFeatureModal, setIsAssignFeatureModal] = useState(false);
	const featureModalTitle = selectedFeature ? 'Edit Feature' : 'Add New Feature';
	const tableData = [ { isActions: true }, ...features ];

	useEffect(() => {
		if (isEmpty(features)) getFeatures();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const openFeaturesModal = () => setIsShowFeatureModal(true);

	const closeFeaturesModal = () => {
		setSelectedFeature(null);

		setIsShowFeatureModal(false);
	};

	const openConfirm = () => setIsShowConfirm(true);

	const closeConfirm = () => {
		setSelectedFeatureId(null);

		setIsShowConfirm(false);
	};

	const openAssignFeatureModal = () => setIsAssignFeatureModal(true);

	const closeAssignFeatureModal = () => {
		setAssignType(null);

		setIsAssignFeatureModal(false);
	};

	const featureProps = {
		selectedFeature,
		onClose: closeFeaturesModal,
		createNewFeature,
		editFeature,
	};

	const assignFeatureProps = {
		assignType,
		features,
		editFeature,
		onClose: closeAssignFeatureModal,
	};

	const columns = getColumns({
		setSelectedFeature,
		openFeaturesModal,
		setSelectedFeatureId,
		openConfirm,
		openAssignFeatureModal,
		setAssignType,
	});

	const handleDelete = () => {
		deleteFeature(selectedFeatureId);

		closeConfirm();
	};

	return (
		<div className='features-container'>
			<MainTable
				title='Features assigned to the plans'
				columns={columns}
				data={tableData}
				isLoading={isLoading}
				selectableRows={false}
				sortServer
				withPagination={false}
				withFilters={false}
				tableHeader={FeaturesHeader}
				toggleModal={openFeaturesModal}
			/>
			{isShowFeatureModal
				&& <AppModal
					component={FeatureModal}
					onClose={closeFeaturesModal}
					outerProps={featureProps}
					title={featureModalTitle}
					width='630px'
				/>
			}
			{isShowConfirm
				&& <AppModal
					className='confirm-pop-up'
					onClose={closeConfirm}
					title={confirmMessage}
					outerProps={{
						successConfirm: handleDelete,
						onClose: closeConfirm,
					}}
					component={Confirm}
				/>
			}
			{isAssignFeatureModal
				&& <AppModal
					component={AssignFeatureModal}
					onClose={closeAssignFeatureModal}
					outerProps={assignFeatureProps}
					title={assignFeatureModalTitle}
					width='630px'
				/>
			}
		</div>
	);
};

Features.propTypes = {
	features: arrayOf(featureType),
	getFeatures: func.isRequired,
	isLoading: bool,
	createNewFeature: func.isRequired,
	editFeature: func.isRequired,
	deleteFeature: func.isRequired,
};

export default connect(({ admin: { features, isLoading } }) => ({
	features,
	isLoading,
}), {
	getFeatures,
	createNewFeature,
	editFeature,
	deleteFeature,
})(memo(Features));
