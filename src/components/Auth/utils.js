import { Redirect } from "react-router-dom";
import { Routes } from "@routes";
import React from "react";
import enums from "@constants/enums";

const {
  registrationStatuses: { accountRegistration, chooseYourPlan, paymentMethod },
  gettingStartedStatuses: {
    accountInfo,
    companyInfo,
    sectorsOfCompetence,
    areasOfInterest,
    completedGettingStarted,
    gallery,
  },
  userRoles: { startup, admin, superAdmin, member },
} = enums;

export const redirectToCorrectPageByStatus = (user) => {
  debugger;
  if (!user) return <Redirect to={Routes.AUTH.SIGN_IN} />;

  const { role, status } = user;
  const isMember = role === member;
  const isStartup = role === startup;
  const isAdmin = role === admin || role === superAdmin;
  const isRetailer = !isStartup && !isAdmin && !isMember;
  const isSubscriptionPaid =
    !isAdmin &&
    !isStartup &&
    (!!user[isRetailer ? "retailer" : "member"].stripePaymentSettings
      ?.isTrial ||
      (!isStartup &&
        user[isRetailer ? "retailer" : "member"].stripePaymentSettings
          ?.isSubscriptionPaid &&
        !user[isRetailer ? "retailer" : "member"].stripePaymentSettings
          .isTrial));

  if (isStartup) {
    switch (status) {
      case accountRegistration: {
        if (user.isVerified)
          return <Redirect to={Routes.AUTH.GETTING_STARTED.ACCOUNT_INFO} />;

        return (
          <Redirect
            to={Routes.AUTH.SIGN_UP.EMAIL_VERIFICATION_PROCEED_STARTUP}
          />
        );
      }
      case accountInfo:
        return <Redirect to={Routes.AUTH.GETTING_STARTED.COMPANY_INFO} />;
      case companyInfo:
        return <Redirect to={Routes.AUTH.GETTING_STARTED.GALLERY} />;
      case gallery:
        return <Redirect to={Routes.AUTH.GETTING_STARTED.SECTORS_COMPETENCE} />;
      case sectorsOfCompetence:
        return <Redirect to={Routes.AUTH.GETTING_STARTED.AREAS_OF_INTEREST} />;
      case areasOfInterest:
        return <Redirect to={Routes.AUTH.GETTING_STARTED.RELATED_TAGS} />;
      case completedGettingStarted:
        return (
          <Redirect
            to={Routes.AUTH.GETTING_STARTED.RETAIL_HUB_REGISTRATION_APPROVAL}
          />
        );
      default:
        return <Redirect to={Routes.AUTH.INDEX} />;
    }

    switch (status) {
      case accountRegistration: {
        if (user.isVerified)
          // return <Redirect to={Routes.AUTH.GETTING_STARTED.ACCOUNT_INFO} />;

          return (
            <Redirect
              to={Routes.AUTH.SIGN_UP.EMAIL_VERIFICATION_PROCEED_STARTUP}
            />
          );
      }
      case accountInfo:
        return <Redirect to={Routes.AUTH.GETTING_STARTED.COMPANY_INFO} />;
      case companyInfo:
        return <Redirect to={Routes.AUTH.GETTING_STARTED.GALLERY} />;
      case gallery:
        return <Redirect to={Routes.AUTH.GETTING_STARTED.SECTORS_COMPETENCE} />;
      case sectorsOfCompetence:
        return <Redirect to={Routes.AUTH.GETTING_STARTED.AREAS_OF_INTEREST} />;
      case areasOfInterest:
        return <Redirect to={Routes.AUTH.GETTING_STARTED.RELATED_TAGS} />;
      case completedGettingStarted:
        return (
          <Redirect
            to={Routes.AUTH.GETTING_STARTED.RETAIL_HUB_REGISTRATION_APPROVAL}
          />
        );
      default:
        return <Redirect to={Routes.AUTH.INDEX} />;
    }
  }

  if (isMember) {
    switch (status) {
      case completedGettingStarted: {
        if (user.isVerified) return <Redirect to={Routes.AUTH.INDEX} />;

        return (
          <Redirect
            to={Routes.AUTH.SIGN_UP.EMAIL_VERIFICATION_PROCEED_RETAIL}
          />
        );
      }
      default:
        return <Redirect to={Routes.AUTH.INDEX} />;
    }
  }

  if (isRetailer) {
    if (!user.isVerified) {
      return <Redirect to={Routes.AUTH.SIGN_UP.EMAIL_VERIFICATION_PROCEED} />;
    } else {
      switch (status) {
        case accountRegistration:
          // return <Redirect to={Routes.AUTH.INDEX} />;
          return <Redirect to={Routes.AUTH.SIGN_UP.CHOOSE_YOUR_PLAN} />;
        case chooseYourPlan:
          return <Redirect to={Routes.AUTH.SIGN_UP.RETAIL_BILLING_DETAILS} />;
        case paymentMethod: {
          return <Redirect to={Routes.AUTH.GETTING_STARTED.ACCOUNT_INFO} />;
        }
        case accountInfo:
          return <Redirect to={Routes.AUTH.GETTING_STARTED.COMPANY_INFO} />;
        case companyInfo:
          return <Redirect to={Routes.AUTH.GETTING_STARTED.BILLING_DETAILS} />;
        case completedGettingStarted: {
          if (!isSubscriptionPaid)
            return <Redirect to={Routes.SUBSCRIPTION.RETRY_OR_UPDATE} />;

          return <Redirect to={Routes.AUTH.INDEX} />;
        }
        default:
          return <Redirect to={Routes.AUTH.INDEX} />;
      }
    }
  }

  if (isAdmin) return <Redirect to={Routes.ADMIN_PANEL.INDEX} />;
};
