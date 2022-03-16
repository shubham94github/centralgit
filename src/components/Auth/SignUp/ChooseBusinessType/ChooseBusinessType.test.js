/**
 * @jest-environment jsdom
 */

import React from 'react';
import {
	fireEvent,
	render,
	screen,
} from '@utils/test/reactTestingLibrary';
import configureStore from 'redux-mock-store';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import ChooseBusinessType from '@components/Auth/SignUp/ChooseBusinessType/ChooseBusinessType';
import { submitBtnText } from './constants';
import { setupServer } from 'msw/node';
import { rest } from 'msw';

const testEmail = 'test@test.com';

const mockStore = configureStore({});

export const handlers = [
	rest.post(`/api/`, (req, res, ctx) => {
		return res(ctx.json('John Smith'), ctx.delay(150));
	}),
];

const server = setupServer(...handlers);

const testStore = {
	auth: {
		emailForSignUp: testEmail,
		isCompany: false,
	},
};

describe('ChooseBusinessType component UI', () => {
	let store;
	let history;

	beforeAll(() => server.listen());

	afterEach(() => server.resetHandlers());

	afterAll(() => server.close());

	beforeEach(() => {
		store = mockStore(testStore);
		history = createMemoryHistory();

		render(
			<Router history={history}>
				<ChooseBusinessType/>
			</Router>,
			{
				preloadedState: testStore,
				store,
			},
		);
	});

	it('Rendering with enabled submit button', async () => {
		const submitBtn = screen.getByText(submitBtnText, { selector: 'button' });

		expect(await submitBtn).toBeEnabled();
	});

	it('Rendering with correct chosen radio button', async () => {
		const startupRadioBtn = document.querySelector('#Startup + span');

		expect(await startupRadioBtn).toBeTruthy();
		expect(await startupRadioBtn).toHaveClass('checked');
	});

	it('Rendering with changed chosen radio button', async () => {
		const startupRadioBtn = document.querySelector('#Startup + span');
		const entrepreneurRadioBtn = document.querySelector('#Entrepreneur');
		const submitBtn = screen.getByText(submitBtnText);

		fireEvent.click(entrepreneurRadioBtn);

		expect(await startupRadioBtn).toBeTruthy();
		expect(await entrepreneurRadioBtn).toBeChecked();

		expect(submitBtn).toBeEnabled();
	});
});
