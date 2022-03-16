import React, { memo } from 'react';
import { Col, Row } from 'react-bootstrap';
import PrimaryButton from '@components/_shared/buttons/PrimaryButton';
import { elementType, func, object, string } from 'prop-types';
import { P16 } from '@components/_shared/text';

import './Confirm.scss';

const Confirm = ({
	message,
	component: Component,
	componentProps,
	onClose,
	successConfirm,
	confirmTextButton,
	declineTextButton,
	text,
}) => (
	<div className='confirm'>
		<Row className='g-0'>
			<Col>
				<div className='text-center'>
					{message}
					{componentProps && <Component {...componentProps}/>}
				</div>
				{text && <P16>{text}</P16>}
			</Col>
		</Row>
		<Row className='g-3'>
			<Col>
				<PrimaryButton
					text={declineTextButton}
					isOutline
					onClick={onClose}
					isFullWidth
					className='pe-3'
				/>
			</Col>
			<Col>
				<PrimaryButton
					text={confirmTextButton}
					onClick={successConfirm}
					isFullWidth
				/>
			</Col>
		</Row>
	</div>
);

Confirm.propTypes = {
	onClose: func,
	successConfirm: func.isRequired,
	message: string,
	component: elementType,
	componentProps: object,
	confirmTextButton: string,
	declineTextButton: string,
	text: string,
};

Confirm.defaultProps = {
	onClose: () => {},
	message: '',
	confirmTextButton: 'Yes',
	declineTextButton: 'No',
};

export default memo(Confirm);
