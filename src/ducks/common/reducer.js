import { Record } from 'immutable';
import {
	SET_COUNTRIES,
	SET_PAYMENT_PLANS,
	SET_CATEGORIES,
	SET_ALL_TAGS,
	CLEAR_COMMON_STORE,
	SET_SNACKBAR,
	SET_DEPARTMENTS,
	SET_POSITIONS,
	SET_PLATFORM_PARTNERS,
	SET_TRIAL,
	SET_IS_LOADING,
	SET_STARTUPS_OPTIONS,
	SET_PAYMENT_PLANS_FOR_COUPONS,
} from './index';

const InitialState = Record({
	countries: [],
	isLoading: false,
	categories: [],
	paymentPlans: [],
	plansFeatures: [],
	tags: [],
	snackbars: [],
	departments: [],
	positions: [],
	platformPartners: [],
	trialData: null,
	startupsOptions: [],
	paymentPlansForCoupons: [],
});

const commonReducer = (state = new InitialState(), { type, payload }) => {
	switch (type) {
		case SET_COUNTRIES:
			return state.set('countries', payload.countries);

		case SET_CATEGORIES:
			return state.set('categories', payload.categories);

		case SET_IS_LOADING:
			return state.set('isLoading', payload.isLoading);

		case SET_PAYMENT_PLANS: {
			return state.merge({
				paymentPlans: payload.paymentPlans,
				plansFeatures: payload.plansFeatures,
			});
		}

		case SET_ALL_TAGS:
			return state.set('tags', payload.tags);

		case CLEAR_COMMON_STORE:
			return new InitialState();

		case SET_SNACKBAR:
			return state.set('snackbars', payload.snackbars);

		case SET_DEPARTMENTS:
			return state.set('departments', payload.departments);

		case SET_POSITIONS:
			return state.set('positions', payload.positions);

		case SET_PLATFORM_PARTNERS:
			return state.set('platformPartners', payload.platformPartners);

		case SET_TRIAL:
			return state.set('trialData', payload.trialData);

		case SET_STARTUPS_OPTIONS:
			return state.set('startupsOptions', payload.startupsOptions);

		case SET_PAYMENT_PLANS_FOR_COUPONS:
			return state.set('paymentPlansForCoupons', payload.paymentPlansForCoupons);

		default:
			return state;
	}
};

export default commonReducer;
