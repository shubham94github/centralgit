import React, { memo } from 'react';
import { connect } from 'react-redux';
import { func, object, string } from 'prop-types';
import HistoryForm from '@components/BrowsePage/SearchForStartups/SearchHistory/HistoryForm';
import { saveFormTitle } from '@components/BrowsePage/SearchForStartups/SearchHistory/HistoryForm/constants';

import './SaveHistoryDropdown.scss';

const SaveHistoryDropdown = ({ createFormRef, onClose, keyWord }) =>  (
	<div ref={createFormRef} className='save-history-dropdown-container'>
		<HistoryForm
			isCreateForm
			title={saveFormTitle}
			onClose={onClose}
			titleValue={keyWord}
		/>
	</div>
);

SaveHistoryDropdown.propTypes={
	createFormRef: object,
	onClose: func.isRequired,
	keyWord: string,
};

export default connect(({ browse: { filterCategories } }) => ({
	keyWord: filterCategories.keyWord || '',
}))(memo(SaveHistoryDropdown));
