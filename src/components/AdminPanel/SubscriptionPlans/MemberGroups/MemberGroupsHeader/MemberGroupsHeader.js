import React, { memo } from 'react';
import { Icons } from '@icons';
import { colors } from '@colors';
import { P14 } from '@components/_shared/text';
import PrimaryButton from '@components/_shared/buttons/PrimaryButton';
import { func } from 'prop-types';
import { guidelinesText } from './constants';

import './MemberGroupsHeader.scss';

const infoIcon = Icons.infoIcon(colors.grass50);
const plusIcon = Icons.plus(colors.white);

const MemberGroupsHeader = ({ toggleModal }) => (
	<div className='member-groups-header'>
		<div className='guidelines'>
			{infoIcon}
			<P14>
				{guidelinesText}
			</P14>
		</div>
		<PrimaryButton onClick={toggleModal}>
			{plusIcon}
			Add new Group
		</PrimaryButton>
	</div>
);

MemberGroupsHeader.propTypes = {
	toggleModal: func.isRequired,
};

export default memo(MemberGroupsHeader);
