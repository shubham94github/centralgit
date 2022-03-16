import React, { memo } from 'react';

import './CheckSentEmail.scss';

function CheckSentEmail() {
	return (
		<div className='form-wrapper'>
			<div className='check-email-container'>
					Please check your email to set a new password.
			</div>
		</div>
	);
}

export default memo(CheckSentEmail);
