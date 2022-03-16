import enums from '@constants/enums';
import { bool, number, string } from 'prop-types';
import React  from 'react';
import { P16 } from '@components/_shared/text';
import { dateFormatCorrection } from '@utils';

import './CardsInfo.scss';

const DeleteConfirmContent = ({ brand, last4, isLastCard, nextPaymentDate }) => {
	const lastDate = dateFormatCorrection(new Date(nextPaymentDate), 'MMM d, yyyy');

	return (
		<div className='delete-confirm-content'>
			{isLastCard
				? <P16>
					Without payment, this account will be unavailable from {lastDate}.
				</P16>
				: <div className='card-number'>
					{enums.paymentCardLogos[brand]}
					&nbsp;
					{`xxxx xxxx xxxx ${last4}`}
				</div>
			}
		</div>
	);
};

DeleteConfirmContent.propTypes = {
	brand: string,
	last4: string,
	isLastCard: bool,
	nextPaymentDate: number,
};

export default DeleteConfirmContent;
