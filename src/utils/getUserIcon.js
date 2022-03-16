import React from 'react';
import { S16 } from '@components/_shared/text';
import { getUserDefaultIconName } from '@utils';
import { colors } from '@colors';

export const getUserIcon = (avatar, color = colors.orange40, firstName, lastName) => {
	if (!avatar?.image && firstName && lastName && color) {
		const userName = getUserDefaultIconName(firstName, lastName);

		return (
			<div
				className='icon-person'
				style={{
					background: color,
				}}
			>
				<S16 className='icon-person__text'>
					{userName}
				</S16>
			</div>
		);
	}

	return (
		<div className='icon-person'>
			<img
				className='user-avatar'
				src={avatar?.image}
				alt='user-avatar'
			/>
		</div>
	);
};
