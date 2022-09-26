import React, { memo, useEffect } from "react";
import { bool, elementType, func, shape, string } from "prop-types";
import { Redirect, Route, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { Routes } from "@routes";
import { createInstancesForApis } from "@api/createInstancesForApis";
import enums from "@constants/enums";
import { generateListOfPermissions, setUser } from "@ducks/auth/actions";
import { getItemFromStorage } from "@utils/storage";

const { gettingStartedStatuses, userRoles } = enums;

const {
  AUTH: {
    GETTING_STARTED: { INDEX, RETAIL_HUB_REGISTRATION_APPROVAL },
  },
} = Routes;

const ProtectedRoute = ({
  isAuthenticated,
  path,
  user,
  component: ProtectedComponent,
  location,
  setUser,
  generateListOfPermissions,
}) => {
  const securedRouteMatch = () => {
    const isAdmin =
      user?.role === userRoles.admin || user?.role === userRoles.superAdmin;
    const isRetailer = !!user?.retailer;
    const isStartup = !!user?.startup;
    if (isAuthenticated) {
      if (isAdmin && !location.pathname.includes(Routes.ADMIN_PANEL.INDEX))
        return <Redirect to={Routes.ADMIN_PANEL.INDEX} />;
      if (
        user?.status === gettingStartedStatuses.completedGettingStarted &&
        !isAdmin &&
        !isStartup &&
        !!user[isRetailer ? "retailer" : "member"] &&
        user[isRetailer ? "retailer" : "member"].stripePaymentSettings &&
        !user[isRetailer ? "retailer" : "member"].stripePaymentSettings
          ?.stripeSubscriptionId &&
        !user.trial &&
        !location.pathname.includes(Routes.SUBSCRIPTION.INDEX) &&
        !location.pathname.includes(Routes.SETTINGS.INDEX) &&
        !location.pathname.includes(
          Routes.AUTH.GETTING_STARTED.RETAIL_HUB_REGISTRATION_APPROVAL
        )
      ) {
        return <Redirect to={Routes.SUBSCRIPTION.INDEX} />;
      }
      if (
        user?.status !== gettingStartedStatuses.completedGettingStarted &&
        !isAdmin &&
        !location.pathname.includes(Routes.AUTH.GETTING_STARTED.INDEX)
      )
        return <Redirect to={INDEX} />;

      if (
        user?.status === gettingStartedStatuses.completedGettingStarted &&
        // !user.isApprovedByAdmin &&
        !isAdmin &&
        location.pathname !== RETAIL_HUB_REGISTRATION_APPROVAL
      )
        return <Redirect to={RETAIL_HUB_REGISTRATION_APPROVAL} />;

      const localUser = getItemFromStorage("user");

      if (isAuthenticated || localUser) {
        createInstancesForApis(user?.role || localUser.role);

        return <ProtectedComponent />;
      }
    }

    return <Redirect to={Routes.AUTH.SIGN_IN} />;
  };

  useEffect(() => {
    const localUser = getItemFromStorage("user");
    const userAvatar = getItemFromStorage("userAvatar");
    const companyAvatar = getItemFromStorage("companyAvatar");

    if (!!localUser) {
      setUser({ user: localUser, userAvatar, companyAvatar });
      generateListOfPermissions({ user: localUser });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <Route path={path} render={securedRouteMatch} />;
};

ProtectedRoute.propTypes = {
  isAuthenticated: bool,
  path: string,
  component: elementType,
  user: shape({
    status: string,
  }),
  location: shape({
    pathname: string,
  }),
  setUser: func,
  generateListOfPermissions: func,
};

export default connect(
  ({ auth }) => {
    const user = auth.user || getItemFromStorage("user");

    return {
      isAuthenticated: !!user,
      user: user,
    };
  },
  { setUser, generateListOfPermissions }
)(withRouter(memo(ProtectedRoute)));
