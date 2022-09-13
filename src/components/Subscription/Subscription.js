import React, { memo } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import { Routes } from "@routes";
import ProtectedRoute from "@components/Common/ProtectedRoute";
import RetryOrUpdateSubscription from "./RetryOrUpdateSubscription";
import AddRetailCompany from "@components/Auth/AddRetailCompany";
import UpdateCardSuccessfully from "./UpdateCardSuccessfully";
import UpdateCardFailed from "./UpdateCardFailed";
import PaymentRetry from "./PaymentRetry";
import ChooseYourPlan from "@components/Auth/ChooseYourPlan";

import "./Subscription.scss";

const {
  INDEX,
  RETRY_OR_UPDATE,
  UPDATE_CARD,
  CHANGE_PLAN,
  PAYMENT_RETRY,
  UPDATE_CARD_SUCCESSFULLY,
  UPDATE_CARD_FAILED,
} = Routes.SUBSCRIPTION;

const Subscription = () => {
  return (
    <section className="subscription-section">
      <Switch>
        <Route
          path={INDEX}
          render={() => <Redirect to={RETRY_OR_UPDATE} />}
          exact
        />
        <ProtectedRoute
          path={RETRY_OR_UPDATE}
          component={RetryOrUpdateSubscription}
        />
        <ProtectedRoute path={UPDATE_CARD} component={AddRetailCompany} />
        <ProtectedRoute path={CHANGE_PLAN} component={ChooseYourPlan} />
        <ProtectedRoute
          path={UPDATE_CARD_SUCCESSFULLY}
          component={UpdateCardSuccessfully}
        />
        <ProtectedRoute
          path={UPDATE_CARD_FAILED}
          component={UpdateCardFailed}
        />
        <ProtectedRoute path={PAYMENT_RETRY} component={PaymentRetry} />
      </Switch>
    </section>
  );
};

export default memo(Subscription);
