import React, { memo } from 'react';
import SideBarMenu from '@components/layouts/SideBarMenu';
import { connect } from 'react-redux';
import { array, bool, object } from 'prop-types';
import { Redirect, Route, Switch, useLocation } from 'react-router-dom';
import ProtectedRoute from '@components/Common/ProtectedRoute';
import { Routes } from '@routes';
import Startups from './Startups';
import Retailers from './Retailers';
import Profile from '@components/AdminPanel/ProfileSection';
import cn from 'classnames';
import ManageCategories from '@components/AdminPanel/ManageCategories';
import RolesAndPermissions from '@components/AdminPanel/RolesAndPermissions';
import StartupAnalysis from '@components/AdminPanel/StartupAnalysis';
import Categories from '@components/AdminPanel/Activity/Categories';
import Profiles from '@components/AdminPanel/Activity/Profiles';
import RetailHubTeam from '@components/AdminPanel/RetailHubTeam';
import PlanTypes from '@components/AdminPanel/SubscriptionPlans/PlanTypes';
import { getItemFromStorage } from '@utils/storage';
import enums from '@constants/enums';
import Prices from '@components/AdminPanel/SubscriptionPlans/Prices';
import Features from '@components/AdminPanel/SubscriptionPlans/Features';
import SubscriptionPlansTab from '@components/AdminPanel/SubscriptionPlans/SubscriptionPlansTab';
import DiscountCoupons from '@components/AdminPanel/SubscriptionPlans/DiscountCoupons';
import Enterprise from '@components/AdminPanel/SubscriptionPlans/Enterprise';
import MemberGroups from '@components/AdminPanel/SubscriptionPlans/MemberGroups';

import './AdminPanel.scss';

const {
	INDEX,
	STARTUPS,
	STARTUP_ANALYSIS,
	RETAILERS,
	PROFILE,
	MANAGE_CATEGORIES,
	ROLES_AND_PERMISSIONS,
	CATEGORIES_ACTIVITY,
	PROFILES_ACTIVITY,
	RETAIL_HUB_TEAM,
	PLAN_TYPES,
	PRICES,
	FEATURES,
	SUBSCRIPTION_PLANS,
	DISCOUNT_COUPONS,
	ENTERPRISE,
	MEMBER_GROUPS,
} = Routes.ADMIN_PANEL;

const { superAdmin } = enums.userRoles;

const AdminPanel = ({ user, menuItems, isCategoryViewPermission, isStartupAnalysisPermission }) => {
	const location = useLocation();
	const isFullSizeWrapper = !location.pathname.includes('profile') || location.pathname.includes('profiles');
	const classes = cn('admin-panel-section', { 'max-width': !isFullSizeWrapper });
	const isSuperAdmin = user.role === superAdmin;

	return (
		<div className='admin-panel-container'>
			<SideBarMenu
				menuItems={menuItems}
				userRole={user.role}
				title='Admin Panel'
				isExpandableItems={true}
			/>
			<section className={classes}>
				<Switch>
					<Route
						path={INDEX}
						render={() => <Redirect
							to={STARTUPS}
						/>}
						exact
					/>
					<ProtectedRoute path={STARTUPS} component={Startups}/>
					{isStartupAnalysisPermission
						&& <ProtectedRoute path={STARTUP_ANALYSIS} component={StartupAnalysis}/>
					}
					<ProtectedRoute path={RETAILERS} component={Retailers}/>
					{isCategoryViewPermission
						&& <ProtectedRoute path={MANAGE_CATEGORIES} component={ManageCategories}/>
					}
					<ProtectedRoute path={PROFILE.INDEX} component={Profile}/>
					{isSuperAdmin
						&& <>
							<ProtectedRoute path={ROLES_AND_PERMISSIONS} component={RolesAndPermissions}/>
							<ProtectedRoute path={CATEGORIES_ACTIVITY} component={Categories}/>
							<ProtectedRoute path={PROFILES_ACTIVITY} component={Profiles}/>
							<ProtectedRoute path={RETAIL_HUB_TEAM} component={RetailHubTeam}/>
							<ProtectedRoute path={PLAN_TYPES} component={PlanTypes}/>
							<ProtectedRoute path={PRICES} component={Prices}/>
							<ProtectedRoute path={FEATURES} component={Features}/>
							<ProtectedRoute path={SUBSCRIPTION_PLANS} component={SubscriptionPlansTab}/>
							<ProtectedRoute path={DISCOUNT_COUPONS} component={DiscountCoupons}/>
							<ProtectedRoute path={ENTERPRISE} component={Enterprise}/>
							<ProtectedRoute path={MEMBER_GROUPS} component={MemberGroups}/>
						</>
					}
				</Switch>
			</section>
		</div>
	);
};

AdminPanel.propTypes = {
	user: object.isRequired,
	menuItems: array.isRequired,
	isCategoryViewPermission: bool,
	isStartupAnalysisPermission: bool,
};

export default connect(({ auth, admin }) => {
	const { user, listOfPermissions } = auth;
	const { menuItems } = admin;

	return {
		user: user || getItemFromStorage('user'),
		menuItems,
		isCategoryViewPermission: listOfPermissions?.isCategoryViewPermission,
		isStartupAnalysisPermission: listOfPermissions?.isStartupAnalysisPermission,
	};
}, null)(memo(AdminPanel));
