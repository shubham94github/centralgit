import React, { memo, useCallback, useEffect } from "react";
import { P14, P16 } from "@components/_shared/text";
import { useHistory } from "react-router-dom";
import { Routes } from "@routes";
import LoadingOverlay from "@components/_shared/LoadingOverlay";
import { number, object } from "prop-types";
import { connect } from "react-redux";
import { getItemFromStorage } from "@utils/storage";

const ApprovalForRetailCompany = ({ cssStyle, trial }) => {
  const history = useHistory();
  const delay = 10000;
  const redirectHandler = useCallback(
    () => history.push(Routes.HOME),
    [history]
  );

  useEffect(() => {
    const timer = setTimeout(() => redirectHandler(), delay);

    return () => clearTimeout(timer);
  }, [redirectHandler]);

  return (
    <div className="registration-approval-container" style={cssStyle}>
      <div className="registration-approval-content">
        <p className="approvel-title">
          Your <span>account registration</span> is being
          <span>approved by RetailHub!</span>
        </p>
        <P14>
          {!!trial ? (
            <>
              You have a FREE {trial} day trial period that will start once your
              account is approved. You will only be charged the amount according
              to your Subscription plan after the FREE trial period has ended.
            </>
          ) : (
            <>
              There is no trial period in your payment plan. You will be charged
              the amount right now.
            </>
          )}
          <br />
          <br />
          Please wait a few seconds and you will be redirected to the home page
          where RetailHub has matched Startups that are most related to your
          interest.
        </P14>
        <LoadingOverlay classNames="verification-loading" />
      </div>
    </div>
  );
};

ApprovalForRetailCompany.propTypes = {
  cssStyle: object.isRequired,
  trial: number,
};

export default connect(({ auth: { user } }) => {
  const localUser = getItemFromStorage("user");
  const { retailer } = user || localUser;

  return {
    trial: retailer?.paymentPlan?.trial,
  };
})(memo(ApprovalForRetailCompany));
