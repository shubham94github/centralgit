import {
	MIN_INPUT_LENGTH,
	MAX_INPUT_LENGTH,
	MAX_TEXTAREA_LENGTH,
	MIN_TEXTAREA_LENGTH,
	MAX_NOTIFICATION_LENGTH,
	MIN_TEXTAREA_WORDS_LENGTH,
	MAX_TEXTAREA_WORDS_LENGTH,
	MIN_SOLUTIONS_TEXTAREA_WORDS_LENGTH,
	MAX_DESCRIPTION_LENGTH,
} from './validationConstants';

export const ERROR_MESSAGE_LENGTH = 'Must contain between 1 and 255 characters';
export const ERROR_MESSAGE_LENGTH_SIGN_UP = 'Text must be less than 255 characters';
export const PASSWORD_LENGTH = `The password must be between ${MIN_INPUT_LENGTH} and ${MAX_INPUT_LENGTH} characters`;
export const TEXTAREA_MAX_LENGTH_MESSAGE = `Text must be less than ${MAX_TEXTAREA_LENGTH} characters`;
export const TEXTAREA_MIN_LENGTH_MESSAGE = `Text must be more than ${MIN_TEXTAREA_LENGTH} characters`;
export const MAX_INPUT_LENGTH_MESSAGE = `Text must be less than ${MAX_INPUT_LENGTH} characters`;
export const MAX_TITLE_LENGTH_MESSAGE = `Title must be less than ${MAX_INPUT_LENGTH} characters`;
export const MAX_NOTIFICATION_MESSAGE = `Text must be less than ${MAX_NOTIFICATION_LENGTH} characters`;
export const MIN_INPUT_LENGTH_MESSAGE = `Text must be more than ${MIN_INPUT_LENGTH} characters`;
export const URL = 'Should be a valid url';
export const VALID_PHONE_NUMBER = 'Should be a valid phone number';
export const VALID_EMAIL = 'Please enter a valid email';
export const INPUT_ONLY_LETTERS_MESSAGE = 'The field must contain only letters';
export const TEXT_LINK_EMAIL_ERROR_MESSAGE = 'Company Description shouldn\'t contain links or e-mails';
export const MAX_NOTES_ERROR_MESSAGE = 'Text must be less than 255 characters';

export const getRequiredMessage = fieldName => {
	return `${fieldName} is a required field`;
};

export const getMinTextareaLengthErrMsg = name => `${name} must be more than ${MIN_TEXTAREA_LENGTH} characters`;
export const getMaxTextareaLengthErrMsg = (name, max) => `${name} must be less than ${max || MAX_TEXTAREA_LENGTH} characters`;
export const getMaxDescriptionLengthErrMsg = name => `The ${name} must be less than ${MAX_DESCRIPTION_LENGTH} characters`;

export const getMaxLengthErrMsg = length => `Text must be less than ${length} characters`;
export const getMinLengthErrMsg = (length, fieldName = 'text') => `The ${fieldName} must be more than ${length} characters.`;

export const getMinTextareaWordsLengthErrMsg = name => `${name} must be more than ${MIN_TEXTAREA_WORDS_LENGTH} words`;
export const getMaxTextareaWordsLengthErrMsg = name => `${name} must be less than ${MAX_TEXTAREA_WORDS_LENGTH} words`;

export const getMinSolutionsTextareaWordsLengthErrMsg = name => `${name} must be more than ${MIN_SOLUTIONS_TEXTAREA_WORDS_LENGTH} words`;
