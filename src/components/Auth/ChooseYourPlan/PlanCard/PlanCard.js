import React, { memo, useEffect, useState } from "react";
import {
  arrayOf,
  bool,
  func,
  number,
  oneOf,
  oneOfType,
  shape,
  string,
} from "prop-types";
import P16 from "@components/_shared/text/P16";
import P12 from "@components/_shared/text/P12";
import RadioButton from "@components/_shared/form/RadioButton";
import { isEmpty } from "@utils/js-helpers";
import enums from "@constants/enums";
import {
  getFormattedPrice,
  getUserRestriction,
} from "@components/Auth/ChooseYourPlan/PlanCard/utils";
import TextInput from "@components/_shared/form/TextInput";
import PrimaryButton from "@components/_shared/buttons/PrimaryButton";
import GridContainer from "@components/layouts/GridContainer";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { schema } from "./schema";
import { featureType, paymentPlanType } from "@constants/types";
import P14 from "@components/_shared/text/P14";
import { Icons } from "@icons";
import { colors } from "@colors";
import { getItemFromLocalStorage } from "@utils/localStorage";
import cn from "classnames";

import "./PlanCard.scss";

const checkMarkIcon = Icons.singleTick(colors.grass60);
const enterpriseType = "ENTERPRISE";
const yearTypeInterval = "YEAR";

const { paymentPeriods } = enums;

const PlanCard = ({
  column,
  plans,
  selectedPlanId,
  setSelectedPlanId,
  features,
  sendDiscountCode,
  userToken,
  isModal,
  sendDiscount,
}) => {
  //   const [IsSelectedPlan, setIsSelectedPlan] = useState(false);
  const [mainClass, setMainClass] = useState("plan-card");
  useEffect(() => {
    const result = plans.some((plan) => plan.id === selectedPlanId);
    if (result) {
      //   setIsSelectedPlan(true);
      setMainClass("plan-card plan-card-selected");
    } else setMainClass("plan-card");
  }, [selectedPlanId, plans]);
  const { register, handleSubmit, errors, control, watch } = useForm({
    resolver: yupResolver(schema),
    mode: enums.validationMode.onTouched,
    defaultValues: schema.default(),
  });
  const isEnterprise = column.type === enterpriseType;
  const isDiscountable =
    plans.find((plan) => plan.isDiscountable) || isEnterprise;
  const inputPlaceholder = "Promocode";
  const code = watch("code");

  const activateCode = ({ code }) => {
    if (!isModal) {
      sendDiscountCode({
        code,
        token: getItemFromLocalStorage("resendVerificationToken") || userToken,
        type: column.type,
      });
    } else {
      sendDiscount({
        code,
        type: column.type,
      });
    }
  };

  const selectedPlanChange = (value) => () => {
    setSelectedPlanId(value);
  };
  const PlanTitleComp = () => {
    if (!!isEnterprise) {
      return <div className="plan-card__header">Custom</div>;
    }
    if (plans.length > 0) {
      const plan = plans[0];
      const price =
        plan.interval === yearTypeInterval
          ? plan.price.unitAmount / 100 / 12
          : plan.price.unitAmount / 100;

      return (
        <div className="plan-card__header">
          <span class="currency">$ </span>
          {price?.toFixed(2)}
        </div>
      );
    }
  };
  const PlanDurationComp = () => {
    if (!!isEnterprise) {
      return (
        <div className="plan-card__contact-us">
          Best solution that scale as your company and teams do. Personalized
          billing, many other features, to grow your business like never before.
        </div>
      );
    }
    return <div className="plan-card__duration">/month billed anually</div>;
  };

  return (
    <div
      className={`${mainClass}`}
      onClick={(e) => {
        setSelectedPlanId(plans[0]?.id);
      }}
    >
      <div className="plan-card__sub-header">{column.title}</div>
      {PlanTitleComp()}
      {PlanDurationComp()}

      {/* <div className="plan-card__plans">
        {!isEmpty(plans) ? (
          <div className="plans-list">
            {plans.map((plan) => {
              const isHundredPercentDiscount =
                plan.price.unitAmountWithDiscount === 0;

              const priceClasses = cn("current-price", {
                discounted:
                  plan.price.unitAmountWithDiscount || isHundredPercentDiscount,
              });
              const price =
                plan.interval === yearTypeInterval
                  ? plan.price.unitAmount / 100 / 12
                  : plan.price.unitAmount / 100;
              const priceWithDiscount = isHundredPercentDiscount
                ? plan.price.unitAmountWithDiscount
                : plan.interval === yearTypeInterval
                ? plan.price.unitAmountWithDiscount / 100 / 12
                : plan.price.unitAmountWithDiscount / 100;
              const checked = plan.id === selectedPlanId;

              return (
                <div key={`plan-${plan.id}`} className="plan">
                  <div className="main-info">
                    <RadioButton
                      id={`plan-${plan.id}`}
                      name={`plan-${plan.id}`}
                      checked={checked}
                      value={plan.id}
                      onChange={onChange}
                    />
                    <div className="plan-info">
                      <div className={priceClasses}>{`$${getFormattedPrice(
                        price
                      )}`}</div>
                      {(plan.price.unitAmountWithDiscount ||
                        isHundredPercentDiscount) && (
                        <div className="price-with-discount">
                          {`$${getFormattedPrice(priceWithDiscount)}`}
                        </div>
                      )}
                      <div className="description">
                        <div className="payment-period">
                          {paymentPeriods[plan.interval]}
                        </div>
                        <div className="user-restrictions">
                          {getUserRestriction(
                            column.type,
                            plan?.memberGroup?.maxMembers
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <P12 className="contact-us-link">
            {`For ${column.title} Pricing please `}
            <a
              href="https://retailhub.ai/contact/"
              target="_blank"
              rel="noreferrer"
            >
              contact us.
            </a>
          </P12>
        )}
        {isDiscountable && (
          <GridContainer
            customClassName="code-actions"
            template="172px 63px"
            gap="5px 5px"
          >
            <TextInput
              type="text"
              name="code"
              placeholder={inputPlaceholder}
              register={register}
              isLightTheme
              isError={!!errors.code}
              control={control}
            />
            <PrimaryButton
              onClick={handleSubmit(activateCode)}
              isDarkTheme={false}
              text="Apply"
              isOutline
              disabled={!code}
            />
          </GridContainer>
        )}
      </div> */}
      <div className="plan-card__features-list">
        {features.map((feature, index) => (
          <div className="feature-item" key={`${feature}-${index}`}>
            <p>{feature.title}</p>
            <div className="feature-icon ">{checkMarkIcon}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

PlanCard.defaultProps = {
  isModal: false,
};

PlanCard.propTypes = {
  column: shape({
    title: string,
    type: string,
  }),
  plans: arrayOf(paymentPlanType),
  selectedPlanId: oneOfType([number, oneOf([null])]),
  setSelectedPlanId: func.isRequired,
  features: arrayOf(featureType),
  sendDiscountCode: func.isRequired,
  userToken: string,
  isModal: bool,
  sendDiscount: func.isRequired,
};

export default memo(PlanCard);
