import { configure } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { getCompanyDefaultIconName, getUserDefaultIconName } from '@utils';
import incrementNameCount from '@utils/incrementNameCount';

configure({ adapter: new Adapter() });

describe('Utils/index.js: getCompanyDefaultIconName', () => {
	test('(3 words) First letters of the first two words of the company name - if the name longer then 1 word', () => {
		expect(getCompanyDefaultIconName('short name test')).toBe('SN');
	});

	test('(1 word) First and Last letter from the name - if the the company name is one word.', () => {
		expect(getCompanyDefaultIconName('shortName')).toBe('SE');
	});

	test('Should be uppercase and trim (3 words)', () => {
		expect(getCompanyDefaultIconName('   short name test   ')).toBe('SN');
	});

	test('Should be uppercase and trim (1 word)', () => {
		expect(getCompanyDefaultIconName('   shortName   ')).toBe('SE');
	});

	test('Without special characters, but with numbers', () => {
		expect(getCompanyDefaultIconName('&#,+|@!_-–—()$~%.\'":*?<>{}[]/|/\\;`~=№auyuui1'))
			.toBe('A1');
	});

	test('With space around special characters', () => {
		expect(getCompanyDefaultIconName('B & B'))
			.toBe('BB');
	});
});

describe('Utils/index.js: getUserDefaultIconName', () => {
	test('Should be uppercase', () => {
		expect(getUserDefaultIconName('firstname', 'lastname')).toBe('FL');
	});

	test('Should be trim', () => {
		expect(getUserDefaultIconName('   firstname   ', '   lastname   ')).toBe('FL');
	});

	test('Double names', () => {
		expect(getUserDefaultIconName('firstname secondFirstname', 'lastname secondLastname')).toBe('FL');
	});

	test('Without special characters and numbers', () => {
		expect(getUserDefaultIconName('&#,+|@!_-–—()$~%.\'":*?<>{}[]/|/\\123;`~=№a', '999lastname')).toBe('AL');
	});
});

describe('Utils/incrementNameCount', () => {
	test('Should return name(1)', () => {
		expect(incrementNameCount('name', ['name'])).toBe('name(1)');
	});

	test('Should return name(2)', () => {
		expect(incrementNameCount('name', ['name', 'name(1)'])).toBe('name(3)');
	});

	test('Should return name(2)', () => {
		expect(incrementNameCount('name', ['name', 'name(1)', 'www', 'name(1)(2)'])).toBe('name(4)');
	});
});
