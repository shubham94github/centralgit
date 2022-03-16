import React, { memo } from 'react';
import { array, bool, func, number, oneOfType, string } from 'prop-types';
import RatingStars from '@components/_shared/RatingStars';
import ToggleSection from '@components/_shared/ToggleSection';
import { P12, H1, S14 } from '@components/_shared/text';
import FeedbacksContent from '@components/_shared/Feedbacks/FeedbacksContent';
import cn from 'classnames';
import { Icons } from '@icons';

import './Feedbacks.scss';

const ratingsIcon = Icons.ratingsIcon();

const Feedbacks = ({
	countOfRecords,
	rateStars,
	rateCount,
	idProfile,
	feedbacks,
	isLoadingFeedbacks,
	isExistsFeedback,
	getFeedbacksInfo,
	removeFeedback,
	isAdmin,
	isStartup,
	createFeedback,
	countAllFeedbacks,
	isStartupsEditFeedbacksPermission,
}) => {
	const rateCountFixed = parseFloat(!!rateCount ? rateCount.toFixed(1) : 0);
	const classes = cn('feedbacks-title', { 'pb-3 pt-4': !isAdmin });

	return (
		<div className='feedbacks-container'>
			<H1 className={classes} bold>
				<span className='me-1'>{ratingsIcon}</span>
				Ratings
			</H1>
			{
				isAdmin
					? <FeedbacksContent
						idProfile={idProfile}
						feedbacks={feedbacks}
						countOfRecords={countOfRecords}
						isLoadingFeedbacks={isLoadingFeedbacks}
						isExistsFeedback={isExistsFeedback}
						getFeedbacksInfo={getFeedbacksInfo}
						removeFeedback={removeFeedback}
						isAdmin={isAdmin}
						rateStars={rateStars}
						createFeedback={createFeedback}
						rateCountFixed={rateCountFixed}
						countAllFeedbacks={countAllFeedbacks}
						isStartupsEditFeedbacksPermission={isStartupsEditFeedbacksPermission}
						isStartup={isStartup}
					/>
					: !isStartup
						? <ToggleSection button={
						// eslint-disable-next-line
						<div className='d-flex align-items-start align-items-sm-end flex-column flex-sm-row toggle-feedbacks'>
								<div className='d-flex align-items-end'>
									<RatingStars rate={rateStars}/>
									<S14 className='ms-2' bold>{rateCountFixed}</S14>
								</div>
								<P12 className='ms-0 mt-2 ms-sm-3 mt-sm-0'>
								Feedbacks ({countOfRecords})
								</P12>
							</div>
						}>
							<FeedbacksContent
								idProfile={idProfile}
								feedbacks={feedbacks}
								countOfRecords={countOfRecords}
								isLoadingFeedbacks={isLoadingFeedbacks}
								isExistsFeedback={isExistsFeedback}
								getFeedbacksInfo={getFeedbacksInfo}
								removeFeedback={removeFeedback}
								createFeedback={createFeedback}
								countAllFeedbacks={countAllFeedbacks}
								isStartup={isStartup}
							/>
						</ToggleSection>
						: <div className='d-flex flex-column'>
							<div className='d-flex align-items-center'>
								<div className='d-flex flex-row align-items-end'>
									<RatingStars rate={rateStars}/>
									<S14 className='ms-2' bold>{rateCountFixed}</S14>
								</div>
								<P12 className='ms-0 mt-2 ms-sm-3 mt-sm-0'>
									Feedbacks ({countOfRecords})
								</P12>
							</div>

							<FeedbacksContent
								idProfile={idProfile}
								feedbacks={feedbacks}
								countOfRecords={countOfRecords}
								isLoadingFeedbacks={isLoadingFeedbacks}
								isExistsFeedback={isExistsFeedback}
								getFeedbacksInfo={getFeedbacksInfo}
								removeFeedback={removeFeedback}
								createFeedback={createFeedback}
								countAllFeedbacks={countAllFeedbacks}
								isStartup={isStartup}
							/>
						</div>
			}
		</div>
	);
};

Feedbacks.propTypes = {
	getFeedbacksInfo: func,
	countOfRecords: number,
	countAllFeedbacks: number,
	isExistsFeedback: bool,
	feedbacks: array.isRequired,
	isLoadingFeedbacks: bool,
	rateStars: number,
	rateCount: number,
	idProfile: oneOfType([string, number]).isRequired,
	removeFeedback: func,
	createFeedback: func,
	isAdmin: bool,
	isStartup: bool,
	isStartupsEditFeedbacksPermission: bool,
};

Feedbacks.defaultProps = {
	countOfRecords: 0,
	countAllFeedbacks: 0,
	isExistsFeedback: false,
	rateStars: 0,
	rateCount: 0,
	isAdmin: false,
};

export default memo(Feedbacks);
