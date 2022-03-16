/**
 * @jest-environment jsdom
 */

import React from 'react';
import Enzyme, { mount } from 'enzyme';
import EnzymeAdapter from '@wojtekmaj/enzyme-adapter-react-17';
import SignUpMember from './SignUpMember';

Enzyme.configure({ adapter: new EnzymeAdapter() });

const defaultProps = {
	resetMemberSettings: jest.fn(),
	isCompanyType: false,
	isIndividuals: true,
	completedFormData: {},
	goBackToBusinessType: jest.fn(),
	handleSubmit: jest.fn(),
	listOfCompaniesOptions: [],
	retailerInfoForMember: {},
	setRetailerInfoForMember: jest.fn(),
	isLoadingSubmitForm: false,
	isMemberRegisterError: false,
	setIsMemberRegisterError: jest.fn(),
	setErrorType: jest.fn(),
};

const setup = (props={}) => {
	const setupProps = { ...defaultProps, ...props };

	return mount(
		<SignUpMember {...setupProps}/>,
	);
};

describe('SignUpCompany component for individuals', () => {
	let wrapper;

	beforeEach(() => {
		wrapper = setup(defaultProps);
	});

	it('Rendering without crashing', () => {
		expect(wrapper.exists()).toEqual(true);
	});

	it('Rendering text buttons', () => {
		const buttonNode = wrapper.find('.primary-button.light-theme');
		expect(buttonNode.length).toBe(2);

		const backButton = wrapper.find('.primary-button.light-theme.btn-outline-primary');
		expect(backButton.text()).toEqual('Back');

		const joinButton = wrapper.find('.primary-button.light-theme').at(1);
		expect(joinButton.text()).toEqual('Join');

		expect(wrapper.find('.primary-button.light-theme').get(1).props.disabled).toEqual(false);
	});

	it('On click join button and block Join button', () => {
		const select = wrapper.find('.select-container');
		const joinButton = wrapper.find('.primary-button.light-theme').at(1);
		expect(select.exists()).toEqual(false);

		joinButton.simulate('click');
		expect(wrapper.find('.select-container').exists()).toEqual(true);
		expect(wrapper.find('.primary-button.light-theme').get(1).props.disabled).toEqual(true);
	});
});

describe('SignUpCompany component for company type', () => {
	let wrapper;

	beforeEach(() => {
		wrapper = setup({
			isCompanyType: true,
			isIndividuals: false,
			isLoadingSubmitForm: true,
		});
	});

	it('Rendering without crashing', () => {
		expect(wrapper.exists()).toEqual(true);
	});

	it('Rendering text description', () => {
		const descriptionNote = wrapper.find('.p14');
		expect(descriptionNote.text().length).not.toBe(0);
	});

	it('Rendering buttons and block join button', () => {
		const buttonNode = wrapper.find('.primary-button.light-theme');
		expect(buttonNode.length).toBe(2);

		const joinButton = wrapper.find('.primary-button.light-theme').get(1);
		expect(joinButton.props.disabled).toEqual(true);
	});
});
