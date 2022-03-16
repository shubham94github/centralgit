import React, { memo, useEffect, useState } from 'react';
import MainTable from '@components/_shared/MainTable';
import { getColumns } from './columns';
import { bool, func, object } from 'prop-types';
import AppModal from '@components/Common/AppModal';
import ManageCategory from '@components/_shared/ModalComponents/ManageCategory';
import {
	handleDeleteCategory,
	setStartupsTableMeta,
	setRetailersTableMeta,
	handleRetailerFilters,
} from '@ducks/admin/actions';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import cn from 'classnames';
import { isEmpty } from '@utils/js-helpers';

import './ExpandableRow.scss';

const ExpandableRow = ({
	data,
	handleDeleteCategory,
	setStartupsTableMeta,
	setRetailersTableMeta,
	startupsTableMeta,
	retailersTableMeta,
	handleRetailerFilters,
	isCategoryEditPermission,
	isCategoryDeletePermission,
}) => {
	const { items } = data;
	const history = useHistory();
	const [parentCategory, setParentCategory] = useState(null);
	const [selectedCategory, setSelectedCategory] = useState(null);
	const [isManageCategoriesModal, setIsManageCategoriesModal] = useState(false);
	const [modalTitle, setModalTitle] = useState('');
	const isExpandableRows = !!items?.length;
	const changeModalTitle = 'Change the Category';
	const thirdLevelCondition = parentCategory?.level === 2;
	const thirdLevelModalTitle = 'Add a new third level Category';
	const tableClassName = cn(!isEmpty(items) && items[0].level === 3 ? 'third-level-table' : 'second-level-table', {
		'without-bottom-border': items?.length === 1,
	});

	useEffect(() => {
		if (selectedCategory && !parentCategory) setModalTitle(changeModalTitle);
		else if (!selectedCategory && thirdLevelCondition)
			setModalTitle(thirdLevelModalTitle);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedCategory, parentCategory]);

	const toggleManageCategories = () => setIsManageCategoriesModal(prevState => !prevState);

	const onClose = () => {
		if (selectedCategory) setSelectedCategory(null);
		if (parentCategory) setParentCategory(null);

		setIsManageCategoriesModal(prevState => !prevState);
	};

	const editCategory = category => {
		setSelectedCategory(category);
		toggleManageCategories();
	};

	const createForParentCategory = category => {
		setParentCategory(category);
		toggleManageCategories();
	};

	const manageCategoryProps = {
		onClose: toggleManageCategories,
		categoryForEdit: selectedCategory,
		setSelectedCategory,
		parentCategory,
		setParentCategory,
		history,
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
		if (items) {
			items.forEach(item => {
				const element = document.getElementById(`row-${item.id}`);

				if (item.level === 2)
					element.firstElementChild.classList.add('second-level');
				if (item.level === 3)
					element.firstElementChild.classList.add('third-level');
			});
		}
	}, [items]);

	return (
		<div className='expandable-row'>
			{items
				&& <MainTable
					className={tableClassName}
					noTableHead={true}
					columns={columns}
					data={items}
					selectableRows={false}
					sortServer={true}
					withPagination={false}
					withFilters={false}
					isManageCategories={false}
					isExpandableRows={isExpandableRows}
					toggleModal={toggleManageCategories}
				/>
			}
			{isManageCategoriesModal
				&& <AppModal
					component={ManageCategory}
					onClose={onClose}
					outerProps={manageCategoryProps}
					title={modalTitle}
					width='630px'
				/>
			}
		</div>
	);
};

ExpandableRow.propTypes = {
	data: object.isRequired,
	handleDeleteCategory: func.isRequired,
	setStartupsTableMeta: func.isRequired,
	setRetailersTableMeta: func.isRequired,
	startupsTableMeta: object.isRequired,
	retailersTableMeta: object.isRequired,
	handleRetailerFilters: func.isRequired,
	isCategoryEditPermission: bool,
	isCategoryDeletePermission: bool,
};

export default connect(({ admin, auth }) => {
	const { startupsTableMeta, retailersTableMeta } = admin;
	const { listOfPermissions } = auth;

	return {
		startupsTableMeta,
		retailersTableMeta,
		isCategoryEditPermission: listOfPermissions?.isCategoryEditPermission,
		isCategoryDeletePermission: listOfPermissions?.isCategoryDeletePermission,
	};
}, {
	handleDeleteCategory,
	setStartupsTableMeta,
	setRetailersTableMeta,
	handleRetailerFilters,
})(memo(ExpandableRow));
