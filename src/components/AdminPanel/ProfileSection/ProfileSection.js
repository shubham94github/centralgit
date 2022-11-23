import React, { memo, useEffect } from 'react'
import { Routes } from '@routes'
import { connect } from 'react-redux'
import { useParams, Switch } from 'react-router-dom'
import { getProfileStartupForAdmin, clearProfile, getProfileRetailerForAdmin } from '@ducks/admin/actions'
import { bool, func, object } from 'prop-types'
import LoadingOverlay from '@components/_shared/LoadingOverlay'
import CompanyDetails from './CompanyDetails'
import AccountInformation from './AccountInformation'
import NavPanel from './NavPanel'
import ShortInfo from './ShortInfo'
import RateAndFeedbacks from './RateAndFeedbacks'
import InternalInfo from './InternalInfo'
import GalleryInfo from '@components/AdminPanel/ProfileSection/GalleryInfo'
import BillingDetails from './BillingDetails'
import ListOfStartupBookmarksHOC from './BookmarksStartup'
import ListOfRatedStartupsHOC from './RatedStartups'
import ListOfArticleHOC from './Article'
import { generateNavbarLinks } from '@utils/generateNavbarLinks'
import ProtectedRoute from '@components/Common/ProtectedRoute/ProtectedRoute'
import CompanyMembers from '@components/AdminPanel/ProfileSection/CompanyMembers'
import { isEmpty } from '@utils/js-helpers'

import './ProfileSection.scss'

const { PROFILE } = Routes.ADMIN_PANEL

const ProfileSection = ({
  profile,
  isLoading,
  getProfileStartupForAdmin,
  getProfileRetailerForAdmin,
  clearProfile,
  listOfPermissions
}) => {
  const { id: idProfile, role: profileRole } = useParams()
  const isStartup = profileRole === 'startup'

  const navbarLinks = generateNavbarLinks(isStartup, profileRole, idProfile, profile)

  useEffect(() => {
    if (isStartup) getProfileStartupForAdmin({ id: idProfile })
    else getProfileRetailerForAdmin({ id: idProfile })
  }, [idProfile, getProfileStartupForAdmin, profileRole, getProfileRetailerForAdmin, isStartup])

  useEffect(() => () => clearProfile(), [clearProfile])

  const isVisibleProfile = !isEmpty(profile) && !isEmpty(listOfPermissions)

  return !isVisibleProfile ? (
    <LoadingOverlay classNames='profile-loader' />
  ) : (
    <div className='profile-wrapper'>
      {isLoading && <LoadingOverlay classNames='profile-loader' />}
      <ShortInfo />
      <NavPanel isStartup={isStartup} navbarLinks={navbarLinks} />
      <Switch>
        <ProtectedRoute path={PROFILE.INDEX} component={CompanyDetails} exact />
        <ProtectedRoute path={PROFILE.ACCOUNT_INFO} component={AccountInformation} exact />
        <ProtectedRoute path={PROFILE.FEEDBACKS} component={RateAndFeedbacks} exact />
        <ProtectedRoute path={PROFILE.INFO} component={InternalInfo} exact />
        <ProtectedRoute path={PROFILE.GALLERY} component={GalleryInfo} exact />
        <ProtectedRoute path={PROFILE.BILLING_DETAILS} component={BillingDetails} exact />
        <ProtectedRoute path={PROFILE.BOOKMARKS_STARTUP} component={ListOfStartupBookmarksHOC} exact />
        <ProtectedRoute path={PROFILE.RATED_STARTUPS} component={ListOfRatedStartupsHOC} exact />
        <ProtectedRoute path={PROFILE.ARTICLE} component={ListOfArticleHOC} exact />
        <ProtectedRoute path={PROFILE.COMPANY_MEMBERS} component={CompanyMembers} exact />
      </Switch>
    </div>
  )
}

ProfileSection.propTypes = {
  isLoading: bool.isRequired,
  profile: object,
  getProfileStartupForAdmin: func.isRequired,
  getProfileRetailerForAdmin: func.isRequired,
  clearProfile: func.isRequired,
  listOfPermissions: object
}

export default connect(
  ({ admin, auth }) => {
    const { profile, isLoading } = admin
    const { listOfPermissions } = auth

    return {
      profile,
      isLoading,
      listOfPermissions
    }
  },
  {
    getProfileStartupForAdmin,
    getProfileRetailerForAdmin,
    clearProfile
  }
)(memo(ProfileSection))
