import React, { memo } from 'react';
import { connect } from 'react-redux';
import enums from '@constants/enums';
import PrimaryButton from '@components/_shared/buttons/PrimaryButton';
import TextArea from '@components/_shared/form/TextArea';
import { Col, Row } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { schema } from './schema';
import TextInput from '@components/_shared/form/TextInput';
import { P12 } from '@components/_shared/text';
import { bool, func } from 'prop-types';
import { isEmpty } from '@utils/js-helpers';
import { sendEmailForStartup } from '@ducks/home/actions';
import { sendContactUs } from '@ducks/auth/actions';
import { getItemFromLocalStorage } from '@utils/localStorage';

import './ContactUs.scss';

const ContactUs = ({
	toggleContactUsModal,
	toggleSuccessMessage,
	sendEmailForStartup,
	isAuthenticated,
	sendContactUs,
}) => {
	const { register, handleSubmit, errors, control, trigger, watch } = useForm({
		resolver: yupResolver(schema),
		defaultValues: schema.default(),
		mode: enums.validationMode.onBlur,
	});

	const onSubmit = data => {
		if (isAuthenticated)
			sendEmailForStartup(data);
		else sendContactUs({ ...data, token: getItemFromLocalStorage('resendVerificationToken') });

		toggleSuccessMessage();
		toggleContactUsModal();
	};

	return (
		<div className='contact-us'>
			<Row className='g-0'>
				<Col>
					<TextInput
						type='email'
						name='email'
						register={register({ required: true })}
						isLightTheme
						placeholder='E-mail'
						error={errors.email?.message}
					/>
					{errors.email && <P12 className='warning-text'>
						{errors.email && errors.email.message}
					</P12>
					}
				</Col>
			</Row>
			<Row>
				<Col>
					<TextArea
						id='problem'
						name='problem'
						placeholder='Please describe your problem or question'
						isVisibleLabel={false}
						register={register}
						isError={!!errors.text}
						classNames='textarea-full-width'
						control={control}
						trigger={trigger}
						value={watch('problem')}
						isBorder={false}
					/>
					{errors.problem && <P12 className='warning-text'>
						{errors.problem && errors.problem.message}
					</P12>
					}
				</Col>
			</Row>
			<Row>
				<Col>
					<PrimaryButton
						onClick={toggleContactUsModal}
						isOutline
						isFullWidth
						text='Cancel'
					/>
				</Col>
				<Col>
					<PrimaryButton
						onClick={handleSubmit(onSubmit)}
						disabled={!isEmpty(errors)}
						text='Send'
						isFullWidth
					/>
				</Col>
			</Row>
		</div>
	);
};

ContactUs.propTypes = {
	toggleContactUsModal: func,
	toggleSuccessMessage: func,
	sendEmailForStartup: func,
	sendContactUs: func,
	isAuthenticated: bool,
};

ContactUs.defaultProps = {
	toggleContactUsModal: () => {},
	toggleSuccessMessage: () => {},
	sendEmailForStartup: () => {},
};

export default connect(({ auth }) => {
	const { user } = auth;

	return {
		isAuthenticated: !!user,
	};
}, {
	sendEmailForStartup,
	sendContactUs,
})(memo(ContactUs));
