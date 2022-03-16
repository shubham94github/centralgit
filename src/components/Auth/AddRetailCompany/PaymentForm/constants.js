import { colors } from '@colors';
import { S12 } from '@components/_shared/text';
import { Link } from 'react-router-dom';
import React from 'react';
import { Icons } from '@icons';

const { WEBSOCKET_SERVER_URL } = process.env;

export const CARD_OPTIONS = {
	style: {
		base: {
			iconColor: colors.gray40,
			color: colors.black,
			fontFamily: 'Montserrat, sans-serif',
			fontWeight: 400,
			fontSize: '16px',
		},
		invalid: {
			iconColor: colors.red50,
			color: colors.red50,
		},
	},
};

export const cardNumberOptions = {
	...CARD_OPTIONS,
	placeholder: 'Card Number',
	showIcon: true,
	iconStyle: 'solid',
	style: {
		...CARD_OPTIONS.style,
		base: {
			...CARD_OPTIONS.style.base,
			'::placeholder': {
				color: colors.gray40,
			},
		},
	},
};

export const cardExpiryOptions = {
	...CARD_OPTIONS,
	placeholder: 'MM/YY',
};

export const cardCVCOptions = {
	...CARD_OPTIONS,
	placeholder: 'CVC',
};

export const AgreementLabel = () => (
	<S12>By checking the box below, you agree to
	our <Link to={WEBSOCKET_SERVER_URL} className='blue-link'>Terms</Link> and that you have read and understood
	our <Link to={WEBSOCKET_SERVER_URL} className='blue-link'> Data Policy </Link></S12>
);
export const cvcTooltipText = 'Your CVC is the 3-digit number on the back of your card.';
export const checkedIcon = Icons.checked();
