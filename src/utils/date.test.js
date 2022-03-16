import { configure } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { dateFormattingWithSlash, dateFormattingWithTime, fullDateFormatting } from './date';

configure({ adapter: new Adapter() });

describe('utils/date.js: dateFormattingWithSlash', () => {
	test('Shout return correct date from timestamp: \'07/06/2021\'', () => {
		expect(dateFormattingWithSlash((new Date(1625567115463).toUTCString()))).toBe('07/06/2021');
	});

	test('Shout return correct date from new Date(): \'07/06/2021\'', () => {
		expect(dateFormattingWithSlash(new Date('07/06/2021'))).toBe('07/06/2021');
	});
});

describe('utils/date.js: dateFormattingWithTime', () => {
	test('Shout return correct date from new Date(): \'7 Jun 2021 12:00 AM\'', () => {
		expect(dateFormattingWithTime(new Date('06/07/2021'))).toBe('7 Jun 2021 12:00 AM');
	});
});

describe('utils/date.js: fullDateFormatting', () => {
	test('Shout return correct date from new Date(): \'7 Jun 2021\'', () => {
		expect(fullDateFormatting(new Date('06/07/2021'))).toBe('7 Jun 2021');
	});
});
