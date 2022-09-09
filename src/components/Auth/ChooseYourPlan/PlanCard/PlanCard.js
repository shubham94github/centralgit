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
import CustomDropDown from "./UserSelectionDDR";

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
  const [ddrSelectedIndex, SetDdrSelectedIndex] = useState(null);
  const [mainClass, setMainClass] = useState("plan-card");
  const isPlanMultiUser = plans[0]?.planType === "MULTI_USER";
  useEffect(() => {
    const result = plans.some((plan) => plan.id === selectedPlanId);
    if (result) {
      setMainClass("plan-card plan-card-selected");
    } else setMainClass("plan-card");
  }, [selectedPlanId, plans, isPlanMultiUser]);
  useEffect(() => {
    if (!!ddrSelectedIndex) setSelectedPlanId(plans[ddrSelectedIndex]?.id);
  }, [ddrSelectedIndex, plans, setSelectedPlanId]);
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

  // const selectedPlanChange = (value) => () => {
  //   setSelectedPlanId(value);
  // };
  const PlanTitleComp = () => {
    if (!!isEnterprise) {
      return <div className="plan-card__header">Custom</div>;
    }
    if (plans.length > 0) {
      let plan = plans[0];
      if (!!ddrSelectedIndex) {
        plan = plans[ddrSelectedIndex];
      }

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
  const UserNumberSelectionDropDown = () => {
    return (
      <div className="userselection">
        <div>SELECT USER NUMBER</div>
        <div>
          {isPlanMultiUser && (
            <CustomDropDown
              setSelectedOption={SetDdrSelectedIndex}
              selectedOption={ddrSelectedIndex}
              optionsList={plans.map((plan) => {
                return {
                  value: plan.id,
                  text: plan.memberGroup.maxMembers,
                };
              })}
            />
          )}
        </div>
      </div>
    );
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
      {isPlanMultiUser && UserNumberSelectionDropDown()}
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
