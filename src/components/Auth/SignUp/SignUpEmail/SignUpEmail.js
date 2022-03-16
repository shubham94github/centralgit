import React, { memo, useEffect } from 'react';
import { connect } from 'react-redux';
import { bool, func, string } from 'prop-types';
import enums from '@constants/enums';
import { isEmpty } from '@utils/js-helpers';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { NavLink } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import FormWrapper from '@components/_shared/form/FormWrapper';
import PrimaryButton from '@components/_shared/buttons/PrimaryButton';
import { P12, P16, S12 } from '@components/_shared/text';
import TextInput from '@components/_shared/form/TextInput';
import { colors } from '@constants/colors';
import { Routes } from '@routes';
import { schema } from './schema';
import { emailExistenceErrorText, emailBlockedDomainErrorText } from '@components/Auth/constants';
import { removeItemFromSessionStorage, setItemToSessionStorage } from '@utils/sessionStorage';
import { checkEmail, resetEmailExistenceError, resetBlockedDomainError } from '@ducks/auth/actions';
import { emailFieldPlaceholder, title, submitBtnText } from './constants';
import { Icons } from '@icons';
import GridContainer from '@components/layouts/GridContainer';
import useQueryParams from '@utils/hooks/useQueryParams';

import './SignUpEmail.scss';

const SignUpEmail = ({
	email,
	checkEmail,
	isLoading,
	isEmailExists,
	resetEmailExistenceError,
	isBlockedDomain,
	resetBlockedDomainError,
}) => {
	const query = useQueryParams();

	const { register, handleSubmit, errors, reset, setError, clearErrors } = useForm({
		resolver: yupResolver(schema),
		defaultValues: {
			...schema.default(),
			email: query.get('email'),
		},
		mode: enums.validationMode.onTouched,
	});

	useEffect(() => {
		resetEmailExistenceError();
		resetBlockedDomainError();
	}, [resetEmailExistenceError, resetBlockedDomainError]);

	useEffect(() => {
		if (email) {
			reset({
				email: email,
			});
		}
	}, [email, reset]);

	useEffect(() => {
		if (isEmailExists)
			setError('email', { message: emailExistenceErrorText });
		else if (isBlockedDomain)
			setError('email', { message: emailBlockedDomainErrorText });
		else clearErrors('email');
	}, [isEmailExists, isBlockedDomain, setError, clearErrors]);

	const onSubmit = async data => {
		resetEmailExistenceError();
		resetBlockedDomainError();

		await checkEmail({
			data,
			setError,
		});

		removeItemFromSessionStorage('signUpEmail');
		setItemToSessionStorage('signUpEmail', data.email);
	};

	return (
		<FormWrapper className='signup-email-wrapper'>
			<Container className='email-form-container'>
				<GridContainer>
					<P16>{title}</P16>
				</GridContainer>
				<GridContainer customClassName='field-container'>
					<div>
						<TextInput
							id='email'
							type='email'
							name='email'
							placeholder={emailFieldPlaceholder}
							register={register({ required: true, maxLength: 80 })}
							isLightTheme
							isError={!!errors.email?.message}
						/>
						<P12 className='warning-text'>{errors.email && errors.email.message}</P12>
					</div>
				</GridContainer>
				<GridContainer customClassName='field-container'>
					<PrimaryButton
						onClick={handleSubmit(onSubmit)}
						text={submitBtnText}
						isFullWidth={true}
						disabled={!isEmpty(errors)}
						isLoading={isLoading}
					/>
				</GridContainer>
				<div className='hide-for-first-release'>
					<S12>Or use</S12>
					<NavLink to={Routes.AUTH.SIGN_UP.INDEX} className='linkedin-icon'>
						{Icons.linkedinIconLogIn(colors.gray20)}
					</NavLink>
					<S12>to Sign up</S12>
				</div>
				<div className='field-container'>
					<P12>
						<span>Already have an account?</span>
						<NavLink className='black-link bold underline' to={Routes.AUTH.SIGN_IN}>
							Log in
						</NavLink>
					</P12>
				</div>
			</Container>
		</FormWrapper>
	);
};

SignUpEmail.defaultProps = {
	email: '',
};

SignUpEmail.propTypes = {
	email: string,
	checkEmail: func,
	isLoading: bool,
	isEmailExists: bool,
	isBlockedDomain: bool,
	resetEmailExistenceError: func.isRequired,
	resetBlockedDomainError: func.isRequired,
};

export default connect(({ auth }) => {
	const { emailForSignUp, isLoading, isEmailExists, isBlockedDomain } = auth;

	return {
		emailForSignUp,
		isEmailExists,
		isLoading,
		isBlockedDomain,
	};
}, {
	checkEmail,
	resetEmailExistenceError,
	resetBlockedDomainError,
})(memo(SignUpEmail));
