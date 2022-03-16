import React, { memo, useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import { setFieldForFilter } from '@ducks/browse/action';
import PrimaryButton from '@components/_shared/buttons/PrimaryButton';
import SearchInput from '@components/_shared/form/SearchInput';
import { bool, func, string } from 'prop-types';
import SaveHistoryDropdown from '@components/BrowsePage/SortForStartups/SaveHistoryDropdown';
import { useOnClickOutside } from '@utils/hooks/useOnClickOutside';
import { Icons } from '@icons';

import('./SearchForStartups.scss');

const saveIcon = Icons.saveIcon();

const SearchForStartups = ({ searchByName, setFieldForFilter, isLoading }) => {
	const [initialValue, setInitialValue] = useState(!!searchByName ? searchByName : '');
	const [isSaveHistoryOpen, setIsSaveHistoryOpen] = useState(false);
	const createFormRef = useRef(null);
	const createButtonRef = useRef(null);

	useEffect(() => setInitialValue(!!searchByName ? searchByName : ''), [searchByName]);

	const toggleSaveHistoryDropdown = () => setIsSaveHistoryOpen(prevState => !prevState);

	const closeSaveHistoryDropdown = () => setIsSaveHistoryOpen(false);

	useOnClickOutside([createFormRef, createButtonRef], () => closeSaveHistoryDropdown());

	const handleSearch = value => {
		const search = value.trim();
		const data = {
			field: 'keyWord',
			data: search,
		};

		if (search.length > 2)
			setFieldForFilter(data);
		else if (search.length === 0) {
			data.data = null;
			setFieldForFilter(data);
		}
	};

	return (
		<div className='search-for-startups-wrapper'>
			<div className='search-input'>
				<SearchInput
					placeholder='Search...'
					isClearable={true}
					onSearch={handleSearch}
					initialValue={initialValue}
					disabled={false}
					isSearchHistory
				/>
			</div>
			<div className='search-button'>
				<PrimaryButton
					disabled={isLoading}
					buttonRef={createButtonRef}
					onClick={toggleSaveHistoryDropdown}
					isFullWidth
				>
					{saveIcon} Save search
				</PrimaryButton>
				{isSaveHistoryOpen
					&& <SaveHistoryDropdown
						createFormRef={createFormRef}
						onClose={closeSaveHistoryDropdown}
					/>
				}
			</div>
		</div>
	);
};

const mapStateToProps = ({
	browse: {
		filterCategories,
		isLoading,
	},
}) => ({
	searchByName: filterCategories.keyWord,
	isLoading,
});

SearchForStartups.propTypes = {
	searchByName: string,
	setFieldForFilter: func.isRequired,
	isLoading: bool.isRequired,
};

SearchForStartups.defaultProps = {
	searchByName: '',
};

export default connect(mapStateToProps, {
	setFieldForFilter,
})(memo(SearchForStartups));
