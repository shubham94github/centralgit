import {
  SET_IS_LOADING,
  HANDLE_CHANGE_MENU,
  SET_STARTUPS,
  SET_RETAILERS,
  SET_STARTUPS_TABLE_META,
  SET_RETAILERS_TABLE_META,
  SET_PROFILE,
  SET_STARTUP_FILTERS,
  CLEAR_STARTUP_FILTERS,
  SET_SEARCH_REQUEST,
  SET_FEEDBACKS,
  SET_IS_LOADING_FEEDBACKS,
  SET_COUNT_FEEDBACKS,
  SET_RATE_STARS,
  SET_RATE_COUNT,
  IS_ADMIN_NOTIFICATION_SENDING,
  SET_COUNT_ALL_FEEDBACKS,
  SET_CATEGORIES,
  SET_RETAILER_FILTERS,
  CLEAR_RETAILER_FILTERS,
  GET_CATEGORIES,
  SET_REPORTS,
  SET_REPORTS_TABLE_META,
  SET_CATEGORIES_ACTIVITY_TABLE_META,
  SET_CATEGORIES_ACTIVITY,
  SET_PROFILES_ACTIVITY,
  SET_PROFILES_ACTIVITY_TABLE_META,
  SET_BOOKMARKS_STARTUPS,
  SET_FILTER_OF_BOOKMARKS,
  SET_IS_LOADING_LIST_OF_STARTUPS,
  SET_RATED_STARTUPS,
  SET_FILTER_OF_RATED_STARTUPS,
  SET_COMPANY_MEMBERS,
  SET_SUBSCRIPTION_PLANS,
  SET_ALL_PAYMENT_PLANS_NAMES,
  SET_PRICES,
  SET_MEMBER_GROUPS,
  SET_FEATURES,
  SET_ENTERPRISE_CODES,
  SET_PAYMENT_RECEIPTS
} from './index'
import { call, put, all, select, fork } from 'redux-saga/effects'
import {
  getStartups,
  getStartupsCount,
  getRetailers,
  getRetailersCount,
  approveUser,
  approveStartups,
  blockStartup,
  unBlockStartup,
  blockRetailer,
  unBlockRetailer,
  getStartupProfile,
  updateCompanyDetailsStartup,
  updateCompanyDetailsDemo,
  updateCompanyDetailsIncomplete,
  updateSectorOfCompetence,
  updateAreasOfInterest,
  updateTags,
  updateAccountInformation,
  updateStartupFiles,
  enableMailing,
  disableMailing,
  updateStartupLogo,
  updateUserAvatar,
  updateFeedback,
  removeFeedback,
  updateAdminNote,
  sendAdminNotification,
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  uploadCategoryIcon,
  downloadCategoryIcon,
  verifyRetailer,
  verifyStartup,
  getRetailerProfile,
  updateRetailerLogo,
  updateUserRetailerAvatar,
  sendAdminNotificationToUser,
  getAllReports,
  getCountOfAllReports,
  updateBillingAddress,
  checkIsPublicRetailer,
  updateCompanyDetailsRetailer,
  updateAccountInformationRetailer,
  getCategoriesActivity,
  getProfilesActivity,
  getBookmarksStartup,
  getRatedStartups,
  getCompanyMembers,
  downloadMemberAvatar,
  changeUserTwoFa,
  getFeatures,
  createNewFeature,
  editFeature,
  deleteFeature,
  createNewMemberGroup,
  editMemberGroup,
  deleteMemberGroup
} from '@api/adminApi'
import { getFeedback, getCountFeedback, getProfileRating } from '@api/profileApi'
import { onServerErrorHandler, setSnackbar } from '@ducks/common/sagas'
import {
  downloadCompanyAvatar,
  downloadUserAvatar,
  getFileThumbnails,
  uploadAttachedDocuments,
  uploadCompanyLogo,
  uploadUserLogo
} from '@api/fileUploadingApi'
import { toColor } from '@utils'
import {
  selectProfile,
  selectStartupsTableMeta,
  selectRetailersTableMeta,
  selectUserIdForProfile,
  selectUploadedDocuments,
  selectReportsTableMeta,
  selectFilterBookmarks,
  selectFilterRated
} from '../../redux/selectors'
import enums from '@constants/enums'
import {
  defaultFiltersForFeedbacks,
  emptyCategoryImportedErrorMessage,
  emptyCategoryIncompleteErrorMessage
} from '@ducks/admin/constants'
import hideSomeFirstLevelCategories from '@utils/hideSomeFirstLevelCategories'
import { generateFilterForStartups } from '@utils/generateFilterForStartups'
import {
  createNewPaymentPlan,
  deleteSubscriptionPlan,
  editEnterpriseCode,
  getAllPaymentPlanNames,
  getEnterpriseCodes,
  getMemberGroups,
  getPrices,
  getSubscriptionPlans,
  hidePaymentPlan,
  unHidePaymentPlan,
  updatePaymentPlan,
  getPaymentReceipts
} from '@api/subscriptionPansApi'
import { emptyCategoryImportedError, emptyCategoryIncompleteError } from '@constants/errorCodes'

const { accountTypesAdminPanel, verifyUserTypes } = enums

const successAddedMemberGroup = 'A new member group is created!'
const successEditedMemberGroup = 'Changes have been saved!'
const successDeletedMemberGroup = 'Member group delete successfully!'

export function* setIsLoading(isLoading) {
  yield put({
    type: SET_IS_LOADING,
    payload: { isLoading }
  })
}

export function* setIsLoadingListOfStartups(isLoadingListOfStartups) {
  yield put({
    type: SET_IS_LOADING_LIST_OF_STARTUPS,
    payload: { isLoadingListOfStartups }
  })
}

export function* handleMenuItemWorker({ payload: { itemIndex } }) {
  const {
    admin: { menuItems }
  } = yield select()
  const newMenuItems = menuItems.reduce((acc, item, i) => {
    if (i === itemIndex) acc.push({ ...item, isExpanded: !item.isExpanded })
    else acc.push(item)

    return acc
  }, [])

  yield put({
    type: HANDLE_CHANGE_MENU,
    payload: {
      menuItems: newMenuItems
    }
  })
}

function* downloadUserLogo(item) {
  const [startupLogo30, retailerLogo30] = yield all([
    call(downloadCompanyAvatar, item.startup?.logo30?.id),
    call(downloadCompanyAvatar, item.retailer?.logo30?.id)
  ])

  try {
    return {
      ...item,
      startup: item.startup
        ? {
            ...item.startup,
            logo30: {
              ...item.startup.logo30,
              image: item.startup.logo30 ? startupLogo30 : '',
              name: !item.startup.logo30?.id ? item.startup?.companyShortName : '',
              color: !item.startup.logo30?.id ? toColor(item.startup?.id.toString()) : ''
            }
          }
        : null,
      retailer: item.retailer
        ? {
            ...item.retailer,
            logo30: {
              ...item.retailer.logo30,
              image: item.retailer.logo30 ? retailerLogo30 : '',
              name: !item.retailer.logo30?.id ? item.retailer?.companyShortName : '',
              color: !item.retailer.logo30?.id ? toColor(item.retailer.logo30?.id.toString()) : ''
            }
          }
        : null
    }
  } catch (e) {
    yield fork(onServerErrorHandler, e)
  }
}

function* getLogo(data) {
  try {
    return yield all(data.map(item => downloadUserLogo(item)))
  } catch (e) {
    yield fork(onServerErrorHandler, e)
  }
}

export function* getStartupsWorker({ payload: { data } }) {
  try {
    yield setIsLoading(true)

    yield put({
      type: SET_STARTUPS_TABLE_META,
      payload: {
        tableMeta: data
      }
    })

    const [{ items: startups }, { count: startupsCount }] = yield all([
      yield call(getStartups, data),
      yield call(getStartupsCount, { fields: data.fields })
    ])

    const newStartups = yield call(getLogo, startups)

    yield put({
      type: SET_STARTUPS,
      payload: {
        startups: newStartups,
        startupsCount
      }
    })
  } catch (e) {
    yield fork(onServerErrorHandler, e)
  } finally {
    yield setIsLoading(false)
  }
}

export function* getRetailersWorker({ payload: { data } }) {
  try {
    yield setIsLoading(true)

    yield put({
      type: SET_RETAILERS_TABLE_META,
      payload: {
        tableMeta: data
      }
    })

    const [{ items: retailers }, { count: retailersCount }] = yield all([
      yield call(getRetailers, data),
      yield call(getRetailersCount, { fields: data.fields })
    ])

    const newRetailers = yield call(getLogo, retailers)

    yield put({
      type: SET_RETAILERS,
      payload: {
        retailers: newRetailers,
        retailersCount
      }
    })
  } catch (e) {
    yield fork(onServerErrorHandler, e)
  } finally {
    yield setIsLoading(false)
  }
}

export function* approveUserWorker({ payload: { ids, type } }) {
  try {
    yield setIsLoading(true)

    const tableMeta =
      type === verifyUserTypes.startup ? yield select(selectStartupsTableMeta) : yield select(selectRetailersTableMeta)

    if (type === verifyUserTypes.startup) yield call(approveStartups, ids)
    else yield call(approveUser, ids)

    const data = {
      payload: {
        data: tableMeta
      }
    }

    if (type === verifyUserTypes.startup) yield call(getStartupsWorker, data)
    else yield call(getRetailersWorker, data)
  } catch (e) {
    yield fork(onServerErrorHandler, e)
  } finally {
    yield setIsLoading(false)
  }
}

export function* handleStartupActivationWorker({ payload: { ids, isBlocked } }) {
  try {
    yield setIsLoading(true)

    const tableMeta = yield select(selectStartupsTableMeta)

    if (isBlocked) yield call(unBlockStartup, ids)
    else yield call(blockStartup, ids)

    const data = {
      payload: {
        data: tableMeta
      }
    }

    yield call(getStartupsWorker, data)
  } catch (e) {
    yield fork(onServerErrorHandler, e)
  } finally {
    yield setIsLoading(false)
  }
}

export function* handleRetailerActivationWorker({ payload: { ids, isBlocked } }) {
  try {
    yield setIsLoading(true)

    const tableMeta = yield select(selectRetailersTableMeta)

    if (isBlocked) yield call(unBlockRetailer, ids)
    else yield call(blockRetailer, ids)

    const data = {
      payload: {
        data: tableMeta
      }
    }

    yield call(getRetailersWorker, data)
  } catch (e) {
    yield fork(onServerErrorHandler, e)
  } finally {
    yield setIsLoading(false)
  }
}

export function* getStartupProfileWorker({ payload: { id } }) {
  try {
    yield setIsLoading(true)

    const resp = yield call(getStartupProfile, id)
    const thumbnailIds = resp.startup.documents.map(doc => doc.thumbnailId)
    const thumbnails = yield call(getFileThumbnails, thumbnailIds)

    const profile = {
      ...resp,
      avatar60: {
        ...resp.avatar60,
        image: resp.avatar60?.id ? yield call(downloadUserAvatar, resp.avatar60.id) : '',
        name: !resp.avatar60?.id && resp.fullName ? resp.fullName : 'Retail Hub',
        color: !resp.avatar60?.id ? toColor(resp.id.toString()) : ''
      },
      startup: {
        ...resp.startup,
        logo60: {
          ...resp.startup.logo60,
          image: resp.startup.logo60?.id ? yield call(downloadCompanyAvatar, resp.startup.logo60?.id) : '',
          name: !resp.startup.logo60?.id ? resp.startup?.companyShortName : '',
          color: !resp.startup.logo60?.id ? toColor(resp.startup?.id.toString()) : ''
        },
        documents: resp.startup.documents.map((doc, i) => ({ ...doc, thumbnail: thumbnails[i] }))
      }
    }

    yield put({
      type: SET_PROFILE,
      payload: { profile }
    })
  } catch (e) {
    yield fork(onServerErrorHandler, e)
  } finally {
    yield setIsLoading(false)
  }
}

export function* downloadAvatarsForMembers(members) {
  const membersWithAvatars = yield all(members.map(member => call(downloadMemberAvatar, member)))

  yield put({
    type: SET_COMPANY_MEMBERS,
    payload: { members: membersWithAvatars }
  })
}

export function* getCompanyMembersWorker({ payload: { profileId } }) {
  try {
    const res = yield call(getCompanyMembers, { profileId })

    yield put({
      type: SET_COMPANY_MEMBERS,
      payload: { members: res.items }
    })

    yield fork(downloadAvatarsForMembers, res.items)
  } catch (e) {
    yield fork(onServerErrorHandler, e)
  }
}

export function* getRetailerProfileWorker({ payload: { id } }) {
  try {
    yield setIsLoading(true)

    const resp = yield call(getRetailerProfile, id)

    const [{ isPublic }, avatar60, retailerLogo60] = yield all([
      call(checkIsPublicRetailer, resp.retailer.id),
      call(downloadUserAvatar, resp.avatar60?.id),
      call(downloadCompanyAvatar, resp.retailer.logo60?.id)
    ])

    const profile = {
      ...resp,
      avatar60: {
        ...resp.avatar60,
        image: resp.avatar60?.id ? avatar60 : '',
        name: !resp.avatar60?.id && resp.fullName ? resp.fullName : 'Retail Hub',
        color: !resp.avatar60?.id ? toColor(resp.id.toString()) : ''
      },
      retailer: {
        ...resp.retailer,
        logo60: {
          ...resp.retailer.logo60,
          image: resp.retailer.logo60?.id ? retailerLogo60 : '',
          name: !resp.retailer.logo60?.id ? resp.retailer?.companyShortName : '',
          color: !resp.retailer.logo60?.id ? toColor(resp.retailer?.id.toString()) : ''
        },
        isPublic
      }
    }

    yield put({
      type: SET_PROFILE,
      payload: { profile }
    })

    yield fork(getCompanyMembersWorker, { payload: { profileId: resp.id } })
  } catch (e) {
    yield fork(onServerErrorHandler, e)
  } finally {
    yield setIsLoading(false)
  }
}

export function* handleProfileStartupActivationWorker({ payload: { ids, isBlocked } }) {
  try {
    yield setIsLoading(true)

    const { startup, id: userId } = yield select(selectProfile)
    const isStartup = !!startup
    const unBlockApi = isStartup ? unBlockStartup : unBlockRetailer
    const blockApi = isStartup ? blockStartup : blockRetailer
    const profileWorker = isStartup ? getStartupProfileWorker : getRetailerProfileWorker

    if (isBlocked) yield call(unBlockApi, ids)
    else yield call(blockApi, ids)

    const data = {
      payload: {
        id: userId
      }
    }

    yield call(profileWorker, data)
  } catch (e) {
    yield fork(onServerErrorHandler, e)
  } finally {
    yield setIsLoading(false)
  }
}

export function* approveUserProfileWorker({ payload: { ids } }) {
  try {
    yield setIsLoading(true)

    const { startup, id: userId } = yield select(selectProfile)
    const isStartup = !!startup
    const approveApi = isStartup ? approveStartups : approveUser
    const getProfileWorker = isStartup ? getStartupProfileWorker : getRetailerProfileWorker

    yield call(approveApi, ids)

    const data = {
      payload: {
        id: userId
      }
    }

    yield call(getProfileWorker, data)
  } catch (e) {
    yield fork(onServerErrorHandler, e)
    yield setSnackbar({
      text: 'Incomplete account information.',
      type: enums.snackbarTypes.error
    })
  } finally {
    yield setIsLoading(false)
  }
}

export function* updateCompanyDetailsProfileWorker({ payload: { data, id } }) {
  try {
    yield setIsLoading(true)

    const { startup, id: userId } = yield select(selectProfile)
    const isStartup = !!startup
    const getProfileWorker = isStartup ? getStartupProfileWorker : getRetailerProfileWorker

    switch (data?.accountType) {
      case accountTypesAdminPanel.STANDARD:
        yield all([
          call(updateCompanyDetailsStartup, data, id),
          call(mailingProfileWorker, { payload: { ids: [userId], isEnableMailing: true } })
        ])
        break
      case accountTypesAdminPanel.DEMO:
        yield all([
          call(updateCompanyDetailsDemo, data, id),
          call(mailingProfileWorker, { payload: { ids: [userId], isEnableMailing: false } })
        ])
        break
      case accountTypesAdminPanel.INCOMPLETE:
      case accountTypesAdminPanel.IMPORTED:
        yield all([
          yield call(updateCompanyDetailsIncomplete, data, id),
          call(mailingProfileWorker, { payload: { ids: [userId], isEnableMailing: false } })
        ])
        break
      default:
        yield call(updateCompanyDetailsRetailer, data, id)
    }

    const dataProfile = {
      payload: {
        id: userId
      }
    }

    yield call(getProfileWorker, dataProfile)
  } catch (e) {
    if (e.code === emptyCategoryImportedError) {
      yield setSnackbar({
        text: emptyCategoryImportedErrorMessage,
        type: enums.snackbarTypes.error
      })
    } else if (e.code === emptyCategoryIncompleteError) {
      yield setSnackbar({
        text: emptyCategoryIncompleteErrorMessage,
        type: enums.snackbarTypes.error
      })
    } else yield fork(onServerErrorHandler, e)
  } finally {
    yield setIsLoading(false)
  }
}

export function* updateSectorOfCompetenceStartupWorker({ payload: { data, id } }) {
  try {
    yield setIsLoading(true)

    const userId = yield select(selectUserIdForProfile)

    yield call(updateSectorOfCompetence, data, id)

    const dataProfile = {
      payload: {
        id: userId
      }
    }

    yield call(getStartupProfileWorker, dataProfile)
  } catch (e) {
    yield fork(onServerErrorHandler, e)
  } finally {
    yield setIsLoading(false)
  }
}

export function* updateAreasOfInterestStartupWorker({ payload: { data, id } }) {
  try {
    yield setIsLoading(true)

    const userId = yield select(selectUserIdForProfile)

    yield call(updateAreasOfInterest, data, id)

    const dataProfile = {
      payload: {
        id: userId
      }
    }

    yield call(getStartupProfileWorker, dataProfile)
  } catch (e) {
    yield fork(onServerErrorHandler, e)
  } finally {
    yield setIsLoading(false)
  }
}

export function* updateTagsStartupWorker({ payload: { data, id } }) {
  try {
    yield setIsLoading(true)

    const userId = yield select(selectUserIdForProfile)

    yield call(updateTags, data, id)

    const dataProfile = {
      payload: {
        id: userId
      }
    }

    yield call(getStartupProfileWorker, dataProfile)
  } catch (e) {
    yield fork(onServerErrorHandler, e)
  } finally {
    yield setIsLoading(false)
  }
}

export function* updateAccountInformationWorker({ payload: { data, id } }) {
  try {
    yield setIsLoading(true)

    const { startup, id: userId } = yield select(selectProfile)
    const isStartup = !!startup
    const profileWorker = isStartup ? getStartupProfileWorker : getRetailerProfileWorker
    const updateAccountInformationApi = isStartup ? updateAccountInformation : updateAccountInformationRetailer

    yield call(updateAccountInformationApi, data, id)

    const dataProfile = {
      payload: {
        id: userId
      }
    }

    yield call(profileWorker, dataProfile)
  } catch (e) {
    yield fork(onServerErrorHandler, e)
  } finally {
    yield setIsLoading(false)
  }
}

export function* updateStartupFilesWorker({ payload: { documentId, id } }) {
  try {
    yield setIsLoading(true)

    yield call(updateStartupFiles, { documentId, id })
  } catch (e) {
    yield fork(onServerErrorHandler, e)
  } finally {
    yield setIsLoading(false)
  }
}

export function* handleUploadDocumentsWorker({ payload: { files, id } }) {
  try {
    yield setIsLoading(true)
    const selectedDocuments = yield select(selectUploadedDocuments)
    const selectedDocumentsIds = selectedDocuments.map(doc => doc.id)

    const res = yield call(uploadAttachedDocuments, files)
    const uploadedDocumentsIds = res.map(doc => doc.id)

    const documentId = [...selectedDocumentsIds, ...uploadedDocumentsIds]

    yield call(updateStartupFilesWorker, { documentId, id })

    const userId = yield select(selectUserIdForProfile)

    const dataProfile = {
      payload: {
        id: userId
      }
    }

    yield call(getStartupProfileWorker, dataProfile)
  } catch (e) {
    yield fork(onServerErrorHandler, e)
  } finally {
    yield setIsLoading(false)
  }
}

export function* handleRemoveDocumentWorker({ payload: { idDocument, id } }) {
  try {
    yield setIsLoading(true)
    const selectedDocuments = yield select(selectUploadedDocuments)
    const selectedDocumentsIds = selectedDocuments.filter(doc => doc.id !== idDocument).map(doc => doc.id)

    const data = {
      documentId: selectedDocumentsIds,
      id
    }

    yield call(updateStartupFilesWorker, data)

    const userId = yield select(selectUserIdForProfile)

    const dataProfile = {
      payload: {
        id: userId
      }
    }

    yield call(getStartupProfileWorker, dataProfile)
  } catch (e) {
    yield fork(onServerErrorHandler, e)
  } finally {
    yield setIsLoading(false)
  }
}

export function* mailingProfileWorker({ payload: { ids, isEnableMailing } }) {
  try {
    yield setIsLoading(true)

    if (isEnableMailing) yield call(enableMailing, { ids })
    else yield call(disableMailing, { ids })

    const userId = yield select(selectUserIdForProfile)

    const dataProfile = {
      payload: {
        id: userId
      }
    }

    yield call(getStartupProfileWorker, dataProfile)
  } catch (e) {
    yield fork(onServerErrorHandler, e)
  } finally {
    yield setIsLoading(false)
  }
}

export function* uploadLogoProfileWorker({ payload: { file, profileId } }) {
  try {
    yield setIsLoading(true)

    const { startup, id: userId } = yield select(selectProfile)
    const isStartup = !!startup
    const profileWorker = isStartup ? getStartupProfileWorker : getRetailerProfileWorker

    const { id } = yield call(uploadCompanyLogo, file)

    if (isStartup) yield call(updateStartupLogo, { logoId: id }, profileId)
    else yield call(updateRetailerLogo, { logoId: id, retailerId: profileId })

    const dataProfile = {
      payload: {
        id: userId
      }
    }

    yield call(profileWorker, dataProfile)
  } catch (e) {
    yield fork(onServerErrorHandler, e)
  } finally {
    yield setIsLoading(false)
  }
}

export function* uploadUserAvatarProfileWorker({ payload: { file } }) {
  try {
    yield setIsLoading(true)

    const { startup, id: userId } = yield select(selectProfile)
    const isStartup = !!startup
    const profileWorker = isStartup ? getStartupProfileWorker : getRetailerProfileWorker

    const { id } = yield call(uploadUserLogo, file)

    if (isStartup) yield call(updateUserAvatar, { logoId: id }, userId)
    else yield call(updateUserRetailerAvatar, { logoId: id, userId })

    const dataProfile = {
      payload: {
        id: userId
      }
    }

    yield call(profileWorker, dataProfile)
  } catch (e) {
    yield fork(onServerErrorHandler, e)
  } finally {
    yield setIsLoading(false)
  }
}

export function* setSelectedStartupFiltersWorker({ payload }) {
  try {
    yield put({
      type: SET_STARTUP_FILTERS,
      payload: { filters: payload }
    })
  } catch (e) {
    yield fork(onServerErrorHandler, e)
  }
}

export function* setSelectedRetailerFiltersWorker({ payload }) {
  try {
    const tableMeta = yield select(selectRetailersTableMeta)

    yield put({
      type: SET_RETAILER_FILTERS,
      payload: { filters: payload }
    })

    const data = {
      payload: {
        data: tableMeta
      }
    }

    yield call(getRetailersWorker, data)
  } catch (e) {
    yield fork(onServerErrorHandler, e)
  }
}

export function* setSearchRequestFiltersWorker({ payload: { text } }) {
  try {
    yield setIsLoading(true)

    yield put({
      type: SET_SEARCH_REQUEST,
      payload: { text }
    })
  } catch (e) {
    yield fork(onServerErrorHandler, e)
  } finally {
    yield setIsLoading(false)
  }
}

export function* resetStartupFiltersWorker() {
  try {
    yield setIsLoading(true)

    yield put({
      type: CLEAR_STARTUP_FILTERS
    })

    const tableMeta = yield select(selectStartupsTableMeta)

    const data = {
      payload: {
        data: {
          ...tableMeta,
          fields: [],
          page: 1,
          size: 10
        }
      }
    }

    yield call(getStartupsWorker, data)
  } catch (e) {
    yield fork(onServerErrorHandler, e)
  } finally {
    yield setIsLoading(false)
  }
}

export function* resetRetailersFiltersWorker() {
  try {
    const tableMeta = yield select(selectRetailersTableMeta)

    yield setIsLoading(true)

    yield put({
      type: CLEAR_RETAILER_FILTERS
    })

    const data = {
      payload: {
        data: tableMeta
      }
    }

    yield call(getRetailersWorker, data)
  } catch (e) {
    yield fork(onServerErrorHandler, e)
  } finally {
    yield setIsLoading(false)
  }
}

export function* setIsLoadingFeedbacks(isLoadingFeedbacks) {
  yield put({
    type: SET_IS_LOADING_FEEDBACKS,
    payload: { isLoadingFeedbacks }
  })
}

function* downloadAvatarOfFeedback(feedback) {
  try {
    return {
      ...feedback,
      companyAvatar: {
        image: feedback.author.logo60?.id ? yield call(downloadUserAvatar, feedback.author.logo60?.id) : '',
        name: !feedback.author.logo60?.id ? feedback.author?.companyShortName : '',
        color: !feedback.author?.logo60?.id ? toColor(feedback.author.id.toString()) : ''
      }
    }
  } catch (e) {
    yield fork(onServerErrorHandler, e)
  }
}

function* getLogoFeedbacks(feedbacks) {
  try {
    return yield all(feedbacks.map(feedback => downloadAvatarOfFeedback(feedback)))
  } catch (e) {
    yield fork(onServerErrorHandler, e)
  }
}

function* getFeedbacksWorker({ payload: { data, id } }) {
  try {
    const { items } = yield call(getFeedback, data, id)
    const feedbacks = yield getLogoFeedbacks(items)

    yield put({
      type: SET_FEEDBACKS,
      payload: { feedbacks }
    })
  } catch (e) {
    yield fork(onServerErrorHandler, e)
  }
}

function* getCountFeedbacksWorker({ payload: { data, id } }) {
  try {
    const { count } = yield call(getCountFeedback, data, id)

    yield put({
      type: SET_COUNT_FEEDBACKS,
      payload: { count }
    })
  } catch (e) {
    yield fork(onServerErrorHandler, e)
  }
}

function* getCountAllFeedbacksWorker({ payload: { id } }) {
  try {
    const data = {
      isAllStars: true,
      rate: null
    }

    const { count } = yield call(getCountFeedback, data, id)

    yield put({
      type: SET_COUNT_ALL_FEEDBACKS,
      payload: { count }
    })
  } catch (e) {
    yield fork(onServerErrorHandler, e)
  }
}

function* getProfileRatingWorker({ payload: { id } }) {
  try {
    const { stars, rate } = yield call(getProfileRating, id)

    yield all([
      put({
        type: SET_RATE_STARS,
        payload: { stars }
      }),
      put({
        type: SET_RATE_COUNT,
        payload: { rate }
      })
    ])
  } catch (e) {
    yield fork(onServerErrorHandler, e)
  }
}

export function* getFeedbacksInfoWorker({
  payload: {
    data: { isAllStars, page, pageSize, rate },
    id
  }
}) {
  yield setIsLoadingFeedbacks(true)

  try {
    const dataFeedbacks = {
      isAllStars,
      page,
      pageSize,
      rate
    }
    const dataCount = {
      isAllStars,
      rate
    }

    yield all([
      getFeedbacksWorker({ payload: { data: dataFeedbacks, id } }),
      getCountFeedbacksWorker({ payload: { data: dataCount, id } }),
      getCountAllFeedbacksWorker({ payload: { id } }),
      getProfileRatingWorker({ payload: { id } })
    ])
  } catch (e) {
    yield fork(onServerErrorHandler, e)
  } finally {
    yield setIsLoadingFeedbacks(false)
  }
}

export function* handleUpdateFeedbacksWorker({ payload: { data, id } }) {
  try {
    yield setIsLoadingFeedbacks(true)

    yield call(updateFeedback, data, id)

    yield getFeedbacksInfoWorker({ payload: { data: defaultFiltersForFeedbacks, id } })
  } catch (e) {
    yield fork(onServerErrorHandler, e)
  } finally {
    yield setIsLoadingFeedbacks(false)
  }
}

export function* handleRemoveFeedbacksWorker({ payload: { data, id } }) {
  try {
    yield setIsLoadingFeedbacks(true)

    yield call(removeFeedback, data.id)

    yield getFeedbacksInfoWorker({ payload: { data: defaultFiltersForFeedbacks, id } })
  } catch (e) {
    yield fork(onServerErrorHandler, e)
  } finally {
    yield setIsLoadingFeedbacks(false)
  }
}

export function* updateAdminNoteWorker({ payload: { data, id } }) {
  try {
    yield setIsLoading(true)

    const {
      startup: { adminNote }
    } = yield call(updateAdminNote, data, id)

    const profile = yield select(selectProfile)

    yield put({
      type: SET_PROFILE,
      payload: { profile: { ...profile, startup: { ...profile.startup, adminNote } } }
    })
  } catch (e) {
    yield fork(onServerErrorHandler, e)
  } finally {
    yield setIsLoading(false)
  }
}

export function* sendAdminNotificationWorker({ payload: { recipientId, message } }) {
  try {
    const { startup } = yield select(selectProfile)
    const isStartup = !!startup
    const sendAdminNotificationApi = isStartup ? sendAdminNotification : sendAdminNotificationToUser

    yield all([
      put({
        type: IS_ADMIN_NOTIFICATION_SENDING,
        payload: { isAdminNotificationSending: true }
      }),
      call(sendAdminNotificationApi, { userId: recipientId, message })
    ])
  } catch (e) {
    yield fork(onServerErrorHandler, e)
  } finally {
    yield put({
      type: IS_ADMIN_NOTIFICATION_SENDING,
      payload: { isAdminNotificationSending: false }
    })
  }
}

function* downloadCategoryLogo(item) {
  try {
    return {
      ...item,
      logo: {
        ...item.logo,
        image: item.logo ? yield call(downloadCategoryIcon, item.logo.id) : null
      },
      areasLogo: {
        ...item.areasLogo,
        image: item.areasLogo ? yield call(downloadCategoryIcon, item.areasLogo.id) : null
      }
    }
  } catch (e) {
    yield onServerErrorHandler(e)
  }
}

function* getCategoriesLogo(data) {
  try {
    return yield all(data.map(item => downloadCategoryLogo(item)))
  } catch (e) {
    yield onServerErrorHandler(e)
  }
}

export function* getCategoriesWorker() {
  try {
    yield setIsLoading(true)

    const { items } = yield call(getCategories, false)
    const categories = hideSomeFirstLevelCategories(items)

    const categoriesWithLogo = yield call(getCategoriesLogo, categories)

    yield put({
      type: SET_CATEGORIES,
      payload: { categories: categoriesWithLogo }
    })
  } catch (e) {
    yield fork(onServerErrorHandler, e)
  } finally {
    yield setIsLoading(false)
  }
}

export function* createCategoryWorker({ payload }) {
  try {
    yield setIsLoading(true)

    if (payload.sectorsIcon && payload.areasIcon) {
      const [{ id: sectorsIconId }, { id: areasIconId }] = yield all([
        yield call(uploadCategoryIcon, payload.sectorsIcon),
        yield call(uploadCategoryIcon, payload.areasIcon)
      ])

      yield call(createCategory, { ...payload, logoId: sectorsIconId, areasLogoId: areasIconId })
    } else if (payload.sectorsIcon && !payload.areasIcon) {
      const { id: sectorsIconId } = yield call(uploadCategoryIcon, payload.sectorsIcon)

      yield call(createCategory, { ...payload, logoId: sectorsIconId })
    } else if (!payload.sectorsIcon && payload.areasIcon) {
      const { id: areasIconId } = yield call(uploadCategoryIcon, payload.areasIcon)

      yield call(createCategory, { ...payload, areasLogoId: areasIconId })
    } else yield call(createCategory, payload)

    yield put({ type: GET_CATEGORIES })
  } catch (e) {
    yield fork(onServerErrorHandler, e)
  } finally {
    yield setIsLoading(false)
  }
}

export function* updateCategoryWorker({ payload }) {
  try {
    yield setIsLoading(true)

    if (payload.sectorsIcon && payload.areasIcon) {
      const [{ id: sectorsIconId }, { id: areasIconId }] = yield all([
        yield call(uploadCategoryIcon, payload.sectorsIcon),
        yield call(uploadCategoryIcon, payload.areasIcon)
      ])

      yield call(updateCategory, { ...payload, logoId: sectorsIconId, areasLogoId: areasIconId })
    } else if (payload.sectorsIcon && !payload.areasIcon) {
      const { id: sectorsIconId } = yield call(uploadCategoryIcon, payload.sectorsIcon)

      yield call(updateCategory, { ...payload, logoId: sectorsIconId })
    } else if (!payload.sectorsIcon && payload.areasIcon) {
      const { id: areasIconId } = yield call(uploadCategoryIcon, payload.areasIcon)

      yield call(updateCategory, { ...payload, areasLogoId: areasIconId })
    } else yield call(updateCategory, payload)

    yield put({ type: GET_CATEGORIES })
  } catch (e) {
    yield fork(onServerErrorHandler, e)
  } finally {
    yield setIsLoading(false)
  }
}

export function* deleteCategoryWorker({ payload }) {
  try {
    yield setIsLoading(true)

    yield call(deleteCategory, payload)

    yield put({ type: GET_CATEGORIES })
  } catch (e) {
    yield fork(onServerErrorHandler, e)
  } finally {
    yield setIsLoading(false)
  }
}

export function* verifyUserWorker({ payload: { ids, type } }) {
  try {
    yield setIsLoading(true)

    const tableMeta =
      type === verifyUserTypes.startup ? yield select(selectStartupsTableMeta) : yield select(selectRetailersTableMeta)
    const profile = yield select(selectProfile)

    const data = {
      payload: {
        data: tableMeta
      }
    }

    if (type === verifyUserTypes.startup) {
      yield call(verifyStartup, ids)
      if (profile) {
        const dataProfile = {
          payload: {
            id: ids[0]
          }
        }

        yield call(getStartupProfileWorker, dataProfile)
      } else yield call(getStartupsWorker, data)
    } else {
      yield call(verifyRetailer, ids)
      yield call(getRetailersWorker, data)
    }
  } catch (e) {
    yield fork(onServerErrorHandler, e)
  } finally {
    yield setIsLoading(false)
  }
}

export function* verifyProfileWorker() {
  try {
    yield setIsLoading(true)

    const { startup, id: userId } = yield select(selectProfile)
    const isStartup = !!startup
    const verifyApi = isStartup ? verifyStartup : verifyRetailer
    const profileWorker = isStartup ? getStartupProfileWorker : getRetailerProfileWorker

    yield call(verifyApi, [userId])

    const dataProfile = {
      payload: {
        id: userId
      }
    }

    yield call(profileWorker, dataProfile)
  } catch (e) {
    yield fork(onServerErrorHandler, e)
  } finally {
    yield setIsLoading(false)
  }
}

export function* getReportsWorker({ payload: { meta, withLoading } }) {
  try {
    if (withLoading) yield setIsLoading(true)

    yield put({
      type: SET_REPORTS_TABLE_META,
      payload: {
        reportsTableMeta: meta
      }
    })

    const [{ items }, { count }] = yield all([yield call(getAllReports, meta), yield call(getCountOfAllReports)])

    yield put({
      type: SET_REPORTS,
      payload: {
        reports: items,
        reportsCount: count
      }
    })
  } catch (e) {
    yield fork(onServerErrorHandler, e)
  } finally {
    yield setIsLoading(false)
  }
}

export function* updateReportStatusWorker() {
  try {
    const meta = yield select(selectReportsTableMeta)

    yield call(getReportsWorker, { payload: { meta, withLoading: false } })
  } catch (e) {
    yield fork(onServerErrorHandler, e)
  }
}

export function* updateBillingAddressWorker({ payload: { data } }) {
  try {
    yield setIsLoading(true)

    const {
      retailer: { id },
      id: userId
    } = yield select(selectProfile)

    yield call(updateBillingAddress, data, id)

    const dataProfile = {
      payload: {
        id: userId
      }
    }

    yield call(getRetailerProfileWorker, dataProfile)
  } catch (e) {
    yield fork(onServerErrorHandler, e)
  } finally {
    yield setIsLoading(false)
  }
}

export function* getCategoriesActivityWorker({ payload: { meta } }) {
  try {
    yield setIsLoading(true)

    yield put({
      type: SET_CATEGORIES_ACTIVITY_TABLE_META,
      payload: {
        categoriesActivityTableMeta: meta
      }
    })

    const { items, count } = yield call(getCategoriesActivity, meta)

    yield put({
      type: SET_CATEGORIES_ACTIVITY,
      payload: {
        categoriesActivity: items,
        categoriesActivityCount: count
      }
    })
  } catch (e) {
    yield fork(onServerErrorHandler, e)
  } finally {
    yield setIsLoading(false)
  }
}

function* prepareProfileWithLogo(profileActivity) {
  try {
    return {
      ...profileActivity,
      user: {
        ...profileActivity.user,
        startup: profileActivity.user.startup
          ? {
              ...profileActivity.user.startup,
              logo30: {
                ...profileActivity.user.startup.logo30,
                image: profileActivity.user.startup.logo30
                  ? yield call(downloadCompanyAvatar, profileActivity.user.startup.logo30.id)
                  : '',
                name: !profileActivity.user.startup.logo30?.id ? profileActivity.user.startup?.companyShortName : '',
                color: !profileActivity.user.startup.logo30?.id
                  ? toColor(profileActivity.user.startup?.id.toString())
                  : ''
              }
            }
          : null,
        retailer: profileActivity.user?.retailer
          ? {
              ...profileActivity.user?.retailer,
              logo30: {
                ...profileActivity.user?.retailer?.logo30,
                image: profileActivity.user?.retailer?.logo30
                  ? yield call(downloadCompanyAvatar, profileActivity.user?.retailer.logo30.id)
                  : '',
                name: !profileActivity.user?.retailer?.logo30?.id
                  ? profileActivity.user?.retailer?.companyShortName
                  : '',
                color: !profileActivity.user?.retailer?.logo30?.id
                  ? toColor(profileActivity.user?.retailer.logo30?.id.toString())
                  : ''
              }
            }
          : null
      }
    }
  } catch (e) {
    yield fork(onServerErrorHandler, e)
  }
}

function* getProfilesActivityWithLogos(profilesActivities) {
  try {
    return yield all(profilesActivities.map(profileActivity => prepareProfileWithLogo(profileActivity)))
  } catch (e) {
    yield fork(onServerErrorHandler, e)
  }
}

export function* getProfilesActivityWorker({ payload: { meta } }) {
  try {
    yield setIsLoading(true)

    yield put({
      type: SET_PROFILES_ACTIVITY_TABLE_META,
      payload: {
        profilesActivityTableMeta: meta
      }
    })

    const { items: profilesActivities, count } = yield call(getProfilesActivity, meta)

    const profilesWithLogos = yield call(getProfilesActivityWithLogos, profilesActivities)

    yield put({
      type: SET_PROFILES_ACTIVITY,
      payload: {
        profilesActivity: profilesWithLogos,
        profilesActivityCount: count
      }
    })
  } catch (e) {
    yield fork(onServerErrorHandler, e)
  } finally {
    yield setIsLoading(false)
  }
}

function* downloadAndGenerateStartupWithLogo(startup) {
  try {
    return {
      ...startup,
      logo120: {
        ...startup.logo120,
        image: startup.logo120?.id ? yield call(downloadUserAvatar, startup.logo120?.id) : '',
        name: !startup.logo120?.id ? startup?.companyShortName : '',
        color: !startup.logo120?.id ? toColor(startup?.id.toString()) : ''
      }
    }
  } catch (e) {
    yield fork(onServerErrorHandler, e)
  }
}

function* getStartupsWithLogo(startups) {
  try {
    yield setIsLoadingListOfStartups(true)

    return yield all(startups.map(startup => downloadAndGenerateStartupWithLogo(startup)))
  } catch (e) {
    yield fork(onServerErrorHandler, e)
  } finally {
    yield setIsLoadingListOfStartups(false)
  }
}

export function* getBookmarksStartupsWorker({ payload: { filterBookmarks } }) {
  try {
    yield setIsLoadingListOfStartups(true)

    const userId = yield select(selectUserIdForProfile)

    const { items, count } = yield call(getBookmarksStartup, userId, filterBookmarks)

    const startups = yield call(getStartupsWithLogo, items)

    const bookmarksStartups = {
      startups,
      countOfRecords: count
    }

    yield put({
      type: SET_BOOKMARKS_STARTUPS,
      payload: {
        bookmarksStartups
      }
    })
  } catch (e) {
    yield fork(onServerErrorHandler, e)
  } finally {
    yield setIsLoadingListOfStartups(false)
  }
}

export function* changeFilterBookmarksStartupsWorker({ payload: { field, data } }) {
  try {
    yield setIsLoadingListOfStartups(true)

    const selectedFilterBookmarks = yield select(selectFilterBookmarks)

    const filterBookmarks = generateFilterForStartups(field, data, selectedFilterBookmarks)

    yield put({
      type: SET_FILTER_OF_BOOKMARKS,
      payload: {
        filterBookmarks
      }
    })

    yield call(getBookmarksStartupsWorker, { payload: { filterBookmarks } })
  } catch (e) {
    yield fork(onServerErrorHandler, e)
  } finally {
    yield setIsLoadingListOfStartups(false)
  }
}

export function* getRatedStartupsWorker({ payload: { filterRated } }) {
  try {
    yield setIsLoadingListOfStartups(true)

    const userId = yield select(selectUserIdForProfile)

    const { items, count } = yield call(getRatedStartups, userId, filterRated)

    const startups = yield call(getStartupsWithLogo, items)

    const ratedStartups = {
      startups,
      countOfRecords: count
    }

    yield put({
      type: SET_RATED_STARTUPS,
      payload: {
        ratedStartups
      }
    })
  } catch (e) {
    yield fork(onServerErrorHandler, e)
  } finally {
    yield setIsLoadingListOfStartups(false)
  }
}

export function* changeFilterRatedStartupsWorker({ payload: { field, data } }) {
  try {
    yield setIsLoadingListOfStartups(true)

    const selectedFilterRated = yield select(selectFilterRated)

    const filterRated = generateFilterForStartups(field, data, selectedFilterRated)

    yield put({
      type: SET_FILTER_OF_RATED_STARTUPS,
      payload: {
        filterRated
      }
    })

    yield call(getRatedStartupsWorker, { payload: { filterRated } })
  } catch (e) {
    yield fork(onServerErrorHandler, e)
  } finally {
    yield setIsLoadingListOfStartups(false)
  }
}

export function* changeUserTwoFaWorker({ payload: { twoFaData } }) {
  try {
    yield setIsLoadingListOfStartups(true)

    yield call(changeUserTwoFa, twoFaData)

    const { startup, id: userId } = yield select(selectProfile)
    const isStartup = !!startup
    const profileWorker = isStartup ? getStartupProfileWorker : getRetailerProfileWorker

    const data = {
      payload: {
        id: userId
      }
    }

    yield call(profileWorker, data)
  } catch (e) {
    yield fork(onServerErrorHandler, e)
  } finally {
    yield setIsLoadingListOfStartups(false)
  }
}
export function* getSubscriptionPlansWorker() {
  try {
    yield setIsLoading(true)

    const { items } = yield call(getSubscriptionPlans)

    yield put({
      type: SET_SUBSCRIPTION_PLANS,
      payload: {
        subscriptionPlans: items
      }
    })
  } catch (e) {
    yield fork(onServerErrorHandler, e)
  } finally {
    yield setIsLoading(false)
  }
}
export function* getPaymentReceiptsWorker({ payload: { userId } }) {
  try {
    yield setIsLoading(true)

    const receipts = yield call(getPaymentReceipts, userId)
    yield put({
      type: SET_PAYMENT_RECEIPTS,
      payload: {
        receipts
      }
    })
  } catch (e) {
    yield fork(onServerErrorHandler, e)
  } finally {
    yield setIsLoading(false)
  }
}

export function* getAllPaymentPlansNamesWorker() {
  try {
    yield setIsLoading(true)

    const { items } = yield call(getAllPaymentPlanNames)

    yield put({
      type: SET_ALL_PAYMENT_PLANS_NAMES,
      payload: {
        paymentPlansNames: items
      }
    })
  } catch (e) {
    yield fork(onServerErrorHandler, e)
  } finally {
    yield setIsLoading(false)
  }
}

export function* getPricesWorker() {
  try {
    yield setIsLoading(true)

    const { items } = yield call(getPrices)

    yield put({
      type: SET_PRICES,
      payload: {
        prices: items
      }
    })
  } catch (e) {
    yield fork(onServerErrorHandler, e)
  } finally {
    yield setIsLoading(false)
  }
}

export function* saveNewSubscriptionPlanWorker({ payload: { newPaymentPlan, closeModal, setFormError } }) {
  try {
    yield setIsLoading(true)

    yield call(createNewPaymentPlan, newPaymentPlan)

    yield getSubscriptionPlansWorker()
    yield call(closeModal)
    yield setSnackbar({
      text: 'Payment plan successfully created',
      type: enums.snackbarTypes.info
    })
  } catch (e) {
    yield call(setFormError, e.response.data.message)
    yield fork(onServerErrorHandler, e)
  } finally {
    setIsLoading(false)
  }
}

export function* editSubscriptionPlanWorker({
  payload: { updatedPlan, closeEditSubscriptionPlanModal, setFormError }
}) {
  try {
    yield setIsLoading(true)

    yield call(updatePaymentPlan, { planId: updatedPlan?.id, paymentPlan: updatedPlan })

    yield getSubscriptionPlansWorker()
    yield call(closeEditSubscriptionPlanModal)
    yield setSnackbar({
      text: 'Payment plan successfully updated',
      type: enums.snackbarTypes.info
    })
  } catch (e) {
    yield call(setFormError, e.response.data.message)
    yield fork(onServerErrorHandler, e, true)
  } finally {
    setIsLoading(false)
  }
}

export function* deleteSubscriptionPlanWorker({ payload: { id } }) {
  try {
    yield setIsLoading(true)

    yield call(deleteSubscriptionPlan, id)

    yield getSubscriptionPlansWorker()
    yield setSnackbar({
      text: 'Payment plan successfully removed',
      type: enums.snackbarTypes.info
    })
  } catch (e) {
    yield fork(onServerErrorHandler, e, true)
  } finally {
    setIsLoading(false)
  }
}
export function* getFeaturesWorker() {
  try {
    yield setIsLoading(true)

    const { items: features } = yield call(getFeatures)

    yield put({
      type: SET_FEATURES,
      payload: {
        features
      }
    })
  } catch (e) {
    yield fork(onServerErrorHandler, e)
  } finally {
    yield setIsLoading(false)
  }
}

export function* createNewFeatureWorker({ payload: { featureData, onClose } }) {
  try {
    yield setIsLoading(true)

    yield call(createNewFeature, featureData)

    yield call(onClose)

    yield call(getFeaturesWorker)
  } catch (e) {
    yield fork(onServerErrorHandler, e)
  } finally {
    yield setIsLoading(false)
  }
}

export function* editFeatureWorker({ payload: { featuresData, onClose } }) {
  try {
    yield setIsLoading(true)

    yield call(editFeature, featuresData)

    yield call(onClose)

    yield call(getFeaturesWorker)
  } catch (e) {
    yield fork(onServerErrorHandler, e)
  } finally {
    yield setIsLoading(false)
  }
}

export function* deleteFeatureWorker({ payload: { featureId } }) {
  try {
    yield setIsLoading(true)

    yield call(deleteFeature, featureId)

    yield call(getFeaturesWorker)
  } catch (e) {
    yield fork(onServerErrorHandler, e)
  } finally {
    yield setIsLoading(false)
  }
}

export function* getMemberGroupsWorker() {
  try {
    yield setIsLoading(true)

    const { items: memberGroups } = yield call(getMemberGroups)

    yield put({
      type: SET_MEMBER_GROUPS,
      payload: {
        memberGroups
      }
    })
  } catch (e) {
    yield fork(onServerErrorHandler, e)
  } finally {
    yield setIsLoading(false)
  }
}

export function* createNewMemberGroupWorker({ payload: { memberGroupData, onClose } }) {
  try {
    yield setIsLoading(true)

    yield call(createNewMemberGroup, memberGroupData)

    yield call(onClose)

    yield setSnackbar({
      text: successAddedMemberGroup,
      type: enums.snackbarTypes.info
    })

    yield call(getMemberGroupsWorker)
  } catch (e) {
    yield fork(onServerErrorHandler, e)
  } finally {
    yield setIsLoading(false)
  }
}

export function* editMemberGroupWorker({ payload: { groupId, memberGroupData, onClose } }) {
  try {
    yield setIsLoading(true)

    yield call(editMemberGroup, { groupId, memberGroupData })

    yield call(onClose)

    yield setSnackbar({
      text: successEditedMemberGroup,
      type: enums.snackbarTypes.info
    })

    yield call(getMemberGroupsWorker)
  } catch (e) {
    yield fork(onServerErrorHandler, e)
  } finally {
    yield setIsLoading(false)
  }
}

export function* deleteMemberGroupWorker({ payload: { groupId } }) {
  try {
    yield setIsLoading(true)

    yield call(deleteMemberGroup, groupId)

    yield setSnackbar({
      text: successDeletedMemberGroup,
      type: enums.snackbarTypes.info
    })

    yield call(getMemberGroupsWorker)
  } catch (e) {
    yield fork(onServerErrorHandler, e)
  } finally {
    yield setIsLoading(false)
  }
}

export function* getEnterpriseCodesWorker() {
  try {
    yield setIsLoading(true)

    const { items: enterpriseCodes } = yield call(getEnterpriseCodes)

    yield put({
      type: SET_ENTERPRISE_CODES,
      payload: {
        enterpriseCodes
      }
    })
  } catch (e) {
    yield fork(onServerErrorHandler, e)
  } finally {
    yield setIsLoading(false)
  }
}

export function* editEnterpriseCodeWorker({ payload: { id, enterpriseCode, onClose } }) {
  try {
    yield setIsLoading(true)

    yield call(editEnterpriseCode, { id, enterpriseCode })

    yield call(onClose)

    yield getEnterpriseCodesWorker()
    yield setSnackbar({
      text: 'Enterprise Code successfully updated',
      type: enums.snackbarTypes.info
    })
  } catch (e) {
    yield fork(onServerErrorHandler, e)
  } finally {
    yield setIsLoading(false)
  }
}

export function* changePaymentPlanStatusWorker({ payload: { id, isHidden } }) {
  try {
    yield setIsLoading(true)

    const req = isHidden ? unHidePaymentPlan : hidePaymentPlan

    yield call(req, id)

    yield getSubscriptionPlansWorker()
  } catch (e) {
    yield fork(onServerErrorHandler, e)
  } finally {
    yield setIsLoading(false)
  }
}
