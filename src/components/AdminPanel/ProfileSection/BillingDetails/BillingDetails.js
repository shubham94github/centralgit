import React, { memo, useState } from 'react';
import { P12, P16 } from '@components/_shared/text';
import { Icons } from '@icons';
import { colors } from '@colors';
import { connect } from 'react-redux';
import enums from '@constants/enums';
import { dateFormatCorrection } from '@utils';
import { number, object, string, bool } from 'prop-types';
import BillingAddressHOC from './BillingAddressHOC';
import AppModal from '@components/Common/AppModal';

import './BillingDetails.scss';

const editIcon = Icons.editIcon(colors.darkblue70);

const BillingDetails = ({
	companyLegalName,
	country,
	city,
	address,
	vatNumber,
	postZipCode,
	nextBillingDate,
	brand,
	last4,
	enterpriseCode,
	discountCode,
	isRetailersEditBillingDetailsPermission,
	uiName,
}) => {
	const paymentCardIcon = enums.paymentCardLogos[brand];
	const nextBillingDateFormat = nextBillingDate && dateFormatCorrection(nextBillingDate, 'MMM d, yyyy');
	const [isEditBillingAddress, setIsEditBillingAddress] = useState(false);

	const toggleBillingAddressEditModal = () => setIsEditBillingAddress(prevState => !prevState);

	return (
		<>
			{isEditBillingAddress
				&& <AppModal
					component={BillingAddressHOC}
					className='account-information-pop-up'
					onClose={toggleBillingAddressEditModal}
					title='Billing address'
					outerProps={{
						onClose: toggleBillingAddressEditModal,
					}}
					width='630px'
				/>
			}
			<div className='billing-details-admin-container'>
				<div>
					<P16 bold>
					Billing address
						{isRetailersEditBillingDetailsPermission
							&& <span
								className='edit-icon'
								onClick={toggleBillingAddressEditModal}
							>
								{editIcon}
							</span>
						}
					</P16>
					{companyLegalName
						&& <P12 className='word-break'><b>Legal name:</b>&nbsp;{companyLegalName}</P12>
					}
					{country?.name
						&& <P12><b>Country:</b>&nbsp;{country.name}</P12>
					}
					{city
						&& <P12><b>City: </b>&nbsp;{city}</P12>
					}
					{address
						&& <P12><b>Address:</b>&nbsp;{address}</P12>
					}
					{vatNumber
						&& <P12><b>VAT Number:</b>&nbsp;{vatNumber}</P12>
					}
					{postZipCode
						&& <P12><b>Post/Zip code:</b>&nbsp;{postZipCode}</P12>
					}
				</div>
				<div>
					<P16 bold>Billing</P16>
					{last4
						&& <P12 className='card-center'><b>Card number:</b>&nbsp;{paymentCardIcon}&nbsp;{last4}</P12>
					}
					{uiName
						&& <P12><b>Current plan:</b>&nbsp;{uiName}</P12>
					}
					{nextBillingDate
						&& <P12><b>Next billing date:</b>&nbsp;{nextBillingDateFormat}</P12>
					}
					{discountCode
						&& <P12><b>Coupon:</b>&nbsp;{discountCode}</P12>
					}
					{enterpriseCode
						&& <P12><b>Enterprise code:</b>&nbsp;{enterpriseCode}</P12>
					}
				</div>
			</div>
		</>
	);
};

BillingDetails.propTypes = {
	companyLegalName: string,
	country: object,
	city: string,
	address: string,
	vatNumber: string,
	postZipCode: string,
	nextBillingDate: number,
	brand: string,
	last4: string,
	enterpriseCode: string,
	discountCode: number,
	isRetailersEditBillingDetailsPermission: bool,
	uiName: string,
};

export default connect(({ admin: { profile }, auth }) => {
	const { listOfPermissions } = auth;

	const {
		retailer: {
			companyLegalName,
			address,
			vatNumber,
			postZipCode,
			nextBillingDate,
			brand,
			last4,
			enterpriseCode,
			discountCode,
			paymentPlan,
		},
		city,
		country,
	} = profile;

	return {
		companyLegalName,
		country,
		city,
		address,
		vatNumber,
		postZipCode,
		nextBillingDate,
		brand,
		last4,
		enterpriseCode,
		discountCode,
		isRetailersEditBillingDetailsPermission: listOfPermissions?.isRetailersEditBillingDetailsPermission,
		uiName: paymentPlan?.uiName,
	};
})(memo(BillingDetails));
