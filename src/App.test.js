import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import EnzymeAdapter from '@wojtekmaj/enzyme-adapter-react-17';
import App from './App';

Enzyme.configure({ adapter: new EnzymeAdapter() });

test('Rendering without crashing', () => {
	const wrapper = shallow(<App/>);

	expect(wrapper.exists()).toEqual(true);
});
