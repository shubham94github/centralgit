import { Routes } from '@routes';
import enums from '@constants/enums';

const {
	ADMIN_PANEL: {
		STARTUPS,
		RETAILERS,
		MANAGE_CATEGORIES,
		ROLES_AND_PERMISSIONS,
		STARTUP_ANALYSIS,
		CATEGORIES_ACTIVITY,
		PROFILES_ACTIVITY,
		RETAIL_HUB_TEAM,
		SUBSCRIPTION_PLANS,
		PLAN_TYPES,
		PRICES,
		FEATURES,
		DISCOUNT_COUPONS,
		ENTERPRISE,
		MEMBER_GROUPS,
	},
} = Routes;

const {
	userRoles: {
		admin,
		superAdmin,
	},
} = enums;

export const enterpriseItem = {
	mainTitle: 'Manage Subscription Plans',
	isExpanded: true,
	items: [
		{
			title: 'Plans types',
			route: PLAN_TYPES,
			isHidden: false,
		},
		{
			title: 'Prices',
			route: PRICES,
			isHidden: false,
		},
		{
			title: 'Features',
			route: FEATURES,
			isHidden: false,
		},
		{
			title: 'Payment plans',
			route: SUBSCRIPTION_PLANS,
			isHidden: false,
		},
		{
			title: 'Discount coupons',
			route: DISCOUNT_COUPONS,
			isHidden: false,
		},
		{
			title: 'Enterprise',
			route: ENTERPRISE,
			isHidden: false,
		},
		{
			title: 'Member Groups',
			route: MEMBER_GROUPS,
			isHidden: false,
		},
	],
	roles: [
		admin,
		superAdmin,
	],
};

export const sideMenuItems = [
	{
		mainTitle: 'Startup Companies',
		isExpanded: true,
		items: [
			{
				title: 'Startup list',
				route: STARTUPS,
				isHidden: false,
				profileRoute: 'profile/startup',
			},
			{
				title: 'Startup Analysis',
				route: STARTUP_ANALYSIS,
				isHidden: false,
			},
		],
		roles: [
			admin,
			superAdmin,
		],
	},
	{
		mainTitle: 'User Companies',
		isExpanded: true,
		items: [
			{
				title: 'User list',
				route: RETAILERS,
				isHidden: false,
				profileRoute: 'profile/user',
			},
		],
		roles: [
			admin,
			superAdmin,
		],
	},
	{
		mainTitle: 'Categories',
		isExpanded: true,
		items: [
			{
				title: 'Manage categories',
				route: MANAGE_CATEGORIES,
				isHidden: false,
			},
		],
		roles: [
			admin,
			superAdmin,
		],
	},
	{
		mainTitle: 'Admin Panel Access',
		isExpanded: true,
		items: [
			{
				title: 'Roles and Permissions',
				route: ROLES_AND_PERMISSIONS,
				isHidden: false,
			},
			{
				title: 'RetailHub Team',
				route: RETAIL_HUB_TEAM,
				isHidden: false,
			},
		],
		roles: [
			superAdmin,
		],
	},
	{
		mainTitle: 'Activity log',
		isExpanded: true,
		items: [
			{
				title: 'Categories',
				route: CATEGORIES_ACTIVITY,
				isHidden: false,
			},
			{
				title: 'Profile',
				route: PROFILES_ACTIVITY,
				isHidden: false,
			},
		],
		roles: [
			superAdmin,
		],
	},
	enterpriseItem,
];
