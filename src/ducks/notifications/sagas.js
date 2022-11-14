import { validationErrMessages } from '@constants/common'
import { logOutWorker } from '@ducks/auth/sagas'
import { call, put, select, all, fork } from 'redux-saga/effects'
import {
  getNotifications,
  getCountNewNotifications,
  removeNotification,
  removeAllNotifications,
  readAllNotifications,
  getCountAllNotifications
} from '@api/notificationsApi'
import {
  SET_NOTIFICATIONS,
  SET_COUNT_NEW_NOTIFICATIONS,
  SET_IS_LOADING,
  SET_COUNT_ALL_NOTIFICATIONS,
  SET_PAGE
} from './index'
import { onServerErrorHandler } from '@ducks/common/sagas'
import {
  selectNotifications,
  selectCountOfNewNotifications,
  selectCountAllNotifications,
  selectPageNotifications
} from '../../redux/selectors'
import enums from '@constants/enums'
import { toColor } from '@utils'
import { downloadCompanyAvatar } from '@api/fileUploadingApi'

const { notificationWithAdditionalInfo } = enums.notificationTypes

export function* setIsLoading(isLoading) {
  yield put({
    type: SET_IS_LOADING,
    payload: { isLoading }
  })
}

function* downloadImage(notification) {
  try {
    const isRetailer = notification.shortProfile?.role.includes('RETAILER')

    return {
      ...notification,
      avatar: {
        name: notification.shortProfile?.companyShortName,
        firstName: isRetailer ? notification.shortProfile?.firstName : '',
        lastName: isRetailer ? notification.shortProfile?.lastName : '',
        color: toColor(notification.shortProfile?.userId),
        image: notification.shortProfile?.logoId
          ? yield call(downloadCompanyAvatar, notification.shortProfile.logoId)
          : ''
      }
    }
  } catch (e) {
    yield fork(onServerErrorHandler, e)
  }
}

function* getLogoNotifications(notifications) {
  try {
    return yield all(
      notifications.map(notification => {
        if (notification.notificationType === notificationWithAdditionalInfo && notification?.shortProfile)
          return downloadImage(notification)

        return notification
      })
    )
  } catch (e) {
    yield fork(onServerErrorHandler, e)
  }
}

export function* getCountAllNotificationsWorker() {
  try {
    const countAllNotifications = yield call(getCountAllNotifications)

    yield put({
      type: SET_COUNT_ALL_NOTIFICATIONS,
      payload: { countAllNotifications }
    })
  } catch (e) {
    onServerErrorHandler(e)
  }
}

export function* getNewNotificationsWorker({ payload: { notification } }) {
  try {
    const notificationsList = yield select(selectNotifications)
    const countOfNewNotifications = yield select(selectCountOfNewNotifications)
    const countAllNotifications = yield select(selectCountAllNotifications)

    if (notificationsList.find(existingItem => existingItem.id === notification.id)) return

    const filteredNotifications = [...notificationsList, notification].sort(function (a, b) {
      return new Date(b.createdAt) - new Date(a.createdAt)
    })
    const notificationsListWithLogo = yield getLogoNotifications(filteredNotifications)

    yield all([
      put({
        type: SET_NOTIFICATIONS,
        payload: { notificationsList: notificationsListWithLogo }
      }),
      put({
        type: SET_COUNT_NEW_NOTIFICATIONS,
        payload: { countOfNewNotifications: countOfNewNotifications + 1 }
      }),
      put({
        type: SET_COUNT_ALL_NOTIFICATIONS,
        payload: { countAllNotifications: countAllNotifications + 1 }
      })
    ])
  } catch (e) {
    onServerErrorHandler(e)
  }
}

export function* getNotificationsWorker() {
  try {
    yield setIsLoading(true)

    yield call(getCountAllNotificationsWorker)

    const [notificationsList, countOfNewNotifications] = yield all([
      call(getNotifications, { page: 0 }),
      call(getCountNewNotifications)
    ])

    const notificationsListWithLogo = yield getLogoNotifications(notificationsList)

    yield all([
      put({
        type: SET_NOTIFICATIONS,
        payload: { notificationsList: notificationsListWithLogo }
      }),
      put({
        type: SET_COUNT_NEW_NOTIFICATIONS,
        payload: { countOfNewNotifications }
      })
    ])
  } catch (e) {
    if (e?.error_description === validationErrMessages.accessDenied) yield logOutWorker()
    else yield onServerErrorHandler(e)
  } finally {
    yield setIsLoading(false)
  }
}

export function* getMoreNotificationsWorker() {
  try {
    yield setIsLoading(true)

    const countAllNotifications = yield select(selectCountAllNotifications)
    const notificationsList = yield select(selectNotifications)

    if (notificationsList.length >= countAllNotifications) return

    const pageNotifications = yield select(selectPageNotifications)

    const data = { page: pageNotifications + 1 }

    const nextPageNotificationsList = yield call(getNotifications, data)
    const updatedNotificationsList = [...notificationsList, ...nextPageNotificationsList]
    const notificationsListWithLogo = yield getLogoNotifications(updatedNotificationsList)

    yield all([
      put({
        type: SET_NOTIFICATIONS,
        payload: { notificationsList: notificationsListWithLogo }
      }),
      put({
        type: SET_PAGE,
        payload: { page: pageNotifications + 1 }
      })
    ])
  } catch (e) {
    onServerErrorHandler(e)
  } finally {
    yield setIsLoading(false)
  }
}

export function* removeNotificationWorker({ payload: { id } }) {
  try {
    const notificationsList = yield select(selectNotifications)
    const countOfNewNotifications = yield select(selectCountOfNewNotifications)
    const countAllNotifications = yield select(selectCountAllNotifications)
    const filteredNotifications = notificationsList.filter(notification => notification.id !== id)

    yield all([
      put({
        type: SET_NOTIFICATIONS,
        payload: { notificationsList: filteredNotifications }
      }),
      put({
        type: SET_COUNT_NEW_NOTIFICATIONS,
        payload: { countOfNewNotifications: countOfNewNotifications - 1 }
      }),
      put({
        type: SET_COUNT_ALL_NOTIFICATIONS,
        payload: { countAllNotifications: countAllNotifications - 1 }
      })
    ])

    yield call(removeNotification, id)
  } catch (e) {
    onServerErrorHandler(e)
  }
}

export function* removeAllNotificationsWorker() {
  try {
    yield all([
      put({
        type: SET_NOTIFICATIONS,
        payload: { notificationsList: [] }
      }),
      put({
        type: SET_COUNT_NEW_NOTIFICATIONS,
        payload: { countOfNewNotifications: 0 }
      })
    ])

    yield call(removeAllNotifications)
  } catch (e) {
    onServerErrorHandler(e)
  }
}

export function* readAllNotificationsWorker() {
  try {
    const notificationsList = yield select(selectNotifications)
    const readNotifications = notificationsList.map(notification => ({ ...notification, isRead: true }))

    yield all([
      put({
        type: SET_NOTIFICATIONS,
        payload: { notificationsList: readNotifications }
      }),
      put({
        type: SET_COUNT_NEW_NOTIFICATIONS,
        payload: { countOfNewNotifications: 0 }
      })
    ])

    yield call(readAllNotifications)
  } catch (e) {
    onServerErrorHandler(e)
  }
}
