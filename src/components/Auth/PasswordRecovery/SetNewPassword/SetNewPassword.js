import enums from '@constants/enums';
import React, { memo, useState } from 'react';
import { Redirect, useHistory } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { schema } from './schema';
import { isEmpty } from '@utils/js-helpers';
import { Col, Row } from 'react-bootstrap';
import { P12, P16, S12 } from '@components/_shared/text';
import TextInput from '@components/_shared/form/TextInput';
import { Routes } from '@routes';
import PrimaryButton from '@components/_shared/buttons/PrimaryButton';
import {
	newPasswordName,
	confirmPasswordName,
	newPasswordPlaceholder,
	passwordMatchErrorText,
	confirmPasswordPlaceholder,
	submitBtnText,
	tokenErrorText,
	setPasswordTitle,
} from './constants';
import useQueryParams from '@utils/hooks/useQueryParams';
import { connect } from 'react-redux';
import { checkTwoFaForgotPassword } from '@ducks/auth/actions';
import { getItemFromLocalStorage } from '@utils/localStorage';
import { func } from 'prop-types';

import './SetNewPassword.scss';

function SetNewPassword({ checkTwoFaForgotPassword }) {
	const query = useQueryParams();
	const history = useHistory();

	const [formError, setFormError] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [isPasswordSent, setIsPasswordSent] = useState(false);

	const { register, handleSubmit, errors } = useForm({
		resolver: yupResolver(schema),
		defaultValues: schema.default(),
		mode: enums.validationMode.onTouched,
	});

	const onSubmit = ({ newPassword, confirmPassword }) => {
		if (newPassword !== confirmPassword) {
			setFormError(passwordMatchErrorText);

			return;
		}

		try {
			setFormError('');
			setIsLoading(true);

			checkTwoFaForgotPassword({ data: {
				newPassword: newPassword,
				token: query.get('token'),
				email: getItemFromLocalStorage('emailFor2Fa'),
			}, history, setIsPasswordSent });
		} catch (e) {
			const errorMessage = e.response.data.message;

			setFormError(errorMessage === 'Not found' ? tokenErrorText : errorMessage);
		} finally {
			setIsLoading(false);
		}
	};

	const clearFormError = () => setFormError('');

	if (!query?.get('token')) return <Redirect to={Routes.AUTH.PASSWORD_RECOVERY.EMAIL_FORM}/>;

	return isPasswordSent
		? <Redirect to={Routes.AUTH.PASSWORD_RECOVERY.PASSWORD_WAS_CHANGED}/>
		: (
			<div className='set-new-password'>
				<div className='form-wrapper'>
					<form
						onSubmit={handleSubmit(onSubmit)}
						className='email-form'
					>
						<Row>
							<Col className='text-center'>
								<P16 className='title'>{setPasswordTitle}</P16>
							</Col>
						</Row>
						<Row>
							<Col>
								<TextInput
									onChange={clearFormError}
									id={newPasswordName}
									type='password'
									name={newPasswordName}
									register={register({ required: true })}
									isLightTheme
									placeholder={newPasswordPlaceholder}
									error={errors.newPassword?.message}
								/>
								<P12 className='warning-text'>{errors.newPassword && errors.newPassword.message}</P12>
							</Col>
						</Row>
						<Row>
							<Col>
								<TextInput
									onChange={clearFormError}
									id={confirmPasswordName}
									type='password'
									name={confirmPasswordName}
									register={register({ required: true })}
									isLightTheme
									placeholder={confirmPasswordPlaceholder}
									error={errors.confirmPassword?.message}
								/>
								<P12 className='warning-text'>
									{ errors.confirmPassword && errors.confirmPassword.message }
								</P12>
							</Col>
						</Row>
						{formError
							&& <Row>
								<Col className='text-center'>
									<S12 className='warning-text'><span>{formError}</span></S12>
								</Col>
							</Row>
						}
						<Row>
							<Col className='d-flex justify-content-center'>
								<PrimaryButton
									onClick={handleSubmit(onSubmit)}
									text={submitBtnText}
									disabled={!isEmpty(errors)}
									isLoading={isLoading}
									isFullWidth={false}
								/>
							</Col>
						</Row>
					</form>
				</div>
			</div>
		);
}

SetNewPassword.propTypes = {
	checkTwoFaForgotPassword: func,
};

export default connect(null, {
	checkTwoFaForgotPassword,
})(memo(SetNewPassword));
