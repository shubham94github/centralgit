import { array, arrayOf, bool, instanceOf, number, object, oneOf, oneOfType, shape, string } from 'prop-types'
import enums from '@constants/enums'

export const selectValueType = shape({
  label: string,
  value: string
})

export const interviewVideoType = shape({
  id: number,
  link: string,
  title: string,
  videoSource: oneOf(Object.values(enums.videoSource)),
  videoType: string,
  createdAt: number,
  updatedAt: number
})

export const profileDocumentsType = arrayOf(
  shape({
    id: number,
    filename: string,
    extension: string,
    size: number
  })
)

export const marketingVideoType = shape({
  id: number,
  link: string,
  title: string
})

export const profileStartupType = shape({
  companyShortName: string,
  city: string,
  country: object,
  needs: string,
  teamSize: string,
  numberOfCustomers: number,
  numberOfInvestors: number,
  founders: string,
  businessModel: string,
  companyStatus: string,
  targetMarket: array,
  retailCustomerExample: array,
  problemSolved: string,
  solutionOffered: string,
  numberOfUsers: number,
  numberOfRetailCustomers: number,
  companyEvaluation: number,
  categories: array,
  areasOfInterest: array,
  foundedAt: number,
  logo60: object,
  urlOfCompanyWebsite: string,
  companyDescription: string,
  mainGoalInStartupHunting: string,
  companySectors: array,
  tags: array,
  isEnableMailing: bool,
  documents: profileDocumentsType,
  marketingVideo: marketingVideoType,
  interviewVideo: interviewVideoType
})

export const chatMessageType = shape({
  id: number,
  senderId: number,
  chatRoomId: number,
  text: string,
  recipientId: number,
  readByIds: arrayOf(number),
  updatedAt: number,
  createdAt: number,
  messageStatus: oneOf(Object.values(enums.chatMessagesStatuses))
})

export const userAvatarType = shape({
  image: string,
  name: string,
  color: string,
  firstName: string,
  lastName: string
})

export const extremesForRangesTypes = shape({
  companyEvaluationMax: number,
  companyEvaluationMin: number,
  numberOfCustomersMax: number,
  numberOfCustomersMin: number,
  numberOfInvestorsMax: number,
  numberOfInvestorsMin: number,
  numberOfRetailCustomersMax: number,
  numberOfRetailCustomersMin: number,
  numberOfUsersMax: number,
  numberOfUsersMin: number
})

export const departmentType = shape({
  id: number,
  name: string,
  createdAt: oneOfType([instanceOf(Date), string]),
  label: string,
  value: oneOfType([string, number])
})

export const countryType = shape({
  id: number,
  name: string,
  iso: string,
  iso3: string,
  numcode: number,
  phonecode: number,
  label: string,
  value: string
})

export const positionType = departmentType

export const onlineStatusType = shape({
  userId: number,
  onlineStatus: string,
  visitedAt: number
})

export const userRoles = oneOf(Object.values(enums.userRoles).map(value => value))

export const gettingStartedStatuses = [
  enums.gettingStartedStatuses.completedGettingStarted,
  ...Object.values(enums.gettingStartedStatuses)
]

export const userType = shape({
  approvedByAdminAt: number,
  avatar: userAvatarType,
  avatar30: userAvatarType,
  avatar60: userAvatarType,
  avatar120: userAvatarType,
  chatIds: arrayOf(number),
  createdAt: number,
  department: oneOfType([departmentType, string]),
  email: string,
  firstName: string,
  fullName: string,
  id: number,
  isApprovedByAdmin: bool,
  isBlocked: bool,
  isEnable2fa: bool,
  isEnableMailing: bool,
  isVerified: bool,
  lastName: string,
  onlineStatus: onlineStatusType,
  phoneNumber: string,
  position: oneOfType([string, positionType]),
  retailer: object,
  role: userRoles,
  startup: object,
  status: string,
  token: string,
  updatedAt: number,
  member: object,
  city: string,
  country: object
})

export const authorityType = shape({
  createdAt: number,
  id: oneOfType([number, string]),
  name: string,
  permissions: arrayOf(
    oneOf(
      Object.keys(enums.permissions).reduce((acc, key) => {
        acc = acc.concat(enums.permissions[key].items.map(item => item.value))

        return acc
      }, [])
    )
  ),
  updatedAt: number
})

export const allRolesTypes = shape({
  count: number,
  items: arrayOf(authorityType)
})

export const userRoleType = shape({
  createdAt: number,
  id: number.isRequired,
  name: string.isRequired,
  permissions: arrayOf(
    oneOf(
      Object.keys(enums.permissions).reduce((acc, key) => {
        acc = acc.concat(enums.permissions[key].items.map(item => item.value))

        return acc
      }, [])
    )
  ),
  updatedAt: number
})

export const tableMetaType = shape({
  fields: arrayOf(
    shape({
      fieldName: string,
      filterBoolean: bool,
      filterText: string,
      filterDates: arrayOf(number)
    })
  ),
  page: number,
  size: number,
  sort: shape({
    direction: string,
    fieldName: string
  })
})

export const selectedFiltersType = shape({
  isVerified: shape({
    label: string,
    value: bool
  }),
  accountType: selectValueType,
  rateStars: selectValueType,
  isBlocked: shape({
    label: string,
    value: bool
  }),
  status: selectValueType,
  companyType: selectValueType,
  businessModel: selectValueType,
  companyStatus: selectValueType,
  country: shape({
    ...selectValueType,
    id: number,
    iso: string,
    iso3: string,
    name: string,
    numcode: number,
    phonecode: number
  }),
  filterCategories: arrayOf(number)
})

export const signUpFormTypes = shape({
  companyLegalName: string,
  companyShortName: string,
  countryId: shape({
    id: number.isRequired,
    iso: string.isRequired,
    iso3: string.isRequired,
    label: string.isRequired,
    name: string.isRequired,
    numcode: number.isRequired,
    phonecode: number.isRequired,
    value: string.isRequired
  }),

  email: string,
  emailDomain: string,
  firstName: string,
  lastName: string,
  password: string,
  policyConfirmed: bool
})

export const documentType = shape({
  id: number.isRequired,
  filename: string
})

export const featureType = shape({
  createdAt: number,
  id: number,
  isEnterpriseUser: bool,
  isMultiUser: bool,
  isSingleUser: bool,
  sortOrdering: number,
  title: string,
  updatedAt: number
})

export const memberGroupsType = shape({
  createdAt: number,
  id: number,
  maxMembers: number,
  name: string,
  updatedAt: number
})

export const priceType = shape({
  name: string,
  comment: string,
  createdAt: string,
  currency: string,
  id: number,
  unitAmount: number,
  updatedAt: string
})

export const memberGroupType = shape({
  id: number,
  name: string,
  unitAmount: number,
  comment: string,
  currency: string
})

export const subscriptionPlanType = shape({
  createdAt: number,
  id: number,
  interval: string,
  memberGroup: memberGroupType,
  name: string,
  price: priceType,
  role: userRoles,
  sortOrdering: number,
  stripeName: string,
  stripePriceId: string,
  stripeProductId: string,
  uiName: string,
  updatedAt: number
})

export const discountCouponType = shape({
  code: string,
  createdAt: number,
  currency: string,
  duration: string,
  id: number,
  isBlocked: bool,
  isDeleted: bool,
  maxRedemptions: number,
  name: string,
  paymentPlans: array,
  percentOff: number,
  redeemBy: number,
  status: string,
  stripeCouponId: string,
  updatedAt: number,
  usingCount: number
})

export const enterpriseType = shape({
  code: string,
  createdAt: number,
  id: number,
  isActivated: bool,
  isDeleted: bool,
  paymentPlan: subscriptionPlanType,
  updatedAt: number
})

export const paymentPlanType = shape({
  createdAt: number,
  id: number,
  interval: string,
  isDiscountable: bool,
  planType: string,
  price: priceType,
  role: string,
  sortOrdering: number,
  stripeName: string,
  stripePriceId: string,
  stripeProductId: string,
  uiName: string,
  updatedAt: number,
  usingCount: number
})
