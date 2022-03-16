import React from 'react';
import { bool, shape, string } from 'prop-types';
import { S16 } from '@components/_shared/text';
import { getUserDefaultIconName } from '@utils';
import ConnectionStatus from '@components/Messages/ConnectionStatus';

import './Avatar.scss';

function Avatar({ avatar: { image, color, firstName, lastName }, withInput, connectionStatus }) {
	const userName = getUserDefaultIconName(firstName, lastName);

	return (
		<label
			htmlFor='avatar'
			className='avatar-container'
		>
			{ !image
				&& <div
					className='avatar-shutter'
					style={ { backgroundColor: color } }
				>
					<S16>{userName}</S16>
				</div>
			}
			{
				!!image
				&& <img src={image} alt='avatar'/>
			}
			{ withInput
				&& <input
					style={ { display: 'none' } }
					id={ 'avatar' }
					type='file'
				/>
			}
			{ connectionStatus
				&& <ConnectionStatus status={connectionStatus}/>
			}
		</label>
	);
}

Avatar.defaultProps = {
	avatar: {},
	withInput: false,
};

Avatar.propTypes = {
	avatar: shape({
		image: string,
		firstName: string,
		lastName: string,
		color: string,
	}).isRequired,
	withInput: bool,
	connectionStatus: string,
};

export default Avatar;
