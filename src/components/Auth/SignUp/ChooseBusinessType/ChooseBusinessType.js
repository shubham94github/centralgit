import React, { memo, useState } from "react";
import { isEmpty } from "@utils/js-helpers";
import { useForm } from "react-hook-form";
import enums from "@constants/enums";
import { yupResolver } from "@hookform/resolvers/yup";
import { schema } from "./schema";
import { Col, Row } from "react-bootstrap";
import { P12, P14, P16 } from "@components/_shared/text";
import RadioButton from "@components/_shared/form/RadioButton";
import RegistrationProgressBar from "@components/_shared/RegistrationProgressBar";
import {
  businessTypeName,
  startupLabel,
  businessTypes,
  retailerLabel,
  submitBtnText,
  entrepreneurLabel,
 
} from "./constants";
import { connect } from "react-redux";
import { bool, func, oneOf, string } from "prop-types";
import PrimaryButton from "@components/_shared/buttons/PrimaryButton";
import { Routes } from "@routes";
import { Redirect, useHistory } from "react-router-dom";
import { setBusinessType } from "@ducks/auth/actions";
import { colors } from "@colors";
import { setItemToSessionStorage } from "@utils/sessionStorage";
import { Icons } from "@icons";
import { getItemFromStorage } from "@utils/storage";

import "./ChooseBusinessType.scss";

function ChooseBusinessType({ email, isCompany, setBusinessType }) {
  const history = useHistory();
  const [termsAndCondition, setTermsAndCondition] = useState(false);
  const {
    register,
    handleSubmit,
    errors,
    reset,
    setError,
    clearErrors,
    watch,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      ...schema.default(),
      businessType: isCompany ? retailerLabel : entrepreneurLabel,
    },
    mode: enums.validationMode.onTouched,
  });

  const onSubmit = async ({ businessType, firstName, lastName, password }) => {
    debugger;
    setItemToSessionStorage("businessType", businessType);
    console.log(firstName, lastName, password);
    history.push(
      businessType === "Startup"
        ? Routes.AUTH.SIGN_UP.ADD_STARTUP_COMPANY
        : Routes.AUTH.SIGN_UP.ADD_RETAIL_COMPANY
    );
  };

  const goBack = () => history.goBack();

  if (!email) return <Redirect to={Routes.AUTH.SIGN_UP.ADD_EMAIL} />;

  return (
    <div className="choose-business-type">
      <RegistrationProgressBar stepCount={2} />
      <form
        className="form-wrapper form-wrapper--grey"
        // onSubmit={handleSubmit(onSubmit)}
      >
        <Row>
          <Col md={6}>
            <div className="form-group">
              <label htmlFor="firstName">First Name</label>
              <input
                // type="text"
                className="form-control"
                placeholder="First Name"
                name="firstName"
                {...register("firstName")}
              />
              <P12 className="warning-text">
                {errors.firstName && errors.firstName.message}
              </P12>
            </div>
          </Col>
          <Col md={6}>
            <div className="form-group">
              <label htmlFor="lastName">Last Name</label>
              <input
                name="lastName"
                // type="text"
                className="form-control"
                placeholder="Last Name"
                {...register("lastName")}
              />
              <P12 className="warning-text">
                {errors.lastName && errors.lastName.message}
              </P12>
            </div>
          </Col>
        </Row>
        <Row>
          <Col>
            <div className="form-group">
              <label htmlFor="email">E-mail</label>
              <input
                type="text"
                className="form-control"
                placeholder="email"
                name="email"
                value={email}
                disabled
              />
            </div>
          </Col>
        </Row>
        <Row>
          <Col className="company">
            <div className="fields">
              <Row>
                <Col sm={6}>
                  <P14 className="mt-3">Companies:</P14>
                  {businessTypes.companies.map((type) => (
                    <Row key={type}>
                      <RadioButton
                        type="radio"
                        id={type}
                        label={type}
                        name={businessTypeName}
                        value={type}
                        register={register()}
                        defaultChecked={watch(businessTypeName) === type}
                        disabled={!isCompany}
                      />
                    </Row>
                  ))}
                </Col>
                <Col sm={6}>
                  <P14 className="mt-3">Individuals:</P14>
                  {businessTypes.individuals.map((type) => (
                    <Row key={type}>
                      <RadioButton
                        type="radio"
                        id={type}
                        label={type}
                        name={businessTypeName}
                        value={type}
                        register={register()}
                        defaultChecked={watch(businessTypeName) === type}
                      />
                    </Row>
                  ))}
                </Col>
              </Row>
            </div>
          </Col>
        </Row>
        <Row>
          <Col>
            <div className="form-group">
              <label htmlFor="password">Set your password</label>
              <input
                type="password"
                className="form-control"
                name="password"
                  register={register()}
                //  value={password}
              />
              <P12 className="warning-text">
                {errors.password && errors.password.message}
              </P12>
            </div>
          </Col>
        </Row>
        <Row>
          <Col>
            <div className="form-group agreeTerms-container d-flex align-items-baseline">
              <input
                className="agreeCheck"
                type="checkbox"
                onChange={() => setTermsAndCondition(!termsAndCondition)}
              ></input>
              <label>
                I Agree to the RetailHub’s Terms of services, Privacy Policy and
                Security Policy, including Cookie Use Policy.
              </label>
            </div>
          </Col>
        </Row>
        <Row>
          <Col className="d-flex justify-content-center">
            <PrimaryButton
             
              onClick={
                handleSubmit(onSubmit)
              }
               className="rounded-pill dark-theme"
             
              text={submitBtnText}
               
              disabled={!termsAndCondition || !email ||!isEmpty(errors)? true : false}
            />
          </Col>
        </Row>
        <Row>
          <Col className="d-flex justify-content-center">
            <div className="back-btn" onClick={goBack}>
              Back
            </div>
          </Col>
        </Row>
      </form>
    </div>
  );
}

ChooseBusinessType.propTypes = {
  email: string,
  isCompany: bool,
  setBusinessType: func.isRequired,
  businessType: oneOf([
    ...businessTypes.companies,
    ...businessTypes.individuals,
    startupLabel,
  ]),
};

export default connect(
  ({ auth: { emailForSignUp, isCompany, businessType } }) => {
    return {
      email: emailForSignUp || getItemFromStorage("signUpEmail"),
      isCompany,
      businessType,
    };
  },
  { setBusinessType }
)(memo(ChooseBusinessType));
