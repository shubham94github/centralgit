import React, { memo, useState } from 'react';
import { array, func, object } from 'prop-types';
import Checkbox from '@components/_shared/form/Checkbox';
import PrimaryButton from '@components/_shared/buttons/PrimaryButton';
import { connect } from 'react-redux';
import { getRetailers } from '@ducks/admin/actions';
import GridContainer from '@components/layouts/GridContainer';

import './RetailerCategoriesFilter.scss';

const RetailerCategoriesFilter = ({
	categories,
	onClose,
	setCategoriesFilter,
	categoriesFilter,
	retailersTableMeta,
	getRetailers,
}) => {
	const [selectedCategories, setSelectedCategories] = useState([...categoriesFilter]);

	const selectCategories = categoryId => {
		if (!selectedCategories.find(category => categoryId === category))
			setSelectedCategories([ ...selectedCategories, categoryId ]);
		else setSelectedCategories(selectedCategories.filter(category => categoryId !== category));
	};

	const apply = () => {
		setCategoriesFilter(selectedCategories);
		if (!retailersTableMeta.fields.find(field => field.fieldName === 'categoryIds')) {
			getRetailers({
				...retailersTableMeta,
				page: 1,
				fields: [
					...retailersTableMeta.fields,
					{ fieldName: 'categoryIds', filterCategories: selectedCategories },
				],
			});
		} else {
			const fields = retailersTableMeta.fields.map(field => {
				if (field.fieldName === 'categoryIds')
					return { fieldName: 'categoryIds', filterCategories: selectedCategories };

				return field;
			});

			getRetailers({
				...retailersTableMeta,
				page: 1,
				fields,
			});
		}

		getRetailers({
			...retailersTableMeta,
			page: 1,
			fields: [...retailersTableMeta.fields, { fieldName: 'categoryIds', filterCategories: selectedCategories }],
		});
		onClose();
	};

	const reset = () => {
		setCategoriesFilter([]);
		getRetailers({
			...retailersTableMeta,
			page: 1,
			fields: retailersTableMeta.fields.filter(field => field.fieldName !== 'categoryIds'),
		});
		onClose();
	};

	return (
		<div className='filter-categories'>
			<ul className='categories-list'>
				{categories.map(({ name, id }) => {
					const onChange = () => selectCategories(id);
					const checked = selectedCategories.find(selectedCategoryId => selectedCategoryId === id);

					return (
						<li key={id}>
							<Checkbox
								name={name}
								label={name}
								onChange={onChange}
								checked={!!checked}
							/>
						</li>
					);
				})}
			</ul>
			<GridContainer columns={2}>
				<PrimaryButton
					text='Reset'
					onClick={reset}
					isOutline={true}
				/>
				<PrimaryButton
					text='Apply'
					onClick={apply}
				/>
			</GridContainer>
		</div>
	);
};

RetailerCategoriesFilter.propTypes = {
	onClose: func.isRequired,
	categories: array.isRequired,
	setCategoriesFilter: func.isRequired,
	categoriesFilter: array,
	retailersTableMeta: object,
	getRetailers: func.isRequired,
};

RetailerCategoriesFilter.defaultProps = {
	onClose: () => {},
	categories: [],
	categoriesFilter: [],
};

export default connect(({ admin }) => {
	const { retailersTableMeta } = admin;

	return {
		retailersTableMeta,
	};
}, {
	getRetailers,
})(memo(RetailerCategoriesFilter));
