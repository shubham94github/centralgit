import React, { memo, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { array, bool, func } from 'prop-types';
import {
	getCategories,
	handleDeleteCategory,
	setStartupsTableMeta,
	setRetailersTableMeta,
	handleRetailerFilters,
} from '@ducks/admin/actions';
import MainTable from '@components/_shared/MainTable';
import { getColumns } from './columns';
import AppModal from '@components/Common/AppModal';
import ManageCategory from '@components/_shared/ModalComponents/ManageCategory';
import { useHistory } from 'react-router-dom';
import ManageCategoriesHeader from '@components/AdminPanel/ManageCategories/ManageCategoriesHeader';
import { tableMetaType } from '@constants/types';

import './ManageCategories.scss';

const ManageCategories = ({
	categories,
	getCategories,
	isLoading,
	startupsTableMeta,
	retailersTableMeta,
	setStartupsTableMeta,
	setRetailersTableMeta,
	handleRetailerFilters,
	handleDeleteCategory,
	isCategoryEditPermission,
	isCategoryDeletePermission,
}) => {
	const history = useHistory();
	const [isManageCategoriesModal, setIsManageCategoriesModal] = useState(false);
	const [parentCategory, setParentCategory] = useState(null);
	const [selectedCategory, setSelectedCategory] = useState(null);
	const [modalTitle, setModalTitle] = useState('');
	const changeModalTitle = 'Change the Category';
	const firstLevelModalTitle = 'Add a new first level Category';
	const secondLevelModalTitle = 'Add a new second level Category';
	const secondLevelCondition = parentCategory?.parentNames?.length === 1;

	useEffect(() => {
		if (!selectedCategory && !parentCategory) setModalTitle(firstLevelModalTitle);
		else if (selectedCategory && !parentCategory) setModalTitle(changeModalTitle);
		else if (!selectedCategory && secondLevelCondition)
			setModalTitle(secondLevelModalTitle);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedCategory, parentCategory]);

	const toggleManageCategories = () => setIsManageCategoriesModal(prevState => !prevState);

	const onClose = () => {
		if (selectedCategory) setSelectedCategory(null);
		if (parentCategory) setParentCategory(null);

		setIsManageCategoriesModal(prevState => !prevState);
	};

	const manageCategoryProps = {
		onClose: toggleManageCategories,
		categoryForEdit: selectedCategory,
		setSelectedCategory,
		parentCategory,
		setParentCategory,
	};

	const editCategory = category => {
		setSelectedCategory(category);
		toggleManageCategories();
	};

	const createForParentCategory = category => {
		setParentCategory(category);
		toggleManageCategories();
	};

	const columns = getColumns({
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
	});

	useEffect(() => {
		getCategories();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<div className='manage-categories'>
			<MainTable
				title='Manage Categories'
				columns={columns}
				data={categories}
				selectableRows={false}
				sortServer={true}
				withPagination={false}
				withFilters={false}
				isManageCategories={true}
				isExpandableRows={true}
				isLoading={isLoading}
				toggleModal={toggleManageCategories}
				tableHeader={ManageCategoriesHeader}
			/>
			{isManageCategoriesModal
				&& <AppModal
					component={ManageCategory}
					onClose={onClose}
					outerProps={manageCategoryProps}
					title={modalTitle}
					width='690px'
				/>
			}
		</div>
	);
};

ManageCategories.propTypes = {
	categories: array.isRequired,
	getCategories: func.isRequired,
	isLoading: bool.isRequired,
	setStartupsTableMeta: func.isRequired,
	setRetailersTableMeta: func.isRequired,
	startupsTableMeta: tableMetaType.isRequired,
	retailersTableMeta: tableMetaType.isRequired,
	handleRetailerFilters: func,
	handleDeleteCategory: func.isRequired,
	isCategoryEditPermission: bool,
	isCategoryDeletePermission: bool,
};

ManageCategories.defaultProps = {
	handleRetailerFilters: () => {},
};

export default connect(({ admin, auth }) => {
	const { categories, isLoading, startupsTableMeta, retailersTableMeta } = admin;
	const { listOfPermissions } = auth;

	return {
		categories,
		isLoading,
		startupsTableMeta,
		retailersTableMeta,
		isCategoryEditPermission: listOfPermissions?.isCategoryEditPermission,
		isCategoryDeletePermission: listOfPermissions?.isCategoryDeletePermission,
	};
}, {
	getCategories,
	handleDeleteCategory,
	setStartupsTableMeta,
	setRetailersTableMeta,
	handleRetailerFilters,
})(memo(ManageCategories));
