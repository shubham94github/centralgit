import React, { lazy, memo, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { getHomeInfo } from '@ducks/home/actions';
import { array, bool, func, number, string } from 'prop-types';
import enums from '@constants/enums';
import { getChatsByUserIdInFork } from '@ducks/messages/actions';
import AppModal from '@components/Common/AppModal';
import ContactUs from '@components/_shared/ContactUs';
import SuccessMessage from '@components/_shared/ContactUs/SuccessMessage';
import { redirectToCorrectPageByStatus } from '@components/Auth/utils';
import { profileStartupType, userType } from '@constants/types';
import { isEmpty } from '@utils/js-helpers';
import CategoriesMenuHomeHOC from './CategoriesMenuHomeHOC';
import { getItemFromStorage } from '@utils/storage';
import withSuspense from '@utils/withSuspense';
import { retryLoad } from '@utils/retryReload';
import { getUser } from '@ducks/settings/actions';
import Profile from '@components/ProfilePage/Profile';
import { getFeedbacksInfo, getProfile } from '@ducks/profile/actions';
import Feedbacks from '@components/_shared/Feedbacks/Feedbacks';
import StartupWarningModal from './StartupWarningModal';
import { P16 } from '@components/_shared/text';

import('./HomePage.scss');

const { gettingStartedStatuses, userRoles } = enums;

const retailerRoles = Object.keys(userRoles)
	.filter(key => key.toLowerCase().includes('retailer'))
	.map(key => userRoles[key]);
const defaultOffset = 0;
const defaultLimit = 20;

const Startups = withSuspense(lazy(() => retryLoad(() => import('./Startups'))));
const NewsFeed = withSuspense(lazy(() => retryLoad(() => import('@components/HomePage/NewsFeed'))));

const HomePage = ({
	getHomeInfo,
	ratedStartups,
	newStartups,
	relatedStartups,
	isLoading,
	role,
	status,
	isAuthenticated,
	getChatsByUserIdInFork,
	user,
	getUser,
	profile,
	getProfile,
	feedbacks,
	isLoadingFeedbacks,
	isExistsFeedback,
	countAllFeedbacks,
	rateStars,
	rateCount,
	getFeedbacksInfo,
}) => {
	const [isShowContactUs, setIsShowContactUs] = useState(false);
	const [isShowSuccessMessage, setIsShowSuccessMessage] = useState(false);
	const [isStartupModal, setIsStartupModal] = useState(false);

	const isCompleted = status === gettingStartedStatuses.completedGettingStarted;
	const isMember = user?.role === userRoles.member;
	const isRetailerBehavior = retailerRoles.includes(role) || isMember;

	const toggleContactUsModal = () => setIsShowContactUs(prevState => !prevState);
	const toggleSuccessMessage = () => setIsShowSuccessMessage(prevState => !prevState);

	useEffect(() => {
		if (isRetailerBehavior && isCompleted && isAuthenticated && isEmpty(ratedStartups) && isEmpty(newStartups))
			getHomeInfo();
		else if (!isRetailerBehavior && isCompleted && isAuthenticated)
			getChatsByUserIdInFork({ offset: defaultOffset, size: defaultLimit });
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isRetailerBehavior, isCompleted, isAuthenticated]);

	useEffect(() => {
		setIsStartupModal(!user?.onlineStatus && !!user?.startup);
	}, [user?.onlineStatus, user?.startup]);

	useEffect(() => {
		if (user && !!user?.startup) getProfile({ id: user?.startup?.id });
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [user?.id, profile?.id]);

	useEffect(() => {
		if (!profile || !isEmpty(feedbacks)) return;

		const data = {
			isAllStars: true,
			page: 0,
			pageSize: 150 || feedbacks.length,
			rate: null,
		};

		getFeedbacksInfo({ data, id: profile.id });
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [feedbacks?.length, profile?.id]);

	if ((!!role && !isCompleted)) return redirectToCorrectPageByStatus(user);

	const closeStartupNotificationModal = () => {
		setIsStartupModal(false);
		getUser();
	};

	const isStartup = user?.role.includes('STARTUP');

	return isRetailerBehavior
		? (
			<div className='home-page-wrapper'>
				<CategoriesMenuHomeHOC/>
				<Startups
					newStartups={newStartups}
					ratedStartups={ratedStartups}
					relatedStartups={relatedStartups}
					isLoading={isLoading}
				/>
				<NewsFeed/>
			</div>
		)
		: <div className='home-page-container-startup'>
			{!!profile
				&& <section className='startup-profile-section'>
					<div className='startup-profile-wrapper'>
						<Profile
							profile={profile}
							isTrial={false}
							isMember={false}
							isAuthRoleRetailer={false}
							isRetailer={false}
						/>
					</div>
					<div className='rate-and-feedbacks-wrapper'>
						<Feedbacks
							isStartup={isStartup}
							idProfile={profile.id}
							feedbacks={feedbacks}
							countOfRecords={countAllFeedbacks}
							isLoadingFeedbacks={isLoadingFeedbacks}
							isExistsFeedback={isExistsFeedback}
							countAllFeedbacks={countAllFeedbacks}
							rateStars={rateStars}
							rateCount={rateCount}
						/>
					</div>
				</section>
			}
			{isStartupModal
				&& <AppModal
					width='690px'
					onClose={closeStartupNotificationModal}
					isHeader={true}
					title={<P16 className='text-center'>
							Welcome to RetailHub!
					</P16>}
					component={StartupWarningModal}
					outerProps={{
						toggleContactUsModal,
					}}
					isDisableClickOutside
				/>
			}
			{
				isShowContactUs
					&& <AppModal
						component={ContactUs}
						onClose={toggleContactUsModal}
						className='contact-as-modal'
						isCloseIcon={false}
						title='Contact us'
						outerProps={{
							toggleContactUsModal,
							toggleSuccessMessage,
						}}
					/>
			}
			{
				isShowSuccessMessage
					&& <AppModal
						isHeader={false}
						component={SuccessMessage}
						onClose={toggleSuccessMessage}
						className='success-message-as-modal'
					/>
			}
		</div>;
};

HomePage.propTypes = {
	getHomeInfo: func,
	newStartups: array,
	relatedStartups: array,
	ratedStartups: array,
	isLoading: bool,
	status: string,
	role: string,
	isAuthenticated: bool,
	userId: number,
	getChatsByUserId: func,
	user: userType,
	getChatsByUserIdInFork: func.isRequired,
	getUser: func,
	profile: profileStartupType,
	getProfile: func,
	countOfRecords: number,
	feedbacks: array,
	isLoadingFeedbacks: bool,
	isExistsFeedback: bool,
	countAllFeedbacks: number,
	rateStars: number,
	rateCount: number,
	getFeedbacksInfo: func,
};

const mapStateToProps = ({ home: {
	newStartups,
	ratedStartups,
	relatedStartups,
	isLoading,
}, auth: {
	user,
}, profile: storeProfile,
}) => {
	const localStorageUser = getItemFromStorage('user');
	const {
		profile,
		feedbacks,
		rateStars,
		rateCount,
		count,
	} = storeProfile;

	return {
		newStartups,
		ratedStartups,
		relatedStartups,
		isLoading,
		status: user?.status || localStorageUser?.status,
		role: user?.role || localStorageUser?.role,
		isAuthenticated: !!user,
		userId: user?.id || localStorageUser?.id,
		user,
		profile,
		feedbacks,
		countAllFeedbacks: count,
		isLoadingFeedbacks: profile?.isLoading,
		isExistsFeedback: !!count,
		rateStars,
		rateCount,
	};
};

export default connect(mapStateToProps, {
	getHomeInfo,
	getChatsByUserIdInFork,
	getUser,
	getProfile,
	getFeedbacksInfo,
})(memo(HomePage));
