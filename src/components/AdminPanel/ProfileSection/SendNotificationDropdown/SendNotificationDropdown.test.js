/**
 * @jest-environment jsdom
 */

import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { SendNotificationDropdown } from './SendNotificationDropdown';

const recipientId = 1;
const testMessageText = 'www   ';
const textAreaPlaceholder = 'Add a message';
const sendBtnText = 'Send';
const buttonSelector = { selector: 'button' };
const mockSendNotification = jest.fn(() => {
	return Promise.resolve();
});

const props = {
	isAdminNotificationSending: false,
	sendAdminNotification: mockSendNotification,
	recipientId,
	onClose: jest.fn(),
};

describe('SendNotificationDropdown component UI', () => {
	beforeEach(() => {
		render(<SendNotificationDropdown {...props}/>);
	});

	it('Rendering with textarea and button', async () => {
		const textarea = screen.getByPlaceholderText(textAreaPlaceholder);
		const button = screen.getByText(sendBtnText, buttonSelector);

		expect(await textarea).toBeTruthy();
		expect(await button).toBeDisabled();

		fireEvent.change(await textarea, { target: { value: '    ' } });

		expect(await button).toBeDisabled();

		fireEvent.change(await textarea, { target: {
			value: testMessageText,
		} });
	});
});
