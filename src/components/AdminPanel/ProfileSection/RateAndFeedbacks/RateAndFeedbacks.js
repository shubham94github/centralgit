import React, { memo } from 'react';
import { connect } from 'react-redux';
import { array, bool, func, number } from 'prop-types';
import { getFeedbacks, removeFeedback, updateFeedback } from '@ducks/admin/actions';
import Feedbacks from '@components/_shared/Feedbacks';

const RateAndFeedbacks = ({
	idStartup,
	getFeedbacks,
	feedbacks,
	isLoadingFeedbacks,
	countOfRecords,
	rateStars,
	rateCount,
	updateFeedback,
	removeFeedback,
	countOfRecordsAllFeedbacks,
	isStartupsEditFeedbacksPermission,
}) => {
	return (
		<div className='rate-and-feedbacks-wrapper'>
			<Feedbacks
				idProfile={idStartup.toString()}
				feedbacks={feedbacks}
				countOfRecords={countOfRecords}
				isLoadingFeedbacks={isLoadingFeedbacks}
				isExistsFeedback={true}
				rateStars={rateStars}
				rateCount={rateCount}
				getFeedbacksInfo={getFeedbacks}
				createFeedback={updateFeedback}
				removeFeedback={removeFeedback}
				isAdmin={true}
				countAllFeedbacks={countOfRecordsAllFeedbacks}
				isStartupsEditFeedbacksPermission={isStartupsEditFeedbacksPermission}
			/>
		</div>
	);
};

RateAndFeedbacks.propTypes = {
	idStartup: number.isRequired,
	getFeedbacks: func.isRequired,
	feedbacks: array.isRequired,
	isLoadingFeedbacks: bool.isRequired,
	countOfRecords: number,
	countOfRecordsAllFeedbacks: number,
	rateStars: number,
	rateCount: number,
	updateFeedback: func,
	removeFeedback: func,
	isStartupsEditFeedbacksPermission: bool,
};

RateAndFeedbacks.defaultProps = {
	countOfRecords: 0,
	countOfRecordsAllFeedbacks: 0,
	rateStars: 0,
	rateCount: 0,
};

export default connect(({ admin, auth }) => {
	const { listOfPermissions } = auth;

	const {
		profile: {
			startup: {
				id: idStartup,
			},
		},
		feedbacks,
		isLoadingFeedbacks,
		countOfRecords,
		countOfRecordsAllFeedbacks,
		rateStars,
		rateCount,
	} = admin;

	return {
		idStartup,
		feedbacks,
		isLoadingFeedbacks,
		countOfRecords,
		rateStars,
		rateCount,
		countOfRecordsAllFeedbacks,
		isStartupsEditFeedbacksPermission: listOfPermissions?.isStartupsEditFeedbacksPermission,
	};
}, {
	getFeedbacks,
	updateFeedback,
	removeFeedback,
})(memo(RateAndFeedbacks));
