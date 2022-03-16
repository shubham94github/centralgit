/**
 * @jest-environment jsdom
 */

import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import EnzymeAdapter from '@wojtekmaj/enzyme-adapter-react-17';
import { act, findByDisplayValue, fireEvent, getByLabelText, render, screen } from '@testing-library/react';
import configureStore from 'redux-mock-store';
import { SignIn } from '@components/Auth/SignIn/SignIn';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { validationErrMessages } from '@constants/common';
import enums from '@constants/enums';

const { gettingStartedStatuses } = enums;
const mockStore = configureStore({});
const testEmail = 'test@test.com';
const testPassword = '112142Ol!7';
const emailLabelText = 'E-mail';
const passwordLabelText = 'Password';

Enzyme.configure({ adapter: new EnzymeAdapter() });

const mockLogin = jest.fn(() => {
	return Promise.resolve(undefined);
});

jest.mock('react-router', () => ({
	...jest.requireActual('react-router'),
	useLocation: () => ({
		pathname: '/auth/sign-in',
	}),
}));

describe('SignIn component', () => {
	let store;

	beforeEach(() => {
		store = mockStore({
			auth: {
				user: null,
				isLoading: false,
			},
		});

		store.dispatch = jest.fn();
	});

	const props = {
		checkTwoFa: mockLogin,
		setIsLoading: jest.fn(),
	};

	it('Rendering without crashing', () => {
		const wrapper = shallow(
			<SignIn {...props} store={store}/>,
		);

		expect(wrapper.exists()).toEqual(true);
	});

	it('Rendering with correct button text', () => {
		const wrapper = shallow(
			<SignIn {...props} store={store}/>,
		);

		expect(wrapper.find('Memo(PrimaryButton)').dive().find('button').text()).toEqual('Log in');
	});

	it('Rendering with isAuthenticated = true', () => {
		const updatedProps = {
			...props,
			isAuthenticated: true,
			user: {
				retailer: {
					stripePaymentSettings: {
						isSubscriptionPaid: true,
					},
				},
				status: gettingStartedStatuses.completedGettingStarted,
			},
		};

		const wrapper = shallow(
			<SignIn {...updatedProps} store={store}/>,
		);

		expect(wrapper.exists()).toEqual(true);
	});
});

describe('SignIn component UI', () => {
	let store;
	let history;

	const props = {
		checkTwoFa: mockLogin,
		setIsLoading: jest.fn(),
	};

	beforeEach(() => {
		store = mockStore({
			auth: {
				user: null,
				isLoading: false,
			},
		});
		history = createMemoryHistory();

		render(<Router history={history}>
			<SignIn {...props} store={store}/>
		</Router>);
	});

	it('Rendering with correct error message', async () => {
		await fireEvent.click(screen.getByText('Log in', { selector: 'button' }));

		expect(await screen.findByText(validationErrMessages.email)).toBeTruthy();
		expect(await screen.findByText(validationErrMessages.password)).toBeTruthy();
		expect(await screen.getByText('Log in', { selector: 'button' })).toBeDisabled();
	});

	it('Rendering with correct E-mail input value', async () => {
		const container = document.querySelector('.sign-in-form');
		const emailInput = getByLabelText(container, emailLabelText);

		fireEvent.change(emailInput, { target: { value: testEmail } });

		expect(await screen.getByLabelText(emailLabelText)).toBeTruthy();
		expect(await screen.getByLabelText(emailLabelText)).toHaveValue(testEmail);
	});

	it('Rendering with correct error \'Invalid e-mail\' message', async () => {
		const button = screen.getByText('Log in', { selector: 'button' });

		await act(async () => {
			await screen.getByLabelText(emailLabelText).focus();

			fireEvent.change(screen.getByLabelText(emailLabelText), { target: { value: 'www' } });

			await screen.getByLabelText(emailLabelText).blur();
		});

		expect(await screen.getByLabelText(emailLabelText)).toBeTruthy();
		expect(await screen.getByLabelText(emailLabelText)).toHaveValue('www');
		expect(await screen.getByText('Invalid e-mail')).toBeTruthy();
		expect(await button).toBeDisabled();
	});

	it('Rendering with password input value', async () => {
		const container = document.querySelector('.sign-in-form');
		const passwordInput = getByLabelText(container, passwordLabelText);

		screen.getByLabelText(passwordLabelText).focus();

		fireEvent.change(passwordInput, { target: { value: testPassword } });

		expect(await screen.getByLabelText(passwordLabelText)).toBeTruthy();
		expect(await screen.getByLabelText(passwordLabelText)).toHaveValue(testPassword);
	});

	it('Render with correct values and enabled buttun', async () => {
		const testPassword = '132564!On7';
		const container = document.querySelector('.sign-in-form');
		const passwordInput = getByLabelText(container, passwordLabelText);
		const emailInput = getByLabelText(container, emailLabelText);
		const button = screen.getByText('Log in', { selector: 'button' });

		await act(async () => {
			fireEvent.change(passwordInput, { target: { value: testPassword } });

			await findByDisplayValue(container, testPassword);

			fireEvent.change(emailInput, { target: { value: testEmail } });
			fireEvent.change(passwordInput, { target: { value: testPassword } });

			await findByDisplayValue(container, testEmail);
			expect(await screen.getByText('Log in', { selector: 'button' })).toHaveClass('primary-button');
			expect(await screen.getByText('Log in', { selector: 'button' })).toBeEnabled();

			fireEvent.click(button);
		});

		expect(await screen.getByLabelText(passwordLabelText)).toHaveValue(testPassword);
		expect(await screen.getByLabelText(emailLabelText)).toHaveValue(testEmail);
		expect(await screen.getByText('Log in', { selector: 'button' })).toBeEnabled();
	});
});
