import React, { useState, memo, useEffect } from "react";
import { useForm } from "react-hook-form";
import { connect } from "react-redux";
import { bool, func, string } from "prop-types";
import PhoneInputWithCountry from "react-phone-number-input/react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import PrimaryButton from "@components/_shared/buttons/PrimaryButton";
import { isEmpty } from "@utils/js-helpers";
import FormWrapper from "@components/_shared/form/FormWrapper";
import {
  removeItemFromSessionStorage,
  setItemToSessionStorage,
} from "@utils/sessionStorage";

import {
  signUp,
  checkEmail,
  resetEmailExistenceError,
  resetBlockedDomainError,
} from "@ducks/auth/actions";
import {
  emailExistenceErrorText,
  emailBlockedDomainErrorText,
} from "@components/Auth/constants";
import { privacyPolicyText, SubmitStartup, startupLabel } from "./constants";
import { schemaStartup } from "./schema.js";
import "react-phone-number-input/style.css";
import "./SignUpForm.scss";

const SignUpForm = ({
  resetEmailExistenceError,
  isBlockedDomain,
  resetBlockedDomainError,
  isEmailExists,
  checkEmail,
  isLoading,
  signUp,
}) => {
  const [policyConfirm, setPolicyConfirm] = useState(false);
  const [errorType, setErrorType] = useState(null);
  const [IsMemberRegisterError, setIsMemberRegisterError] = useState(null);

  // useEffect(() => {
  //   resetEmailExistenceError();
  //   resetBlockedDomainError();
  // }, [resetEmailExistenceError, resetBlockedDomainError]);

  useEffect(() => {
    debugger;
    if (isEmailExists) setError("email", { message: emailExistenceErrorText });
    else if (isBlockedDomain)
      setError("email", { message: emailBlockedDomainErrorText });
    else clearErrors("email");
  }, [isBlockedDomain, setError, clearErrors, isEmailExists]);

  const { register, errors, control, handleSubmit, setError, clearErrors } =
    useForm({
      resolver: yupResolver(schemaStartup),
      defaultValues: {
        ...schemaStartup.default(),
      },
      mode: "onTouched",
    });

  const onEmailBlur = async (event) => {
    const email = event.target.value;
    resetEmailExistenceError();
    resetBlockedDomainError();
    const data = { email };
    await checkEmail({
      data,
      setError,
      startup: true,
    });
    removeItemFromSessionStorage("signUpEmail");
    setItemToSessionStorage("signUpEmail", data.email);
  };

  const onSubmit = (values) => {
    const signupPayload = {
      data: {
        ...values,
        businessType: startupLabel,
        companyShortName: values.startup,
        policyConfirmed: true,
        retailerId: null,
      },
      isRetail: false,

      role: startupLabel,

      isMember: false,
      setIsMemberRegisterError,
      setErrorType,
    };

    signUp(signupPayload);
  };

  // const [isPasswordFieldActive, setIsPasswordFieldActive] = useState(false);

  // const togglePasswordFieldState = (state) => setIsPasswordFieldActive(state);

  // const onBlurPasswordHandler = () => togglePasswordFieldState(false);

  // const onFocusPasswordHandler = () => togglePasswordFieldState(true);

  return (
    <FormWrapper className="signup-company-wrapper">
      <div className="row">
        <div className="form-group col-lg-12">
          <label>Startup Name(Company Name)</label>
          <input
            className="form-control"
            type="text"
            name="startup"
            id="startup"
            placeholder="Startup Name"
            ref={register}
          />
          {errors.startup && (
            <p className="warning-text">
              {!!errors.startup && errors.startup.message}
            </p>
          )}
        </div>

        <div className="form-group col-lg-12">
          <label>URL</label>
          <input
            className="form-control"
            placeholder="http://"
            name="website"
            id="website"
            ref={register}
          />
          {errors.website && (
            <p className="warning-text">
              {!!errors.website && errors.website.message}
            </p>
          )}
        </div>
        <div className="form-group col-lg-12">
          <label>Email</label>
          <input
            className="form-control"
            placeholder="E-mail"
            name="email"
            id="email"
            ref={register}
            onBlur={onEmailBlur}
          />
          {errors.email && (
            <p className="warning-text">
              {!!errors.email && errors.email.message}
            </p>
          )}
        </div>
        <div className=" form-group col-md-6">
          <label>First Name</label>
          <input
            className="form-control"
            id="firstName"
            type="text"
            name="firstName"
            placeholder="First Name"
            ref={register}
          />
          {errors.firstName && (
            <p className="warning-text">
              {!!errors.firstName && errors.firstName.message}
            </p>
          )}
        </div>
        <div className=" form-group  col-md-6">
          <label>Last Name</label>
          <input
            className="form-control"
            id="lastName"
            type="text"
            name="lastName"
            placeholder="Last Name"
            ref={register}
          />
          {errors.lastName && (
            <p className="warning-text">
              {!!errors.lastName && errors.lastName.message}
            </p>
          )}
        </div>

        <div className="form-group col-md-6">
          <label>Set your password</label>
          <input
            className="form-control"
            type="password"
            name="password"
            placeholder="Password"
            ref={register}
          />
          {errors.password && (
            <p className="warning-text">
              {!!errors.password && errors.password.message}
            </p>
          )}
        </div>
        <div className="form-group col-md-6">
          <label>Phone Number</label>
          <PhoneInputWithCountry
            name="phone"
            control={control}
            rules={{ required: true }}
          />

          {errors.phone && (
            <p className="warning-text">
              {!!errors.phone && errors.phone.message}
            </p>
          )}
        </div>
      </div>

      <div className="confirmPrivacy">
        <input
          type="checkbox"
          name="policyConfirmed"
          value={policyConfirm}
          onChange={() => {
            return setPolicyConfirm(!policyConfirm);
          }}
        />
        <p>{privacyPolicyText}</p>
      </div>
      <div className="d-flex justify-content-center">
        <PrimaryButton
          className={"rounded-pill"}
          text={SubmitStartup}
          disabled={!policyConfirm || !isEmpty(errors)}
          isLoading={isLoading}
          onClick={handleSubmit(onSubmit)}
        />
      </div>
    </FormWrapper>
  );
};

SignUpForm.propTypes = {
  signUp: func,
  checkEmail: func,
  isLoading: bool,
  isEmailExists: bool,
  isBlockedDomain: bool,
};
// export default memo(SignUpForm);
export default connect(
  ({ auth }) => {
    const { isLoading, isEmailExists, isBlockedDomain } = auth;
    return {
      isEmailExists,
      isLoading,
      isBlockedDomain,
    };
  },
  { checkEmail, resetEmailExistenceError, resetBlockedDomainError, signUp }
)(memo(SignUpForm));
