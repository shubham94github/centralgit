import React from 'react';

import './PasswordHint.scss';

const PasswordHint = () => (
	<div className='hint-wrapper'>
		<p className='hint-category'>
			The password must be between 8 and
			<br/>
			255 characters and contain:
		</p>
		<p className='hint-item'>Uppercase letter</p>
		<p className='hint-item'>Lowercase letter</p>
		<p className='hint-item'>Digit (0-9)</p>
		<p className='hint-item'>Special character</p>
	</div>
);

export default PasswordHint;
