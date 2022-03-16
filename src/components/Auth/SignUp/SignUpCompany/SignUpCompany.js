import React, { memo, useEffect, useState } from 'react';
import { func, string, array, bool } from 'prop-types';
import { connect } from 'react-redux';
import enums from '@constants/enums';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import { schemaRetailer, schemaStartup } from './schema';
import { checkEmail, setBusinessType, setIsHideStepsForMember, signUp } from '@ducks/auth/actions';
import { getCountries, getDepartments, setSnackbar } from '@ducks/common/actions';
import { businessTypes } from '@components/Auth/SignUp/ChooseBusinessType/constants';
import { getEmailDomain } from '@utils';
import { userType } from '@constants/types';
import { redirectToCorrectPageByStatus } from '@components/Auth/utils';
import SignUpForm from './SignUpForm';
import { checkIsMemberCompany, checkIsMemberIndividual } from '@api/auth';
import SignUpMember from './SignUpMember';
import { optionsMapperForRetailers } from '@utils/optionsMapper';
import { getItemFromStorage } from '@utils/storage';
import { isEmpty } from '@utils/js-helpers';

import './SignUpCompany.scss';

const SignUpCompany = ({
	countries,
	email,
	getCountries,
	isLoadingSubmitForm,
	signUp,
	businessType,
	emailDomain,
	user,
	setBusinessType,
	setSnackbar,
	setIsHideStepsForMember,
}) => {
	const isCompanyType = businessTypes.companies.includes(businessType);
	const isIndividuals = businessTypes.individuals.includes(businessType);
	const isStartup = !isCompanyType && !isIndividuals;
	const schema = isStartup ? schemaStartup : schemaRetailer;
	const history = useHistory();
	const [isLoadingCheckMember, setIsLoadingCheckMember] = useState(false);
	const [listOfCompaniesOptions, setListOfCompaniesOptions] = useState([]);
	const [retailerInfoForMember, setRetailerInfoForMember] = useState(null);
	const [isMember, setIsMember] = useState(false);
	const [isMemberRegisterError, setIsMemberRegisterError] = useState(false);
	const [errorType, setErrorType] = useState(null);
	const [completedFormData, setCompletedFormData] = useState(null);

	const {
		register,
		handleSubmit,
		errors,
		watch,
		control,
		setValue,
		setError,
		clearErrors,
		getValues,
		reset,
	} = useForm({
		resolver: yupResolver(schema),
		defaultValues: {
			...schema.default(),
			emailDomain,
			email,
		},
		mode: enums.validationMode.onTouched,
	});

	useEffect(() => {
		if (isEmpty(countries)) getCountries();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const onSubmit = values => {
		signUp({
			data: { ...values, emailDomain: values.emailDomain || null },
			isRetail: !isStartup,
			role: businessType === 'Entrepreneur' ? 'Retailer Entrepreneur' : businessType,
			isMember,
			setIsMemberRegisterError,
			setErrorType,
		});
	};

	const saveRetailerInfoForMember = option => setRetailerInfoForMember(option);

	const checkIsMemberHandler = async () => {
		try {
			setIsLoadingCheckMember(true);

			if (isStartup) return handleSubmit(onSubmit)(getValues());

			const checkIsMemberApi = isCompanyType ? checkIsMemberCompany : checkIsMemberIndividual;
			const companyShortName = getValues('companyShortName');
			const requestData = isCompanyType
				? {
					brandName: companyShortName,
					email,
				}
				: {
					companyShortName,
				};

			const {
				data: {
					isMember,
					isIndividual,
					retailers,
					retailer,
				},
			} = await checkIsMemberApi(requestData);

			if (isMember || isIndividual) {
				setCompletedFormData(getValues());
				setIsMember(true);

				if (isIndividual) setListOfCompaniesOptions(optionsMapperForRetailers(retailers));
				if (isMember) setRetailerInfoForMember({ value: retailer.retailerId, email: retailer.email });

				setIsHideStepsForMember(true);
			} else handleSubmit(onSubmit)(getValues());
		} catch (e) {
			setSnackbar({
				type: 'error',
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

	const resetMemberSettings = () => {
		setIsMember(false);
		setListOfCompaniesOptions([]);
		setRetailerInfoForMember(null);
	};

	if (user && !isMember) return redirectToCorrectPageByStatus(user);

	const goBackToBusinessType = () => {
		setBusinessType(null);
		history.goBack();
	};

	return (isMember
		? <SignUpMember
			resetMemberSettings={resetMemberSettings}
			goBackToBusinessType={goBackToBusinessType}
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
		: <SignUpForm
			goBack={goBackToBusinessType}
			isStartup={isStartup}
			isCompanyType={isCompanyType}
			isIndividuals={isIndividuals}
			register={register}
			errors={errors}
			email={email}
			control={control}
			countries={countries}
			watch={watch}
			setError={setError}
			setValue={setValue}
			clearErrors={clearErrors}
			checkIsMember={checkIsMemberHandler}
			isLoading={isLoadingSubmitForm || isLoadingCheckMember}
		/>
	);
};

SignUpCompany.propTypes = {
	checkEmail: func.isRequired,
	countries: array,
	email: string,
	emailDomain: string,
	getCountries: func.isRequired,
	isLoadingSubmitForm: bool,
	signUp: func.isRequired,
	businessType: string,
	user: userType,
	setBusinessType: func.isRequired,
	setSnackbar: func.isRequired,
	setIsHideStepsForMember: func.isRequired,
};

const mapStateToProps = ({
	auth: {
		emailForSignUp,
		isLoading,
		businessType,
		user,
	},
	common: {
		countries,
	},
}) => {
	const email = emailForSignUp || getItemFromStorage('signUpEmail');

	return ({
		user: user || getItemFromStorage('user'),
		email,
		countries,
		isLoadingSubmitForm: isLoading,
		businessType: businessType || getItemFromStorage('businessType'),
		emailDomain: !!email ? getEmailDomain(email) : '',
	});
};

export default connect(mapStateToProps, {
	checkEmail,
	getCountries,
	signUp,
	getDepartments,
	setBusinessType,
	setSnackbar,
	setIsHideStepsForMember,
})(memo(SignUpCompany));
