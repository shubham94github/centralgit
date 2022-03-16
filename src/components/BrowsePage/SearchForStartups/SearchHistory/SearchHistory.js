import React, { memo, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { getHistory, setHistoryFilter } from '@ducks/browse/action';
import { array, bool, func, object, string } from 'prop-types';
import HistoryItem from './HistoryItem';
import { S16 } from '@components/_shared/text';
import { historyFilterHandler, savedHistoryFilterHandler } from '@utils/historyFilterHelper';
import LoadingOverlay from '@components/_shared/LoadingOverlay';

import './SearchHistory.scss';

const SearchHistory = ({
	getHistory,
	searchHistory,
	savedSearchHistory,
	setHistoryFilter,
	isOpenSearchHistory,
	localValue,
	editNode,
	handleOpenSearchHistory,
	isHistoryLoading,
}) => {
	useEffect(() => {
		getHistory();
	}, [getHistory]);

	const [searchHistoryFiltered, setSearchHistoryFiltered] = useState(searchHistory);
	const [savedSearchHistoryFiltered, setSavedSearchHistoryFiltered] = useState(savedSearchHistory);

	useEffect(() => {
		if (searchHistory.length && localValue)
			setSearchHistoryFiltered(historyFilterHandler(searchHistory, localValue.trim()));
		if (!localValue) setSearchHistoryFiltered(searchHistory);
	}, [searchHistory, localValue, setSearchHistoryFiltered]);

	useEffect(() => {
		if (savedSearchHistory.length && localValue)
			setSavedSearchHistoryFiltered(savedHistoryFilterHandler(savedSearchHistory, localValue.trim()));
		if (!localValue) setSavedSearchHistoryFiltered(savedSearchHistory);
	}, [savedSearchHistory, localValue, setSavedSearchHistoryFiltered]);

	return (isOpenSearchHistory && (!!searchHistoryFiltered.length || !!savedSearchHistoryFiltered.length)
		&& <div className='search-history-wrapper'>
			{!!searchHistoryFiltered.length
				&& <>
					<S16
						className='history-title'
						bold
					>
						Recent Searches
					</S16>
					{searchHistoryFiltered.map(history => (
						<HistoryItem
							key={history.id}
							history={history}
							setFilter={setHistoryFilter}
							editNode={editNode}
							handleOpenSearchHistory={handleOpenSearchHistory}
						/>
					))}
				</>
			}
			{!!savedSearchHistoryFiltered.length
				&& <>
					<S16
						className='history-title'
						bold
					>
						Saved Searches
					</S16>
					{savedSearchHistoryFiltered.map(history => (
						<HistoryItem
							key={history.id}
							history={history}
							setFilter={setHistoryFilter}
							editNode={editNode}
							isSaved
							handleOpenSearchHistory={handleOpenSearchHistory}
						/>
					))}
				</>
			}
			{isHistoryLoading
				&& <LoadingOverlay classNames='history-loader'/>
			}
		</div>
	);
};

SearchHistory.propTypes = {
	searchHistory: array,
	savedSearchHistory: array,
	getHistory: func.isRequired,
	setHistoryFilter: func.isRequired,
	isOpenSearchHistory: bool.isRequired,
	handleOpenSearchHistory: func.isRequired,
	localValue: string,
	editNode: object,
	isHistoryLoading: bool.isRequired,
};

const mapStateToProps = ({ browse: { searchHistory, savedSearchHistory, isHistoryLoading } }) => ({
	searchHistory,
	savedSearchHistory,
	isHistoryLoading,
});

export default connect(mapStateToProps, {
	getHistory,
	setHistoryFilter,
})(memo(SearchHistory));
