import React, { memo, useEffect, useMemo, useState } from 'react';
import { colors } from '@colors';
import ReactPaginate from 'react-paginate';
import { func, number } from 'prop-types';
import { S16 } from '@components/_shared/text';
import Select from '@components/_shared/form/Select';
import { prepareSelectCountOfRecordsStyles } from './helpers/prepareSelectStyles';
import { countOfRecordsOptions } from './constants';
import { Icons } from '@icons';

import './Paginate.scss';

const Paginate = ({ handlePageClick, pageCount, forcePage, countOfRecords, pageSize, changePageSizeHandler }) => {
	const customStylesCountOfRecords = useMemo(() => prepareSelectCountOfRecordsStyles, []);

	const selectedInterval = useMemo(() => {
		const start = ((forcePage === 0 || forcePage === null) ? 0 : forcePage) * pageSize + 1;
		const end = Math.min(start + pageSize - 1, countOfRecords);

		return `${start} - ${end} of ${countOfRecords} Results`;
	}, [forcePage, countOfRecords, pageSize]);

	const [selectPage, setSelectPage] = useState(forcePage + 1);

	const [selectCountOfRecords, setSelectCountOfRecords]
		= useState(countOfRecordsOptions.find(opt => opt.value === pageSize));

	useEffect(() =>
		setSelectCountOfRecords(countOfRecordsOptions.find(opt => opt.value === pageSize)),
	[pageSize]);

	const onChangeHandlerPage = e => setSelectPage(e.target.value);

	const onChangeHandlerCountOfRecords = option => {
		setSelectCountOfRecords(option);
		changePageSizeHandler(option.value);
	};

	useEffect(() => {
		setSelectPage(forcePage + 1);
	}, [forcePage]);

	const handleKeyDown = e => {
		const invalidChars = ['-', 'e', '+'];

		if (invalidChars.includes(e.key)) e.preventDefault();

		if ((e.code === 'Enter' || e.keyCode === 13) && (selectPage <= pageCount && selectPage > 0))
			handlePageClick({ selected: selectPage - 1 });
	};

	return (
		pageCount > 0
			&& <div className='d-flex align-items-center justify-content-between flex-wrap'>
				<div className='d-flex'>
					<div className='d-flex justify-content-center align-items-center me-4'>
						<S16 className='pe-2'>
							Show:
						</S16>
						<Select
							isFilter
							isSearchable={false}
							options={countOfRecordsOptions}
							onChange={onChangeHandlerCountOfRecords}
							value={selectCountOfRecords}
							customStyles={customStylesCountOfRecords}
							menuPlacement='top'
						/>
					</div>
					<div className='d-flex align-items-center me-4'>
						<ReactPaginate
							previousLabel={Icons.leftArrowIcon(colors.darkblue70)}
							nextLabel={Icons.rightArrowIcon(colors.darkblue70)}
							breakLabel={'...'}
							pageCount={pageCount}
							marginPagesDisplayed={1}
							pageRangeDisplayed={3}
							onPageChange={handlePageClick}
							containerClassName='pagination'
							activeLinkClassName='active'
							previousClassName='arrows'
							nextClassName='arrows'
							forcePage={forcePage}
						/>
					</div>
					<div className='d-flex justify-content-center align-items-center'>
						<S16 className='pe-2'>
							Jump to page:
						</S16>
						<input
							className='page-input'
							value={selectPage}
							type='number'
							onChange={onChangeHandlerPage}
							onKeyDown={handleKeyDown}
						/>
					</div>
				</div>
				<S16>
					{selectedInterval}
				</S16>
			</div>
	);
}
;

Paginate.propTypes = {
	handlePageClick: func.isRequired,
	changePageSizeHandler: func,
	pageCount: number.isRequired,
	forcePage: number,
	countOfRecords: number,
	pageSize: number.isRequired,
};

Paginate.defaultProps = {
	forcePage: 0,
	countOfRecords: 0,
	changePageSizeHandler: () => {},
};

export default memo(Paginate);
