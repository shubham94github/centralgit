import React, { memo, useEffect } from 'react';
import { Route, Switch, useLocation } from 'react-router-dom';
import { connect } from 'react-redux';
import { Routes } from '@routes';
import HomeLayout from '@components/layouts/HomeLayout';
import SnackbarsContainer from '@components/_shared/SnackbarContainer';
import HomePage from '@components/HomePage';
import ProtectedRoute from './ProtectedRoute';
import Auth from '../Auth/Auth';
import MessagesPage from '@components/Messages/MessagesPage';
import ProfilePage from '@components/ProfilePage';
import Subscription from '@components/Subscription';
import BrowsePage from '@components/BrowsePage';
import AdminPanel from '@components/AdminPanel';
import News from '@components/News';
import { setUser, generateListOfPermissions } from '@ducks/auth/actions';
import { func, string } from 'prop-types';
import cn from 'classnames';
import PasswordRecovery from '@components/Auth/PasswordRecovery';
import Settings from '@components/Settings';
import { getItemFromStorage } from '@utils/storage';
import Mission from '@components/Mission';

function Home({ setUser, userRole, generateListOfPermissions }) {
	useEffect(() => {
		const localUser = getItemFromStorage('user');
		const userAvatar = getItemFromStorage('userAvatar');
		const companyAvatar = getItemFromStorage('companyAvatar');

		if (!!localUser) {
			setUser({ user: localUser, userAvatar, companyAvatar });
			generateListOfPermissions({ user: localUser });
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const location = useLocation();
	const isRetailerBackground = userRole && userRole.includes('RETAIL')
		&& location.pathname === Routes.AUTH.GETTING_STARTED.RETAIL_HUB_REGISTRATION_APPROVAL;
	const classes = cn('content-wrapper', { 'bg-retailer-stuffer': isRetailerBackground });

	return (
		<HomeLayout>
			<main className={classes}>
				<SnackbarsContainer/>
				<Switch>
					<Route
						path={Routes.AUTH.PASSWORD_RECOVERY.INDEX}
						component={PasswordRecovery}
					/>
					<Route
						path={Routes.AUTH.INDEX}
						component={Auth}
					/>
					<ProtectedRoute
						path={Routes.HOME}
						component={HomePage}
						exact
					/>
					<ProtectedRoute
						path={Routes.MISSION}
						component={Mission}
						exact
					/>
					<ProtectedRoute
						path={Routes.NEWS}
						component={News}
					/>
					<ProtectedRoute
						path={Routes.PROFILE}
						component={ProfilePage}
					/>
					<ProtectedRoute
						path={Routes.SUBSCRIPTION.INDEX}
						component={Subscription}
					/>
					<ProtectedRoute
						path={Routes.BROWSE_PAGE}
						component={BrowsePage}
					/>
					<ProtectedRoute
						path={Routes.MESSAGES.INDEX}
						component={MessagesPage}
					/>
					<ProtectedRoute
						path={Routes.ADMIN_PANEL.INDEX}
						component={AdminPanel}
					/>
					<ProtectedRoute
						path={Routes.SETTINGS.INDEX}
						component={Settings}
					/>
				</Switch>
			</main>
		</HomeLayout>
	);
}

Home.propTypes = {
	setUser: func,
	generateListOfPermissions: func,
	userRole: string,
};

const mapStateToProps = ({ auth }) => {
	const user = auth?.user || getItemFromStorage('user');
	return {
		userRole: user?.role,
	};
};

export default connect(mapStateToProps, { setUser, generateListOfPermissions })(memo(Home));
