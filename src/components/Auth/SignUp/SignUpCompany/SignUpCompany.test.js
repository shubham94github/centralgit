import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import EnzymeAdapter from '@wojtekmaj/enzyme-adapter-react-17';
import configureStore from 'redux-mock-store';
import SignUpCompany from './SignUpCompany';
import { Provider } from 'react-redux';

const mockStore = configureStore({});

Enzyme.configure({ adapter: new EnzymeAdapter() });

const defaultStore = {
	auth: {
		emailForSignUp: 'test@test.com',
		isLoading: false,
		businessType: '',
		user: {},
	},
	common: {
		countries: [],
	},
	sessionStorage: jest.fn(),
	checkEmail: jest.fn(),
	getCountries: jest.fn(),
	signUp: jest.fn(),
	getDepartments: jest.fn(),
	setBusinessType: jest.fn(),
	setSnackbar: jest.fn(),
};

const setup = store => {
	return shallow(
		<Provider store={store}>
			<SignUpCompany/>
		</Provider>,
	);
};

describe('SignUpCompany component', () => {
	let wrapper;
	let store;

	beforeEach(() => {
		store = mockStore(defaultStore);

		store.dispatch = jest.fn();

		wrapper = setup(store);
	});

	it('Rendering without crashing', () => {
		expect(wrapper.exists()).toEqual(true);
	});
});
