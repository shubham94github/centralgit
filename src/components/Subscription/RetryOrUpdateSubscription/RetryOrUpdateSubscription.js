import React, { memo, useEffect } from 'react';
import { P16, P14 } from '@components/_shared/text';
import PrimaryButton from '@components/_shared/buttons/PrimaryButton';
import { useHistory } from 'react-router-dom';
import { Routes } from '@routes';
import { connect } from 'react-redux';
import { getCardInfo, retryPayment } from '@ducks/auth/actions';
import { bool, func, object, string } from 'prop-types';
import { getItemFromStorage } from '@utils/storage';

import './RetryOrUpdateSubscription.scss';

const RetryOrUpdateSubscription = ({
	getCardInfo,
	customerId,
	retryPayment,
	isLoading,
	cardInfo,
	stripeSubscriptionId,
	isMember,
}) => {
	const history = useHistory();

	const update = () => history.push(Routes.SUBSCRIPTION.UPDATE_CARD);
	const retry = () => retryPayment(stripeSubscriptionId);

	useEffect(() => {
		if (customerId) getCardInfo(customerId);
	}, [customerId, getCardInfo]);

	return (
		<section className='retry-subscription-section'>
			<div className='retry-subscription-container'>
				<P16
					className='label'
					bold
				>
					Your account is on hold. <span>{isMember && 'Retry your payment?'}</span>
				</P16>
				{cardInfo
					? <P14 className='description'>
						We couldn’t process your last payment.
						Retry ({cardInfo?.brand?.toUpperCase()} - {cardInfo?.last4})
						or update your payment info to keep using RetailHub.
					</P14>
					: <P14 className='description'>
						{isMember
							? 'Please update your payment info to keep using RetailHub.'
							: 'Please contact your company manager.'
						}
					</P14>
				}
				{!isMember
					&& <div className='retry-subscription-actions'>
						<PrimaryButton
							text='Update your info'
							onClick={ update }
							isOutline
							disabled={ isLoading }
						/>
						{ (!!cardInfo && !!stripeSubscriptionId)
						&& <PrimaryButton
							text='Retry payment'
							onClick={ retry }
							isLoading={ isLoading }
						/>
						}
					</div>
				}
			</div>
		</section>
	);
};

RetryOrUpdateSubscription.defaultProps = {
	getCardInfo: () => {},
	retryPayment: () => {},
	customerId: '',
	isLoading: false,
	cardInfo: {},
	stripeSubscriptionId: '',
};

RetryOrUpdateSubscription.propTypes = {
	getCardInfo: func.isRequired,
	retryPayment: func.isRequired,
	customerId: string,
	isLoading: bool,
	cardInfo: object,
	stripeSubscriptionId: string,
	isMember: bool,
};

const mapStateToProps = ({ auth }) => {
	const user = auth.user || getItemFromStorage('user');
	const propName = !!user?.retailer ? 'retailer' : 'member';

	return {
		customerId: user[propName].stripePaymentSettings?.customerId,
		isLoading: auth.isLoading,
		cardInfo: auth.cardInfo,
		stripeSubscriptionId: !!auth.user && auth.user[propName].stripePaymentSettings?.stripeSubscriptionId,
		isMember: !!user.member,
	};
};

export default connect(mapStateToProps, {
	getCardInfo,
	retryPayment,
})(memo(RetryOrUpdateSubscription));
