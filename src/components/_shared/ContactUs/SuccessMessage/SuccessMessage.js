import React, { memo } from 'react';
import { P14 } from '@components/_shared/text';

import './SuccessMessage.scss';

const SuccessMessage = () => (
	<P14 className='text-center success-message'>
		Thank you,
		<br/>
		Our support team will get straight back to you.
	</P14>
);

export default memo(SuccessMessage);
