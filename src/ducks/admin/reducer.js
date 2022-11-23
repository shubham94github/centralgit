import { Record } from 'immutable'
import {
  HANDLE_CHANGE_MENU,
  SET_STARTUPS,
  SET_RETAILERS,
  SET_IS_LOADING,
  SET_STARTUPS_TABLE_META,
  SET_RETAILERS_TABLE_META,
  CLEAR_ADMIN_STORE,
  SET_PROFILE,
  CLEAR_PROFILE,
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
  SET_REPORTS,
  SET_REPORTS_TABLE_META,
  SET_CATEGORIES_ACTIVITY,
  SET_CATEGORIES_ACTIVITY_TABLE_META,
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
  SET_UPDATED_PROFILE,
  SET_PAYMENT_RECEIPTS,
  SET_ALL_PAYMENT_RECEIPTS,
  CREATE_PAYMENT_RECEIPTS,
  ADD_PAYMENT_RECEIPTS,
  UPDATED_PAYMENT_RECEIPTS,
  SET_USER_ARTICLE
} from './index'
import { pageSize } from '@constants/pagination'
import {
  defaultFilterStartups,
  defaultListOfStartups,
  defaultRetailerFilters,
  defaultStartupFilters
} from '@ducks/admin/constants'
import { sideMenuItems } from '@components/AdminPanel/constants'

const InitialState = Record({
  menuItems: sideMenuItems,
  startups: [],
  startupsCount: 0,
  startupsTableMeta: {
    fields: [],
    page: 1,
    size: pageSize,
    sort: {
      direction: 'ASC',
      fieldName: 'createdAt'
    }
  },
  retailers: [],
  retailersCount: 0,
  retailersTableMeta: {
    fields: [],
    page: 1,
    size: pageSize,
    sort: {
      direction: 'ASC',
      fieldName: 'createdAt'
    }
  },
  isLoading: false,
  profile: null,
  selectedStartupFilters: defaultStartupFilters,
  selectedRetailerFilters: defaultRetailerFilters,
  searchRequest: '',
  feedbacks: [],
  isLoadingFeedbacks: false,
  countOfRecords: null,
  countOfRecordsAllFeedbacks: null,
  rateStars: null,
  rateCount: null,
  isAdminNotificationSending: false,
  categories: [],
  reports: [],
  articles: [],
  reportsTableMeta: {
    page: 1,
    pageSize,
    sort: {
      direction: 'DESC',
      fieldName: 'Date'
    }
  },
  paymentReceipts: [],
  allPaymentReceipts: [],
  reportsCount: 0,
  categoriesActivity: [],
  categoriesActivityCount: 0,
  categoriesActivityTableMeta: {
    fields: [],
    page: 1,
    size: pageSize,
    sort: {
      direction: 'DESC',
      fieldName: 'createdAt'
    }
  },
  profilesActivity: [],
  profilesActivityCount: 0,
  profilesActivityTableMeta: {
    fields: [],
    page: 1,
    size: pageSize,
    sort: {
      direction: 'DESC',
      fieldName: 'createdAt'
    }
  },
  bookmarksStartups: defaultListOfStartups,
  filterBookmarks: defaultFilterStartups,
  ratedStartups: defaultListOfStartups,
  filterRated: defaultFilterStartups,
  isLoadingListOfStartups: false,
  subscriptionPlans: [],
  paymentPlansNames: [],
  prices: [],
  features: [],
  memberGroups: [],
  enterpriseCodes: []
})

const adminReducer = (state = new InitialState(), action) => {
  const { type, payload } = action

  switch (type) {
    case SET_IS_LOADING:
      return state.set('isLoading', payload.isLoading)

    case HANDLE_CHANGE_MENU:
      return state.set('menuItems', payload.menuItems)

    case SET_STARTUPS:
      return state.merge({
        startups: payload.startups,
        startupsCount: payload.startupsCount
      })

    case SET_STARTUPS_TABLE_META:
      return state.set('startupsTableMeta', payload.tableMeta)

    case SET_RETAILERS:
      return state.merge({
        retailers: payload.retailers,
        retailersCount: payload.retailersCount
      })

    case SET_RETAILERS_TABLE_META:
      return state.set('retailersTableMeta', payload.tableMeta)

    case CLEAR_ADMIN_STORE:
      return new InitialState()

    case SET_PROFILE:
      return state.set('profile', payload.profile)

    case CLEAR_PROFILE:
      return state.merge({
        profile: null,
        bookmarksStartups: defaultListOfStartups,
        filterBookmarks: defaultFilterStartups,
        ratedStartups: defaultListOfStartups,
        filterRated: defaultFilterStartups,
        feedbacks: [],
        countOfRecords: null,
        countOfRecordsAllFeedbacks: null,
        rateStars: null,
        rateCount: null
      })

    case CLEAR_STARTUP_FILTERS:
      return state.set('selectedStartupFilters', defaultStartupFilters)

    case CLEAR_RETAILER_FILTERS:
      return state.set('selectedRetailerFilters', defaultRetailerFilters)

    case SET_STARTUP_FILTERS:
      return state.set('selectedStartupFilters', payload.filters)

    case SET_RETAILER_FILTERS:
      return state.set('selectedRetailerFilters', payload.filters)

    case SET_SEARCH_REQUEST:
      return state.set('searchRequest', payload.text)

    case SET_FEEDBACKS:
      return state.set('feedbacks', payload.feedbacks)

    case SET_IS_LOADING_FEEDBACKS:
      return state.set('isLoadingFeedbacks', payload.isLoadingFeedbacks)

    case SET_COUNT_FEEDBACKS:
      return state.set('countOfRecords', payload.count)

    case SET_COUNT_ALL_FEEDBACKS:
      return state.set('countOfRecordsAllFeedbacks', payload.count)

    case SET_RATE_STARS:
      return state.set('rateStars', payload.stars)

    case SET_RATE_COUNT:
      return state.set('rateCount', payload.rate)

    case IS_ADMIN_NOTIFICATION_SENDING:
      return state.set('isAdminNotificationSending', payload.isAdminNotificationSending)

    case SET_CATEGORIES:
      return state.set('categories', payload.categories)

    case SET_REPORTS:
      return state.merge({
        reports: payload.reports,
        reportsCount: payload.reportsCount
      })

    case SET_REPORTS_TABLE_META:
      return state.set('reportsTableMeta', payload.reportsTableMeta)

    case SET_CATEGORIES_ACTIVITY:
      return state.merge({
        categoriesActivity: payload.categoriesActivity,
        categoriesActivityCount: payload.categoriesActivityCount
      })

    case SET_CATEGORIES_ACTIVITY_TABLE_META:
      return state.set('categoriesActivityTableMeta', payload.categoriesActivityTableMeta)

    case SET_PROFILES_ACTIVITY:
      return state.merge({
        profilesActivity: payload.profilesActivity,
        profilesActivityCount: payload.profilesActivityCount
      })

    case SET_PROFILES_ACTIVITY_TABLE_META:
      return state.set('profilesActivityTableMeta', payload.profilesActivityTableMeta)

    case SET_BOOKMARKS_STARTUPS:
      return state.set('bookmarksStartups', payload.bookmarksStartups)

    case SET_FILTER_OF_BOOKMARKS:
      return state.set('filterBookmarks', payload.filterBookmarks)

    case SET_RATED_STARTUPS:
      return state.set('ratedStartups', payload.ratedStartups)

    case SET_FILTER_OF_RATED_STARTUPS:
      return state.set('filterRated', payload.filterRated)

    case SET_IS_LOADING_LIST_OF_STARTUPS:
      return state.set('isLoadingListOfStartups', payload.isLoadingListOfStartups)

    case SET_COMPANY_MEMBERS:
      return state.set('profile', { ...state.get('profile'), members: payload.members })

    case SET_UPDATED_PROFILE:
      return state.set('profile', {
        ...state.get('profile'),
        retailer: { ...state.get('profile')?.retailer, paymentPlan: payload.profile?.retailer?.paymentPlan }
      })

    case SET_FEATURES:
      return state.set('features', payload.features)

    case SET_MEMBER_GROUPS:
      return state.set('memberGroups', payload.memberGroups)

    case SET_SUBSCRIPTION_PLANS:
      return state.set('subscriptionPlans', payload.subscriptionPlans)

    case SET_PAYMENT_RECEIPTS:
      return state.set('paymentReceipts', payload.receipts)

    case ADD_PAYMENT_RECEIPTS:
      const output = [...state.get('paymentReceipts'), payload.receipt]
      return state.set('paymentReceipts', output)

    case SET_ALL_PAYMENT_RECEIPTS:
      return state.set('allPaymentReceipts', payload.receipts)

    case SET_ALL_PAYMENT_PLANS_NAMES:
      return state.set('paymentPlansNames', payload.paymentPlansNames)

    case UPDATED_PAYMENT_RECEIPTS:
      return state.set(
        'paymentReceipts',
        state.get('paymentReceipts').map(item => (item.id === payload.receipt.id ? payload.receipt : item))
      )

    case SET_PRICES:
      return state.set('prices', payload.prices)

    case SET_USER_ARTICLE:
      return state.set('articles', payload.articles)

    case SET_ENTERPRISE_CODES:
      return state.set('enterpriseCodes', payload.enterpriseCodes)

    default:
      return state
  }
}

export default adminReducer
