import React, { memo, useState } from 'react';
import { connect } from 'react-redux';
import enums from '@constants/enums';
import { Link, NavLink, Redirect, useHistory } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import { func, bool, string, shape } from 'prop-types';
import { isEmpty } from '@utils/js-helpers';
import { useForm } from 'react-hook-form';
import PrimaryButton from '@components/_shared/buttons/PrimaryButton';
import { P16, P12, S12 } from '@components/_shared/text';
import TextInput from '@components/_shared/form/TextInput';
import { Routes } from '@routes';
import { schema } from './schema';
import { checkTwoFa } from '@ducks/auth/actions';
import { redirectToCorrectPageByStatus } from '@components/Auth/utils';
import GridContainer from '@components/layouts/GridContainer';
import Checkbox from '@components/_shared/form/Checkbox';

import './SignIn.scss';

const { gettingStartedStatuses, userRoles } = enums;

export const SignIn = ({
	checkTwoFa,
	isAuthenticated,
	isLoading,
	user,
}) => {
	const history = useHistory();
	const [formError, setFormError] = useState('');

	const { register, handleSubmit, errors, watch, setValue } = useForm({
		resolver: yupResolver(schema),
		defaultValues: schema.default(),
		mode: enums.validationMode.onTouched,
	});

	const onSubmit = data => {
		checkTwoFa({ data, history, setFormError })
			.then(error => {
				if (error) setFormError(error.message || error.error_description);
			});
	};

	const isMember = user?.role === userRoles.member;
	const isVerified = user?.isVerified;

	const isCompletedUser = isMember ? isVerified : user?.status === gettingStartedStatuses.completedGettingStarted;

	if (!!user && !isCompletedUser)
		return redirectToCorrectPageByStatus(user);

	const propName = !!user?.retailer ? 'retailer' : 'member';

	if (isAuthenticated && user?.status === gettingStartedStatuses.completedGettingStarted
		&& user[propName]
		&& (!user[propName].stripePaymentSettings.isSubscriptionPaid
			&& !user[propName].stripePaymentSettings.isTrial))
		return <Redirect to={Routes.SUBSCRIPTION.INDEX}/>;

	if (isAuthenticated) return <Redirect to={Routes.HOME}/>;

	const onInputChange = () => setFormError('');

	const setRememberMe = e => setValue('rememberMe', e.target.checked);

	return (
		<section className='sign-in-page-section'>
			<div className='sign-in-page-container'>
				<form
					className={`form-wrapper sign-in-form`}
					onSubmit={handleSubmit(onSubmit)}
				>
					<GridContainer customClassName='centered field-container'>
						<P16>Log in</P16>
					</GridContainer>
					<GridContainer customClassName='field-container'>
						<TextInput
							onChange={onInputChange}
							id='email'
							type='email'
							name='email'
							register={register({ required: true })}
							isLightTheme
							placeholder='E-mail'
							error={errors.email?.message}
						/>
						{errors.email && <P12 className='warning-text'>{errors.email.message}</P12>}
					</GridContainer>
					<GridContainer customClassName='field-container'>
						<TextInput
							onChange={onInputChange}
							id='password'
							type='password'
							name='password'
							register={register({ required: true })}
							isLightTheme
							placeholder='Password'
							error={errors.password?.message}
						/>
						{errors.password
							&& <P12 className='warning-text'>
								{errors.password.message}&nbsp;
							</P12>
						}
					</GridContainer>

					<GridContainer customClassName='field-container'>
						<Checkbox
							name='rememberMe'
							label='Remember me'
							register={register}
							value={watch('rememberMe')}
							isError={!!errors.rememberMe}
							readOnly={false}
							onChange={setRememberMe}
							disabled={false}
						/>
						{errors.rememberMe
							&& <P12 className='warning-text'>
								{errors.rememberMe.message}&nbsp;
							</P12>
						}
					</GridContainer>

					{formError
						&& <GridContainer customClassName='field-container'>
							<S12 className='warning-text'>{formError}</S12>
						</GridContainer>
					}
					<GridContainer customClassName='field-container centered'>
						<NavLink className='black-link s12' to={Routes.AUTH.PASSWORD_RECOVERY.EMAIL_FORM}>
								Forgot password?
						</NavLink>
					</GridContainer>
					<GridContainer customClassName='field-container'>
						<PrimaryButton
							onClick={handleSubmit(onSubmit)}
							text='Log in'
							isFullWidth={true}
							disabled={!isEmpty(errors)}
							isLoading={isLoading}
						/>
					</GridContainer>
					<GridContainer customClassName='centered'>
						<P12 className='centered'>
								New to Retail Innovation Explorer?
							<br/>
							<Link
								to={Routes.AUTH.SIGN_UP.ADD_EMAIL}
								className='black-link bold underline'
							>
									Sign up
							</Link>
						</P12>
					</GridContainer>
				</form>
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

export default connect(({ auth }) => {
	const { user, isLoading } = auth;

	return {
		isAuthenticated: !!user,
		user,
		isLoading,
	};
}, {
	checkTwoFa,
})(memo(SignIn));
