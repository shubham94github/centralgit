import React from 'react';
import { string } from 'prop-types';

import './ConnectionStatus.scss';

function ConnectionStatus({ status }) {
	return (
		<div className={`connection-status ${ status === 'ONLINE' ? 'online' : 'offline'}`}/>
	);
}

ConnectionStatus.propTypes = {
	status: string,
};

export default ConnectionStatus;
