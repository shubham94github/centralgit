export const generateNavbarLinks = (isStartup, profileRole, idProfile, profile) => (
	[
		{
			id: 'companyDetails',
			name: `${isStartup ? 'Startup ' : ''}Company details`,
			path: `/admin-panel/profile/${profileRole}/${idProfile || profile.id}`,
			roles: ['startup', 'user'],
		},
		{
			id: 'accountInformation',
			name: 'Account information',
			path: `/admin-panel/profile/${profileRole}/${idProfile || profile.id}/account-info`,
			roles: ['startup', 'user'],
		},
		{
			id: 'billingDetails',
			name: 'Billing details',
			path: `/admin-panel/profile/${profileRole}/${idProfile || profile.id}/billing-details`,
			roles: ['user'],
		},
		{
			id: 'gallery',
			name: 'Gallery',
			path: `/admin-panel/profile/startup/${idProfile || profile.id}/gallery`,
			roles: ['startup'],
		},
		{
			id: 'rateAndFeedbacks',
			name: 'Rate and Feedback',
			path: `/admin-panel/profile/startup/${idProfile || profile.id}/feedbacks`,
			roles: ['startup'],
		},
		{
			id: 'internalInfo',
			name: 'Internal info',
			path: `/admin-panel/profile/startup/${idProfile || profile.id}/internal-info`,
			roles: ['startup'],
		},
		{
			id: 'companyMembers',
			name: 'Company Members',
			path: `/admin-panel/profile/${profileRole}/${idProfile || profile.id}/company-members`,
			roles: ['user'],
		},
		{
			id: 'bookmarksStartup',
			name: 'Bookmarks',
			path: `/admin-panel/profile/${profileRole}/${idProfile || profile.id}/bookmarks-startup`,
			roles: ['user'],
		},
		{
			id: 'ratedStartups',
			name: 'Rated',
			path: `/admin-panel/profile/${profileRole}/${idProfile || profile.id}/rated-startups`,
			roles: ['user'],
		},
	]
);
