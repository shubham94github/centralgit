import React, { memo, useState } from "react";
import { connect } from "react-redux";
import enums from "@constants/enums";
import { Link, NavLink, Redirect, useHistory } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import { func, bool, string, shape } from "prop-types";
import { isEmpty } from "@utils/js-helpers";
import { useForm } from "react-hook-form";
import { Container } from "react-bootstrap";
import PrimaryButton from "@components/_shared/buttons/PrimaryButton";
import { P16, P12, S12 } from "@components/_shared/text";
import TextInput from "@components/_shared/form/TextInput";
import { Routes } from "@routes";
import { schema } from "./schema";
import { checkTwoFa } from "@ducks/auth/actions";
import { redirectToCorrectPageByStatus } from "@components/Auth/utils";
import GridContainer from "@components/layouts/GridContainer";
import Checkbox from "@components/_shared/form/Checkbox";
import FormWrapper from "@components/_shared/form/FormWrapper";
import "./SignIn.scss";
import { call } from "redux-saga/effects";

const { gettingStartedStatuses, userRoles } = enums;

export const SignIn = ({ checkTwoFa, isAuthenticated, isLoading, user }) => {
  const history = useHistory();
  const [formError, setFormError] = useState("");

  const { register, handleSubmit, errors, watch, setValue } = useForm({
    resolver: yupResolver(schema),
    defaultValues: schema.default(),
    mode: enums.validationMode.onTouched,
  });

  const onSubmit = (data) => {
    checkTwoFa({ data, history, setFormError }).then((error) => {
      if (error) setFormError(error.message || error.error_description);
    });
  };

  const isMember = user?.role === userRoles.member;
  const isVerified = user?.isVerified;

  const isCompletedUser = isMember
    ? isVerified
    : user?.status === gettingStartedStatuses.completedGettingStarted;

  if (!!user && !isCompletedUser) return redirectToCorrectPageByStatus(user);

  const propName = !!user?.retailer ? "retailer" : "member";

  if (
    isAuthenticated &&
    user?.status === gettingStartedStatuses.completedGettingStarted &&
    user[propName] &&
    !user[propName].stripePaymentSettings.isSubscriptionPaid &&
    !user[propName].stripePaymentSettings.isTrial
  )
    return <Redirect to={Routes.SUBSCRIPTION.INDEX} />;

  if (isAuthenticated) return <Redirect to={Routes.HOME} />;

  const setRememberMe = (e) => setValue("rememberMe", e.target.checked);

  return (
    <section className="sign-in-page-section">
      <div className="sign-in-page-container">
        <FormWrapper
          className={`sign-in-form-wrapper`}
          // onSubmit={handleSubmit(onSubmit)}
        >
          <Container>
            <GridContainer customClassName="centered field-container">
              <p className="sign-title">
                Access your <span> Retail Hub Innovation Explorer </span>account
              </p>
            </GridContainer>

            <div className="form-group form-group--input">
              <input
                className="form-control"
                id="email"
                type="email"
                name="email"
                ref={register({ required: true })}
                placeholder="E-mail"
                error={errors.email?.message}
              />
              {errors.email && (
                <P12 className="warning-text">{errors.email.message}</P12>
              )}
            </div>

            <div className="form-group form-group--input">
              <input
                className="form-control"
                id="password"
                type="password"
                name="password"
                ref={register({ required: true })}
                placeholder="Password"
              />
              {errors.password && (
                <P12 className="warning-text">
                  {errors.password.message}&nbsp;
                </P12>
              )}
            </div>

            <div className=" form-group form-group--input">
              <input
                type="checkbox"
                name="rememberMe"
                ref={register}
                value={watch("rememberMe")}
                readOnly={false}
                onChange={setRememberMe}
                disabled={false}
              />
              <label style={{ paddingLeft: "5px" }}>Remember me</label>
              {errors.rememberMe && (
                <P12 className="warning-text">
                  {errors.rememberMe.message}&nbsp;
                </P12>
              )}
            </div>

            {formError && (
              <GridContainer customClassName="field-container">
                <S12 className="warning-text">{formError}</S12>
              </GridContainer>
            )}
            <GridContainer customClassName="field-container centered">
              <NavLink
                className="s12 link"
                to={Routes.AUTH.PASSWORD_RECOVERY.EMAIL_FORM}
              >
                Forgot password?
              </NavLink>
            </GridContainer>
            <div className="d-flex justify-content-center px-4">
              <PrimaryButton
                onClick={handleSubmit(onSubmit)}
                text="Log in"
                isFullWidth={true}
                disabled={!isEmpty(errors)}
                isLoading={isLoading}
                className="rounded-pill p-2"
              />
            </div>
            <GridContainer customClassName="centered">
              <P12 className="centered">
                New to Retail Innovation Explorer?
                <br />
                <Link
                  to={Routes.AUTH.SIGN_UP.ADD_EMAIL}
                  className=" link bold underline"
                >
                  Sign up
                </Link>
              </P12>
            </GridContainer>
          </Container>
        </FormWrapper>
      </div>
    </section>
  );
};

SignIn.propTypes = {
  checkTwoFa: func.isRequired,
  isAuthenticated: bool,
  isLoading: bool,
  user: shape({
    status: string,
  }),
};

export default connect(
  ({ auth }) => {
    const { user, isLoading } = auth;

    return {
      isAuthenticated: !!user,
      user,
      isLoading,
    };
  },
  {
    checkTwoFa,
  }
)(memo(SignIn));
