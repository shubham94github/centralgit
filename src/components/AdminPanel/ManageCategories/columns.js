import React from 'react';
import cn from 'classnames';
import { colors } from '@colors';
import { Routes } from '@routes';
import { Icons } from '@icons';
import { P12 } from '@components/_shared/text';
import Tooltip from '@components/_shared/Tooltip';

const {
	STARTUPS,
	RETAILERS,
} = Routes.ADMIN_PANEL;

/* eslint-disable */

export const getColumns = ({
	editCategory,
	createForParentCategory,
	handleDeleteCategory,
	setStartupsTableMeta,
	setRetailersTableMeta,
	startupsTableMeta,
	retailersTableMeta,
	history,
	handleRetailerFilters,
	isCategoryEditPermission,
	isCategoryDeletePermission,
}) => {
	return [
		{
			name: 'Category Name',
			grow: 2,
			property: 'name',
			selector: 'name',
			sortable: false,
			width: '350px',
			cell: ({ level, name }) => {
				const className = cn('category-name', {
					'second-level': level === 2,
					'third-level': level === 3,
				});

				return <Tooltip
					message={
						<P12 className='parent-paths'>
							{name}
						</P12>
					}
				>
					<div className={className}>{name}</div>
				</Tooltip>;
			},
		},
		{
			name: 'Title for Subcategories list',
			grow: 2,
			property: 'childHeader',
			selector: 'childHeader',
			sortable: false,
			minWidth: '250px',
			maxWidth: '260px',
		},
		{
			name: 'Sectors',
			grow: 2,
			property: 'countUsingStartupInCategories',
			selector: 'countUsingStartupInCategories',
			sortable: false,
			cell: ({ countUsingStartupInCategories, id }) => {
				const setFilters = () => {
					setStartupsTableMeta({
						...startupsTableMeta,
						fields: [
							{ fieldName: 'categoryIds', filterCategories: [id] },
						],
					});

					history.push(STARTUPS);
				};

				return (countUsingStartupInCategories
					? <div
						className='link center'
						onClick={setFilters}
					>
						{countUsingStartupInCategories}
					</div>
					: '');
			},
			width: '100px',
		},
		{
			name: 'Areas',
			grow: 2,
			property: 'countUsingStartupInAreasOfInterest',
			selector: 'countUsingStartupInAreasOfInterest',
			sortable: false,
			width: '80px',
			cell: ({ countUsingStartupInAreasOfInterest, parentId }) => {
				const text = (!countUsingStartupInAreasOfInterest && !parentId)
					? ''
					: countUsingStartupInAreasOfInterest;

				return (
					<div className='center'>{text}</div>
				);
			},
		},
		{
			name: 'Used in Companies',
			grow: 2,
			property: 'countUsingRetailers',
			selector: 'countUsingRetailers',
			sortable: false,
			width: '220px',
			cell: ({ countUsingRetailers, id }) => {
				const setFilters = () => {
					setRetailersTableMeta({
						...retailersTableMeta,
						page: 1,
						fields: [{ fieldName: 'categoryIds', filterCategories: [id] }],
					});

					handleRetailerFilters({
						country: null,
						isBlocked: null,
						isVerified: null,
						paymentPlanName: null,
						status: null,
						filterCategories: [id],
					});

					history.push(RETAILERS);
				};

				return (countUsingRetailers
					? <div
						className='link center'
						onClick={setFilters}
					>{countUsingRetailers}</div>
					: ''
				);
			},
		},
		{
			name: 'Sort order',
			grow: 1,
			property: 'weight',
			selector: 'weight',
			sortable: false,
			width: '120px',
			cell: ({ weight }) => (
				<div className='center'>{weight}</div>
			),
		},
		{
			name: 'Actions',
			grow: 1,
			property: 'actions',
			selector: 'actions',
			sortable: false,
			cell: row => {
				const {
					isCustom,
					countUsingStartupInCategories,
					countUsingStartupInAreasOfInterest,
					countUsingRetailers,
					countSubcategories,
					level,
				} = row;

				const handleEdit = () => editCategory(row);
				const handleCreate = () => createForParentCategory(row);
				const handleDelete = () => handleDeleteCategory(row.id);
				const editIcon = Icons.edit(colors.darkblue70);
				const removeIcon = Icons.removeIcon(colors.darkblue70);
				const addIcon = Icons.plus(colors.darkblue70);
				const isVisibleRemoveIcon = isCustom && !countSubcategories && !countUsingStartupInCategories
					&& !countUsingStartupInAreasOfInterest && !countUsingRetailers;
				const isAvailableToAddCategory = level < 3;

				return (
					<div className='actions-cell'>
						{isCategoryEditPermission
							&& <div className='icon' onClick={handleEdit}>{editIcon}</div>
						}
						{isVisibleRemoveIcon && isCategoryDeletePermission
							&& <div className='icon' onClick={handleDelete}>{removeIcon}</div>
						}
						{isAvailableToAddCategory && isCategoryEditPermission
							&& <div className='icon' onClick={handleCreate}>{addIcon}</div>
						}
					</div>
				);
			},
			width: '120px',
		},
	];
};
