import React from 'react';
import PlansTypesTable from './PlansTypesTable';
import UserTypesAndPlansAssociationTable from './UserTypesAndPlansAssociationTable';
import { P16, P14 } from '@components/_shared/text';
import { colors } from '@colors';
import { Icons } from '@icons';
import { guidelinesText } from './constants';

import '../SubscriptionPlans.scss';

const infoIcon = Icons.infoIcon(colors.grass50);

const PlanTypes = () => (
	<div className='subscription-plans-container'>
		<P16
			bold
			className='table-title'
		>
			Subscription Plan types
		</P16>
		<PlansTypesTable/>
		<P16
			bold
			className='table-title'
		>
			User Types and Plans Association
		</P16>
		<div className='guidelines'>
			{infoIcon}
			<P14>
				{guidelinesText}
			</P14>
		</div>
		<UserTypesAndPlansAssociationTable/>
	</div>
);

export default PlanTypes;
