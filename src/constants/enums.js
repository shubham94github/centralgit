import { Icons } from '@icons'

const enums = {
  fileExtensions: [
    '.csv',
    '.doc',
    '.docx',
    '.dot',
    '.png',
    '.tif',
    '.tiff',
    '.pdf',
    '.pps',
    '.ppsx',
    '.ppt',
    '.pptx',
    '.rtf',
    '.txt',
    '.xls',
    '.xlsx',
    '.bmp',
    '.gif',
    '.jpeg',
    '.jpg',
    '.zip',
    '.rar'
  ],
  registrationStatuses: {
    accountRegistration: 'ACCOUNT_REGISTRATION',
    chooseYourPlan: 'PAYMENT_PLAN',
    paymentMethod: 'PAYMENT_METHOD'
  },
  gettingStartedStatuses: {
    completedGettingStarted: 'COMPLETED',
    accountInfo: 'ACCOUNT_INFORMATION',
    companyInfo: 'COMPANY_INFORMATION',
    gallery: 'GALLERY',
    billingDetails: 'BILLING_DETAILS',
    sectorsOfCompetence: 'SECTORS_OF_COMPETENCE',
    areasOfInterest: 'AREAS_OF_INTEREST',
    associatedTags: 'ASSOCIATED_TAGS'
  },
  userRoles: {
    admin: 'ADMIN',
    superAdmin: 'SUPER_ADMIN',
    startup: 'STARTUP',
    retailerCompany: 'RETAILER',
    retailerBrand: 'RETAILER_BRAND',
    retailerConsultant: 'RETAILER_CONSULTANT',
    retailerServiceProvider: 'RETAILER_SERVICE_PROVIDER',
    retailerVentureCapital: 'RETAILER_VENTURE_CAPITAL',
    retailerEntrepreneur: 'RETAILER_ENTREPRENEUR',
    retailerInvestor: 'RETAILER_INVESTOR',
    retailerPrivatePerson: 'RETAILER_PRIVATE_PERSON',
    member: 'MEMBER'
  },
  chatMessagesStatuses: {
    sent: 'SENT',
    read: 'READ',
    received: 'RECEIVED'
  },
  paymentCardLogos: {
    visa: Icons.visaCardIcon(),
    mastercard: Icons.masterCardIcon(),
    discover: Icons.discoverCardIcon(),
    amex: Icons.amexCardIcon(),
    jcb: Icons.jcbCardIcon(),
    unionpay: Icons.unionpayCardIcon(),
    diners: Icons.dinersCardIcon()
  },
  groupActions: {
    approve: 'APPROVE',
    activate: 'ACTIVATE',
    deactivate: 'DEACTIVATE',
    verify: 'VERIFY'
  },
  snackbarTypes: {
    info: 'info',
    warning: 'warning',
    error: 'error'
  },
  accountType: {
    demo: 'Demo',
    standard: 'Standard'
  },
  accountTypesAdminPanel: {
    STANDARD: 'Standard',
    DEMO: 'Demo',
    INCOMPLETE: 'Incomplete',
    IMPORTED: 'Imported'
  },
  gettingStartedStatusesAdminPanel: {
    completedGettingStarted: 'Completed',
    accountInfo: 'Account information',
    accountRegistration: 'Account registration',
    companyInfo: 'Company information',
    sectorsOfCompetence: 'Sectors of competence',
    areasOfInterest: 'Areas of interest'
  },
  notificationTypes: {
    adminNotification: 'ADMIN_NOTIFICATION',
    systemNotification: 'SYSTEM_NOTIFICATION',
    notificationWithAdditionalInfo: 'NOTIFICATION_WITH_ADDITIONAL_INFO'
  },
  validationMode: {
    all: 'all',
    onBlur: 'onBlur',
    onChange: 'onChange',
    onSubmit: 'onSubmit',
    onTouched: 'onTouched'
  },
  reValidationMode: {
    onChange: 'onChange',
    onBlur: 'onBlur',
    onSubmit: 'onSubmit'
  },
  criteriaMode: {
    all: 'all',
    firstError: 'firstError'
  },
  verifyUserTypes: {
    startup: 'STARTUP',
    retailer: 'RETAILER'
  },
  videoSource: {
    youtube: 'YOUTUBE',
    vimeo: 'VIMEO'
  },
  permissions: {
    manageStartups: {
      title: 'Manage Startups',
      items: [
        {
          label: 'Approve',
          value: 'STARTUPS_APPROVE',
          disabled: false
        },
        {
          label: 'View Profile',
          value: 'STARTUPS_VIEW_PROFILE',
          disabled: false
        },
        {
          label: 'Gallery',
          value: 'STARTUPS_EDIT_GALLERY',
          isDisabled: false
        },
        {
          label: 'Edit Company details & Account Information',
          value: 'STARTUPS_EDIT_DETAILS_INFO',
          disabled: false
        },
        {
          label: 'Edit Feedbacks',
          value: 'STARTUPS_EDIT_FEEDBACKS',
          disabled: false
        },
        {
          label: 'Edit Internal Info',
          value: 'STARTUPS_EDIT_INTERNAL',
          disabled: false
        },
        {
          label: 'Change Status',
          value: 'STARTUPS_CHANGE_STATUS',
          disabled: false
        },
        {
          label: 'Send Direct Notification',
          value: 'STARTUPS_DIRECT_NOTIFICATIONS',
          disabled: false
        },
        {
          label: 'Startup Analysis',
          value: 'STARTUP_ANALYSIS',
          disabled: false
        }
      ]
    },
    manageUsers: {
      title: 'Manage Company Users',
      items: [
        {
          label: 'Approve',
          value: 'USERS_APPROVE',
          disabled: false
        },
        {
          label: 'View Profile',
          value: 'USERS_VIEW_PROFILE',
          disabled: false
        },
        {
          label: 'Edit Company details & Account Information',
          value: 'USERS_EDIT_DETAILS_INFO',
          disabled: false
        },
        {
          label: 'Edit Billing details',
          value: 'USERS_EDIT_BILLING_DETAILS',
          disabled: false
        },
        {
          label: 'Edit Members',
          value: 'MEMBER_EDIT',
          disabled: false
        },
        {
          label: 'Change Status',
          value: 'USERS_CHANGE_STATUS',
          disabled: false
        },
        {
          label: 'Send Direct Notification',
          value: 'USERS_DIRECT_NOTIFICATIONS'
        }
      ]
    },
    manageCategories: {
      title: 'Manage Categories',
      items: [
        {
          label: 'View',
          value: 'CATEGORY_VIEW',
          disabled: false
        },
        {
          label: 'Create/Edit',
          value: 'CATEGORY_EDIT',
          disabled: false
        },
        {
          label: 'Delete',
          value: 'CATEGORY_DELETE',
          disabled: false
        }
      ]
    },
    notifications: {
      title: 'Notifications',
      items: [
        {
          label: 'Admin Panel Notifications',
          value: 'NOTIFICATION_GETTING_IN_APP',
          disabled: false
        },
        {
          label: 'Email Notifications',
          value: 'NOTIFICATION_GETTING_EMAIL',
          disabled: false
        },
        {
          label: 'Users Chat',
          value: 'USERS_CHAT',
          disabled: true,
          isHidden: true
        },
        {
          label: 'Startups Chat',
          value: 'STARTUPS_CHAT',
          disabled: true,
          isHidden: true
        }
      ]
    }
  },
  permissionTypes: {
    isStartupsApprovePermission: 'STARTUPS_APPROVE',
    isStartupsViewProfilePermission: 'STARTUPS_VIEW_PROFILE',
    isStartupsEditDetailsPermission: 'STARTUPS_EDIT_DETAILS_INFO',
    isStartupsEditFeedbacksPermission: 'STARTUPS_EDIT_FEEDBACKS',
    isStartupsEditInternalPermission: 'STARTUPS_EDIT_INTERNAL',
    isStartupsEditGalleryPermission: 'STARTUPS_EDIT_GALLERY',
    isStartupsChangeStatusPermission: 'STARTUPS_CHANGE_STATUS',
    isStartupsDirectNotificationsPermission: 'STARTUPS_DIRECT_NOTIFICATIONS',
    isStartupsChatPermission: 'STARTUPS_CHAT',
    isRetailersApprovePermission: 'USERS_APPROVE',
    isRetailersViewProfilePermission: 'USERS_VIEW_PROFILE',
    isRetailersEditDetailsInfoPermission: 'USERS_EDIT_DETAILS_INFO',
    isRetailersEditBillingDetailsPermission: 'USERS_EDIT_BILLING_DETAILS',
    isRetailersChangeStatusPermission: 'USERS_CHANGE_STATUS',
    isRetailersDirectNotificationsPermission: 'USERS_DIRECT_NOTIFICATIONS',
    isRetailersChatPermission: 'USERS_CHAT',
    isCategoryViewPermission: 'CATEGORY_VIEW',
    isCategoryEditPermission: 'CATEGORY_EDIT',
    isCategoryDeletePermission: 'CATEGORY_DELETE',
    isMemberEditPermission: 'MEMBER_EDIT',
    isNotificationGettingEmailPermission: 'NOTIFICATION_GETTING_EMAIL',
    isNotificationGettingInAppPermission: 'NOTIFICATION_GETTING_IN_APP',
    isStartupAnalysisPermission: 'STARTUP_ANALYSIS',
    userChat: 'USERS_CHAT'
  },
  protectedRoleNames: ['Guest', 'Full Access'],
  paymentPeriods: {
    DAY: '/day, billed daily',
    MONTH: '/month, billed monthly',
    WEEK: '/week, billed weekly',
    YEAR: '/month, billed annually'
  }
}

export default enums
