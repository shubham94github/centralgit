import React, { memo, useEffect } from "react";
import { P16, P14 } from "@components/_shared/text";
import PrimaryButton from "@components/_shared/buttons/PrimaryButton";
import { useHistory } from "react-router-dom";

import { connect } from "react-redux";
import { getCardInfo, retryPayment } from "@ducks/auth/actions";
import { bool, func, object, string } from "prop-types";
import { getItemFromStorage } from "@utils/storage";
import { Routes } from "@routes";
import "./RetryOrUpdateSubscription.scss";

const RetryOrUpdateSubscription = ({
  getCardInfo,
  customerId,
  retryPayment,
  isLoading,
  cardInfo,
  isTrial,
  stripeSubscriptionId,
  isMember,
}) => {
  const history = useHistory();
  // const update = () => history.push(Routes.SUBSCRIPTION.UPDATE_CARD);
  const update = () => history.push(Routes.SETTINGS.INDEX);
  const retry = () => retryPayment(stripeSubscriptionId);
  const gotoHome = () => {
    return history.push(Routes.HOME);
  };
  useEffect(() => {
    if (customerId) getCardInfo(customerId);
  }, [customerId, getCardInfo]);

  return (
    <section className="retry-subscription-section">
      <div className="retry-subscription-container">
        {/* <P16 className="label" bold>
          Your account is on hold.{" "}
          <span>{isMember && "Retry your payment?"}</span>
        </P16> */}
        {/* {cardInfo ? (
          <P14 className="description">
            We couldn’t process your last payment. Retry (
            {cardInfo?.brand?.toUpperCase()} - {cardInfo?.last4}) or update your
            payment info to keep using RetailHub.
          </P14>
        ) : ( */}
        {isTrial ? (
          <p className="description">
            !
            <br />
            <span>Upgrade </span> now your account to use this feature!
          </p>
        ) : (
          <p className="description">
            <span>!</span>
            <br />
            <span>Your trial has ended, </span>
            <br></br> we hope you enjoyed it. If you want to continue please
            complete the following and add a payment
          </p>
        )}

        {/* ) } */}
        {!isMember && (
          <div className="retry-subscription-actions">
            <PrimaryButton
              text="Update your info"
              onClick={update}
              isOutline
              className="rounded-pill"
              disabled={isLoading}
            />
            {!!cardInfo && !!stripeSubscriptionId && (
              <PrimaryButton
                text="Retry payment"
                onClick={retry}
                isLoading={isLoading}
              />
            )}
          </div>
        )}
        {isTrial && (
          <div className="backButton" onClick={gotoHome}>
            <span>&#60;</span>Back to Home
          </div>
        )}
      </div>
    </section>
  );
};

RetryOrUpdateSubscription.defaultProps = {
  getCardInfo: () => {},
  retryPayment: () => {},
  customerId: "",
  isLoading: false,
  cardInfo: {},
  stripeSubscriptionId: "",
};

RetryOrUpdateSubscription.propTypes = {
  getCardInfo: func.isRequired,
  retryPayment: func.isRequired,
  customerId: string,
  isTrial: bool,
  isLoading: bool,
  cardInfo: object,
  stripeSubscriptionId: string,
  isMember: bool,
};

const mapStateToProps = ({ auth }) => {
  const user = auth.user || getItemFromStorage("user");
  const propName = !!user?.retailer ? "retailer" : "member";

  return {
    customerId: user[propName].stripePaymentSettings?.customerId,
    isLoading: auth.isLoading,
    cardInfo: auth.cardInfo,
    isTrial: user.trial,
    stripeSubscriptionId:
      !!auth.user &&
      auth.user[propName].stripePaymentSettings?.stripeSubscriptionId,
    isMember: !!user.member,
  };
};

export default connect(mapStateToProps, {
  getCardInfo,
  retryPayment,
})(memo(RetryOrUpdateSubscription));
