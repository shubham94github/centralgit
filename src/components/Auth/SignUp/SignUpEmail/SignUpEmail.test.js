/**
 * @jest-environment jsdom
 */

import React from 'react';
import { act, findByDisplayValue, fireEvent, getByLabelText, render, screen } from '@utils/test/reactTestingLibrary';
import configureStore from 'redux-mock-store';
import SignUpEmail from '@components/Auth/SignUp/SignUpEmail';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { validationErrMessages } from '@constants/common';
import { Provider } from 'react-redux';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { getByPlaceholderText } from '@testing-library/react';
import { emailFieldPlaceholder, submitBtnText } from './constants';

const testEmail = 'test@test.com';

const mockStore = configureStore({});

const mockLogin = jest.fn(() => {
	return Promise.resolve(undefined);
});

jest.mock('react-router', () => ({
	...jest.requireActual('react-router'),
	useLocation: () => ({
		pathname: '/auth/sign-up/add-email',
	}),
}));

export const handlers = [
	rest.get('/v1/registration/check-email', (req, res, ctx) => {
		return res(ctx.json('John Smith'), ctx.delay(150));
	}),
];

const server = setupServer(...handlers);

describe('SignUpEmail component UI', () => {
	let store;
	let history;

	const props = {
		handleSignIn: mockLogin,
	};

	beforeAll(() => server.listen());

	afterAll(() => server.close());

	beforeEach(() => {
		store = mockStore({
			auth: {
				user: null,
				emailForSignUp: testEmail,
				isLoading: false,
				isEmailExists: null,
			},
		});
		history = createMemoryHistory();

		server.resetHandlers();

		render(
			<Provider store={store}>
				<Router history={history}>
					<SignUpEmail {...props}/>
				</Router>
			</Provider>,
		);
	});

	it('Rendering with correct error message', async () => {
		await fireEvent.click(screen.getByText(submitBtnText, { selector: 'button' }));

		expect(await screen.findByText(validationErrMessages.email)).toBeTruthy();
		expect(await screen.getByText(submitBtnText, { selector: 'button' })).toBeDisabled();
	});

	it('Rendering with correct E-mail input value', async () => {
		const container = document.querySelector('.signup-email-wrapper');
		const emailInput = getByPlaceholderText(container, emailFieldPlaceholder);

		fireEvent.change(emailInput, { target: { value: testEmail } });

		expect(await screen.getByLabelText(emailFieldPlaceholder)).toBeTruthy();
		expect(await screen.getByLabelText(emailFieldPlaceholder)).toHaveValue(testEmail);
	});

	it('Rendering with correct error \'Invalid e-mail\' message', async () => {
		const button = screen.getByText(submitBtnText, { selector: 'button' });

		await act(async () => {
			await screen.getByLabelText(emailFieldPlaceholder).focus();

			fireEvent.change(screen.getByLabelText(emailFieldPlaceholder), { target: { value: 'www' } });

			await screen.getByLabelText(emailFieldPlaceholder).blur();
		});

		expect(await screen.getByLabelText(emailFieldPlaceholder)).toBeTruthy();
		expect(await screen.getByLabelText(emailFieldPlaceholder)).toHaveValue('www');
		expect(await screen.getByText('Invalid e-mail')).toBeTruthy();
		expect(await button).toBeDisabled();
	});

	it('Render with correct values and enabled buttun', async () => {
		const container = document.querySelector('.signup-email-wrapper');
		const emailInput = getByLabelText(container, emailFieldPlaceholder);
		const button = screen.getByText(submitBtnText, { selector: 'button' });

		await act(async () => {
			fireEvent.change(emailInput, { target: { value: testEmail } });

			await findByDisplayValue(container, testEmail);
			expect(await screen.getByText(submitBtnText, { selector: 'button' })).toHaveClass('primary-button');
			expect(await screen.getByText(submitBtnText, { selector: 'button' })).toBeEnabled();

			fireEvent.click(button);
		});

		expect(await screen.getByLabelText(emailFieldPlaceholder)).toHaveValue(testEmail);
		expect(await screen.getByText(submitBtnText, { selector: 'button' })).toBeEnabled();
	});
});
