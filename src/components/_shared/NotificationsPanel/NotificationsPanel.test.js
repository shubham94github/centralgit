/**
 * @jest-environment jsdom
 */

import React from 'react';
import Enzyme, { mount } from 'enzyme';
import EnzymeAdapter from '@wojtekmaj/enzyme-adapter-react-17';
import configureStore from 'redux-mock-store';
import NotificationsPanel from './NotificationsPanel';
import { Provider } from 'react-redux';
import {
	emptyNotificationsMessage,
	mockedNotifications,
	titleOfNotifications,
} from './constants';

const mockStore = configureStore({});

Enzyme.configure({ adapter: new EnzymeAdapter() });

describe('NotificationsPanel component', () => {
	let store;

	beforeEach(() => {
		store = mockStore({
			notifications: {
				notificationsList: [],
				removeAllNotifications: jest.fn(),
				readAllNotifications: jest.fn(),
				isLoading: false,
				getMoreNotifications: jest.fn(),
				clearNotifications: jest.fn(),
			},
			auth: {
				user: { role: '' },
			},
		});

		store.dispatch = jest.fn();
	});

	it('Rendering without crashing', () => {
		const wrapper = mount(
			<Provider store={store}>
				<NotificationsPanel isShow={true}/>
			</Provider>,
		);

		expect(wrapper.exists()).toEqual(true);
		expect(wrapper.find('.p14.empty-notifications-message').text()).toEqual(emptyNotificationsMessage);
		expect(wrapper.find('.p14.bold-theme').text()).toEqual(titleOfNotifications);
	});

	it('Rendering with 5 notifications', () => {
		store = mockStore({
			notifications: {
				notificationsList: mockedNotifications,
				removeAllNotifications: jest.fn(),
				readAllNotifications: jest.fn(),
				isLoading: false,
				getMoreNotifications: jest.fn(),
				clearNotifications: jest.fn(),
			},
			auth: {
				user: { role: '' },
			},
		});

		window.HTMLElement.prototype.scrollIntoView = jest.fn();

		const wrapper = mount(
			<Provider store={store}>
				<NotificationsPanel isShow={true}/>
			</Provider>,
		);

		expect(wrapper.exists()).toEqual(true);
		expect(wrapper.find('.notification-item').length === mockedNotifications.length).toEqual(true);

		expect(wrapper.find('.green-notification').length === mockedNotifications
			.filter(notofication => !notofication.isRead).length).toEqual(true);

		wrapper.find('.notification-item .clickable').forEach(notification => {
			expect(notification.find('svg').exists()).toEqual(true);
		});
	});
});

