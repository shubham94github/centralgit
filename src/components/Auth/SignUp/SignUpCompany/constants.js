import { Icons } from '@icons';
import { colors } from '@colors';

const isCompanyOptions = [
	{
		text: 'Yes',
		value: 'true',
	},
	{
		text: 'No',
		value: 'false',
	},
];

const verificationEmailSuccess = 'The verification email was sent successfully';
const verificationEmailFail = 'The verification email sending is failed';
const chevronLeft = Icons.chevronLeft(colors.darkblue70);
const submitBtnText = 'Create an Account and continue';
const privacyPolicyText = 'I agree to the Retailhub’s Terms of Service, '
	+ 'Privacy Policy and Security Policy, including Cookie Use Policy.';
const couponNotExistTextError = 'The code you entered does not exist or has expired.';

export {
	isCompanyOptions,
	verificationEmailSuccess,
	verificationEmailFail,
	chevronLeft,
	submitBtnText,
	privacyPolicyText,
	couponNotExistTextError,
};
