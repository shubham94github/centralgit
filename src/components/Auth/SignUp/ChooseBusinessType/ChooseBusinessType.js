import React, { memo, useState, useEffect } from "react";
import { isEmpty } from "@utils/js-helpers";
import { getEmailDomain } from "@utils";
import { useForm } from "react-hook-form";
import enums from "@constants/enums";
import { yupResolver } from "@hookform/resolvers/yup";
import { schema } from "./schema";
import { Col, Row } from "react-bootstrap";
import { P12, P14 } from "@components/_shared/text";
import RadioButton from "@components/_shared/form/RadioButton";
import RegistrationProgressBar from "@components/_shared/RegistrationProgressBar";
import { checkIsMemberCompany, checkIsMemberIndividual } from "@api/auth";
import { redirectToCorrectPageByStatus } from "@components/Auth/utils";
import {
  checkEmail,
  setBusinessType,
  setIsHideStepsForMember,
  signUp,
} from "@ducks/auth/actions";
import { setSnackbar } from "@ducks/common/actions";
import {
  // businessTypeName,
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
import { getItemFromStorage } from "@utils/storage";
import { validateCompanyName, validatePassword } from "@utils/validation";
import { optionsMapperForRetailers } from "@utils/optionsMapper";
import "./ChooseBusinessType.scss";
import SignUpMember from "../SignUpCompany/SignUpMember";
// import { firstNews } from "../../../News/newsContent";
// import { isAccordionItemSelected } from "react-bootstrap/esm/AccordionContext";

function ChooseBusinessType({
  email,
  isCompany,
  signUp,
  emailDomain,
  user,
  setBusinessType,
  setSnackbar,
  setIsHideStepsForMember,
  isLoadingSubmitForm,
}) {
  // const [businessTypeState, setBusinessTypeState] = setState(businessType);
  // const schema = isStartup ? schemaStartup : schemaRetailer;

  const history = useHistory();
  const [isLoadingCheckMember, setIsLoadingCheckMember] = useState(false);
  const [isCompanyType, setIsCompanyType] = useState(false);
  const [isIndividuals, setIsIndividuals] = useState(false);
  const [isStartup, setIsStartup] = useState(false);
  const [listOfCompaniesOptions, setListOfCompaniesOptions] = useState([]);
  const [retailerInfoForMember, setRetailerInfoForMember] = useState(null);
  const [isMember, setIsMember] = useState(false);
  const [isMemberRegisterError, setIsMemberRegisterError] = useState(false);
  const [errorType, setErrorType] = useState(null);
  const [completedFormData, setCompletedFormData] = useState(null);
  const [termsAndCondition, setTermsAndCondition] = useState(false);

  const {
    register,
    handleSubmit,
    errors,
    watch,
    control,
    getValues,
    reset,
    ...rest
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      ...schema.default(),
      emailDomain,
      isCompany,
      businessTypeName: isCompany ? retailerLabel : entrepreneurLabel,
      email,
    },
    mode: "all",
  });

  const getUserCompanyTypes = (values) => {
    var result = businessTypes.companies.includes(values.businessTypeName);
    setIsCompanyType(result);
    return result;
  };

  const getUserIndivisualTypes = (values) => {
    const result = businessTypes.individuals.includes(values.businessTypeName);
    setIsIndividuals(result);
    return result;
  };

  const onSubmit = (values) => {
    const signupPayload = {
      data: {
        ...values,
        email,
        emailDomain,
        businessType: values.businessTypeName,
        companyShortName: values.companyLegalName,
        policyConfirmed: true,
        retailerId: retailerInfoForMember?.value,
      },
      isRetail: !isStartup,

      role:
        values.businessTypeName === "Entrepreneur"
          ? "Retailer Entrepreneur"
          : values.businessTypeName,

      isMember,
      setIsMemberRegisterError,
      setErrorType,
    };
    console.log(signupPayload);
    signUp(signupPayload);
  };
  // const onSubmit = async ({ businessType, firstName, lastName, password }) => {

  //   setItemToSessionStorage("businessType", businessType);
  //   console.log(firstName, lastName, password);
  //   history.push(
  //     businessType === "Startup"
  //       ? Routes.AUTH.SIGN_UP.ADD_STARTUP_COMPANY
  //       : Routes.AUTH.SIGN_UP.ADD_RETAIL_COMPANY
  //   );
  // };
  const saveRetailerInfoForMember = (option) =>
    setRetailerInfoForMember(option);

  const checkIsMemberHandler = async (values) => {
    const isCompanyType = getUserCompanyTypes(values);

    const isIndividuals = getUserIndivisualTypes(values);
    const isStartup = setIsStartup(!isCompanyType && !isIndividuals);
    try {
      setIsLoadingCheckMember(true);
      if (isStartup) return handleSubmit(onSubmit)(getValues());
      const checkIsMemberApi = isCompanyType
        ? checkIsMemberCompany
        : checkIsMemberIndividual;
      const companyShortName = values.companyLegalName;
      const requestData = isCompanyType
        ? {
            brandName: companyShortName,
            email,
          }
        : {
            companyShortName,
          };

      const {
        data: { isMember, isIndividual, retailers, retailer },
      } = await checkIsMemberApi(requestData);

      if (isMember || isIndividual) {
        setCompletedFormData(getValues());
        setIsMember(true);

        if (isIndividual)
          setListOfCompaniesOptions(optionsMapperForRetailers(retailers));
        if (isMember)
          setRetailerInfoForMember({
            value: retailer.retailerId,
            email: retailer.email,
          });
        setIsHideStepsForMember(true);
      } else handleSubmit(onSubmit)(getValues());
    } catch (e) {
      setSnackbar({
        type: "error",
        text: e.message,
      });
    } finally {
      setIsLoadingCheckMember(false);
    }
  };
  useEffect(() => {
    if (!!completedFormData) reset(completedFormData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [completedFormData]);
  // const handleChangeEmail = (e) => {
  //   e.stopPropagation();
  //   e.preventDefault();
  //   history.goBack();
  // };
  const resetMemberSettings = () => {
    setIsMember(false);
    setListOfCompaniesOptions([]);
    setRetailerInfoForMember(null);
  };

  if (user && !isMember) return redirectToCorrectPageByStatus(user);
  const goBack = () => history.goBack();

  if (!email) return <Redirect to={Routes.AUTH.SIGN_UP.ADD_EMAIL} />;

  return (
    <div className="choose-business-type">
      <RegistrationProgressBar stepCount={2} />
      <div>
        {/* <a href="javascript:void(0)" onClick={handleChangeEmail}>
          change email
        </a> */}
      </div>
      {isMember ? (
        <SignUpMember
          resetMemberSettings={resetMemberSettings}
          goBackToBusinessType={() => history.goBack()}
          isCompanyType={isCompanyType}
          isIndividuals={isIndividuals}
          completedFormData={completedFormData}
          handleSubmit={onSubmit}
          listOfCompaniesOptions={listOfCompaniesOptions}
          retailerInfoForMember={retailerInfoForMember}
          setRetailerInfoForMember={saveRetailerInfoForMember}
          isLoadingSubmitForm={isLoadingSubmitForm}
          isMemberRegisterError={isMemberRegisterError}
          setIsMemberRegisterError={setIsMemberRegisterError}
          errorType={errorType}
          setErrorType={setErrorType}
        />
      ) : (
        <form
          className="form-wrapper form-wrapper--grey"
          onSubmit={handleSubmit(onSubmit)}
        >
          <Row>
            <Col md={6}>
              <div className="form-group">
                <label htmlFor="firstName">First Name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="First Name"
                  name="firstName"
                  ref={register}
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
                  type="text"
                  className="form-control"
                  placeholder="Last Name"
                  ref={register}
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
                  ref={register}
                  defaultValue={watch(getValues().email)}
                  // value={email}
                  disabled
                />
                <P12 className="warning-text">
                  {errors.email && errors.email.message}
                </P12>
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
                        <label htmlFor={type}>
                          <input
                            style={{ marginRight: "10px" }}
                            type="radio"
                            id={type}
                            value={type}
                            //className="ml-3"
                            name={"businessTypeName"}
                            ref={register}
                            // defaultChecked={watch(businessTypeName) === type}
                            disabled={!isCompany}
                          />
                          {type}
                        </label>
                      </Row>
                    ))}
                  </Col>
                  <Col sm={6}>
                    <P14 className="mt-3">Individuals:</P14>
                    {businessTypes.individuals.map((type) => (
                      <Row key={type}>
                        <label htmlFor={type}>
                          <input
                            type="radio"
                            id={type}
                            value={type}
                            ref={register}
                            name={"businessTypeName"}
                            className="ml-3"
                            style={{ marginRight: "10px" }}
                            // defaultChecked={watch(businessTypeName) === type}
                          />{" "}
                          {type}
                        </label>
                      </Row>
                    ))}
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <P12 className="warning-text">
                      {errors.businessTypeName &&
                        errors.businessTypeName.message}
                    </P12>
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
                  ref={register}
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
              <div className="form-group">
                <label htmlFor="companyLegalName">Company Name</label>
                <input
                  className="form-control"
                  name="companyLegalName"
                  ref={register}
                  //  value={password}
                />
                <P12 className="warning-text">
                  {errors.companyLegalName && errors.companyLegalName.message}
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
                  defaultChecked={termsAndCondition}
                  onChange={() => setTermsAndCondition(!termsAndCondition)}
                ></input>
                <label>
                  I Agree to the RetailHub’s Terms of services, Privacy Policy
                  and Security Policy, including Cookie Use Policy.
                </label>
              </div>
            </Col>
          </Row>
          <Row>
            <Col className="d-flex justify-content-center">
              <PrimaryButton
                onClick={handleSubmit(checkIsMemberHandler)}
                className="rounded-pill dark-theme"
                text={submitBtnText}
                disabled={
                  !termsAndCondition || !email || !isEmpty(errors)
                    ? true
                    : false
                }
                isLoading={isLoadingSubmitForm}
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
      )}
    </div>
  );
}

ChooseBusinessType.propTypes = {
  checkEmail: func.isRequired,
  email: string,
  isCompany: bool,
  setBusinessType: func.isRequired,
  emailDomain: string,
  // businessType: oneOf([
  //   ...businessTypes.companies,
  //   ...businessTypes.individuals,
  //   startupLabel,
  // ]),
};

export default connect(
  ({ auth: { emailForSignUp, isCompany, isLoading, user } }) => {
    const email = emailForSignUp || getItemFromStorage("signUpEmail");
    return {
      email,
      isCompany,
      emailDomain: !!email ? getEmailDomain(email) : "",
      // businessType: businessType || getItemFromStorage("businessType"),
      user: user || getItemFromStorage("user"),
      isLoadingSubmitForm: isLoading,
    };
  },
  {
    checkEmail,
    signUp,
    setBusinessType,
    setSnackbar,
    setIsHideStepsForMember,
  }
)(memo(ChooseBusinessType));
