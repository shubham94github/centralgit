import React, { memo, useEffect, useState } from 'react';
import { P14, S16 } from '@components/_shared/text';
import GridContainer from '@components/layouts/GridContainer';
import { Icons } from '@icons';
import { colors } from '@colors';
import EnterpriseTable from '@components/AdminPanel/SubscriptionPlans/Enterprise/EnterpriseTable';
import { enterpriseType } from '@constants/types';
import { arrayOf, bool, func } from 'prop-types';
import { connect } from 'react-redux';
import {
	getEnterpriseCodes,
	editEnterpriseCode,
} from '@ducks/admin/actions';
import { isEmpty } from '@utils/js-helpers';
import AppModal from '@components/Common/AppModal';
import EditEnterpriseCode from '@components/AdminPanel/SubscriptionPlans/Enterprise/EditEnterpriseCode';
import LoadingOverlay from '@components/_shared/LoadingOverlay';
import { guidelinesText } from './constants';

import './Enterprise.scss';

const infoIcon = Icons.infoIcon(colors.grass50);
const editEnterpriseTitle = 'Edit Enterprise Code';
const submitButtonText = 'Update';

const Enterprise = ({
	enterpriseCodes,
	getEnterpriseCodes,
	editEnterpriseCode,
	isLoading,
}) => {
	const [editableCode, setEditableCode] = useState(false);

	useEffect(() => {
		if (isEmpty(enterpriseCodes)) getEnterpriseCodes();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const openEditEnterpriseCode = code => setEditableCode(code);
	const closeEditEnterpriseCode = () => setEditableCode(null);

	const handleEditEnterpriseCode = ({ id, enterpriseCode }) =>
		editEnterpriseCode({ id, enterpriseCode, onClose: closeEditEnterpriseCode });

	return (
		<div className='enterprise-plans'>
			<GridContainer>
				<S16 className='title' bold>Enterprise</S16>
			</GridContainer>
			<div className='guidelines'>
				{infoIcon}
				<P14>
					{guidelinesText}
				</P14>
			</div>
			<GridContainer>
				<EnterpriseTable enterpriseCodes={enterpriseCodes} handleEdit={openEditEnterpriseCode}/>
			</GridContainer>
			{editableCode
				&& <AppModal
					width='630px'
					title={editEnterpriseTitle}
					outerProps={{
						enterpriseCode: editableCode,
						updateCode: handleEditEnterpriseCode,
						submitButtonText,
						onClose: closeEditEnterpriseCode,
					}}
					component={EditEnterpriseCode}
					onClose={closeEditEnterpriseCode}
				/>
			}
			{isLoading && <LoadingOverlay/>}
		</div>
	);
};

Enterprise.propTypes = {
	enterpriseCodes: arrayOf(enterpriseType),
	getEnterpriseCodes: func.isRequired,
	editEnterpriseCode: func.isRequired,
	isLoading: bool,
};

const mapStateToProps = ({ admin: { enterpriseCodes, isLoading } }) => ({
	enterpriseCodes,
	isLoading,
});

export default connect(mapStateToProps, {
	getEnterpriseCodes,
	editEnterpriseCode,
})(memo(Enterprise));
