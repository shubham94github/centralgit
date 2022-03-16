import React, { memo } from 'react';
import { useForm } from 'react-hook-form';
import enums from '@constants/enums';
import { yupResolver } from '@hookform/resolvers/yup';
import { schema } from './schema';
import { Col, Row } from 'react-bootstrap';
import { P14, P16 } from '@components/_shared/text';
import RadioButton from '@components/_shared/form/RadioButton';
import {
	businessTypeName,
	chooseBusinessTypeTitle,
	companyDescription,
	startupDescription1,
	startupDescription2,
	startupLabel,
	businessTypes,
	retailerLabel,
	submitBtnText,
	entrepreneurLabel,
	helloTitle,
} from './constants';
import { connect } from 'react-redux';
import { bool, func, oneOf, string } from 'prop-types';
import PrimaryButton from '@components/_shared/buttons/PrimaryButton';
import { Routes } from '@routes';
import { Redirect, useHistory } from 'react-router-dom';
import { setBusinessType } from '@ducks/auth/actions';
import { colors } from '@colors';
import { setItemToSessionStorage } from '@utils/sessionStorage';
import { Icons } from '@icons';
import { getItemFromStorage } from '@utils/storage';

import './ChooseBusinessType.scss';

function ChooseBusinessType({ email, isCompany, setBusinessType }) {
	const history = useHistory();

	const { register, handleSubmit, watch } = useForm({
		resolver: yupResolver(schema),
		defaultValues: {
			businessType: isCompany ? retailerLabel : entrepreneurLabel,
		},
		mode: enums.validationMode.onTouched,
	});

	const onSubmit = ({ businessType }) => {
		setBusinessType(businessType);

		setItemToSessionStorage('businessType', businessType);

		history.push(businessType === 'Startup'
			? Routes.AUTH.SIGN_UP.ADD_STARTUP_COMPANY
			: Routes.AUTH.SIGN_UP.ADD_RETAIL_COMPANY,
		);
	};

	const goBack = () => history.goBack();

	if (!email) return <Redirect to={Routes.AUTH.SIGN_UP.ADD_EMAIL}/>;

	return (
		<div className='choose-business-type'>
			<form
				className='form-wrapper'
				onSubmit={handleSubmit(onSubmit)}
			>
				<Row>
					<Col className='text-center'>
						<p className='position-relative title'>
							<span className='back-btn' onClick={goBack}>{Icons.chevronLeft(colors.darkblue70)}</span>
							<span>{helloTitle}</span>
							<br/>
							<span>{chooseBusinessTypeTitle}</span>
						</p>
						{ email
							&& <P16 className='position-relative'>
								You are signing up with the <b>{email}</b> E-mail.
								<br/>
								If you want to change, please&nbsp;
								<span onClick={ goBack } className='blue-link underline'> go back </span> and provide
								another email.
							</P16>
						}
					</Col>
				</Row>
				<Row>
					<Col sm={6} className='company'>
						<P16 className='bold sub-title'>Company</P16>
						<P14 className='description'>{companyDescription}</P14>
						<div className='fields'>
							<Row>
								<Col sm={6}>
									<P14 className='mt-3'>Companies:</P14>
									{
										businessTypes.companies.map(type => (
											<Row key={type}>
												<RadioButton
													type='radio'
													id={type}
													label={type}
													name={businessTypeName}
													value={type}
													register={register}
													defaultChecked={watch(businessTypeName) === type}
													disabled={!isCompany}
												/>
											</Row>
										))
									}
								</Col>
								<Col sm={6}>
									<P14 className='mt-3'>Individuals:</P14>
									{
										businessTypes.individuals.map(type => (
											<Row key={type}>
												<RadioButton
													type='radio'
													id={type}
													label={type}
													name={businessTypeName}
													value={type}
													register={register}
													defaultChecked={watch(businessTypeName) === type}
												/>
											</Row>
										))
									}
								</Col>
							</Row>
						</div>
					</Col>
					<Col sm={6} className='startup'>
						<P16 className='bold sub-title'>Startup</P16>
						<P14 className='description'>Select Startup {startupDescription1}</P14>
						<br/>
						<P14 className='description'>{startupDescription2}</P14>
						<div className='fields'>
							<RadioButton
								type='radio'
								id={startupLabel}
								label={startupLabel}
								name={businessTypeName}
								value={startupLabel}
								register={register}
								defaultChecked={watch(businessTypeName) === startupLabel}
							/>
						</div>
					</Col>
				</Row>
				<Row>
					<Col className='d-flex justify-content-end'>
						<PrimaryButton
							onClick={handleSubmit(onSubmit)}
							text={submitBtnText}
							disabled={!email}
						/>
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
	businessType: oneOf([...businessTypes.companies, ...businessTypes.individuals, startupLabel]),
};

export default connect(({ auth: { emailForSignUp, isCompany, businessType } }) => {
	return {
		email: emailForSignUp || getItemFromStorage('signUpEmail'),
		isCompany,
		businessType,
	};
}, { setBusinessType })(memo(ChooseBusinessType));
