import React, { memo, useState } from 'react';
import { connect } from 'react-redux';
import { Col, Row } from 'react-bootstrap';
import { P14 } from '@components/_shared/text';
import { colors } from '@colors';
import { bool, func, number, string } from 'prop-types';
import AppModal from '@components/Common/AppModal';
import InternalInfoForm from './InternalInfoForm';
import { updateAdminNoteProfile } from '@ducks/admin/actions';
import Confirm from '@components/_shared/ModalComponents/Confirm';
import GridContainer from '@components/layouts/GridContainer';
import GalleryInternalInfoHOC from '@components/AdminPanel/ProfileSection/InternalInfo/GalleryInternalInfo';
import { Icons } from '@icons';

import './InternalInfo.scss';

const InternalInfo = ({
	adminNote,
	startupId,
	updateAdminNoteProfile,
	isStartupsEditInternalPermission,
}) => {
	const [isEditInternalInfo, setIsEditInternalInfo] = useState(false);
	const [isShowConfirm, setIsShowConfirm] = useState(false);
	const confirmMessage = 'Are you sure you want to delete this note?';

	const editInternalInfoToggle = () => setIsEditInternalInfo(prevState => !prevState);

	const toggleConfirm = () => setIsShowConfirm(prevState => !prevState);

	const removeHandler = () => {
		updateAdminNoteProfile({ data: { adminNote: '' }, id: startupId });
		toggleConfirm();
	};

	return (
		<>
			{
				isEditInternalInfo
					&& <AppModal
						component={InternalInfoForm}
						className='internal-info-pop-up'
						onClose={editInternalInfoToggle}
						title='Admin Notes'
						outerProps={{
							onClose: editInternalInfoToggle,
						}}
					/>
			}
			{
				isShowConfirm
					&& <AppModal
						className='confirm-pop-up'
						onClose={toggleConfirm}
						title={confirmMessage}
						outerProps={{
							successConfirm: removeHandler,
							onClose: toggleConfirm,
						}}
						component={Confirm}
					/>
			}
			<Row className='internal-info-container'>
				<Col xs={12} sm={8}>
					<P14
						className='d-flex justify-content-between align-items-center edit-icon-container'
						bold
					>
						Admin Notes
						{isStartupsEditInternalPermission
							&& <span
								onClick={editInternalInfoToggle}
								className='clickable edit-icon'
							>
								{Icons.editIcon(colors.darkblue70)}
							</span>
						}
						{
							!!adminNote?.length
								&& <span
									onClick={toggleConfirm}
									className='clickable remove-icon'
								>
									{Icons.removeIcon(colors.darkblue70)}
								</span>
						}
					</P14>
					{
						adminNote
							&& <P14 className='word-wrap'>
								{adminNote}
							</P14>
					}
				</Col>
			</Row>
			<GridContainer>
				<GalleryInternalInfoHOC/>
			</GridContainer>
		</>
	);
};

InternalInfo.propTypes={
	adminNote: string,
	startupId: number.isRequired,
	updateAdminNoteProfile: func.isRequired,
	isStartupsEditInternalPermission: bool,
};

InternalInfo.defaultProps={
	adminNote: '',
};

export default connect(({ admin, auth }) => {
	const { listOfPermissions } = auth;

	const {
		profile: {
			startup: {
				adminNote,
				id: startupId,
			},
		},
	} = admin;

	return {
		adminNote,
		startupId,
		isStartupsEditInternalPermission: listOfPermissions?.isStartupsEditInternalPermission,
	};
}, {
	updateAdminNoteProfile,
})(memo(InternalInfo));

