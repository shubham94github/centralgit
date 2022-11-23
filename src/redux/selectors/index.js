export const selectUser = state => state.auth.user

export const selectChannelByParticipantId = async (id, role) => {
  return state =>
    state.messaging.channels.find(channel => {
      if (role.includes('RETAILER')) return channel.participant.id === id

      return channel.creator.id === id
    })
}

export const selectParticipantProfile = (state, participantId) => {
  const startupProfile = state.browse.startups.find(item => item.user.id === participantId)

  if (state.profile.profile === null && startupProfile) return startupProfile.user

  return state.profile.profile.user
}

export const selectChannels = state => state.messaging.channels

export const selectActiveChannelId = state => state.messaging.activeChannelId

export const selectMessages = state => state.messaging.messages

export const selectMeta = state => state.messaging.meta

export const selectStartupsTableMeta = state => state.admin.startupsTableMeta

export const selectRetailersTableMeta = state => state.admin.retailersTableMeta

export const selectProfile = state => state.admin.profile

export const selectProfileVideo = state => state.admin.profile.marketingVideo

export const selectUserIdForProfile = state => state.admin.profile.id

export const selectStartupId = state => state.admin.profile.startup.id

export const selectUploadedDocuments = state => state.admin.profile.startup.documents

export const selectChannelsMeta = state => state.messaging.channelsMeta

export const selectNotifications = state => state.notifications.notificationsList

export const selectCountOfNewNotifications = state => state.notifications.countOfNewNotifications

export const selectCountAllNotifications = state => state.notifications.countAllNotifications

export const selectPageNotifications = state => state.notifications.page

export const selectUserId = state => state.auth.user.id

export const selectTrialData = state => state.common.trialData

export const selectListOfStartupsBrowse = state => state.browse.startups

export const selectStartupProfile = state => state.profile.profile

export const selectFilterCategories = state => state.browse.filterCategories

export const selectSavedSearchHistory = state => state.browse.savedSearchHistory

export const selectReportsTableMeta = state => state.admin.reportsTableMeta

export const selectFilterBookmarks = state => state.admin.filterBookmarks

export const selectFilterRated = state => state.admin.filterRated

export const selectRememberMe = state => state.auth.rememberMe

export const selectPaymentPlans = state => state.common.paymentPlans

export const selectFeatures = state => state.common.plansFeatures
