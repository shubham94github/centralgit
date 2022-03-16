import React, { memo, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { func, array } from 'prop-types';
import enums from '@constants/enums';
import { useForm } from 'react-hook-form';
import SearchBar from '@components/_shared/form/SearchBar/SearchBar';
import { getCategories } from '@ducks/common/actions';
import { schema } from './schema';
import { yupResolver } from '@hookform/resolvers/yup';
import { defaultValueSelect } from './constants';
import hideSomeFirstLevelCategories from '@utils/hideSomeFirstLevelCategories';
import { isEmpty } from '@utils/js-helpers';

const SearchForCategories = ({ handleSearch, getCategories, categories }) => {
	const [searchOptions, setSearchOptions] = useState([defaultValueSelect]);

	const { register, handleSubmit, control, setValue, reset } = useForm({
		resolver: yupResolver(schema),
		defaultValues: schema.default(),
		mode: enums.validationMode.onBlur,
	});

	useEffect(() => {
		if (!isEmpty(categories)) getCategories();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (!isEmpty(categories)) setSearchOptions([defaultValueSelect, ...categories]);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [categories.length]);

	const onSubmit = data => {
		handleSearch(data);
		reset({ category: searchOptions[0], search: '' });
	};

	const handleKeyDown = e => {
		if (e.code === 'Enter' || e.keyCode === 13) handleSubmit(onSubmit)();
	};

	const onChangeHandler = option => setValue('category', option);

	return (
		<form
			onKeyDown={e => handleKeyDown(e)}
		>
			<SearchBar
				control={control}
				register={register({ required: true })}
				searchName='search'
				categoryName='category'
				searchOptions={hideSomeFirstLevelCategories(searchOptions)}
				onChange={onChangeHandler}
				onClickHandler={handleSubmit(onSubmit)}
			/>
		</form>
	);
};

SearchForCategories.propTypes = {
	handleSearch: func,
	getCategories: func,
	categories: array,
};

const mapStateToProps = ({ common: { categories } }) => ({
	categories,
});

export default connect(mapStateToProps, {
	getCategories,
})(memo(SearchForCategories));
