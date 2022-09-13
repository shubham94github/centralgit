import React, { memo, useEffect } from "react";
import { array, bool, func, number, object, shape } from "prop-types";
import Feedbacks from "@components/_shared/Feedbacks";
import LoadingOverlay from "@components/_shared/LoadingOverlay";
import { connect } from "react-redux";
import {
  getProfile,
  clearProfile,
  getProfileRetailer,
  getFeedbacksInfo,
  removeFeedback,
  createFeedback,
} from "@ducks/profile/actions";
import { getViewedProfile } from "@ducks/common/actions";
import { useLocation, useParams } from "react-router-dom";
import Profile from "@components/ProfilePage/Profile";
import SimilarStartups from "@components/ProfilePage/Profile/SimilarStartups";

import "./ProfilePage.scss";

const ProfilePage = ({
  getProfile,
  getProfileRetailer,
  profile,
  isLoading,
  clearProfile,
  getViewedProfile,
  feedbacks,
  countOfRecords,
  isLoadingFeedbacks,
  isExistsFeedback,
  rateStars,
  rateCount,
  getFeedbacksInfo,
  removeFeedback,
  createFeedback,
  countAllFeedbacks,
  isStartup,
}) => {
  const location = useLocation();
  const isRetailer = profile?.role
    ? profile.role.includes("RETAILER")
    : location.pathname.includes("retailer");
  const isMember = profile?.role?.includes("MEMBER");
  const { id: idProfile, role: profileRole } = useParams();

  useEffect(() => {
    if (!isRetailer) getViewedProfile({ id: idProfile });
  }, [isRetailer, idProfile, getViewedProfile]);

  useEffect(() => () => clearProfile(), [clearProfile]);

  useEffect(() => {
    if (profileRole === "startup") getProfile({ id: idProfile });
    else getProfileRetailer({ id: idProfile });
  }, [getProfile, idProfile, getProfileRetailer, profileRole]);

  return isLoading || !profile ? (
    <LoadingOverlay />
  ) : (
    <section className="startup-profile-section">
      <div className="startup-profile-wrapper">
        <Profile
          profile={profile}
          isRetailer={isRetailer}
          isMember={isMember}
        />
        {!isRetailer && (
          <>
            {!isStartup && <SimilarStartups startupId={idProfile} />}
            <Feedbacks
              idProfile={idProfile}
              feedbacks={feedbacks}
              countOfRecords={countOfRecords}
              isLoadingFeedbacks={isLoadingFeedbacks}
              isExistsFeedback={isExistsFeedback}
              rateStars={rateStars}
              rateCount={rateCount}
              getFeedbacksInfo={getFeedbacksInfo}
              removeFeedback={removeFeedback}
              createFeedback={createFeedback}
              countAllFeedbacks={countAllFeedbacks}
            />
          </>
        )}
      </div>
    </section>
  );
};

ProfilePage.propTypes = {
  getProfile: func.isRequired,
  clearProfile: func.isRequired,
  getProfileRetailer: func.isRequired,
  getViewedProfile: func.isRequired,
  profile: shape({
    id: number,
    feedbackCount: number,
    rateStars: number,
    rate: number,
  }),
  isLoading: bool.isRequired,
  isLoadingFeedbacks: bool,
  feedbacks: array.isRequired,
  countOfRecords: number,
  countAllFeedbacks: number,
  isExistsFeedback: bool,
  rateStars: number,
  rateCount: number,
  getFeedbacksInfo: func,
  removeFeedback: func,
  createFeedback: func,
  trialData: object,
  isTrial: bool,
  isStartup: bool,
};

ProfilePage.defaultProps = {
  countOfRecords: 0,
  countAllFeedbacks: 0,
  isExistsFeedback: true,
  rateStars: 0,
  rateCount: 0,
};

const mapStateToProps = ({
  auth: { user },
  profile: {
    profile,
    isLoading,
    feedbacks,
    count: countOfRecords,
    isLoadingFeedbacks,
    isExistsFeedback,
    rateStars,
    rateCount,
    countAllFeedbacks,
  },
}) => {
  return {
    profile,
    isLoading,
    feedbacks,
    countOfRecords,
    isLoadingFeedbacks,
    isExistsFeedback,
    rateStars,
    rateCount,
    countAllFeedbacks,
    isStartup: user?.role?.includes("STARTUP"),
  };
};

export default connect(mapStateToProps, {
  getProfileRetailer,
  getProfile,
  clearProfile,
  getViewedProfile,
  getFeedbacksInfo,
  removeFeedback,
  createFeedback,
})(memo(ProfilePage));
