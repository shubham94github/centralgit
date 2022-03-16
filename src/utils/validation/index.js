import { replaceAll } from '../js-helpers';
import {
	MAX_TEXTAREA_LENGTH,
	MIN_INPUT_LENGTH,
	MIN_TEXTAREA_LENGTH,
	MIN_TEXTAREA_WORDS_LENGTH,
	MAX_TEXTAREA_WORDS_LENGTH,
	MIN_SOLUTIONS_TEXTAREA_WORDS_LENGTH,
	MIN_DESCRIPTION_LENGTH,
	MAX_DESCRIPTION_LENGTH,
	MIN_NOTES_LENGTH,
} from '@constants/validationConstants';
import { replaceHtmlTags, replaceTagBr, replaceTagP } from '@utils/replaceHtmlTags';
import { markDownToText } from '@utils';
import parsePhoneNumber from 'libphonenumber-js';

const acceptedCreditCards = {
	visa: /^4[0-9]{12}(?:[0-9]{3})?$/,
	mastercard: /^5[1-5][0-9]{14}$|^2(?:2(?:2[1-9]|[3-9][0-9])|[3-6][0-9][0-9]|7(?:[01][0-9]|20))[0-9]{12}$/,
	amex: /^3[47][0-9]{13}$/,
	discover: /^65[4-9][0-9]{13}|64[4-9][0-9]{13}|6011[0-9]{12}|(622(?:12[6-9]|1[3-9][0-9]|[2-8][0-9][0-9]|9[01][0-9]|92[0-5])[0-9]{10})$/,
	dinersClub: /^3(?:0[0-5]|[68][0-9])[0-9]{11}$/,
	jcb: /^(?:2131|1800|35[0-9]{3})[0-9]{11}$/,
};

export const validateCreditCardNumber = value => {
	const { visa, mastercard, amex, discover, dinersClub, jcb } = acceptedCreditCards;
	const formatterValue = replaceAll(replaceAll(value, '_', ''), ' ', '');

	switch (true) {
		case !!visa.test(formatterValue):
			return true;
		case !!mastercard.test(formatterValue):
			return true;
		case !!amex.test(formatterValue):
			return true;
		case !!discover.test(formatterValue):
			return true;
		case !!dinersClub.test(formatterValue):
			return true;
		case !!jcb.test(formatterValue):
			return true;
		default:
			return false;
	}
};

export const validateExpirationDate = value => {
	try {
		const regExp = /^(0[1-9]|1[0-2])\/?([0-9]{4}|[0-9]{2})$/;
		const formatterValue = replaceAll(replaceAll(value, '_', ''), ' ', '');
		const month = formatterValue.split('/')[0].trim();
		const year = formatterValue.split('/')[1].trim();
		const isValidMonth = /^(0?[1-9]|1[012])$/.test(month);
		const isValidYear = (2000 + +year) >= new Date().getFullYear();

		if (!isValidMonth || !isValidYear) return false;

		const expirationDate = new Date(`${month}/01/${year}`);
		const isFutureDate = expirationDate.getTime() - Date.now() > 0;

		return regExp.test(formatterValue) && isFutureDate;
	} catch {
		return false;
	}
};

export const validateSecretCode = value => {
	const regExp = /[0-9]{3}/;

	return regExp.test(value);
};

export const validatePhoneNumber = value => {
	if (!value) return true;

	const parsedPhone = parsePhoneNumber(value);

	return !!parsedPhone?.isValid();
};

export const validateEmailDomain = string => {
	const reg = new RegExp(/[a-zA-Z0-9]+\.[A-Za-z]+$/);

	return reg.test(string);
};

export const checkPasswordRules = password => {
	const passwordRules = [
		{ message: 'Please use at least one lowercase letter', regex: /[a-z]+/ },
		{ message: 'Please use at least one uppercase letter', regex: /[A-Z]+/ },
		{ message: `The password length must be at least ${MIN_INPUT_LENGTH}`, regex: /.{8,}/ },
		{ message: 'Please use at least one digit', regex: /[0-9]+/ },
		{ message: 'Please use at least one sign', regex: /(?=.*\W)/ },
	];

	const isCyrillicSymbolExist = /[а-яА-ЯЁё]+/g.test(password);
	const brokenRule = passwordRules.find(rule => !rule.regex.test(password));

	return isCyrillicSymbolExist
		? {
			isValid: false,
			message: 'Please use only Latin letters',
		}
		: {
			isValid: !brokenRule,
			message: brokenRule?.message,
		};
};

export function validatePassword(fieldName) {
	return function (value) {
		if (!value?.length) return { isValid: true };

		const { message, isValid } = checkPasswordRules(value);

		return isValid
			? isValid
			: this.createError({
				message,
				path: fieldName,
			});
	};
}

export const validateStringIsInteger = value => {
	const regExp = /^(0|[1-9]\d*)$/;

	return regExp.test(value);
};

export const validateStringIsIntegerOrEmpty = value => {
	const regExp = /^(0|[1-9]|\d*)$/;

	return regExp.test(value) || value === '';
};

export const validateTextByLinksAndEmails = value => {
	// eslint-disable-next-line
	const emailRegex = new RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/);
	// eslint-disable-next-line
	const urlRegex = new RegExp(/(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/);

	return !urlRegex.test(value) && !emailRegex.test(value);
};

export const validateLetters = value => /^([a-zA-Z\s]*)$/.test(value);

export const validateMaxCountPercentOff = value => +value <= 100;

export const validateCompanyName = name => {
	if (name === '') return true;

	const regex = {
		oneLetterAndOneDigit: /^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)/,
		atLeastTwoLetters: /^[a-zA-Z0-9_.+-/&]*(?:[a-zA-Z][a-zA-Z0-9_.+-/&]*){2,}/,
	};

	return regex.oneLetterAndOneDigit.test(name) || regex.atLeastTwoLetters.test(name);
};

export const validateRequiredEditableTextarea = value => {
	const text = replaceHtmlTags(value);

	return !!text.trim();
};

export const validateDescriptionAndSolutionMax = value => {
	const text = markDownToText(value);

	return text.length <= MAX_TEXTAREA_LENGTH;
};

export const validateDescriptionAndSolutionMin = value => {
	const text = markDownToText(value);

	return text.length > MIN_TEXTAREA_LENGTH;
};

export const validateCompanyDescriptionMaxOrEmpty = value => {
	const text = markDownToText(value);

	return text.length <= MAX_TEXTAREA_LENGTH || !text.trim().length;
};

export const validateUserCompanyDescriptionMaxOrEmpty = value => {
	const text = markDownToText(value);

	return text.length <= MAX_DESCRIPTION_LENGTH || !text.trim().length;
};

export const validateUserCompanyDescriptionMinOrEmpty = value => {
	const text = replaceHtmlTags(value);

	return text.length > MIN_DESCRIPTION_LENGTH || !text.trim().length;
};

export const validateOnlyLetters = value => {
	if (value === '') return true;

	const regExp = /^[a-zA-Z ]+$/;

	return regExp.test(value);
};

export const validateOnlyLettersOrEmpty = value => {
	const regExp = /^[a-zA-Z ]+$/;

	return regExp.test(value) || value === '';
};

export const validateUrls = url => {
	if (url === '') return true;

	const regExp = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi;

	return regExp.test(url);
};

export const validateUrlsOrEmpty = url => {
	const regExp = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi;

	return regExp.test(url) || url === '';
};

export const validateTextareaMaxOrEmpty = maxLength => value => {
	const clearedValue = replaceHtmlTags(replaceTagP(replaceTagBr(value))).trim();

	return clearedValue.length <= maxLength || !value.trim().length;
};

export const validateTextareaMinOrEmpty = minLength => value => {
	const clearedValue = replaceHtmlTags(replaceTagP(replaceTagBr(value))).trim();

	return clearedValue.length >= minLength || !clearedValue.trim().length;
};

export const withoutLettersAndSymbolsRegExp = /([.,\-*?^=!:${}()~'№”"<>#@;%_&`|[\]/\\a-zA-Z])/g;

export const withoutDigitsAndSymbolsRegExp = /([.,\-*?^=!:${}()~'№”"<>#@;%_&`|[\]/\\0-9])/g;

export const validateMinWordsLength = value => {
	const text = markDownToText(value);
	const textArray = text.split(' ');

	return textArray.length > MIN_TEXTAREA_WORDS_LENGTH;
};

export const validateMinSolutionsWordsLength = value => {
	const text = markDownToText(value);
	const textArray = text.split(' ');

	return textArray.length > MIN_SOLUTIONS_TEXTAREA_WORDS_LENGTH;
};

export const validateMaxWordsLength = value => {
	const text = markDownToText(value);
	const textArray = text.split(' ');

	return textArray.length < MAX_TEXTAREA_WORDS_LENGTH;
};

export const validateRequiredArrayValue = value => !!value?.length;

export const validateMinTextAreaLengthOrEmpty = text => {
	if (text === '') return true;

	return text.length >= MIN_NOTES_LENGTH;
};

export const validateHtmlTextByMaxLength = maxLength => value => {
	const clearedValue = replaceHtmlTags(replaceTagP(replaceTagBr(value))).trim();

	return clearedValue.length <= maxLength;
};

export const validateHtmlTextByMinLength = minLength => value => {
	const clearedValue = replaceHtmlTags(replaceTagP(replaceTagBr(value))).trim();

	return clearedValue.length >= minLength;
};

export const validateAmount = value => value[0] !== '.' && value[value.length - 1] !== '.';
