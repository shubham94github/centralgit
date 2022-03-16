import React, { memo, useEffect, useRef, useState } from 'react';
import Avatar from '@components/_shared/form/Avatar';
import { S14, S16, S12, P14, P12 } from '@components/_shared/text';
import SearchInput from '@components/_shared/form/SearchInput';
import { arrayOf, bool, func, number, object, oneOfType, shape, string } from 'prop-types';
import MessagesSearchResultDropdown from '@components/Messages/ChatContainer/ChatHeader/MessagesSearchResultDropdown';
import { useOnClickOutside } from '@utils/hooks/useOnClickOutside';
import { chatMessageType } from '@constants/types';
import { connect } from 'react-redux';
import {
	findMessagesInChat,
	clearFoundMessages,
	setFoundMessage,
	setIsShortProfileOpen,
	deleteChat,
} from '@ducks/messages/actions';
import { removeItemFromSessionStorage, setItemToSessionStorage } from '@utils/sessionStorage';
import Tooltip from '@components/_shared/Tooltip';
import tooltipsText from '@constants/tooltipsText';
import enums from '@constants/enums';
import Confirm from '@components/_shared/ModalComponents/Confirm';
import AppModal from '@components/Common/AppModal';
import { infoProfileIcon, deleteIcon, defaultMeta, confirmTitle, confirmMessage } from './constants';
import { formatDateForMessages } from '@components/Messages/utils';
import { setSnackbar } from '@ducks/common/actions';

import './ChatHeader.scss';

const { informationTooltipText, tooltipRemovalText } = tooltipsText;
const maxStringLength = 14;

function ChatHeader({
	name,
	position,
	department,
	wasOnline,
	avatar,
	foundMessages,
	channel,
	findMessagesInChat,
	clearFoundMessages,
	isSearchMessagesLoading,
	setFoundMessage,
	isLoadingMessages,
	isShortProfileOpen,
	setIsShortProfileOpen,
	companyName,
	activeChannelId,
	deleteChat,
	userRole,
	isBlocked,
	setSnackbar,
}) {
	const searchInput = useRef();
	const [isShowConfirm, setIsShowConfirm] = useState(false);
	const [searchValue, setSearchValue] = useState('');
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const [meta, setMeta] = useState(defaultMeta);
	const isStartup = userRole === enums.userRoles.startup;

	const wasOnlineText = wasOnline ? `Active ${formatDateForMessages(wasOnline.visitedAt)}` : 'Never been active';

	const clearSearch = () => {
		setIsDropdownOpen(false);
		if (!searchValue) clearFoundMessages();
	};

	useOnClickOutside([searchInput], clearSearch);

	const handleSearchMessages = value => {
		if (value?.length < 2) {
			setIsDropdownOpen(false);
			setMeta(defaultMeta);

			return clearFoundMessages();
		} else if (value?.length >= 2)
			setIsDropdownOpen(true);

		findMessagesInChat(channel.id, value, meta);
	};

	const onLoadMoreSearchResults = () => {
		const newMeta = { ...meta, pageSize: meta.pageSize + defaultMeta.pageSize };

		findMessagesInChat(channel.id, searchValue, newMeta);
		setMeta(newMeta);
	};

	useEffect(() => {
		if (foundMessages?.length) setIsDropdownOpen(true);
		else setIsDropdownOpen(false);
	}, [foundMessages.length]);

	const onSearchFocusIn = () => {
		if (foundMessages.length) setIsDropdownOpen(true);
	};

	const handleSetFoundMessage = message => {
		setFoundMessage(message);
		clearFoundMessages();
		setSearchValue('');
		setIsDropdownOpen(false);
	};

	const toggleShortProfile = () => {
		if (isBlocked) {
			setSnackbar({
				type: 'error',
				text: 'This Startup is blocked. You can\'t view his profile.',
			});

			return;
		}

		if (!isShortProfileOpen === true)
			setItemToSessionStorage('openedShortProfileChatId', activeChannelId);
		else
			removeItemFromSessionStorage('openedShortProfileChatId');

		setIsShortProfileOpen(!isShortProfileOpen);
	};

	const toggleConfirm = () => setIsShowConfirm(prevState => !prevState);

	const handleDeleteChat = id => () => deleteChat(id);

	return (
		<div className='chat-header'>
			<div className='user-card'>
				<Avatar avatar={avatar}/>
				<div className='username'>
					<Tooltip
						placement='bottom'
						message={name}
						isVisibleTooltip={name.length > maxStringLength}
					>
						<S16 bold className='name'>{name}</S16>
					</Tooltip>
					<P14>{department}</P14>
					{!!position
						&& <Tooltip
							placement='bottom-start'
							message={
								<P12><>{position}&nbsp;<S14>at</S14>&nbsp;</>{companyName}</P12>
							}
						>
							<P12><>{position}&nbsp;<S14>at</S14>&nbsp;</>{companyName}</P12>
						</Tooltip>
					}
					<S12 className='last-online'>{wasOnlineText}</S12>
				</div>
			</div>
			<div className='search-container' ref={searchInput}>
				<SearchInput
					onSearch={handleSearchMessages}
					sendValue={setSearchValue}
					value={searchValue}
					isOuterValue
					isClearable
					onFocusIn={onSearchFocusIn}
					isLoading={isSearchMessagesLoading}
					isAutoFocus={false}
					placeholder='Search this conversation'
				>
					{(!!foundMessages?.length && isDropdownOpen)
						&& <MessagesSearchResultDropdown
							messages={foundMessages}
							channel={channel}
							chooseFoundMessage={handleSetFoundMessage}
							onLoadMoreSearchResults={onLoadMoreSearchResults}
							isLoadingMessages={isLoadingMessages}
						/>
					}
				</SearchInput>
			</div>
			<div className='actions'>
				{!isStartup
					&& <Tooltip
						placement='bottom-end'
						message={
							<P12>{tooltipRemovalText}</P12>
						}
					>
						<span
							className='ellipsis'
							onClick={toggleConfirm}
						>
							{deleteIcon}
						</span>
					</Tooltip>
				}
				<Tooltip
					placement='bottom-end'
					message={
						<P12>{informationTooltipText}</P12>
					}
				>
					<div className='info-icon' onClick={toggleShortProfile}>{infoProfileIcon}</div>
				</Tooltip>
			</div>
			{isShowConfirm
				&& <AppModal
					className='confirm-pop-up'
					onClose={toggleConfirm}
					title={confirmTitle}
					outerProps={{
						successConfirm: handleDeleteChat(channel?.id),
						onClose: toggleConfirm,
						text: confirmMessage,
					}}
					component={Confirm}
				/>
			}
		</div>
	);
}

ChatHeader.defaultProps = {
	onEllipsisClick: () => {},
};

ChatHeader.propTypes = {
	name: string,
	position: string,
	department: string,
	wasOnline: shape({
		visitedAt: number,
	}),
	onEllipsisClick: func,
	avatar: shape({
		image: string,
		firstName: string,
		lastName: string,
		color: string,
	}),
	foundMessages: arrayOf(chatMessageType),
	channel: object,
	findMessagesInChat: func,
	clearFoundMessages: func,
	isSearchMessagesLoading: bool,
	setFoundMessage: func,
	isLoadingMessages: bool,
	isShortProfileOpen: bool,
	setIsShortProfileOpen: func.isRequired,
	companyName: string,
	activeChannelId: oneOfType([string, number]),
	deleteChat: func.isRequired,
	userRole: string.isRequired,
	isBlocked: bool.isRequired,
	setSnackbar: func.isRequired,
};

export default connect(({ messaging: { isShortProfileOpen, activeChannelId }, auth: { user } }) => {
	return {
		isShortProfileOpen,
		activeChannelId,
		userRole: user.role,
	};
}, {
	findMessagesInChat,
	clearFoundMessages,
	setFoundMessage,
	setIsShortProfileOpen,
	deleteChat,
	setSnackbar,
})(memo(ChatHeader));
