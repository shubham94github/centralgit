import React, { memo, useEffect, useState } from 'react';
import { bool, func, number, oneOfType, string } from 'prop-types';
import TextArea from '@components/_shared/form/TextArea';
import PrimaryButton from '@components/_shared/buttons/PrimaryButton';
import { P12, S12, S14 } from '@components/_shared/text';
import { stopPropagation } from '@utils';
import { useForm } from 'react-hook-form';
import { schema } from './schema';
import { yupResolver } from '@hookform/resolvers/yup';
import enums from '@constants/enums';
import { isEmpty } from '@utils/js-helpers';

import './SendNotificationDropdown.scss';

const delay = 5000;

export function SendNotificationDropdown({
	recipientId,
	sendAdminNotification,
	isAdminNotificationSending,
	onClose,
}) {
	const [isSendMessage, setIsSendMessage] = useState(false);

	const {
		register,
		handleSubmit,
		errors,
		watch,
	} = useForm({
		resolver: yupResolver(schema),
		mode: enums.validationMode.onChange,
		defaultValues: schema.default(),
	});

	const handleSendMessage = ({ message }) => {
		sendAdminNotification({ recipientId, message: message.trim() });
		setIsSendMessage(true);
	};

	useEffect(() => {
		if (isSendMessage) {
			const timer = setTimeout(() => onClose(), delay);

			return () => clearTimeout(timer);
		}
	}, [onClose, isSendMessage]);

	return (
		<div className='send-notification-dropdown' onClick={stopPropagation}>
			<S14 bold>Notification</S14>
			{
				isSendMessage
					? <S12><br/>Your message was sent successfully!</S12>
					:<>
						<TextArea
							id='message'
							name='message'
							isVisibleLabel={false}
							register={register}
							isError={!!errors.message}
							value={watch('message')}
							placeholder='Add a message'
							rows={3}
							disabled={isAdminNotificationSending}
							isBorder
						/>
						{
							errors.message && <P12 className='warning-text'>{errors.message.message}</P12>
						}
						<PrimaryButton
							className='float-end'
							text='Send'
							disabled={isAdminNotificationSending || !isEmpty(errors) || !watch('message').trim().length}
							isLoading={isAdminNotificationSending}
							onClick={handleSubmit(handleSendMessage)}
						/>
					</>
			}
		</div>
	);
}

SendNotificationDropdown.propTypes = {
	sendAdminNotification: func.isRequired,
	onClose: func.isRequired,
	recipientId: oneOfType([string, number]),
	isAdminNotificationSending: bool,
};

export default memo(SendNotificationDropdown);
