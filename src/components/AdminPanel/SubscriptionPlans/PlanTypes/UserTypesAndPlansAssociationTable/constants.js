import React from 'react';
import { Icons as icons } from '@icons';
import { colors } from '@colors';

const checkedIcon = icons.checkboxCheckedLight();

export const userTypesAndPlansAssociationColumns = [
	{
		name: 'User Role',
		selector: 'number',
		maxWidth: '200px',
		cell: row => {
			if (row.isTitle)
				return <div className='title category-cell'>{row.title}</div>;

			return <div className='title'>{row.role}</div>;
		},
	},
	{
		name: 'Single User',
		cell: row => {
			if (row.isTitle)
				return <div className='title category-cell'/>;

			if (row.isSingleUser)
				return <div className='checked-icon'>{checkedIcon}</div>;
		},
	},
	{
		name: 'Multi-User',
		cell: row => {
			if (row.isTitle)
				return <div className='title category-cell'/>;

			if (row.isMultiUser) {
				const isTemporaryAbilityToCreateMembers = row.role === 'Entrepreneur'
				|| row.role === 'Investor'
				|| row.role === 'Private person';

				return (
					<div className='checked-icon'>
						{icons.checkboxCheckedLight(isTemporaryAbilityToCreateMembers
							? colors.orange40
							: colors.grass50)
						}
					</div>
				);
			}
		},
	},
	{
		name: 'Enterprise',
		cell: row => {
			if (row.isTitle)
				return <div className='title category-cell'/>;

			if (row.isEnterprise)
				return <div className='checked-icon'>{checkedIcon}</div>;
		},
	},
];

export const userTypesAndPlansAssociationData = [
	{
		id: 1,
		title: 'Company',
		isTitle: true,
		isEnterprise: true,
	},
	{
		id: 2,
		role: 'Retailer',
		isSingleUser: true,
		isMultiUser: true,
		isEnterprise: true,
	},
	{
		id: 3,
		role: 'Brand',
		isSingleUser: true,
		isMultiUser: true,
		isEnterprise: true,
	},
	{
		id: 4,
		role: 'Consultant',
		isSingleUser: true,
		isMultiUser: true,
		isEnterprise: true,
	},
	{
		id: 5,
		role: 'Service provider',
		isSingleUser: true,
		isMultiUser: true,
		isEnterprise: true,
	},
	{
		id: 6,
		role: 'Venture capital',
		isSingleUser: true,
		isMultiUser: true,
		isEnterprise: true,
	},
	{
		id: 7,
		title: 'Single User',
		isTitle: true,
	},
	{
		id: 8,
		role: 'Entrepreneur',
		isSingleUser: true,
		isEnterprise: true,
		isMultiUser: true,
	},
	{
		id: 9,
		role: 'Investor',
		isSingleUser: true,
		isEnterprise: true,
		isMultiUser: true,
	},
	{
		id: 10,
		role: 'Private person',
		isSingleUser: true,
		isEnterprise: true,
		isMultiUser: true,
	},
];
