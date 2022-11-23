export const Routes = {
  INDEX: '/',
  AUTH: {
    INDEX: '/auth',
    SIGN_IN: '/auth/sign-in',
    TWO_FA: '/auth/2fa',
    SIGN_UP: {
      INDEX: '/auth/sign-up',
      ADD_EMAIL: '/auth/sign-up/add-email',
      ADD_RETAIL_EMAIL: '/auth/sign-up/retailer/sign-up-email',
      ADD_RETAIL_COMPANY: '/auth/sign-up/retailer/sign-up-company',
      ADD_STARTUP_EMAIL: '/auth/sign-up/startup/sign-up-email',
      ADD_STARTUP_COMPANY: '/auth/sign-up/startup/sign-up-company',
      RETAIL_BILLING_DETAILS: '/auth/sign-up/retail-billing-details',
      CHOOSE_YOUR_PLAN: '/auth/sign-up/choose-your-plan',
      EMAIL_VERIFICATION_PROCEED: '/auth/sign-up/email-verification-proceed',
      EMAIL_VERIFICATION_PROCEED_STARTUP: '/auth/sign-up/startup/email-verification-proceed',
      EMAIL_VERIFICATION_PROCEED_RETAIL: '/auth/sign-up/retailer/email-verification-proceed',
      EMAIL_VERIFICATION_STARTUP: '/auth/sign-up/startup/email-verification',
      EMAIL_VERIFICATION_RETAIL: '/auth/sign-up/retailer/email-verification',
      EMAIL_VERIFICATION_MEMBER: '/auth/sign-up/member/email-verification',
      CHOOSE_BUSINESS_TYPE: '/auth/sign-up/choose-business-type'
    },
    GETTING_STARTED: {
      INDEX: '/auth/getting-started',
      ACCOUNT_INFO: '/auth/getting-started/account-info',
      COMPANY_INFO: '/auth/getting-started/company-info',
      STARTUP_COMPANY_INFO: '/auth/getting-started/startup-company-info',
      SECTORS_COMPETENCE: '/auth/getting-started/sectors-competence',
      AREAS_OF_INTEREST: '/auth/getting-started/areas-of-interest',
      BILLING_DETAILS: '/auth/getting-started/billing-details',
      RELATED_TAGS: '/auth/getting-started/related-tags',
      COMPANY_MEMBERS: '/auth/getting-started/company-members',
      RETAIL_HUB_REGISTRATION_APPROVAL: '/auth/getting-started/retail-hub-registration-approval',
      GALLERY: '/auth/getting-started/gallery'
    },
    PASSWORD_RECOVERY: {
      INDEX: '/auth/password-recovery',
      EMAIL_FORM: '/auth/password-recovery/email',
      CHECK_SENT_EMAIL: '/auth/password-recovery/check-sent-email',
      SET_NEW_PASSWORD: '/auth/password-recovery/set-new-password',
      PASSWORD_WAS_CHANGED: '/auth/password-recovery/password-changed'
    }
  },
  HOME: '/',
  PROFILE: '/profile/:role/:id',
  NEWS: '/news/:id',
  BROWSE_PAGE: '/browse-page',
  MISSION: '/mission',
  MESSAGES: {
    INDEX: '/messages',
    NEW: '/messages/new',
    CHAT: '/messages/chat/:id'
  },
  SUBSCRIPTION: {
    INDEX: '/subscription',
    RETRY_OR_UPDATE: '/subscription/retry-or-update',
    UPDATE_CARD: '/subscription/update-card',
    CHANGE_PLAN: '/subscription/change-plan',
    PAYMENT_RETRY: '/subscription/payment-retry',
    UPDATE_CARD_SUCCESSFULLY: '/subscription/update-card-successfully',
    UPDATE_CARD_FAILED: '/subscription/update-card-failed'
  },
  ADMIN_PANEL: {
    INDEX: '/admin-panel',
    STARTUPS: '/admin-panel/startups',
    STARTUP_ANALYSIS: '/admin-panel/startup-analysis',
    RETAILERS: '/admin-panel/retailers',
    MANAGE_CATEGORIES: '/admin-panel/manage-categories',
    ROLES_AND_PERMISSIONS: `/admin-panel/roles-and-permissions`,
    CATEGORIES_ACTIVITY: '/admin-panel/activity/categories',
    PROFILES_ACTIVITY: '/admin-panel/activity/profiles',
    PLAN_TYPES: '/admin-panel/plan-types',
    PRICES: '/admin-panel/prices',
    FEATURES: '/admin-panel/features',
    SUBSCRIPTION_PLANS: '/admin-panel/subscription-plans',
    PAYMENT_RECEIPTS: '/admin-panel/payment-receipts',
    DISCOUNT_COUPONS: '/admin-panel/discount-coupons',
    ENTERPRISE: '/admin-panel/enterprise',
    MEMBER_GROUPS: '/admin-panel/member-groups',
    PROFILE: {
      INDEX: '/admin-panel/profile/:role/:id',
      ACCOUNT_INFO: '/admin-panel/profile/:role/:id/account-info',
      FEEDBACKS: '/admin-panel/profile/:role/:id/feedbacks',
      INFO: '/admin-panel/profile/:role/:id/internal-info',
      GALLERY: '/admin-panel/profile/:role/:id/gallery',
      BILLING_DETAILS: '/admin-panel/profile/:role/:id/billing-details',
      COMPANY_MEMBERS: '/admin-panel/profile/:role/:id/company-members',
      BOOKMARKS_STARTUP: '/admin-panel/profile/:role/:id/bookmarks-startup',
      RATED_STARTUPS: '/admin-panel/profile/:role/:id/rated-startups',
      ARTICLE: '/admin-panel/profile/:role/:id/article'
    },
    RETAIL_HUB_TEAM: '/admin-panel/retail-hub-team'
  },
  SETTINGS: {
    INDEX: '/settings',
    ACCOUNT_INFO: '/settings/account-info',
    COMPANY_INFO: '/settings/company-info',
    GALLERY: '/settings/gallery',
    BILLING_DETAILS: '/settings/billing-details',
    SECTORS_COMPETENCE: '/settings/sectors-competence',
    AREAS_OF_INTEREST: '/settings/areas-of-interest',
    RELATED_TAGS: '/settings/related-tags',
    COMPANY_MEMBERS: '/settings/company-members'
  }
}
