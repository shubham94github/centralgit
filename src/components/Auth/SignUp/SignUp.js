import React, { memo, useEffect } from "react";
import {
  Redirect,
  Route,
  Switch,
  useHistory,
  useLocation,
} from "react-router-dom";
import { Routes } from "@constants/routes";
import AddRetailCompany from "@components/Auth/AddRetailCompany";
import SignUpEmail from "@components/Auth/SignUp/SignUpEmail/SignUpEmail";
import SignUpCompany from "@components/Auth/SignUp/SignUpCompany/SignUpCompany";
import ChooseYourPlan from "@components/Auth/ChooseYourPlan/ChooseYourPlan";
import EmailVerificationProceed from "../EmailVerificationProceed";
import EmailVerification from "../EmailVerification";
import ChooseBusinessType from "@components/Auth/SignUp/ChooseBusinessType";
import backgroundStartup from "@assets/images/sing-up-bg.jpg";
import backgroundRetailer from "@assets/images/stuffer-gs-retailer.png";
import { colors } from "@colors";
import { connect } from "react-redux";
import { bool } from "prop-types";
import P12 from "@components/_shared/text/P12";

import "./SignUp.scss";

const SignUp = ({ isStartup, isMember }) => {
  const location = useLocation();
  const history = useHistory();

  const renderStep = (pathname) => {
    switch (pathname) {
      case Routes.AUTH.SIGN_UP.ADD_RETAIL_COMPANY:
        return "Step 1 of 3";
      case Routes.AUTH.SIGN_UP.CHOOSE_YOUR_PLAN:
        return "Step 2 of 3";
      case Routes.AUTH.SIGN_UP.RETAIL_BILLING_DETAILS:
        return "Step 3 of 3";
      default:
        return "";
    }
  };

  const cssStyle = {
    backgroundSize: "cover",
    backgroundPosition: isStartup ? "center" : "left top",
    backgroundColor: colors.darkblue90,
    backgroundImage: `url(${
      isStartup ? backgroundStartup : backgroundRetailer
    })`,
  };

  useEffect(() => {
    if (
      location.pathname === Routes.AUTH.SIGN_UP.INDEX ||
      location.pathname === Routes.AUTH.SIGN_UP.ADD_EMAIL ||
      location.pathname === Routes.AUTH.SIGN_UP.ADD_RETAIL_COMPANY ||
      location.pathname === Routes.AUTH.SIGN_UP.ADD_STARTUP_COMPANY ||
      location.pathname === Routes.AUTH.SIGN_UP.CHOOSE_YOUR_PLAN ||
      location.pathname === Routes.AUTH.SIGN_UP.RETAIL_BILLING_DETAILS ||
      location.pathname ===
        Routes.AUTH.SIGN_UP.EMAIL_VERIFICATION_PROCEED_STARTUP ||
      location.pathname ===
        Routes.AUTH.SIGN_UP.EMAIL_VERIFICATION_PROCEED_RETAIL ||
      location.pathname === Routes.AUTH.SIGN_UP.EMAIL_VERIFICATION_STARTUP ||
      location.pathname === Routes.AUTH.SIGN_UP.EMAIL_VERIFICATION_RETAIL ||
      location.pathname === Routes.AUTH.SIGN_UP.EMAIL_VERIFICATION_MEMBER ||
      location.pathname === Routes.AUTH.SIGN_UP.CHOOSE_BUSINESS_TYPE
    )
      history.push(location.pathname);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className="sign-up-page-section " style={cssStyle}>
      <div className="sign-up-page-container d-flex justify-content-center align-items-center flex-column">
        {!isMember && (
          <P12 className="step-style light">
            {renderStep(location.pathname)}
          </P12>
        )}
        <Switch>
          <Route
            path={Routes.AUTH.SIGN_UP.INDEX}
            render={() => <Redirect to={Routes.AUTH.SIGN_IN} />}
            exact
          />
          <Route path={Routes.AUTH.SIGN_UP.ADD_EMAIL} component={SignUpEmail} />
          <Route
            path={Routes.AUTH.SIGN_UP.ADD_RETAIL_COMPANY}
            component={SignUpCompany}
          />
          <Route
            path={Routes.AUTH.SIGN_UP.ADD_STARTUP_COMPANY}
            component={SignUpCompany}
            exact
          />
          <Route
            path={Routes.AUTH.SIGN_UP.CHOOSE_YOUR_PLAN}
            component={ChooseYourPlan}
          />
          <Route
            path={Routes.AUTH.SIGN_UP.RETAIL_BILLING_DETAILS}
            component={AddRetailCompany}
          />
          <Route
            path={Routes.AUTH.SIGN_UP.EMAIL_VERIFICATION_PROCEED}
            component={EmailVerificationProceed}
            exact
          />
          <Route
            path={Routes.AUTH.SIGN_UP.EMAIL_VERIFICATION_PROCEED_STARTUP}
            component={EmailVerificationProceed}
          />
          <Route
            path={Routes.AUTH.SIGN_UP.EMAIL_VERIFICATION_PROCEED_RETAIL}
            component={EmailVerificationProceed}
          />
          <Route
            path={Routes.AUTH.SIGN_UP.EMAIL_VERIFICATION_STARTUP}
            component={EmailVerification}
          />
          <Route
            path={Routes.AUTH.SIGN_UP.EMAIL_VERIFICATION_RETAIL}
            component={EmailVerification}
          />
          <Route
            path={Routes.AUTH.SIGN_UP.EMAIL_VERIFICATION_MEMBER}
            component={EmailVerification}
          />
          <Route
            path={Routes.AUTH.SIGN_UP.CHOOSE_BUSINESS_TYPE}
            component={ChooseBusinessType}
          />
          <Redirect
            path={`${Routes.AUTH.SIGN_UP.INDEX}/*`}
            to={Routes.AUTH.SIGN_IN}
          />
        </Switch>
      </div>
    </section>
  );
};

SignUp.propTypes = {
  isStartup: bool,
  isMember: bool,
};

const mapStateToProps = ({ auth }) => ({
  isStartup: auth.businessType ? auth.businessType === "Startup" : true,
  isMember: auth.isMember,
});

export default connect(mapStateToProps)(memo(SignUp));
