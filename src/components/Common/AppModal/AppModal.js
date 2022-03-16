import React, { memo, useRef } from 'react';
import cn from 'classnames';
import { string, func, elementType, bool, object } from 'prop-types';
import { Modal } from 'react-bootstrap';
import { stopPropagation } from '@utils';
import { useOnClickOutside } from '@utils/hooks/useOnClickOutside';
import { P16 } from '@components/_shared/text';
import { colors } from '@colors';
import { Icons } from '@icons';

import './AppModal.scss';

const AppModal = ({
	className,
	component: Component,
	isCompany,
	onClose,
	outerProps,
	staticBackdrop,
	title,
	width,
	isCloseIcon,
	isHeader,
	isScrollable,
	isCentered,
	isDarkModal,
	isDisableClickOutside,
}) => {
	const overlayRef = useRef();
	const modalDialogRef = useRef();
	const closeIcon = isDarkModal ? Icons.removeBoldIcon(colors.darkblue70) : Icons.removeIcon(colors.darkblue70);
	const modalContainerClasses = cn('modal-overlay', {
		'dark': isDarkModal,
		[className]: !!className,
	});
	const modalClasses = cn('modal-container', {
		'withoutHeader': !isHeader,
		'dark-background': isDarkModal,
	});

	const handleClose = () => onClose();

	useOnClickOutside([staticBackdrop ? {} : modalDialogRef], () => handleClose(), isDisableClickOutside);

	return (
		<div className={modalContainerClasses} ref={overlayRef}>
			<Modal.Dialog
				ref={modalDialogRef}
				onClick={stopPropagation}
				style={{ maxWidth: width }}
				scrollable={isScrollable}
				centered={isCentered}
				className={modalClasses}
			>
				{isHeader && (
					<Modal.Header>
						{title && <P16 className='modal-title' bold>{title}</P16>}
						{isCloseIcon && (
							<div className='close-icon' onClick={handleClose}>
								{Icons.removeIcon(colors.darkblue70)}
							</div>
						)}
					</Modal.Header>
				)}
				<Modal.Body>
					<Component
						{...outerProps}
						isCompany={isCompany}
						onClose={handleClose}
					/>
					{isCloseIcon && !isHeader && (
						<div className='close-icon' onClick={handleClose}>
							{closeIcon}
						</div>
					)}
				</Modal.Body>
			</Modal.Dialog>
		</div>
	);
};

AppModal.defaultProps = {
	className: '',
	onClose: () => {},
	isCompany: false,
	isScrollable: false,
	width: '768px',
	title: '',
	outerProps: {},
	isCloseIcon: true,
	isHeader: true,
	isCentered: false,
	isDarkModal: false,
	isDisableClickOutside: false,
};

AppModal.propTypes = {
	className: string,
	title: string,
	onClose: func,
	component: elementType,
	isCompany: bool,
	outerProps: object,
	staticBackdrop: bool,
	width: string,
	isCloseIcon: bool,
	isHeader: bool,
	isScrollable: bool,
	isCentered: bool,
	isDarkModal: bool,
	isDisableClickOutside: bool,
};

export default memo(AppModal);
