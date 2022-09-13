import React, { memo } from "react";
import { P16, P14 } from "@components/_shared/text";
import PrimaryButton from "@components/_shared/buttons/PrimaryButton";
import { Routes } from "@routes";
import { useHistory } from "react-router-dom";
import { retryPayment } from "@ducks/auth/actions";
import { connect } from "react-redux";
import { bool, func, string } from "prop-types";
import { Icons } from "@icons";
import { userRoles } from "@constants/types";

import "./UpdateCardFailed.scss";

const exclamationPointIcon = Icons.exclamationPointIcon();

const UpdateCardFailed = ({ retryPayment, stripeSubscriptionId }) => {
  const history = useHistory();

  const retry = () => retryPayment(stripeSubscriptionId);
  // const update = () => history.push(Routes.SUBSCRIPTION.UPDATE_CARD);
  const update = () => history.push(Routes.SETTINGS.INDEX);

  return (
    <section className="update-card-failed-section">
      <div className="update-card-failed-container">
        {exclamationPointIcon}
        <P16 className="label">Payment failed</P16>
        <P14 className="description">
          Oops! Something went wrong with your payment!
          <br />
          Please select options below.
        </P14>
        <div className="update-card-failed-actions">
          <PrimaryButton text="Retry" onClick={retry} isOutline />
          <PrimaryButton text="Update" onClick={update} />
        </div>
      </div>
    </section>
  );
};

UpdateCardFailed.defaultProps = {
  retryPayment: () => {},
  stripeSubscriptionId: "",
  isLoading: false,
};

UpdateCardFailed.propTypes = {
  retryPayment: func.isRequired,
  stripeSubscriptionId: string,
  isLoading: bool,
};

const mapStateToProps = ({ auth: { user, isLoading } }) => {
  const isRetailer = !!user?.retailer;
  const isStartup = !!user?.startup;
  const isAdmin =
    user?.role === userRoles.admin || user?.role === userRoles.superAdmin;

  return {
    stripeSubscriptionId:
      !isAdmin &&
      !isStartup &&
      user[isRetailer ? "retailer" : "member"].stripePaymentSettings
        .stripeSubscriptionId,
    isLoading,
  };
};

export default connect(mapStateToProps, {
  retryPayment,
})(memo(UpdateCardFailed));
