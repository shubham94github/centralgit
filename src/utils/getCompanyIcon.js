import React from 'react';
import { S12, S16 } from '@components/_shared/text';
import { getCompanyDefaultIconName } from '@utils';

export const getCompanyIcon = (avatar, name, color, isForTable = false) => {
	if (!avatar?.image && name && color) {
		const companyName = getCompanyDefaultIconName(name);

		return (
			<div
				className='icon-person'
				style={{
					background: color,
				}}
			>
				{isForTable
					? <S12 className='icon-person__text'>
						{companyName}
					</S12>
					: <S16 className='icon-person__text'>
						{companyName}
					</S16>
				}
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
