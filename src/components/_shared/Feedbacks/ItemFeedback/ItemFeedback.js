import React, { memo, useCallback } from 'react';
import { bool, number, string, shape, object, func } from 'prop-types';
import { Col } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import Avatar from '@components/_shared/Avatar';
import { P12 } from '@components/_shared/text';
import { colors } from '@colors';
import RatingStars from '@components/_shared/RatingStars';
import Tooltip from '@components/_shared/Tooltip';
import { fullDateFormatting } from '@utils/date';
import { Icons } from '@icons';
import GridContainer from '@components/layouts/GridContainer';

import './ItemFeedback.scss';

const messageIcon = Icons.messageIcon(colors.darkblue70);

const ItemFeedback = ({
	feedback,
	editModeHandler,
	setSelectedRemove,
	toggleConfirm,
	isAdmin,
	setIdEditFeedback,
	isStartupsEditFeedbacksPermission,
}) => {
	const {
		id,
		companyAvatar,
		author,
		isMy,
		text,
		rate,
		createdAt,
		isContact,
	} = feedback;

	const isEditableFeedback = isMy || (isAdmin && isStartupsEditFeedbacksPermission);
	const history = useHistory();

	const onClickProfileRetailer = () => {
		if (!isAdmin) history.push(`/profile/retailer/${author.id}`);
	};

	const editHandler = () => {
		setIdEditFeedback(id);
		editModeHandler(isEditableFeedback);
	};
	const removeHandler = () => {
		setSelectedRemove(id);
		toggleConfirm();
	};

	const getCreatedAt = useCallback(date => fullDateFormatting(date), []);

	return (
		<GridContainer
			customClassName='feedback-row'
			template='192px 685px 50px'
		>
			<div className='logo-container'>
				<div
					onClick={onClickProfileRetailer}
					className='img-feedbacks-wrapper'
				>
					<Avatar
						logo={companyAvatar}
						className='feedback-avatar'
					/>
				</div>
				<P12 className='word-wrap ps-3'>
					<span
						onClick={onClickProfileRetailer}
						className='name clickable'
					>
						{author.firstName}
					</span>
					<br/>
					<span className='short-name truncate-text'>{author.companyShortName}</span>
					{author?.department && <span className='truncate-text'>{author.department.name}</span>}
					<span className='truncate-text'>{author.position?.name}</span>
				</P12>
			</div>
			{isEditableFeedback
				&& <Col
					xs={1}
					className='d-flex d-sm-none justify-content-end align-items-end'
				>
					<span
						onClick={editHandler}
						className='me-3 clickable'
					>
						{Icons.editIcon(colors.darkblue70)}
					</span>
					<span
						onClick={removeHandler}
						className='clickable'
					>
						{Icons.removeIcon(colors.darkblue70)}
					</span>
				</Col>
			}
			<div>
				<P12 className='word-wrap'>
					{text}
				</P12>
				<div className='d-flex align-items-end pt-2'>
					<RatingStars rate={rate}/>
					<P12 className='ps-3'>
						{createdAt && getCreatedAt(createdAt)}
					</P12>
					{isContact
						&& <Tooltip
							placement='top'
							message={
								<P12>
									Met on retailHub
								</P12>
							}
						>
							<span className='px-2 mt-2 d-inline-block'>{messageIcon}</span>
						</Tooltip>
					}
				</div>
			</div>
			{isEditableFeedback
				&& <Col
					className='d-none d-sm-flex justify-content-start'>
					<span
						onClick={editHandler}
						className='me-3 clickable'
					>
						{Icons.editIcon(colors.darkblue70)}
					</span>
					<span
						onClick={removeHandler}
						className='clickable'
					>
						{Icons.removeIcon(colors.darkblue70)}
					</span>
				</Col>
			}
		</GridContainer>
	);
};

ItemFeedback.propTypes = {
	feedback: shape({
		id: number,
		companyAvatar: object,
		author: object,
		isMy: bool,
		text: string,
		rate: number,
		createdAt: number,
		isContact: bool,
	}),
	editModeHandler: func.isRequired,
	setSelectedRemove: func.isRequired,
	toggleConfirm: func.isRequired,
	setIdEditFeedback: func.isRequired,
	isAdmin: bool,
	isStartupsEditFeedbacksPermission: bool,
};

export default memo(ItemFeedback);
