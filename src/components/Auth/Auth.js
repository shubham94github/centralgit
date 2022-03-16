import React, { memo, useEffect } from 'react';
import { Redirect, Route, Switch, useLocation, useHistory } from 'react-router-dom';
import { Routes } from '@routes';
import SignIn from '@components/Auth/SignIn';
import GettingStarted from '@components/Auth/GettingStarted';
import SignUp from '@components/Auth/SignUp/SignUp';
import ChooseYourPlan from '@components/Auth/ChooseYourPlan/ChooseYourPlan';
import AddRetailCompany from '@components/Auth/AddRetailCompany';
import ProtectedRoute from '@components/Common/ProtectedRoute';
import EmailForm from '@components/Auth/PasswordRecovery/EmailForm';
import TwoFa from '@components/Auth/TwoFa';

import './Auth.scss';

function Auth() {
	const location = useLocation();
	const history = useHistory();

	useEffect(() => {
		if (
			location.pathname === Routes.AUTH.PASSWORD_RECOVERY.EMAIL_FORM
			|| location.pathname === Routes.AUTH.GETTING_STARTED.INDEX
			|| location.pathname === Routes.AUTH.INDEX
			|| location.pathname === Routes.AUTH.SIGN_IN
			|| location.pathname === Routes.AUTH.SIGN_UP.INDEX
			|| location.pathname === Routes.AUTH.SIGN_UP.CHOOSE_YOUR_PLAN
			|| location.pathname === Routes.AUTH.SIGN_UP.RETAIL_BILLING_DETAILS
			|| location.pathname === Routes.AUTH.TWO_FA
		)
			history.push(location.pathname);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<Switch>
			<Route path={Routes.AUTH.PASSWORD_RECOVERY.EMAIL_FORM} component={EmailForm}/>
			<ProtectedRoute
				path={Routes.AUTH.GETTING_STARTED.INDEX}
				component={GettingStarted}
			/>
			<Route path={Routes.AUTH.SIGN_IN} component={SignIn}/>
			<Route
				path={Routes.AUTH.SIGN_UP.INDEX}
				component={SignUp}
			/>
			<Route path={Routes.AUTH.SIGN_UP.CHOOSE_YOUR_PLAN} component={ChooseYourPlan}/>
			<Route path={Routes.AUTH.SIGN_UP.RETAIL_BILLING_DETAILS} component={AddRetailCompany}/>
			<Route
				path={Routes.AUTH.SIGN_UP.INDEX}
				component={SignUp}
				exact
			/>
			<Route
				path={Routes.AUTH.TWO_FA}
				component={TwoFa}
			/>
			<Route
				path={Routes.AUTH.INDEX}
				render={() => <Redirect to={Routes.AUTH.SIGN_IN}/>}
				exact
			/>
		</Switch>
	);
}

export default memo(Auth);
