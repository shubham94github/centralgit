import React, { memo } from 'react';
import { menuItems } from './utils';
import SideBarMenu from '@components/layouts/SideBarMenu';
import { connect } from 'react-redux';
import { bool } from 'prop-types';
import { Routes } from '@routes';
import { Redirect, Route, Switch } from 'react-router-dom';
import ProtectedRoute from '@components/Common/ProtectedRoute';
import AccountInfoHOC from '@components/Settings/AccountInfoSettings';
import CompanyInfo from '@components/Settings/CompanyInfoSettings';
import SectorsOfCompetenceHOC from '@components/Settings/SectorsOfCompetenceSettings';
import AreasOfInterestHOC from '@components/Settings/AreasOfInterestSettings';
import BillingDetailsHOC from '@components/Settings/BillingDetailsSettings';
import RelatedTagsHOC from '@components/Settings/RelatedTagsSettings';
import { userType } from '@constants/types';
import GalleryInfo from './GalleryInfo';
import CompanyMembersHOC from '@components/Settings/CompanyMembersSettings';
import MemberAccountInfoHOC from '@components/Settings/MemberAccountInfo';
import enums from '@constants/enums';
import { getItemFromStorage } from '@utils/storage';

import './Settings.scss';

const {
	userRoles: {
		member,
	},
} = enums;

const {
	INDEX,
	AREAS_OF_INTEREST,
	COMPANY_INFO,
	ACCOUNT_INFO,
	SECTORS_COMPETENCE,
	BILLING_DETAILS,
	RELATED_TAGS,
	GALLERY,
	COMPANY_MEMBERS,
} = Routes.SETTINGS;

const Settings = ({ user, isStartUp }) => {
	const isMember = user.role === member;
	const sideBarTitle = isStartUp
		? 'Startup Settings'
		: isMember
			? 'Members Settings'
			: 'Company Settings';
	const accountInfoComponent = isMember ? MemberAccountInfoHOC : AccountInfoHOC;

	return (
		<div className='settings-container'>
			<SideBarMenu
				menuItems={menuItems}
				userRole={user.role}
				title={sideBarTitle}
				isSettings={true}
			/>
			<div className='form-container'>
				<Switch>
					<Route
						path={INDEX}
						render={() => <Redirect to={ACCOUNT_INFO}/>}
						exact
					/>
					<ProtectedRoute path={ACCOUNT_INFO} component={accountInfoComponent}/>
					<ProtectedRoute path={COMPANY_INFO} component={CompanyInfo}/>
					<ProtectedRoute path={GALLERY} component={GalleryInfo}/>
					<ProtectedRoute path={SECTORS_COMPETENCE} component={SectorsOfCompetenceHOC}/>
					<ProtectedRoute path={AREAS_OF_INTEREST} component={AreasOfInterestHOC}/>
					<ProtectedRoute path={BILLING_DETAILS} component={BillingDetailsHOC}/>
					<ProtectedRoute path={RELATED_TAGS} component={RelatedTagsHOC}/>
					<ProtectedRoute path={COMPANY_MEMBERS} component={CompanyMembersHOC}/>
				</Switch>
			</div>
		</div>
	);
};

Settings.propTypes = {
	user: userType,
	isStartUp: bool,
};

export default connect(({ auth }) => {
	const user = auth.user || getItemFromStorage('user');

	return {
		user,
		isStartUp: user.role.includes('STARTUP'),
	};
}, null)(memo(Settings));
