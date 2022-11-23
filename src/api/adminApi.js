import { client } from './clientApi'
import enums from '@constants/enums'
import promiseMemoize from '@utils/promiseMemoize'
import { svgConverter } from '@utils/imageConverter'
import { fileSaver } from '@utils/fileSaver'
import axios from 'axios'
import { downloadUserAvatar } from '@api/fileUploadingApi'
import { toColor } from '@utils'
import { getItemFromStorage } from '@utils/storage'

const { ADMIN_SERVER_URL } = process.env
const { FILE_UPLOADER_URI } = process.env

export const getStartups = data => client.post(`${ADMIN_SERVER_URL}/v1/admin/startup/view/all`, data)

export const getStartupsCount = data => client.post(`${ADMIN_SERVER_URL}/v1/admin/startup/view/all/count`, data)

export const approveUser = ids => client.post(`${ADMIN_SERVER_URL}/v1/admin/approve/approve-users`, { ids })

export const approveStartups = ids => client.post(`${ADMIN_SERVER_URL}/v1/admin/approve/approve-startups`, { ids })

export const blockStartup = ids => client.post(`${ADMIN_SERVER_URL}/v1/admin/startup/status/block`, { ids })

export const unBlockStartup = ids => client.post(`${ADMIN_SERVER_URL}/v1/admin/startup/status/unblock`, { ids })

export const getRetailers = data => client.post(`${ADMIN_SERVER_URL}/v1/admin/retailer/view/all`, data)

export const getRetailersCount = data => client.post(`${ADMIN_SERVER_URL}/v1/admin/retailer/view/all/count`, data)

export const getRetailerProfile = id => client.post(`${ADMIN_SERVER_URL}/v1/admin/retailer/view/one/${id}`)

export const blockRetailer = ids => client.post(`${ADMIN_SERVER_URL}/v1/admin/retailer/status/block`, { ids })

export const unBlockRetailer = ids => client.post(`${ADMIN_SERVER_URL}/v1/admin/retailer/status/unblock`, { ids })

export const getStartupProfile = id => client.get(`${ADMIN_SERVER_URL}/v1/admin/startup/view/one/${id}`)

export const updateCompanyDetailsDemo = (data, id) =>
  client.post(`${ADMIN_SERVER_URL}/v1/admin/startup/edit/${id}/update-startup-info/demo`, data)

export const updateCompanyDetailsStartup = (data, id) =>
  client.post(`${ADMIN_SERVER_URL}/v1/admin/startup/edit/${id}/update-startup-info/standard`, data)

export const updateCompanyDetailsIncomplete = (data, id) =>
  client.post(`${ADMIN_SERVER_URL}/v1/admin/startup/edit/${id}/update-startup-info/incomplete`, data)

export const updateCompanyDetailsRetailer = (data, id) =>
  client.post(`${ADMIN_SERVER_URL}/v1/admin/retailer/edit/${id}/update-company-details`, data)

export const updateSectorOfCompetence = (data, id) =>
  client.post(`${ADMIN_SERVER_URL}/v1/admin/startup/edit/${id}/update-startup-sectors`, data)

export const updateAreasOfInterest = (data, id) =>
  client.post(`${ADMIN_SERVER_URL}/v1/admin/startup/edit/${id}/update-startup-areas`, data)

export const updateTags = (data, id) =>
  client.post(`${ADMIN_SERVER_URL}/v1/admin/startup/edit/${id}/update-startup-tags`, data)

export const updateAccountInformation = (data, id) =>
  client.post(`${ADMIN_SERVER_URL}/v1/admin/startup/edit/${id}/update-user-info`, data)

export const updateAccountInformationRetailer = (data, id) =>
  client.post(`${ADMIN_SERVER_URL}/v1/admin/retailer/edit/${id}/update-account-information`, data)

export const saveStartupInternalGallery = ({ title, link, description, source, id, videoId }) => {
  const videoLink = videoId
    ? link
      ? `${ADMIN_SERVER_URL}/v1/admin/startup/internal-info/edit/interview/${id}/update/${videoId}`
      : `${ADMIN_SERVER_URL}/v1/admin/startup/internal-info/edit/interview/${id}/delete/${videoId}`
    : `${ADMIN_SERVER_URL}/v1/admin/startup/internal-info/edit/interview/${id}/create`

  return videoId && !link
    ? client.delete(videoLink)
    : client.post(videoLink, {
        description: description || null,
        link: link,
        source: source || null,
        title: title
      })
}

export const updateStartupFiles = ({ documentId, id }) =>
  client.post(`${ADMIN_SERVER_URL}/v1/admin/startup/startup-gallery/edit/${id}/files/update`, { documentId })

export const removeStartupVideo = ({ title, link, description, source, id, videoId }) =>
  client.delete(`${ADMIN_SERVER_URL}/v1/admin/startup/startup-gallery/edit/${id}/video/delete/${videoId}`, {
    title,
    link,
    description: description || null,
    source
  })

export const createStartupGallery = ({ title, link, description, source, id }) =>
  client.post(`${ADMIN_SERVER_URL}/v1/admin/startup/startup-gallery/edit/${id}/video/create`, {
    title,
    link,
    description: description || null,
    source
  })

export const updateStartupGallery = ({ title, link, description, source, id, videoId }) =>
  client.post(`${ADMIN_SERVER_URL}/v1/admin/startup/startup-gallery/edit/${id}/video/update/${videoId}`, {
    title,
    link,
    description: description || null,
    source
  })

export const updateStartupVideo = galleryData => {
  return galleryData.videoId
    ? galleryData.link
      ? updateStartupGallery(galleryData)
      : removeStartupVideo(galleryData)
    : galleryData.link
    ? createStartupGallery(galleryData)
    : new Promise(resolve => resolve())
}

export const enableMailing = data => client.post(`${ADMIN_SERVER_URL}/v1/admin/startup/edit/chat/enable`, data)

export const disableMailing = data => client.post(`${ADMIN_SERVER_URL}/v1/admin/startup/edit/chat/disable`, data)

export const updateStartupLogo = (data, id) =>
  client.post(`${ADMIN_SERVER_URL}/v1/admin/startup/edit/${id}/update-startup-logo`, data)

export const updateRetailerLogo = data =>
  client.post(`${ADMIN_SERVER_URL}/v1/admin/retailer/edit/update-retailer-logo`, data)

export const updateUserAvatar = (data, id) =>
  client.post(`${ADMIN_SERVER_URL}/v1/admin/startup/edit/${id}/update-startup-user-avatar`, data)

export const updateUserRetailerAvatar = data =>
  client.post(`${ADMIN_SERVER_URL}/v1/admin/retailer/edit/update-user-logo`, data)

export const updateFeedback = (data, id) =>
  client.post(`${ADMIN_SERVER_URL}/v1/admin/startup/feedback/${id}/update`, data)

export const removeFeedback = id => client.delete(`${ADMIN_SERVER_URL}/v1/admin/startup/feedback/${id}/delete`)

export const updateAdminNote = (data, id) =>
  client.post(`${ADMIN_SERVER_URL}/v1/admin/startup/note/${id}/update-admin-note`, data)

export const updateBillingAddress = (data, id) =>
  client.post(`${ADMIN_SERVER_URL}/v1/admin/retailer/billing-details/${id}/update`, data)

export const sendAdminNotification = ({ userId, message, isActualAlways = true, title = 'Admin notification' }) =>
  client.post(`${ADMIN_SERVER_URL}/v1/admin/startup/direct/send/${userId}`, {
    title,
    text: message,
    notificationType: enums.notificationTypes.adminNotification,
    isActualAlways
  })

export const sendAdminNotificationToUser = ({ userId, message, isActualAlways = true, title = 'Admin notification' }) =>
  client.post(`${ADMIN_SERVER_URL}/v1/admin/user/direct/send/${userId}`, {
    title,
    text: message,
    notificationType: enums.notificationTypes.adminNotification,
    isActualAlways
  })

export const getCategories = () => client.get(`${ADMIN_SERVER_URL}/v1/admin/categories/view/all`)

export const createCategory = data => client.post(`${ADMIN_SERVER_URL}/v1/admin/categories/edit/create`, data)

export const updateCategory = data =>
  client.post(`${ADMIN_SERVER_URL}/v1/admin/categories/edit/update/${data.id}`, data)

export const deleteCategory = categoryId =>
  client.delete(`${ADMIN_SERVER_URL}/v1/admin/categories/delete/${categoryId}`)

export const uploadCategoryIcon = file => {
  const formData = new FormData()
  formData.append('file', file)

  return client.post(`${FILE_UPLOADER_URI}/v1/logo/upload/svg`, formData)
}

export const downloadCategoryIcon = promiseMemoize(id => {
  return client
    .get(`${FILE_UPLOADER_URI}/v1/user-avatar/download/${id}`, {
      responseType: 'text'
    })
    .then(svgString => {
      return svgConverter(svgString)
    })
})

export const verifyRetailer = retailerIds =>
  client.post(`${ADMIN_SERVER_URL}/v1/admin/retailer/edit/verify-retailer-email`, { retailerIds })

export const verifyStartup = startupIds =>
  client.post(`${ADMIN_SERVER_URL}/v1/admin/startup/edit/verify-startup-email`, { startupIds })

export const getAllReports = filterInDto =>
  client.post(`${ADMIN_SERVER_URL}/v1/admin/startup/analysis/report/find-all-reports`, filterInDto)

export const getCountOfAllReports = () =>
  client.get(`${ADMIN_SERVER_URL}/v1/admin/startup/analysis/report/count-reports`)

export const cancelReportById = id =>
  client.delete(`${ADMIN_SERVER_URL}/v1/admin/startup/report/cancel-report-by-id/${id}`)

export const getAllAuthority = () => client.get(`${ADMIN_SERVER_URL}/v1/admin/authority/all`)

export const getAuthorityWithPermissionsForProfile = () =>
  client.get(`${ADMIN_SERVER_URL}/v1/admin/activity/all-activities`)

export const getAuthorityWithPermissions = () => client.get(`${ADMIN_SERVER_URL}/v1/admin/authority/all-permissions`)

export const getAuthorityCountById = id => client.get(`${ADMIN_SERVER_URL}/v1/admin/authority/count/${id}`)

export const createAuthority = ({ name, permissions }) =>
  client.post(`${ADMIN_SERVER_URL}/v1/admin/authority/create`, {
    name,
    permissions
  })

export const getAllVariantsOfPermissions = () => client.get(`${ADMIN_SERVER_URL}/v1/admin/authority/permission/all`)

export const updateAuthority = ({ id, name, permissions }) =>
  client.post(`${ADMIN_SERVER_URL}/v1/admin/authority/update/${id}`, {
    name,
    permissions
  })

export const checkIsPublicRetailer = id =>
  client.post(`${ADMIN_SERVER_URL}/v1/admin/retailer/view/check-retailer-type/${id}`)

export const deleteAuthority = ({ id }) => client.delete(`${ADMIN_SERVER_URL}/v1/admin/authority/delete/${id}`)

export const downloadReportFile = id => {
  const sessionToken = getItemFromStorage('accessToken')

  return axios
    .get(`${FILE_UPLOADER_URI}/v1/document/download/${id}`, {
      responseType: 'blob',
      headers: {
        Authorization: `Bearer ${sessionToken}`
      }
    })
    .then(res => {
      const contentDispositionHeader = res.headers['content-disposition']
      const fileName = contentDispositionHeader.split(';')[1].trim().split('"')[1]
      const blob = new Blob([res.data])

      fileSaver(blob, fileName)
    })
}

export const getCategoriesActivity = meta => client.post(`${ADMIN_SERVER_URL}/v1/admin/activity/category/all`, meta)

export const getProfilesActivity = meta => client.post(`${ADMIN_SERVER_URL}/v1/admin/activity/profile/all`, meta)

export const createNewAdminUser = ({
  authorityId,
  avatarId,
  email,
  firstName,
  lastName,
  password,
  phoneNumber,
  countryId,
  city
}) =>
  client.post(`${ADMIN_SERVER_URL}/v1/admin/admins/create`, {
    authorityId,
    avatarId,
    email,
    firstName,
    lastName,
    password,
    phoneNumber,
    countryId,
    city
  })

export const updateAdminUser = ({
  updatedUser: { authorityId, avatarId, email, firstName, lastName, password, phoneNumber, countryId, city },
  id
}) =>
  client.post(`${ADMIN_SERVER_URL}/v1/admin/admins/update/${id}`, {
    authorityId,
    avatarId,
    email,
    firstName,
    lastName,
    password,
    phoneNumber,
    countryId,
    city
  })

export const getBookmarksStartup = (id, { page, pageSize, sort: { direction, fieldName } }) =>
  client.post(`${ADMIN_SERVER_URL}/v1/admin/retailer/view/get-all-bookmark/${id}`, {
    page,
    pageSize,
    sort: {
      direction,
      fieldName
    }
  })

export const getRatedStartups = (id, { page, pageSize, sort: { direction, fieldName } }) =>
  client.post(`${ADMIN_SERVER_URL}/v1/admin/retailer/view/get-all-rated/${id}`, {
    page,
    pageSize,
    sort: {
      direction,
      fieldName
    }
  })

export const fetchAdminUsers = ({ page, size, sort }, filter = []) =>
  client.post(`${ADMIN_SERVER_URL}/v1/admin/admins/all`, {
    fields: filter,
    page,
    size,
    sort
  })

export const fetchDiscountCoupons = code =>
  client.post(`${ADMIN_SERVER_URL}/v1/admin/payment/discount/codes/all`, {
    code
  })

export const removeDiscountCoupons = codeIds =>
  client.post(`${ADMIN_SERVER_URL}/v1/admin/payment/discount/codes/delete`, {
    codeIds
  })

export const cancelDiscountCoupons = codeIds =>
  client.post(`${ADMIN_SERVER_URL}/v1/admin/payment/discount/codes/cancel`, {
    codeIds
  })

export const blockDiscountCoupons = codeIds =>
  client.post(`${ADMIN_SERVER_URL}/v1/admin/payment/discount/codes/block`, {
    codeIds
  })

export const unblockDiscountCoupons = codeIds =>
  client.post(`${ADMIN_SERVER_URL}/v1/admin/payment/discount/codes/unblock`, {
    codeIds
  })

export const createNewDiscountCoupon = ({
  amountOff,
  code,
  currency,
  duration,
  durationInMonths,
  maxRedemptions,
  name,
  percentOff,
  planIds,
  redeemBy
}) =>
  client.post(`${ADMIN_SERVER_URL}/v1/admin/payment/discount/codes/create`, {
    amountOff,
    code,
    currency,
    duration,
    durationInMonths,
    maxRedemptions,
    name,
    percentOff,
    planIds,
    redeemBy
  })

export const updateDiscountCoupon = ({ name, codeId }) =>
  client.post(`${ADMIN_SERVER_URL}/v1/admin/payment/discount/codes/update/${codeId}`, {
    name
  })

export const activateAdminUser = ids =>
  client.post(`${ADMIN_SERVER_URL}/v1/admin/admins/status/unblock`, {
    ids
  })

export const deActivateAdminUser = ids =>
  client.post(`${ADMIN_SERVER_URL}/v1/admin/admins/status/block`, {
    ids
  })

export const createNewMember = ({
  avatar120Id,
  avatar30Id,
  avatar60Id,
  avatarId,
  city,
  countryId,
  department,
  email,
  firstName,
  lastName,
  note,
  password,
  position,
  retailerId
}) =>
  client.post(`${ADMIN_SERVER_URL}/v1/admin/member/add/new-member`, {
    avatar120Id,
    avatar30Id,
    avatar60Id,
    avatarId,
    city,
    countryId,
    department,
    email,
    firstName,
    lastName,
    note: note || null,
    password,
    position,
    retailerId
  })

export const editMember = ({
  avatar120Id,
  avatar30Id,
  avatar60Id,
  avatarId,
  city,
  countryId,
  department,
  email,
  firstName,
  lastName,
  note,
  password,
  position,
  isBlocked,
  userId
}) =>
  client.post(`${ADMIN_SERVER_URL}/v1/admin/member/edit/${userId}/update-account-information`, {
    avatar120Id,
    avatar30Id,
    avatar60Id,
    avatarId,
    city,
    countryId,
    department,
    email,
    firstName,
    isBlocked,
    lastName,
    note,
    password,
    position
  })

export const getCompanyMembers = ({ profileId, departmentId }) => {
  return client.post(`${ADMIN_SERVER_URL}/v1/admin/member/view/all`, {
    userRetailerId: profileId,
    departmentId
  })
}

export const downloadMemberAvatar = member => {
  return downloadUserAvatar(member.avatar60?.id).then(avatar60 => {
    return {
      ...member,
      avatar60: {
        ...member.avatar60,
        image: member.avatar60?.id ? avatar60 : '',
        name: !member.avatar60?.id && member.fullName ? member.fullName : 'Retail Hub',
        color: !member.avatar60?.id ? toColor(member.id.toString()) : ''
      }
    }
  })
}

export const changeMemberStatus = (memberId, isBlocked) =>
  client.put(`${ADMIN_SERVER_URL}/v1/admin/member/edit/${memberId}/change-member-status`, { isBlocked })

export const removeMember = memberId => client.delete(`${ADMIN_SERVER_URL}/v1/admin/member/delete/${memberId}`)

export const changeUserTwoFa = twoFaData => client.post(`${ADMIN_SERVER_URL}/v1/admin/authentication`, twoFaData)

export const getFeatures = () => client.post(`${ADMIN_SERVER_URL}/v1/admin/payment/catalog/features/all`)

export const createNewFeature = featureData =>
  client.post(`${ADMIN_SERVER_URL}/v1/admin/payment/catalog/features/create`, featureData)

export const editFeature = items =>
  client.post(`${ADMIN_SERVER_URL}/v1/admin/payment/catalog/features/update`, { items })

export const deleteFeature = featureId =>
  client.delete(`${ADMIN_SERVER_URL}/v1/admin/payment/catalog/features/delete/${featureId}`)

export const getMemberGroups = () => client.post(`${ADMIN_SERVER_URL}/v1/admin/payment/catalog/member-group/all`)

export const createNewMemberGroup = memberGroupData =>
  client.post(`${ADMIN_SERVER_URL}/v1/admin/payment/catalog/member-group/create`, memberGroupData)

export const editMemberGroup = ({ memberGroupData, groupId }) =>
  client.post(`${ADMIN_SERVER_URL}/v1/admin/payment/catalog/member-group/update/${groupId}`, memberGroupData)

export const deleteMemberGroup = groupId =>
  client.delete(`${ADMIN_SERVER_URL}/v1/admin/payment/catalog/member-group/delete/${groupId}`)

export const getUserArticles = userId => client.get(`${ADMIN_SERVER_URL}/v1/startup/article/all/${userId}`)
