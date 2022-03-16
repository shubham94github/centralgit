import { configure } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { validateStringIsInteger } from '@utils/validation/index';

configure({ adapter: new Adapter() });

test('Positive number', () => {
	expect(validateStringIsInteger('10')).toBe(true);
});

test('Negative number', () => {
	expect(validateStringIsInteger('-10')).toBe(false);
});

test('Number starting with zero', () => {
	expect(validateStringIsInteger('001')).toBe(false);
});

test('Not a number', () => {
	expect(validateStringIsInteger('10&01')).toBe(false);
});

test('Non-decimal notation systems', () => {
	expect(validateStringIsInteger('D6C26')).toBe(false);
});

test('Fractional numbers', () => {
	expect(validateStringIsInteger('8,5')).toBe(false);
});

test('Zero', () => {
	expect(validateStringIsInteger('0')).toBe(true);
});

test('Double zero', () => {
	expect(validateStringIsInteger('00')).toBe(false);
});
