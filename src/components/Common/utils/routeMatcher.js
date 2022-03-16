import React from 'react';
import { Redirect } from 'react-router-dom';
import SignIn from '@components/Auth/SignIn';
import { Routes } from '@routes';

export const securedRouteMatch = isAuthenticated => {
	if (isAuthenticated) return <Redirect to={Routes.HOME}/>;

	return <SignIn/>;
};
