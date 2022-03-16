import React, { memo, useRef, useState } from 'react';
import { bool, func, object } from 'prop-types';
import { S16 } from '@components/_shared/text';
import Tooltip from '@components/_shared/Tooltip';
import { useOnClickOutside } from '@utils/hooks/useOnClickOutside';
import HistoryForm from '@components/BrowsePage/SearchForStartups/SearchHistory/HistoryForm';
import {
	editFormTitle,
	removeMessage,
} from '@components/BrowsePage/SearchForStartups/SearchHistory/HistoryForm/constants';
import { colors } from '@colors';
import { Icons } from '@icons';

const closeIcon = Icons.close(colors.darkblue70);
const editIcon = Icons.editIcon(colors.darkblue70);

const HistoryItem = ({
	history,
	setFilter,
	editNode,
	isSaved,
	handleOpenSearchHistory,
}) => {
	const {
		keyWord,
		filterCount,
		title,
		id,
	} = !!history && history;

	const editButtonNode = useRef(null);
	const removeButtonNode = useRef(null);
	const [isModalHistoryOpen, setIsModalHistoryOpen] = useState(false);
	const [isRemoveMode, setIsRemoveMode] = useState(false);
	const [isEditMode, setIsEditMode] = useState(false);

	const handleModalHistoryClick = isOpen => setIsModalHistoryOpen(isOpen);

	const openModalForm = () => handleModalHistoryClick(true);

	const openEditForm = () => {
		openModalForm();
		setIsEditMode(true);
		setIsRemoveMode(false);
	};

	const openRemoveForm = () => {
		openModalForm();
		setIsRemoveMode(true);
		setIsEditMode(false);
	};

	const closeModalForm = () => {
		handleModalHistoryClick(false);
		setIsRemoveMode(false);
		setIsEditMode(false);
	};

	useOnClickOutside([editNode, editButtonNode, removeButtonNode], () => closeModalForm());

	const setFilterHandler = () => {
		setFilter(history);
		handleOpenSearchHistory(false);
	};

	return (
		<div className='history-item'>
			<div className='history-request' onClick={setFilterHandler}>
				<S16 className='key-word'>{isSaved ? title : keyWord}</S16>
				<S16 className='count'>{filterCount} filters</S16>
			</div>
			{isSaved
				&& <Tooltip
					trigger={[]}
					placement='right'
					isVisibleTooltip={true}
					isCustomShow={isModalHistoryOpen}
					className='tooltip-edit-history'
					message={
						<div ref={editNode}>
							<HistoryForm
								isEditForm={isEditMode}
								isRemoveForm={isRemoveMode}
								title={isEditMode ? editFormTitle : removeMessage}
								onClose={closeModalForm}
								savedSearchId={id}
								titleValue={title}
							/>
						</div>
					}
				>
					<div className='manage-section'>
						{isModalHistoryOpen
							? <>
								<span ref={editButtonNode} onClick={closeModalForm}>{editIcon}</span>
								<span ref={removeButtonNode} onClick={closeModalForm}>{closeIcon}</span>
							</>
							: <>
								<span onClick={openEditForm}>{editIcon}</span>
								<span onClick={openRemoveForm}>{closeIcon}</span>
							</>
						}
					</div>
				</Tooltip>
			}
		</div>
	);
};

HistoryItem.propTypes = {
	history: object.isRequired,
	setFilter: func.isRequired,
	handleOpenSearchHistory: func.isRequired,
	editNode: object,
	isSaved: bool,
};

HistoryItem.defaultProps = {
	isSaved: false,
};

export default memo(HistoryItem);
