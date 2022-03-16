import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { Routes } from '@routes';
import SetNewPassword from '@components/Auth/PasswordRecovery/SetNewPassword';
import EmailForm from '@components/Auth/PasswordRecovery/EmailForm';
import CheckSentEmail from '@components/Auth/PasswordRecovery/CheckSentEmail';
import PasswordWasChanged from '@components/Auth/PasswordRecovery/PasswordWasChanged';

function PasswordRecovery() {
	return (
		<div className='password-recovery-container'>
			<Switch>
				<Route
					path={Routes.AUTH.PASSWORD_RECOVERY.EMAIL_FORM}
					component={EmailForm}
					exact
				/>
				<Route
					path={Routes.AUTH.PASSWORD_RECOVERY.CHECK_SENT_EMAIL}
					component={CheckSentEmail}
					exact
				/>
				<Route
					path={Routes.AUTH.PASSWORD_RECOVERY.PASSWORD_WAS_CHANGED}
					component={PasswordWasChanged}
				/>

				<Route
					path={Routes.AUTH.PASSWORD_RECOVERY.INDEX}
					component={SetNewPassword}
				/>
			</Switch>
		</div>
	);
}

export default PasswordRecovery;
