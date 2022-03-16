import React, { memo, useState } from 'react';
import { useForm } from 'react-hook-form';
import enums from '@constants/enums';
import { yupResolver } from '@hookform/resolvers/yup';
import { schema } from './schema';
import { Col, Row } from 'react-bootstrap';
import { P12, P14, P16, S12 } from '@components/_shared/text';
import TextInput from '@components/_shared/form/TextInput';
import PrimaryButton from '@components/_shared/buttons/PrimaryButton';
import { isEmpty } from '@utils/js-helpers';
import { sendEmailForPasswordRecovery } from '@api/auth';
import { Redirect } from 'react-router-dom';
import { Routes } from '@routes';
import { setItemToLocalStorage } from '@utils/localStorage';

import './EmailForm.scss';

export const emailFormTitle = 'Forgot your password?';
export const emailFormDescription = 'Enter your email address and we\'ll send you a link to reset your password.';
export const submitBtnText = 'Reset Password';
const emailNotExistError = 'We couldn\'t find an account with that email address';

export function EmailForm() {
	const [formError, setFormError] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [isEmailSent, setIsEmailSent] = useState(false);

	const { register, handleSubmit, errors } = useForm({
		resolver: yupResolver(schema),
		defaultValues: schema.default(),
		mode: enums.validationMode.onTouched,
	});

	const onSubmit = async data => {
		try {
			setFormError('');
			setIsLoading(true);

			await sendEmailForPasswordRecovery(data.email);

			setItemToLocalStorage('emailFor2Fa', data.email);

			setIsEmailSent(true);
		} catch {
			setFormError(emailNotExistError);
		} finally {
			setIsLoading(false);
		}
	};

	const clearFormError = () => setFormError('');

	return isEmailSent
		? <Redirect to={Routes.AUTH.PASSWORD_RECOVERY.CHECK_SENT_EMAIL}/>
		: (
			<div className='password-recovery'>
				<div className='form-wrapper'>
					<form
						onSubmit={handleSubmit(onSubmit)}
						className='email-form'
					>
						<Row>
							<Col className='text-center'>
								<P16 className='title'>{emailFormTitle}</P16>
							</Col>
						</Row>
						<Row>
							<Col>
								<P14 className='description'>{emailFormDescription}</P14>
							</Col>
						</Row>
						<Row>
							<Col>
								<TextInput
									onChange={clearFormError}
									id='email'
									type='email'
									name='email'
									register={register({ required: true })}
									isLightTheme
									placeholder='E-mail'
									error={errors.email?.message}
									disabled={isLoading}
								/>
								<P12 className='warning-text'>{errors.email && errors.email.message}</P12>
							</Col>
						</Row>
						{formError
							&& <Row>
								<Col>
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

export default memo(EmailForm);
