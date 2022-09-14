import React, { memo, useEffect, useState } from "react";
import { getPaymentPlans as getAllPaymentPlans } from "@ducks/common/actions";
import { getPaymentPlans } from "@ducks/settings/actions";
import enums from "@constants/enums";
import { isEmpty } from "@utils/js-helpers";
import { useForm } from "react-hook-form";
import { useHistory, useLocation } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import { Col, Row } from "react-bootstrap";
import FormWrapper from "@components/_shared/form/FormWrapper";
import { P16, P14, P12 } from "@components/_shared/text";
import PrimaryButton from "@components/_shared/buttons/PrimaryButton";
import TextInput from "@components/_shared/form/TextInput";
import Checkbox from "@components/_shared/form/Checkbox";
import { Routes } from "@routes";
import schema from "./schema";
import {
  useElements,
  useStripe,
  CardNumberElement,
  CardCvcElement,
  CardExpiryElement,
} from "@stripe/react-stripe-js";
import { connect } from "react-redux";
import { bool, object, func, arrayOf, string } from "prop-types";
import {
  attachPaymentMethod,
  detachPaymentMethod,
  getAllCardsInfo,
  recreatePaymentCard,
  retryPayment,
  setIsLoading,
  updatePaymentCard,
} from "@ducks/auth/actions";
import {
  AgreementLabel,
  cardCVCOptions,
  cardExpiryOptions,
  cardNumberOptions,
  cvcTooltipText,
  checkedIcon,
} from "./constants";
import Tooltip from "@components/_shared/Tooltip";
import { colors } from "@colors";
import { stopPropagation } from "@utils";
import { Icons } from "@icons";
import { getItemFromStorage } from "@utils/storage";
import GridContainer from "@components/layouts/GridContainer";
import { getItemFromLocalStorage } from "@utils/localStorage";
import { paymentPlanType, userType } from "@constants/types";
import ChooseYourPlan from "@components/Auth/ChooseYourPlan";
import AppModal from "@components/Common/AppModal";
import { getFormattedPrice } from "@components/Auth/ChooseYourPlan/PlanCard/utils";

import "./PaymentForm.scss";

const { userRoles } = enums;

const PaymentForm = ({
  attachPaymentMethod,
  className,
  currentPaymentPlan,
  getAllPaymentPlans,
  getPaymentPlans,
  isLoading,
  paymentPlans,
  setIsLoading,
  submitButtonText = "Update",
  updatePaymentCard,
  isModal,
  isUpdating,
  toggleModal,
  detachPaymentMethod,
  selectedPaymentMethod,
  customerId,
  getAllCardsInfo,
  emailForSignUp,
  user,
  isUnpaidUser,
  recreatePaymentCard,
  stripeSubscriptionId,
}) => {
  const history = useHistory();
  const [isCardNumberFilled, setIsCardNumberFilled] = useState(false);
  const [isCVCFilled, setIsCvcFilled] = useState(false);
  const [isExpiryFilled, setIsExpiryFilled] = useState(false);
  const [isprivacyAccepted, setIsprivacyAccepted] = useState(false);
  const stripe = useStripe();
  const elements = useElements();
  const location = useLocation();
  const [isChangePlanModal, setIsChangePlanModal] = useState();
  const totalPrice =
    (currentPaymentPlan?.price?.unitAmountWithDiscount >= 0
      ? currentPaymentPlan?.price?.unitAmountWithDiscount
      : currentPaymentPlan?.price?.unitAmount) / 100;
  const userPrice = user?.retailer?.stripePaymentSettings?.discountedPrice;

  const { register, handleSubmit, errors, watch, setValue } = useForm({
    resolver: yupResolver(schema),
    defaultValues: schema.default(),
    mode: enums.validationMode.onBlur,
  });

  const redirectHandler = () => history.push(Routes.SUBSCRIPTION.INDEX);

  useEffect(() => {
    setValue("email", emailForSignUp);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isChangeSubscription =
    location.pathname === Routes.SUBSCRIPTION.UPDATE_CARD || isUpdating;
  const isRegistration = location.pathname.includes("/auth/sign-up/");

  const formTitle =
    !isModal &&
    (!isChangeSubscription
      ? "Add a Payment"
      : "Update your payment information");

  const goPrevPage = () => {
    const prevRoute = !isChangeSubscription
      ? Routes.AUTH.SIGN_UP.CHOOSE_YOUR_PLAN
      : Routes.SUBSCRIPTION.CHANGE_PLAN;

    history.push(prevRoute);
  };

  const onSubmit = async ({ name, email }) => {
    if (!stripe || !elements) return;

    setIsLoading(true);

    const cardElement = elements.getElement(CardNumberElement);

    const {
      paymentMethod: { id },
    } = await stripe.createPaymentMethod({
      type: "card",
      card: cardElement,
      billing_details: {
        name,
        email,
      },
    });

    if (!isChangeSubscription || !!stripeSubscriptionId)
      attachPaymentMethod(
        id,
        !isModal && !stripeSubscriptionId,
        !!stripeSubscriptionId,
        stripeSubscriptionId
      );
    else if (isUpdating && isModal) {
      detachPaymentMethod(selectedPaymentMethod);
      attachPaymentMethod(id, !isModal);
      if (customerId) getAllCardsInfo(customerId);
    } else if (isUnpaidUser) recreatePaymentCard(currentPaymentPlan?.id, id);
    else updatePaymentCard(id);

    if (isModal) toggleModal();
  };

  const handleChangeCardNumber = ({ complete }) =>
    setIsCardNumberFilled(complete);
  const handleChangeCardCVC = ({ complete }) => setIsCvcFilled(complete);
  const handleChangeCardExpiry = ({ complete }) => setIsExpiryFilled(complete);

  const isAgreementAccepted = isModal || watch("agreement");

  const isSubmissionAvailable =
    isEmpty(errors) &&
    isCardNumberFilled &&
    isAgreementAccepted &&
    isCVCFilled &&
    isExpiryFilled;

  useEffect(() => {
    if (isEmpty(paymentPlans)) {
      if (user && user?.token) {
        getAllPaymentPlans({
          token:
            getItemFromLocalStorage("resendVerificationToken") || user.token,
        });
      } else getPaymentPlans();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openEditPlanModal = () => setIsChangePlanModal(true);
  const closeEditPlanModal = () => setIsChangePlanModal(false);

  return (
    <>
      <FormWrapper
        className={`add-retail-company-container ${className}`}
        onClick={stopPropagation}
      >
        <Row>
          <Col className="text-center">
            <P16 className="form-heading" bold>
              Add a Payment
            </P16>
          </Col>
        </Row>
        <Row>
          <Col className="text-center">
            <p className="trial-show" bold>
              Enjoy 7 day trial for free! <br /> As a member we will email you
              before your
            </p>
          </Col>
        </Row>
        <Row>
          <Col className="text-center">
            <p className="trial-period-payment" bold>
              {checkedIcon} Total during 7 day trial $0.00
            </p>
          </Col>
        </Row>
        {!isChangeSubscription && !isModal && (
          <Row className="mt-3">
            {!!currentPaymentPlan.trial && (
              <Col>
                <P14 className="mb-1">
                  {`Enjoy ${currentPaymentPlan.trial}-day trial for free!`}
                </P14>
                <P12>
                  As a reminder, we will email you before your trial expires.
                </P12>
                <div className="label-with-checked mt-3">
                  {checkedIcon}
                  <span className="ms-3">{`Total during ${currentPaymentPlan.trial} day trial $0.00`}</span>
                </div>
              </Col>
            )}
          </Row>
        )}
        <Row>
          <Col className="form-group mb-3" xs={12} sm={6}>
            <label>Full Name</label>
            <input
              //   isError={!!errors.name?.message}
              //   isLightTheme
              name="name"
              placeholder="Name"
              ref={register}
              type="text"
              className="form-control"
            />
            {errors.name && (
              <P12 className="warning-text">{errors.name.message}</P12>
            )}
          </Col>
          <Col className="form-group" xs={12} sm={6}>
            <label>Email</label>
            <input
              //   isError={!!errors.email?.message}
              //   isLightTheme
              name="email"
              placeholder="E-mail"
              ref={register}
              type="text"
              className="form-control"
            />
            {errors.email && (
              <P12 className="warning-text">{errors.email.message}</P12>
            )}
          </Col>
        </Row>

        <Row>
          <Col className="form-group" xs={12} sm={6}>
            <label>Card Number</label>
            <CardNumberElement
              className="card-number-input form-control"
              onChange={handleChangeCardNumber}
              options={cardNumberOptions}
            />
          </Col>
          <Col className="form-group" xs={12} sm={3}>
            <label></label>
            <CardExpiryElement
              className="card-expiry-input form-control"
              options={cardExpiryOptions}
              onChange={handleChangeCardExpiry}
              placeholder="MM/YY"
            />
          </Col>
          <Col className="form-group" xs={12} sm={3}>
            <label></label>
            <div className="card-cvc-wrapper  d-flex">
              <span className="payment-card-icon">{Icons.paymentCard()}</span>
              <CardCvcElement
                className="card-cvc-input form-control"
                options={cardCVCOptions}
                onChange={handleChangeCardCVC}
              />
              <Tooltip placement="bottom-start" message={cvcTooltipText}>
                {Icons.infoIcon(colors.gray40)}
              </Tooltip>
            </div>
          </Col>
        </Row>
        {!isModal && (
          <>
            <Row className="plan-description">
              <Col sm={6} xs={12} className="text-center text-sm-start">
                {!!user.trial ? (
                  <P14>
                    {`After ${currentPaymentPlan.trial} days`}
                    <b>{` $${getFormattedPrice(
                      userPrice ? userPrice / 100 : totalPrice
                    )}`}</b>
                  </P14>
                ) : (
                  <P14>
                    You will be charged
                    <b>{` $${getFormattedPrice(
                      userPrice ? userPrice / 100 : totalPrice
                    )}`}</b>
                  </P14>
                )}
              </Col>
              <Col sm={6} xs={12} className="text-center text-sm-end">
                {((!!isUnpaidUser && !stripeSubscriptionId) ||
                  isRegistration) && (
                  <P14>
                    {`${currentPaymentPlan?.uiName} Plan`}
                    {isUnpaidUser ? (
                      <span className="link" onClick={openEditPlanModal}>
                        Change
                      </span>
                    ) : (
                      <span className="link" onClick={goPrevPage}>
                        Change
                      </span>
                    )}
                  </P14>
                )}
              </Col>
            </Row>
            <Row>
              <Col xs={12} className="mb-0 mt-5">
                <Checkbox
                  label={<AgreementLabel />}
                  name={"agreement"}
                  register={register}
                  value={watch("agreement")}
                />
              </Col>
            </Row>
          </>
        )}

        <Row>
          <div className="align-items-baseline d-flex justify-content-around pt-4 privacy-check">
            <input
              type="checkbox"
              className=""
              checked={isprivacyAccepted}
              onClick={() => setIsprivacyAccepted(!isprivacyAccepted)}
            />
            <p className="p-2">
              By checking the box below, you agree to our &nbsp;
              <span>
                <a href="https://retailhub.ai/terms-service" target="blank">
                  Terms
                </a>
              </span>
              &nbsp; and that you have read and understood our &nbsp;
              <span>
                <a
                  href="https://retailhub.ai/terms-service#13-privacy-and-data-protection"
                  target="blank"
                >
                  Data policy
                </a>
              </span>
              .
            </p>
          </div>
        </Row>
        <div className="form-actions d-flex justify-content-evenly">
          {!isModal && isChangeSubscription && (
            <PrimaryButton
              isFullWidth
              onClick={redirectHandler}
              text="Cancel"
              isOutline
              className="rounded-pill minBtn"
            />
          )}
          <PrimaryButton
            disabled={!isSubmissionAvailable || !isprivacyAccepted}
            isDarkTheme={false}
            isLoading={isLoading}
            onClick={handleSubmit(onSubmit)}
            text={submitButtonText}
            className="rounded-pill minBtn"
          />
        </div>
      </FormWrapper>
      {isUnpaidUser && isChangeSubscription && isChangePlanModal && (
        <AppModal
          component={ChooseYourPlan}
          outerProps={{
            isModal: true,
            closeModal: closeEditPlanModal,
            submitButtonText: "Change",
            activePaymentPlan: currentPaymentPlan,
          }}
          width="fit-content"
          onClose={closeEditPlanModal}
          isCloseIcon
          title="Change your plan"
        />
      )}
    </>
  );
};

PaymentForm.defaultProps = {
  currentPaymentPlan: {},
  isLoading: false,
  paymentPlans: [],
  className: "",
  isModal: false,
};

PaymentForm.propTypes = {
  attachPaymentMethod: func.isRequired,
  className: string,
  currentPaymentPlan: paymentPlanType,
  getAllPaymentPlans: func.isRequired,
  getPaymentPlans: func.isRequired,
  isLoading: bool,
  paymentPlans: arrayOf(object),
  setIsLoading: func.isRequired,
  updatePaymentCard: func.isRequired,
  isModal: bool,
  submitButtonText: string,
  isUpdating: bool,
  toggleModal: func,
  detachPaymentMethod: func.isRequired,
  selectedPaymentMethod: string,
  customerId: string,
  getAllCardsInfo: func.isRequired,
  emailForSignUp: string,
  user: userType,
  isUnpaidUser: bool,
  recreatePaymentCard: func,
  retryPayment: func,
  stripeSubscriptionId: string,
  stripePaymentMethodId: string,
};

const mapStateToProps = ({ common: { paymentPlans }, auth }) => {
  const { currentPaymentPlanId, isLoading, emailForSignUp } = auth;
  const user = auth.user || getItemFromStorage("user");
  const paymentPlanId =
    currentPaymentPlanId ?? getItemFromStorage("paymentPlan");
  const currentPaymentPlan =
    paymentPlans.find(({ id }) => +paymentPlanId === id) ||
    user?.retailer?.paymentPlan;
  const isRetailer = !!user?.retailer;
  const isMember = !!user?.member;
  const isStartup = !!user?.startup;
  const isAdmin =
    user?.role === userRoles.admin || user?.role === userRoles.superAdmin;
  const authUser = isRetailer ? user?.retailer : user?.member;
  //   const isTrial = user.trial;
  return {
    currentPaymentPlan,
    isLoading,
    paymentPlans,
    customerId: isRetailer
      ? user?.retailer?.customerId
      : isMember
      ? user?.member?.customerId
      : user?.startup?.customerId,
    emailForSignUp:
      emailForSignUp || getItemFromStorage("signUpEmail") || user?.email,
    user,
    isUnpaidUser:
      !isAdmin &&
      !isStartup &&
      !!authUser?.stripePaymentSettings &&
      !authUser?.stripePaymentSettings?.isSubscriptionPaid &&
      !authUser?.stripePaymentSettings?.isTrial,
    stripeSubscriptionId:
      !isAdmin &&
      !isStartup &&
      authUser?.stripePaymentSettings?.stripeSubscriptionId,
    stripePaymentMethodId:
      !isAdmin &&
      !isStartup &&
      authUser?.stripePaymentSettings?.stripePaymentMethodId,
  };
};

export default connect(mapStateToProps, {
  attachPaymentMethod,
  getAllPaymentPlans,
  getPaymentPlans,
  setIsLoading,
  updatePaymentCard,
  getAllCardsInfo,
  detachPaymentMethod,
  recreatePaymentCard,
  retryPayment,
})(memo(PaymentForm));
