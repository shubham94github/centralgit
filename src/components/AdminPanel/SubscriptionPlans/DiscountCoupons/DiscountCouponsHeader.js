import React  from 'react';
import SearchInput from '@components/_shared/form/SearchInput';
import { bool, func } from 'prop-types';
import {
	searchInputPlaceholder,
	addNewCouponBtnText,
	plusIcons,
	guidelineIcon,
	textForGuideline,
	discountStatusesDefinition,
} from './constants';
import { P14 } from '@components/_shared/text';
import PrimaryButton from '@components/_shared/buttons/PrimaryButton';

import './DiscountCouponsHeader.scss';

const DiscountCouponsHeader = ({ isLoading, handleSearch, openDiscountCouponModal }) => (
	<div className='discount-coupons-header'>
		<div className='guidelines'>
			{guidelineIcon}
			<P14>
				{textForGuideline}
			</P14>
		</div>
		<div className='status-discount-definition'>
			<P14>A coupon's status can be defined as:</P14>
			<ul className='status-discount-definition-list'>
				{discountStatusesDefinition.map(listItem => (
					<li
						key={listItem.status}
					>
						<b>{listItem.status}</b> - {listItem.definition}
					</li>
				))}
			</ul>
		</div>
		<div className='menage-section'>
			<SearchInput
				placeholder={searchInputPlaceholder}
				onSearch={handleSearch}
				disabled={isLoading}
				isClearable
				className='search-input'
			/>
			<PrimaryButton
				onClick={openDiscountCouponModal}
				className='add-coupon-btn'
			>
				{plusIcons}
				{addNewCouponBtnText}
			</PrimaryButton>
		</div>
	</div>
);

DiscountCouponsHeader.propTypes = {
	handleSearch: func.isRequired,
	openDiscountCouponModal: func.isRequired,
	isLoading: bool,
};

export default DiscountCouponsHeader;
