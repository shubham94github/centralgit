/**
 * @jest-environment jsdom
 */

import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import EnzymeAdapter from '@wojtekmaj/enzyme-adapter-react-17';
import Header from '@components/layouts/HomeLayout/Header/Header';
import configureStore from 'redux-mock-store';

const mockStore = configureStore({});

Enzyme.configure({ adapter: new EnzymeAdapter() });

jest.mock('react-router', () => ({
	...jest.requireActual('react-router'),
	useLocation: () => ({
		pathname: '/auth/getting-started',
	}),
}));

describe('Header component', () => {
	let store;

	beforeEach(() => {
		store = mockStore({
			auth: {
				user: {
					id: 123,
					retailer: {},
				},
				userAvatar: {},
			},
			messaging: {
				newMessagesCounters: [],
			},
			notifications: {
				countOfNewNotifications: 0,
			},
			common: {
				trialData: {},
				isLoading: false,
			},
			home: {
				isLoading: false,
			},
		});

		store.dispatch = jest.fn();
	});

	const props = {
		logOut: jest.fn(),
		setFieldOutsideForFilter: jest.fn(),
		setFieldForFilter: jest.fn(),
		setDefaultFieldForFilter: jest.fn(),
		setNewMessageInChat: jest.fn(),
		setMessageAsRead: jest.fn(),
		onConnectionStatus: jest.fn(),
		getAllChatsByUserId: jest.fn(),
		setUser: jest.fn(),
		clearEmailForSignUp: jest.fn(),
		userAvatar: {},
		newMessagesCounter: 0,
	};

	test('Rendering without crashing', () => {
		const wrapper = shallow(
			<Header {...props} store={store}/>,
		).dive().dive();

		expect(wrapper.exists()).toEqual(true);
	});

	test('Rendering with correct button text', () => {
		const wrapper = shallow(
			<Header {...props} store={store}/>,
		).dive().dive();

		expect(wrapper.find('S14.link__text-margin').dive().text()).toEqual('Log out');
	});
});
