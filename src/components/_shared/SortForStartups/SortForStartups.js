import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { bool, func, number, string } from 'prop-types';
import { P16 } from '@components/_shared/text';
import Select from '@components/_shared/form/Select';
import { optionsSortFilter } from './constants';
import { prepareSelectStyles } from './helpers/prepareSelectStyles';
import SliderCheckbox from '@components/_shared/form/SliderCheckbox';
import GridContainer from '@components/layouts/GridContainer';
import cn from 'classnames';

import './SortForStartups.scss';

const SortForStartups = ({
	countOfRecords,
	sort,
	isAvailableToChat,
	onSelectChange,
	toggleIsAvailableToChat,
	countOfRecordsText,
	isAdmin,
}) => {
	const customStyles = useMemo(() => prepareSelectStyles, []);
	const classes = cn('browse-sort-container', { 'p-50': !isAdmin });
	const getSelectedOptions = useCallback(() =>
		optionsSortFilter.filter(obj => obj.value === sort), [sort]);

	const [initialOptions, setInitialOptions] = useState(getSelectedOptions);

	useEffect(() => setInitialOptions(getSelectedOptions), [setInitialOptions, getSelectedOptions]);

	return (
		<GridContainer template={isAdmin ? 'auto 180px' : 'auto auto 180px'} customClassName={classes}>
			<P16 className='count-of-records'>
				{isAdmin && !!countOfRecords
					&& <>
						{countOfRecords || '0'} {countOfRecordsText}
					</>
				}
			</P16>
			{!isAdmin
				&& <div className='sort-chat-section'>
					<P16>
						Show Startups Available to chat only
					</P16>
					<SliderCheckbox
						checked={isAvailableToChat}
						id='chat-with'
						onChange={toggleIsAvailableToChat}
					/>
				</div>
			}
			<div className='sort-section'>
				<P16 className='pe-3'>
					Sort :
				</P16>
				<div className='search-input'>
					<Select
						isFilter
						options={optionsSortFilter}
						isMulti={false}
						isSearchable={false}
						isCreateable={false}
						onChange={onSelectChange}
						value={initialOptions}
						customStyles={customStyles}
					/>
				</div>
			</div>
		</GridContainer>
	);
};

SortForStartups.defaultProps = {
	countOfRecords: 0,
	sort: '',
	isAdmin: false,
	isAvailableToChat: false,
	countOfRecordsText: '',
};

SortForStartups.propTypes = {
	countOfRecords: number,
	sort: string,
	isAvailableToChat: bool,
	onSelectChange: func,
	isAdmin: bool,
	toggleIsAvailableToChat: func,
	countOfRecordsText: string,
};

export default memo(SortForStartups);
