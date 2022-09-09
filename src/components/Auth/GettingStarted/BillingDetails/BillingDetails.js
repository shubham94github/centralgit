import React, { memo, useEffect, useState } from "react";
import { connect } from "react-redux";
import { useLocation } from "react-router-dom";
import {
  array,
  arrayOf,
  bool,
  func,
  number,
  object,
  shape,
  string,
} from "prop-types";
import cn from "classnames";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { colors } from "@colors";
import AppModal from "@components/Common/AppModal";
import CardsInfo from "@components/Auth/GettingStarted/BillingDetails/CardsInfo";
import FormWrapper from "@components/_shared/form/FormWrapper";
import { P12, P14, P16, S14 } from "@components/_shared/text";
import TextInput from "@components/_shared/form/TextInput";
import Select from "@components/_shared/form/Select";
import PrimaryButton from "@components/_shared/buttons/PrimaryButton";
import { isEmpty } from "@utils/js-helpers";
import {
  normalizeString,
  separateCamelCase,
  dateFormatCorrection,
} from "@utils";
import LoadingOverlay from "@components/_shared/LoadingOverlay";
import enums from "@constants/enums";
import ChooseYourPlan from "@components/Auth/ChooseYourPlan";
import GridContainer from "@components/layouts/GridContainer";
import { Icons } from "@icons";
import { userType } from "@constants/types";
import { Routes } from "@routes";
import {
  billingMessage,
  changePlanMessage,
  subscriptionResumeText,
  subscriptionStopText,
  subscriptionResumeTitle,
  subscriptionStopTitle,
} from "./constants";
import PaymentFormWithProvider from "@components/_shared/PaymentFormWithProvider";
import SliderCheckbox from "@components/_shared/form/SliderCheckbox";
import Confirm from "@components/_shared/ModalComponents/Confirm";
import { toggleIsCancelledSubscription } from "@ducks/settings/actions";

import "./BillingDetails.scss";

const plusIcon = Icons.plus();
const infoIcon = Icons.infoIcon(colors.grass50);

function BillingDetails({
  schema,
  onSubmit,
  setIsEditPaymentPlanModal,
  isEditPaymentPlanModal,
  companyLegalName,
  city,
  countries,
  isLoading,
  countryId,
  client,
  setPaymentPlanId,
  cardsInfo,
  defaultPaymentMethodId,
  activePaymentPlan,
  formattedNextPaymentDate,
  stepText,
  address,
  postZipCode,
  vatNumber,
  isResetButton,
  isAdmin,
  onClose,
  user,
  toggleIsCancelledSubscription,
}) {
  const propName = !!user?.retailer ? "retailer" : "member";
  const isCancelledSubscription =
    user[propName].stripePaymentSettings?.isCancelled;
  const subscriptionEndsAt =
    dateFormatCorrection(
      new Date(user[propName].stripePaymentSettings?.nextPaymentDate),
      "MMM d, yyyy"
    ) || "...";
  const location = useLocation();
  const defaultValues = schema.default();
  const classContainer = cn("billing-details-container", {
    "container-modal": isAdmin,
  });
  const submitButtonText = isAdmin ? "Update" : "Save";
  const isGettingStarted = location.pathname.includes(
    Routes.AUTH.GETTING_STARTED.INDEX
  );
  const [isAddNewCardModal, setIsAddNewCardModal] = useState(false);
  const [isSubscriptionModal, setIsSubscriptionModal] = useState(false);

  const toggleAddCardModal = () => setIsAddNewCardModal(!isAddNewCardModal);
  const toggleSubscriptionModal = () =>
    setIsSubscriptionModal(!isSubscriptionModal);

  const {
    clearErrors,
    control,
    errors,
    getValues,
    handleSubmit,
    register,
    reset,
    setError,
    setValue,
    watch,
    trigger,
  } = useForm({
    resolver: yupResolver(schema),
    mode: enums.validationMode.onTouched,
    defaultValues: {
      ...defaultValues,
      companyLegalName: client.companyLegalName
        ? client.companyLegalName
        : companyLegalName,
      city: city ? city : user.city,
      countryId: user?.country
        ? countries.find((country) => country.id === user.country.id)
        : countryId
        ? countries.find((country) => country.id === countryId)
        : null,
      address: client.address ? client.address : address,
      postZipCode: client.postZipCode ? client.postZipCode : postZipCode,
      vatNumber: client.vatNumber ? client.vatNumber : vatNumber,
    },
  });

  const handleToggleSubscription = () => {
    toggleIsCancelledSubscription({ isCancelledSubscription });
    toggleSubscriptionModal();
  };

  useEffect(() => {
    /* eslint-disable react/prop-types */
    if ((user?.country || countryId) && countries?.length) {
      setValue(
        "countryId",
        user?.country
          ? countries.find((country) => country.id === user.country.id)
          : countries.find((country) => country.id === countryId)
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [countries]);

  const editIcon = Icons.edit(!isEmpty(errors) && colors.gray20);

  const closeModal = () => setIsEditPaymentPlanModal(false);

  const openEditPaymentPlanModal = async () => {
    const isFormFilled = await trigger();

    if (isFormFilled && !isEditPaymentPlanModal)
      setIsEditPaymentPlanModal(true);
  };

  const trimFormValues = (fieldName) => (value) =>
    setValue(fieldName, value.trim(), { shouldValidate: true });

  const onSelectChange = (fieldName) => (option) => {
    if (!option) {
      const separatedName = separateCamelCase(fieldName);

      setError(fieldName, {
        message: `${normalizeString(separatedName)}  is required field`,
      });
    } else clearErrors(fieldName);

    setValue(fieldName, option);
  };

  const onSelectMenuClose = (fieldName) => () => {
    if (!getValues()[fieldName]) {
      const separatedName = separateCamelCase(fieldName);

      setError(fieldName, {
        message: `${normalizeString(separatedName)}  is required field`,
      });
    }
  };

  const handleCopyCompanyInfo = () => {
    const {
      city,
      companyLegalName,
      country: { id: countryId },
    } = client;

    reset({
      companyLegalName,
      city,
      countryId: countries.find((country) => country.id === countryId),
      address: watch("address"),
      vatNumber: watch("vatNumber"),
      postZipCode: watch("postZipCode"),
    });
  };

  const resetValues = () =>
    reset({
      companyLegalName,
      city,
      countryId: countries.find((country) => country.id === countryId),
      address,
      postZipCode,
      vatNumber,
    });

  const addCard = () => toggleAddCardModal();

  return (
    <FormWrapper className={classContainer} onSubmit={onSubmit}>
      {isSubscriptionModal && (
        <AppModal
          className="confirm-subscription"
          onClose={toggleSubscriptionModal}
          title={
            !isCancelledSubscription
              ? subscriptionStopTitle
              : subscriptionResumeTitle
          }
          outerProps={{
            successConfirm: handleToggleSubscription,
            onClose: toggleSubscriptionModal,
            text: !isCancelledSubscription
              ? subscriptionStopText(subscriptionEndsAt)
              : subscriptionResumeText,
          }}
          component={Confirm}
          width="630px"
        />
      )}
      {isAddNewCardModal && (
        <AppModal
          component={PaymentFormWithProvider}
          className="add-new-card-modal"
          outerProps={{
            isModal: true,
            isUpdating: false,
            toggleModal: toggleAddCardModal,
          }}
          title="Add a new payment method"
          onClose={toggleAddCardModal}
          staticBackdrop={false}
          width="668px"
          isDarkModal
        />
      )}
      {stepText && (
        <GridContainer>
          <P14 className="step-style">{stepText}</P14>
        </GridContainer>
      )}
      {!isAdmin && (
        <GridContainer>
          <P16 bold={true} className="mb-3 form-title">
            Billing details
          </P16>
          <S14 className="copy-from" onClick={handleCopyCompanyInfo}>
            Copy from company details
          </S14>
        </GridContainer>
      )}
      <GridContainer template="570px">
        <div>
          <TextInput
            type="text"
            name="companyLegalName"
            placeholder="Legal name"
            register={register}
            isLightTheme
            isError={!!errors.companyLegalName}
            control={control}
            onBlur={trimFormValues("companyLegalName")}
          />
          <P12 className="warning-text">
            {errors.companyLegalName && errors.companyLegalName.message}
          </P12>
        </div>
      </GridContainer>
      <GridContainer template="270px 270px">
        <div>
          <Select
            name="countryId"
            control={control}
            register={register}
            options={countries}
            placeholder="Country"
            value={watch("countryId")}
            onChange={onSelectChange("countryId")}
            onMenuClose={onSelectMenuClose("countryId")}
            isError={!!errors.countryId}
            isSearchable
            isCreatable={false}
            isFilterForStart
            isTopPlaceholder
          />
          <P12 className="warning-text">
            {errors.countryId && errors.countryId.message}
          </P12>
        </div>
        <div>
          <TextInput
            type="text"
            name="city"
            placeholder="City"
            register={register}
            isLightTheme
            isError={!!errors.city}
            control={control}
            onBlur={trimFormValues("city")}
            setValue={setValue}
          />
          <P12 className="warning-text">
            {errors.city && errors.city.message}
          </P12>
        </div>
      </GridContainer>
      <GridContainer template="570px">
        <div>
          <TextInput
            type="text"
            name="address"
            placeholder="Address"
            register={register}
            isLightTheme
            isError={!!errors.address}
            control={control}
            onBlur={trimFormValues("address")}
          />
          <P12 className="warning-text">
            {errors.address && errors.address.message}
          </P12>
        </div>
      </GridContainer>
      <GridContainer template="270px 270px">
        <div>
          <TextInput
            type="text"
            name="vatNumber"
            placeholder="VAT number"
            register={register}
            isLightTheme
            isError={!!errors.vatNumber}
            control={control}
            onBlur={trimFormValues("vatNumber")}
          />
          <P12 className="warning-text">
            {errors.vatNumber && errors.vatNumber.message}
          </P12>
        </div>
        <div>
          <TextInput
            type="text"
            name="postZipCode"
            placeholder="Post/Zip Code"
            register={register}
            isLightTheme
            isError={!!errors.postZipCode}
            control={control}
            onBlur={trimFormValues("postZipCode")}
            setValue={setValue}
          />
          <P12 className="warning-text">
            {errors.postZipCode && errors.postZipCode.message}
          </P12>
        </div>
      </GridContainer>
      {!isAdmin && (
        <GridContainer template="270px 270px">
          {isEmpty(cardsInfo) ? (
            <div className="add-card">
              <P16 bold>Billing</P16>
              {!isGettingStarted && (
                <div className="add-card-container">
                  <P14>Please add at least one valid banking card</P14>
                  <div className="add-card-btn" onClick={addCard}>
                    {plusIcon}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="card-info">
              <P16 bold>Billing</P16>
              <CardsInfo
                cards={cardsInfo}
                defaultPaymentMethodId={defaultPaymentMethodId}
                isGettingStarted={isGettingStarted}
                nextPaymentDate={
                  user?.retailer?.stripePaymentSettings?.nextPaymentDate
                }
              />
            </div>
          )}
          <div>
            {!isGettingStarted && (
              <div className="toggle-subscription">
                Subscription on/off&nbsp;
                <SliderCheckbox
                  checked={!isCancelledSubscription}
                  onChange={toggleSubscriptionModal}
                />
              </div>
            )}
            <S14 className="current-plan">
              Current Plan:&nbsp;
              <b>{activePaymentPlan?.uiName}</b>
              {!isGettingStarted && (
                <span
                  className={cn("edit", {
                    "disabled-action": !isEmpty(errors),
                  })}
                  onClick={openEditPaymentPlanModal}
                >
                  {editIcon}
                </span>
              )}
            </S14>
          </div>
        </GridContainer>
      )}
      {!isAdmin && (
        <GridContainer template="570px">
          {formattedNextPaymentDate && !isEmpty(cardsInfo) && (
            <div className="next-payment">
              <span>
                Your next billing date is&nbsp;
                {formattedNextPaymentDate}
              </span>
              <br />
              <span>{billingMessage}</span>
              {isGettingStarted && (
                <>
                  <br />
                  <span className="change-plan-message">
                    {infoIcon}&nbsp;{changePlanMessage}
                  </span>
                </>
              )}
            </div>
          )}
        </GridContainer>
      )}
      <GridContainer
        customClassName="flex-end"
        template={isAdmin ? "270px 270px" : "auto 270px"}
      >
        {!isAdmin &&
          (isResetButton ? (
            <PrimaryButton
              className="billing-button"
              onClick={resetValues}
              isDarkTheme={false}
              text="Reset"
              disabled={isEmpty(getValues())}
              isOutline
            />
          ) : (
            <div />
          ))}
        {isAdmin && (
          <PrimaryButton
            className="billing-button"
            onClick={onClose}
            isDarkTheme={false}
            text="Cancel"
            isOutline
          />
        )}
        <PrimaryButton
          className="billing-button float-end"
          onClick={handleSubmit(onSubmit)}
          isDarkTheme={false}
          text={submitButtonText}
          disabled={!isEmpty(errors)}
        />
      </GridContainer>
      {isEditPaymentPlanModal && (
        <AppModal
          component={ChooseYourPlan}
          outerProps={{
            submitButtonText: "Update",
            isModal: true,
            setPaymentPlanId,
            closeModal,
            withCancelButton: true,
            activePaymentPlan,
          }}
          title="Upgrade yout account Choose the best plan for you"
          className="edit-payment-plan-modal"
          onClose={closeModal}
          width="100%"
          isDarkModal={true}
        />
      )}
      {isLoading && <LoadingOverlay isCentered={false} />}
    </FormWrapper>
  );
}

BillingDetails.defaultProps = {
  isRetailer: false,
  isResetButton: false,
  isAdmin: false,
};

BillingDetails.propTypes = {
  schema: object.isRequired,
  onSubmit: func.isRequired,
  isEditPaymentPlanModal: bool.isRequired,
  setIsEditPaymentPlanModal: func.isRequired,
  companyLegalName: string,
  city: string,
  countries: array.isRequired,
  nextPaymentDate: number,
  isLoading: bool.isRequired,
  countryId: number,
  role: string,
  client: object,
  setPaymentPlanId: func,
  cardsInfo: arrayOf(
    shape({
      brand: string,
      last4: string,
      paymentMethodId: string,
    })
  ),
  defaultPaymentMethodId: string,
  activePaymentPlan: object,
  isRetailer: bool,
  formattedNextPaymentDate: string,
  stepText: string,
  address: string,
  postZipCode: string,
  vatNumber: string,
  isResetButton: bool,
  isAdmin: bool,
  onClose: func,
  user: userType,
  toggleIsCancelledSubscription: func,
};

export default connect(null, {
  toggleIsCancelledSubscription,
})(memo(BillingDetails));
