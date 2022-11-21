import {
  HANDLE_MENU_ITEM,
  GET_STARTUPS,
  GET_RETAILERS,
  APPROVE_USER,
  HANDLE_STARTUP_ACTIVATION,
  HANDLE_RETAILER_ACTIVATION,
  SET_STARTUPS_TABLE_META,
  SET_RETAILERS_TABLE_META,
  GET_PROFILE_STARTUP,
  CLEAR_PROFILE,
  HANDLE_STARTUP_PROFILE_ACTIVATION,
  APPROVE_USER_PROFILE,
  UPDATE_COMPANY_DETAILS_PROFILE,
  UPDATE_SECTOR_OF_COMPETENCE_PROFILE,
  UPDATE_AREAS_OF_INTEREST_PROFILE,
  UPDATE_TAGS_PROFILE,
  UPDATE_ACCOUNT_INFORMATION,
  SET_IS_LOADING,
  HANDLE_REMOVE_DOCUMENTS_PROFILE,
  HANDLE_MAILING,
  UPLOAD_PROFILE_LOGO,
  UPLOAD_USER_AVATAR,
  HANDLE_STARTUP_FILTERS,
  RESET_STARTUP_FILTERS,
  HANDLE_SEARCH_REQUEST,
  GET_FEEDBACKS,
  HANDLE_UPDATE_FEEDBACK,
  HANDLE_REMOVE_FEEDBACK,
  UPDATE_ADMIN_NOTE,
  SEND_ADMIN_NOTIFICATION,
  GET_CATEGORIES,
  HANDLE_CREATE_CATEGORY,
  HANDLE_UPDATE_CATEGORY,
  HANDLE_DELETE_CATEGORY,
  HANDLE_RETAILER_FILTERS,
  RESET_RETAILER_FILTERS,
  HANDLE_VERIFY_USER,
  HANDLE_VERIFY_PROFILE,
  GET_REPORTS,
  SET_USERS_ROLES,
  GET_PROFILE_RETAILER,
  UPDATE_REPORT_STATUS,
  UPDATE_BILLING_ADDRESS,
  GET_CATEGORIES_ACTIVITY,
  GET_PROFILES_ACTIVITY,
  GET_BOOKMARKS_STARTUPS,
  CHANGE_FILTER_OF_BOOKMARKS,
  GET_RATED_STARTUPS,
  CHANGE_FILTER_OF_RATED_STARTUPS,
  GET_COMPANY_MEMBERS,
  CHANGE_USER_TWO_FA,
  GET_SUBSCRIPTION_PLANS,
  GET_ALL_PAYMENT_PLANS_NAMES,
  GET_PRICES,
  SAVE_NEW_SUBSCRIPTION_PLAN,
  GET_MEMBER_GROUPS,
  EDIT_SUBSCRIPTION_PLAN,
  DELETE__SUBSCRIPTION_PLAN,
  GET_FEATURES,
  CREATE_NEW_FEATURE,
  EDIT_FEATURE,
  DELETE_FEATURE,
  CREATE_NEW_MEMBER_GROUP,
  EDIT_MEMBER_GROUP,
  DELETE_MEMBER_GROUP,
  GET_ENTERPRISE_CODES,
  EDIT_ENTERPRISE_CODE,
  CHANGE_PAYMENT_PLAN_STATUS,
  GET_PAYMENT_RECEIPTS,
  CREATE_PAYMENT_RECEIPTS,
  GET_ALL_PAYMENT_RECEIPTS,
  UPDATE_PAYMENT_RECEIPTS
} from './index'
import { checkEmailForExisting } from '@api/auth'
import { onServerErrorHandler } from '@ducks/common/sagas'
import {
  createAuthority,
  saveStartupInternalGallery,
  updateAuthority,
  updateStartupFiles,
  updateStartupVideo
} from '@api/adminApi'

export const setIsLoading = isLoading => ({
  type: SET_IS_LOADING,
  payload: { isLoading }
})

export const handleMenuItem = data => ({
  type: HANDLE_MENU_ITEM,
  payload: {
    itemIndex: data
  }
})

export const getStartups = data => ({
  type: GET_STARTUPS,
  payload: { data }
})

export const setStartupsTableMeta = tableMeta => ({
  type: SET_STARTUPS_TABLE_META,
  payload: { tableMeta }
})

export const getRetailers = data => ({
  type: GET_RETAILERS,
  payload: { data }
})

export const setRetailersTableMeta = tableMeta => ({
  type: SET_RETAILERS_TABLE_META,
  payload: { tableMeta }
})

export const approveUser = data => ({
  type: APPROVE_USER,
  payload: data
})

export const approveUserProfile = data => ({
  type: APPROVE_USER_PROFILE,
  payload: data
})

export const handleStartupActivation = data => ({
  type: HANDLE_STARTUP_ACTIVATION,
  payload: data
})

export const handleStartupProfileActivation = data => ({
  type: HANDLE_STARTUP_PROFILE_ACTIVATION,
  payload: data
})

export const handleRetailerActivation = data => ({
  type: HANDLE_RETAILER_ACTIVATION,
  payload: data
})

export const getProfileStartupForAdmin = id => ({
  type: GET_PROFILE_STARTUP,
  payload: id
})

export const getProfileRetailerForAdmin = id => ({
  type: GET_PROFILE_RETAILER,
  payload: id
})

export const clearProfile = () => ({
  type: CLEAR_PROFILE
})

export const updateCompanyDetails = data => ({
  type: UPDATE_COMPANY_DETAILS_PROFILE,
  payload: data
})

export const handleUpdateSectorOfCompetenceProfile = data => ({
  type: UPDATE_SECTOR_OF_COMPETENCE_PROFILE,
  payload: data
})

export const handleUpdateAreasOfInterestProfile = data => ({
  type: UPDATE_AREAS_OF_INTEREST_PROFILE,
  payload: data
})

export const handleUpdateTagsProfile = data => ({
  type: UPDATE_TAGS_PROFILE,
  payload: data
})

export const handleUpdateAccountInformation = data => ({
  type: UPDATE_ACCOUNT_INFORMATION,
  payload: data
})

export const handleUpdateBillingAddress = data => ({
  type: UPDATE_BILLING_ADDRESS,
  payload: data
})

export const checkEmailForExistingAccountInformation = data => async dispatch => {
  try {
    dispatch(setIsLoading(true))

    return await checkEmailForExisting(data)
  } catch (e) {
    onServerErrorHandler(e)
  } finally {
    dispatch(setIsLoading(false))
  }
}

export const handleRemoveDocumentProfile = data => ({
  type: HANDLE_REMOVE_DOCUMENTS_PROFILE,
  payload: data
})

export const handleMailingProfile = data => ({
  type: HANDLE_MAILING,
  payload: data
})

export const handleUploadStartupLogoProfile = data => ({
  type: UPLOAD_PROFILE_LOGO,
  payload: data
})

export const handleUploadUserAvatarProfile = data => ({
  type: UPLOAD_USER_AVATAR,
  payload: data
})

export const handleStartupFilters = data => ({
  type: HANDLE_STARTUP_FILTERS,
  payload: data
})

export const handleRetailerFilters = data => ({
  type: HANDLE_RETAILER_FILTERS,
  payload: data
})

export const clearStartupFilters = () => ({
  type: RESET_STARTUP_FILTERS
})

export const clearRetailerFilters = () => ({
  type: RESET_RETAILER_FILTERS
})

export const handleSearchRequestFilters = data => ({
  type: HANDLE_SEARCH_REQUEST,
  payload: data
})

export const getFeedbacks = data => ({
  type: GET_FEEDBACKS,
  payload: data
})

export const updateFeedback = data => ({
  type: HANDLE_UPDATE_FEEDBACK,
  payload: data
})

export const removeFeedback = data => ({
  type: HANDLE_REMOVE_FEEDBACK,
  payload: data
})

export const updateAdminNoteProfile = data => ({
  type: UPDATE_ADMIN_NOTE,
  payload: data
})

export const sendAdminNotification = ({ recipientId, message }) => ({
  type: SEND_ADMIN_NOTIFICATION,
  payload: { recipientId, message }
})

export const getCategories = () => ({
  type: GET_CATEGORIES
})

export const handleCreateCategory = data => ({
  type: HANDLE_CREATE_CATEGORY,
  payload: data
})

export const handleUpdateCategory = data => ({
  type: HANDLE_UPDATE_CATEGORY,
  payload: data
})

export const handleDeleteCategory = id => ({
  type: HANDLE_DELETE_CATEGORY,
  payload: id
})

export const handleVerifyUser = data => ({
  type: HANDLE_VERIFY_USER,
  payload: data
})

export const saveGallery =
  ({ galleryData, id }) =>
  async (dispatch, getState) => {
    try {
      dispatch(setIsLoading(true))

      const { profile } = getState().admin

      await Promise.all([
        updateStartupFiles({ documentId: galleryData.fileId, id }),
        updateStartupVideo({
          title: galleryData.title,
          description: galleryData.description,
          source: galleryData.source,
          link: galleryData.link,
          id,
          videoId: galleryData?.videoId
        })
      ])

      dispatch({ type: GET_PROFILE_STARTUP, payload: { id: profile.id } })
    } catch (e) {
      dispatch(onServerErrorHandler(e))
    } finally {
      dispatch(setIsLoading(false))
    }
  }

export const handleVerifyProfile = () => ({
  type: HANDLE_VERIFY_PROFILE
})

export const saveInternalGallery = galleryData => async dispatch => {
  await saveStartupInternalGallery(galleryData)

  dispatch(getProfileStartupForAdmin({ id: galleryData.id }))
}

export const getReports = meta => ({
  type: GET_REPORTS,
  payload: { meta, withLoading: true }
})

export const onNewReportStatus = () => ({
  type: UPDATE_REPORT_STATUS
})

export const saveRole = (name, id) => async (dispatch, getState) => {
  const { usersRoles } = getState().admin
  const { data: updatedRole } = await updateAuthority(id, name)

  dispatch({
    type: SET_USERS_ROLES,
    payload: { userRoles: usersRoles.map(item => (item.id === updatedRole.id ? updatedRole : item)) }
  })
}

export const createNewRole = name => async (dispatch, getState) => {
  try {
    const { usersRoles } = getState().admin

    setIsLoading(true)

    const { data: newRole } = await createAuthority(name)

    dispatch({
      type: SET_USERS_ROLES,
      payload: { userRoles: [...usersRoles, newRole] }
    })
  } catch (e) {
    onServerErrorHandler(e)
  } finally {
    setIsLoading(false)
  }
}

export const getCategoriesActivity = meta => ({
  type: GET_CATEGORIES_ACTIVITY,
  payload: { meta }
})

export const getProfilesActivity = meta => ({
  type: GET_PROFILES_ACTIVITY,
  payload: { meta }
})

export const getBookmarksStartup = data => ({
  type: GET_BOOKMARKS_STARTUPS,
  payload: data
})

export const changeFilterOfBookmarks = data => ({
  type: CHANGE_FILTER_OF_BOOKMARKS,
  payload: data
})

export const getRatedStartups = data => ({
  type: GET_RATED_STARTUPS,
  payload: data
})

export const changeFilterOfRatedStartups = data => ({
  type: CHANGE_FILTER_OF_RATED_STARTUPS,
  payload: data
})

export const getCompanyMembers = profileId => ({
  type: GET_COMPANY_MEMBERS,
  payload: { profileId }
})

export const changeUserTwoFa = twoFaData => ({
  type: CHANGE_USER_TWO_FA,
  payload: { twoFaData }
})

export const getFeatures = () => ({
  type: GET_FEATURES
})

export const createNewFeature = (featureData, onClose) => ({
  type: CREATE_NEW_FEATURE,
  payload: { featureData, onClose }
})

export const editFeature = ({ featuresData, onClose }) => ({
  type: EDIT_FEATURE,
  payload: { featuresData, onClose }
})

export const deleteFeature = featureId => ({
  type: DELETE_FEATURE,
  payload: { featureId }
})

export const saveNewSubscriptionPlan = (newPaymentPlan, closeModal, setFormError) => ({
  type: SAVE_NEW_SUBSCRIPTION_PLAN,
  payload: { newPaymentPlan, closeModal, setFormError }
})

export const deleteSubscriptionPlan = id => ({
  type: DELETE__SUBSCRIPTION_PLAN,
  payload: { id }
})

export const editSubscriptionPlan = (updatedPlan, closeEditSubscriptionPlanModal, setFormError) => ({
  type: EDIT_SUBSCRIPTION_PLAN,
  payload: { updatedPlan, closeEditSubscriptionPlanModal, setFormError }
})

export const getSubscriptionPlans = () => ({
  type: GET_SUBSCRIPTION_PLANS
})
export const getPaymentReceipts = userId => ({
  type: GET_PAYMENT_RECEIPTS,
  payload: { userId }
})
export const createPaymentReceipts = payload => ({
  type: CREATE_PAYMENT_RECEIPTS,
  payload
})
export const updatePaymentReceipts = payload => ({
  type: UPDATE_PAYMENT_RECEIPTS,
  payload
})
export const getAllPaymentPlanNames = () => ({
  type: GET_ALL_PAYMENT_PLANS_NAMES
})
export const getAllPaymentReceipts = () => ({
  type: GET_ALL_PAYMENT_RECEIPTS
})

export const getPrices = () => ({
  type: GET_PRICES
})

export const getMemberGroups = () => ({
  type: GET_MEMBER_GROUPS
})

export const createNewMemberGroup = (memberGroupData, onClose) => ({
  type: CREATE_NEW_MEMBER_GROUP,
  payload: { memberGroupData, onClose }
})

export const editMemberGroup = ({ groupId, memberGroupData, onClose }) => ({
  type: EDIT_MEMBER_GROUP,
  payload: { groupId, memberGroupData, onClose }
})

export const deleteMemberGroup = groupId => ({
  type: DELETE_MEMBER_GROUP,
  payload: { groupId }
})

export const getEnterpriseCodes = () => ({
  type: GET_ENTERPRISE_CODES
})

export const editEnterpriseCode = ({ id, enterpriseCode, onClose }) => ({
  type: EDIT_ENTERPRISE_CODE,
  payload: { id, enterpriseCode, onClose }
})

export const handleChangePaymentPlanStatus = (id, isHidden) => ({
  type: CHANGE_PAYMENT_PLAN_STATUS,
  payload: { id, isHidden }
})
