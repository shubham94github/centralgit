import React, { memo } from 'react'
import { H1 } from '@components/_shared/text'
import enums from '@constants/enums'
import { bool, func } from 'prop-types'
import { profileStartupType } from '@constants/types'
import { openChat, setWarningOfChatRestriction } from '@ducks/messages/actions'
import { connect } from 'react-redux'
import { isEmpty } from '@utils/js-helpers'
import ProfileHeader from '@components/ProfilePage/Profile/ProfileHeader'
import CategoriesSwiper from '@components/_shared/CategoriesSwiper'
import TextToggleForHeight from '@components/_shared/TextToggleForHeight'
import ProfileLeftSide from './ProfileLeftSide'
import { setIsBookmark } from '@ducks/browse/action'
import TagButtons from '@components/_shared/buttons/TagButtons'
import DocumentsCarousel from '@components/_shared/DocumentsCarousel'
import { Icons } from '@icons'

import './Profile.scss'

const galleryIcon = Icons.documents()

const Profile = ({
  profile,
  openChat,
  isRetailer,
  setWarningOfChatRestriction,
  isTrial,
  setIsBookmark,
  isAuthRoleRetailer,
  isMember,
  isStartup
}) => {
  const {
    areasOfInterest,
    businessModel,
    categories,
    city,
    companyShortName,
    companyStatus,
    country,
    foundedAt,
    logo60,
    clientsList,
    targetMarket,
    urlOfCompanyWebsite,
    companyDescription,
    companySectors,
    id,
    tags,
    companyType,
    solutionProductsServices,
    platformPartners,
    integrationTiming,
    numberOfClients,
    presenceInCountries,
    totalFundingAmount,
    accountType,
    isEnableMailing,
    owner,
    isBookmarked,
    interviewVideo,
    documents,
    marketingVideo,
    linkedInCompanyPage
  } = !!profile && profile
  const isDemoStartup = accountType === enums.accountType.demo
  const isFullNameFilled = !!(profile?.user?.firstName && profile.user?.lastName)

  const handleOpenChat = () => {
    if (isRetailer || isMember) openChat(id)
    else if (isTrial) setWarningOfChatRestriction()
    else openChat(profile.user.id)
  }
  const handleRetailHubChat = () => {
    openChat(10133)
  }

  const handleBookmarkClick = () => setIsBookmark({ id, isBookmarked })

  return (
    <>
      <ProfileHeader
        logo={logo60}
        companyShortName={companyShortName}
        isRetailer={isRetailer}
        isStartup={isStartup}
        handleOpenChat={handleOpenChat}
        handleRetailHubChat={handleRetailHubChat}
        isDemoStartup={isDemoStartup}
        isEnableMailing={isEnableMailing}
        country={country}
        city={city}
        foundedAt={foundedAt}
        owner={owner}
        totalFundingAmount={totalFundingAmount}
        isFullNameFilled={isFullNameFilled}
        isBookmarked={isBookmarked}
        handleBookmarkClick={handleBookmarkClick}
        isAuthRoleRetailer={isAuthRoleRetailer}
        marketingVideo={marketingVideo}
        urlOfCompanyWebsite={urlOfCompanyWebsite}
        linkedInCompanyPage={linkedInCompanyPage}
      />
      <div className='content-profile'>
        <ProfileLeftSide
          isRetailer={isRetailer}
          isMember={isMember}
          urlOfCompanyWebsite={urlOfCompanyWebsite}
          companyType={companyType}
          businessModel={businessModel}
          companyStatus={companyStatus}
          targetMarket={targetMarket}
          platformPartners={platformPartners}
          integrationTiming={integrationTiming}
          clientsList={clientsList}
          numberOfClients={numberOfClients}
          presenceInCountries={presenceInCountries}
          tags={tags}
          videoInterview={interviewVideo}
          documents={documents}
        />
        <div className='right-side-profile'>
          {isRetailer && !isEmpty(companySectors) ? (
            <>
              <H1 className='text-black text-start pt-4' bold>
                Business Sectors of Interest
              </H1>
              <CategoriesSwiper id='companySectors' selectedCategories={companySectors} />
            </>
          ) : (
            !isEmpty(categories) && (
              <>
                <H1 className='text-black text-start' bold>
                  Sectors of competence
                </H1>
                <CategoriesSwiper id='categories' selectedCategories={categories} />
                <div className='separator-horizontal' />
              </>
            )
          )}
          {companyDescription && (
            <div className='list-style-descriptions'>
              <H1 className='text-black text-start pb-3 mt-40' bold>
                Company Description
              </H1>
              <TextToggleForHeight text={companyDescription} />
            </div>
          )}
          {!isRetailer && solutionProductsServices && (
            <div className='list-style-descriptions'>
              <H1 className='text-black text-start pb-3 mt-40' bold>
                Solutions, products and services
              </H1>
              <TextToggleForHeight text={solutionProductsServices} />
            </div>
          )}
          {!isRetailer && !isEmpty(areasOfInterest) && (
            <>
              <H1 className='text-black text-start mt-40' bold>
                Areas of interest
              </H1>
              <CategoriesSwiper id='areasOfInterest' selectedCategories={areasOfInterest} />
            </>
          )}
          {!isEmpty(tags) && interviewVideo && (
            <>
              <H1 className='text-black text-start mt-40 pb-3' bold>
                Associated tags
              </H1>
              <TagButtons tags={tags} />
            </>
          )}
        </div>
      </div>
      {(!isEmpty(documents) || !!marketingVideo) && (
        <div className='profile-gallery'>
          <div className='gallery-title'>
            {galleryIcon}
            <span>Gallery</span>
          </div>
          <DocumentsCarousel documents={documents} profileId={id} marketingVideo={marketingVideo} />
        </div>
      )}
    </>
  )
}

Profile.propTypes = {
  getProfile: func,
  profile: profileStartupType,
  isRetailer: bool,
  openChat: func,
  setWarningOfChatRestriction: func.isRequired,
  isTrial: bool,
  setIsBookmark: func.isRequired,
  isAuthRoleRetailer: bool,
  isMember: bool,
  isStartup: bool
}

Profile.defaultProps = {
  isRetailer: false,
  isMember: false
}

export default connect(
  ({ auth: { user }, common: { trialData } }) => ({
    isTrial: user?.trial || trialData?.isTrial,
    isAuthRoleRetailer: user?.role.includes('RETAILER'),
    isStartup: !!user.startup
  }),
  {
    openChat,
    setWarningOfChatRestriction,
    setIsBookmark
  }
)(memo(Profile))
