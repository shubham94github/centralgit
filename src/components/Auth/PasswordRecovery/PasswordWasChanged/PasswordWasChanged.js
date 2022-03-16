import React, { useEffect, useState } from 'react';
import { Routes } from '@routes';
import { P16, S16 } from '@components/_shared/text';
import { Link, Redirect } from 'react-router-dom';
import { Spinner } from 'react-bootstrap';
import { Icons } from '@icons';

import './PasswordWasChanged.scss';

const timeout = 5000;

const PasswordWasChanged = () => {
	const [isRedirect, setIsRedirect] = useState(false);
	const checkPasswordUpdatedIcon = Icons.checkPasswordUpdatedIcon();

	useEffect(() => {
		setTimeout(() => {
			setIsRedirect(true);
		}, timeout);
	}, []);

	return isRedirect
		? <Redirect to={Routes.AUTH.SIGN_IN}/>
		: (
			<div className='password-was-changed-shutter'>
				<div className='form-wrapper'>
					<div className='pb-2 d-flex justify-content-center align-items-center'>
						{checkPasswordUpdatedIcon}
					</div>
					<P16 className='text-center pb-2' bold>Password Updated!</P16>
					<P16>
						<S16>Your password has been changed successfully.
							<br/>
							Use your new password to </S16>
						<Link to={Routes.AUTH.SIGN_IN}>
							<S16 className='blue-link'>log in</S16>
						</Link>.
					</P16>
					<div className='spinner'>
						<Spinner
							animation='border'
							variant='danger'
							className='spinner-border-xxs'
							size='xxs'
						/>
					</div>
				</div>
			</div>
		);
};

export default PasswordWasChanged;
