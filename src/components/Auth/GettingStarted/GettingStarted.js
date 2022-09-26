import React, { memo } from "react";
import cn from "classnames";
import { Redirect, Route, Switch, withRouter } from "react-router-dom";
import { Routes } from "@routes";
import AreasOfInterestHOC from "@components/Auth/GettingStarted/AreasOfInterestGS";
import CompanyInfoHOC from "@components/Auth/GettingStarted/CompanyInfo";
import SectorsOfCompetenceHOC from "@components/Auth/GettingStarted/SectorsOfCompetenceGS";
import BillingDetailsHOC from "@components/Auth/GettingStarted/BillingDetailsGS";
import RelatedTagsHOC from "@components/Auth/GettingStarted/RelatedTagsGS";
import AccountInfoHOC from "@components/Auth/GettingStarted/AccountInfoGS";
import SideBarMenu from "@components/layouts/SideBarMenu";
import { bool, object, shape, string } from "prop-types";
import RegistrationApprovalShutter from "@components/Auth/GettingStarted/RegistrationApprovalShutter";
import { connect } from "react-redux";
import ProtectedRoute from "@components/Common/ProtectedRoute";
import { menuItems } from "@components/Auth/GettingStarted/utils";
import enums from "@constants/enums";
import GalleryInfo from "@components/Auth/GettingStarted/GalleryInfo";
import { getItemFromStorage } from "@utils/storage";

import "./GettingStarted.scss";

const {
  gettingStartedStatuses,
  userRoles: {
    retailerCompany,
    retailerBrand,
    retailerConsultant,
    retailerServiceProvider,
    retailerVentureCapital,
  },
} = enums;

const {
  INDEX,
  AREAS_OF_INTEREST,
  COMPANY_INFO,
  ACCOUNT_INFO,
  SECTORS_COMPETENCE,
  BILLING_DETAILS,
  RELATED_TAGS,
  RETAIL_HUB_REGISTRATION_APPROVAL,
  GALLERY,
} = Routes.AUTH.GETTING_STARTED;

function GettingStarted({ location, user }) {
  if (
    user?.status === gettingStartedStatuses.completedGettingStarted &&
    // user.isApprovedByAdmin &&
    location.pathname !== RETAIL_HUB_REGISTRATION_APPROVAL
  ) {
    if (
      user.role === retailerCompany ||
      user.role === retailerBrand ||
      user.role === retailerConsultant ||
      user.role === retailerServiceProvider ||
      user.role === retailerVentureCapital
    )
      return <Redirect to={RETAIL_HUB_REGISTRATION_APPROVAL} />;

    return <Redirect to={Routes.HOME} />;
  }

  const isRegistrationApprovalPage =
    location?.pathname === RETAIL_HUB_REGISTRATION_APPROVAL;

  return (
    <div className="getting-started-container">
      {!isRegistrationApprovalPage && (
        <SideBarMenu
          menuItems={menuItems}
          userRole={user.role}
          title="Getting Started"
          subTitle="Complete your profile"
        />
      )}
      <div
        className={cn("form-container", {
          "container-centered": isRegistrationApprovalPage,
        })}
      >
        <Switch>
          <ProtectedRoute
            path={RETAIL_HUB_REGISTRATION_APPROVAL}
            component={RegistrationApprovalShutter}
          />
          <Route
            path={INDEX}
            render={() => <Redirect to={ACCOUNT_INFO} />}
            exact
          />
          <ProtectedRoute path={ACCOUNT_INFO} component={AccountInfoHOC} />
          <ProtectedRoute path={COMPANY_INFO} component={CompanyInfoHOC} />
          <ProtectedRoute path={GALLERY} component={GalleryInfo} />
          <ProtectedRoute
            path={SECTORS_COMPETENCE}
            component={SectorsOfCompetenceHOC}
          />
          <ProtectedRoute
            path={AREAS_OF_INTEREST}
            component={AreasOfInterestHOC}
          />
          <ProtectedRoute
            path={BILLING_DETAILS}
            component={BillingDetailsHOC}
          />
          <ProtectedRoute path={RELATED_TAGS} component={RelatedTagsHOC} />
        </Switch>
      </div>
    </div>
  );
}

GettingStarted.propTypes = {
  location: object,
  isAuthenticated: bool,
  user: shape({
    status: string,
  }),
  isStartUp: bool,
};

export default connect(
  ({ auth }) => {
    const user = auth.user || getItemFromStorage("user");

    return {
      isAuthenticated: !!user,
      user,
      isStartUp: user.role.includes("STARTUP"),
    };
  },
  null,
  null,
  { pure: false }
)(memo(withRouter(GettingStarted)));
