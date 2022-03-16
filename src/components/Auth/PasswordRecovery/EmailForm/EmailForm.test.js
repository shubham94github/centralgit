/**
 * @jest-environment jsdom
 */

import React from 'react';
import { act, findByDisplayValue, fireEvent, getByLabelText, render, screen } from '@testing-library/react';
import EmailForm from '@components/Auth/PasswordRecovery/EmailForm';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { validationErrMessages } from '@constants/common';
import configureStore from 'redux-mock-store';
import {
	submitBtnText,
} from '@components/Auth/PasswordRecovery/EmailForm/EmailForm';

const testEmail = 'test@test.com';
const emailLabelText = 'E-mail';

const mockHandleSendEmailForPasswordRecovery = jest.fn(() => async dispatch => dispatch({
	type: 'test-action-type',
	payload: {},
}));

const mockStore = configureStore({});

describe('Password Recovery / EmailForm component UI', () => {
	let store;
	let history;

	const props = {
		handleSendEmailForPasswordRecovery: mockHandleSendEmailForPasswordRecovery,
	};

	beforeEach(() => {
		store = mockStore({});
		history = createMemoryHistory();

		render(<Router history={history}>
			<EmailForm {...props} store={store}/>
		</Router>);
	});

	it('Rendering with correct error message', async () => {
		await fireEvent.click(screen.getByText(submitBtnText, { selector: 'button' }));

		expect(await screen.findByText(validationErrMessages.email)).toBeTruthy();
		expect(await screen.getByText(submitBtnText, { selector: 'button' })).toBeDisabled();
	});

	it('Rendering with correct E-mail input value', async () => {
		const container = document.querySelector('.email-form');
		const emailInput = getByLabelText(container, emailLabelText);

		fireEvent.change(emailInput, { target: { value: testEmail } });

		expect(await screen.getByLabelText(emailLabelText)).toBeTruthy();
		expect(await screen.getByLabelText(emailLabelText)).toHaveValue(testEmail);
	});

	it('Rendering with correct error \'Invalid e-mail\' message', async () => {
		const button = screen.getByText(submitBtnText, { selector: 'button' });

		await act(async () => {
			await screen.getByLabelText(emailLabelText).focus();

			fireEvent.change(screen.getByLabelText(emailLabelText), { target: { value: 'www' } });

			await screen.getByLabelText(emailLabelText).blur();
		});

		expect(await screen.getByLabelText(emailLabelText)).toBeTruthy();
		expect(await screen.getByLabelText(emailLabelText)).toHaveValue('www');
		expect(await screen.getByText('Please enter a valid email')).toBeTruthy();
		expect(await button).toBeDisabled();
	});

	it('Render with correct values and enabled buttun', async () => {
		const container = document.querySelector('.email-form');
		const emailInput = getByLabelText(container, emailLabelText);
		const button = screen.getByText(submitBtnText, { selector: 'button' });

		await act(async () => {
			fireEvent.change(emailInput, { target: { value: testEmail } });

			await findByDisplayValue(container, testEmail);

			expect(await button).toHaveClass('primary-button');
			expect(await button).toBeEnabled();

			await emailInput.blur();

		});

		expect(await emailInput).toHaveValue(testEmail);
		expect(await button).toBeEnabled();
	});
});
