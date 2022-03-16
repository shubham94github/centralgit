import React from 'react';
import ReactCountryFlag from 'react-country-flag';
import { currencyFormatter } from '@utils/currencyFormatter';
import { Icons } from '@icons';

const countryIcon = Icons.countryIcon();
const founderIcon = Icons.founderIcon();
const foundedIcon = Icons.foundedIcon();
const totalFundingIcon = Icons.totalFundingIcon();

const getYearFounded = date => new Date(date).getFullYear();

export const setAboutItems = (country, owner, foundedAt, totalFundingAmount) => [
	{
		id: 1,
		title: {
			name: 'Country',
			icon: countryIcon,
		},
		value: {
			text: country?.iso
				? <ReactCountryFlag
					countryCode={country.iso}
					style={{
						width: '35px',
						height: '25px',
						borderRadius: '2px',
					}}
					svg
				/>
				: 'n/a',
		},
	},
	{
		id: 2,
		title: {
			name: 'Founder',
			icon: founderIcon,
		},
		value: {
			text: owner?.length > 50 ? `${owner.slice(0, 50)  }...` : owner || 'n/a',
		},
	},
	{
		id: 3,
		title: {
			name: 'Founded',
			icon: foundedIcon,
		},
		value: {
			text: foundedAt ? getYearFounded(foundedAt) : 'n/a',
		},
	},
	{
		id: 4,
		title: {
			name: 'Total Funding',
			icon: totalFundingIcon,
		},
		value: {
			text: totalFundingAmount ? currencyFormatter.format(totalFundingAmount) : 'n/a',
		},
	},
];
