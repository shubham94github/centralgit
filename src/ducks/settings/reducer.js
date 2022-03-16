import { Record } from 'immutable';
import {
	CLEAR_SETTINGS_STORE,
	SET_IS_LOADING,
	SET_MEMBERS,
} from './index';

const InitialState = Record({
	isLoading: false,
	members: [],
});

const settingsReducer = (state = new InitialState(), action) => {
	const { type, payload } = action;

	switch (type) {
		case SET_IS_LOADING:
			return state.set('isLoading', payload.isLoading);

		case SET_MEMBERS:
			return state.set('members', payload.members);

		case CLEAR_SETTINGS_STORE:
			return new InitialState();

		default: return state;
	}
};

export default settingsReducer;
