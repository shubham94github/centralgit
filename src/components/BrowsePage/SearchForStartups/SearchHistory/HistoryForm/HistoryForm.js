import React, { memo } from 'react';
import { connect } from 'react-redux';
import cn from 'classnames';
import { bool, func, number, string } from 'prop-types';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import enums from '@constants/enums';
import { schema } from './schema';
import { P16, P12 } from '@components/_shared/text';
import { saveMessage } from './constants';
import { colors } from '@colors';
import TextInput from '@components/_shared/form/TextInput';
import PrimaryButton from '@components/_shared/buttons/PrimaryButton';
import { isEmpty } from '@utils/js-helpers';
import { editSearchHistory, removeSavedSearch, setSearchHistory } from '@ducks/browse/action';
import { Icons } from '@icons';

import './HistoryForm.scss';

const closeIcon = Icons.close(colors.darkblue70);

const HistoryForm = ({
	onClose,
	isEditForm,
	isRemoveForm,
	isCreateForm,
	titleValue,
	title,
	setSearchHistory,
	editSearchHistory,
	savedSearchId,
	removeSavedSearch,
}) => {
	const iconClasses = cn('clickable', { 'close-icon': !title });
	const textButton = isCreateForm
		? 'Save'
		: 'Edit saved search title';
	const titleClasses = cn('title-wrapper', { 'remove': isRemoveForm });

	const {
		register,
		handleSubmit,
		errors,
	} = useForm({
		resolver: yupResolver(schema),
		mode: enums.validationMode.onBlur,
		defaultValues: { title: titleValue },
	});

	const onSubmit = ({ title }) => {
		if (isCreateForm)
			setSearchHistory({ data: { title } });
		else if (isEditForm) {
			editSearchHistory({ data: {
				savedSearchId,
				title,
			} });
		}

		onClose();
	};

	const removeHandler = () => {
		removeSavedSearch({ data: { savedSearchId } });

		onClose();
	};

	return (
		<div className='history-form-container'>
			<div className={titleClasses}>
				{title && <P16 bold>{title}</P16>}
				<div className={iconClasses} onClick={onClose}>{closeIcon}</div>
			</div>
			{!isRemoveForm
				&& <div>
					<TextInput
						isError={!!errors.title?.message}
						name='title'
						placeholder='Title'
						register={register}
						type='text'
						isLightTheme
						isBorder
					/>
					{errors.title && <P12 className='warning-text'>{errors.title.message}</P12>}
				</div>
			}
			{isRemoveForm
				&& <P16 className='text-center' bold>{titleValue}</P16>
			}
			{isRemoveForm
				? <PrimaryButton
					text='Delete This Saved Search'
					onClick={removeHandler}
					isFullWidth
				/>
				: <PrimaryButton
					text={textButton}
					onClick={handleSubmit(onSubmit)}
					disabled={!isEmpty(errors)}
					isFullWidth
				/>
			}
			{isCreateForm && <P12>{saveMessage}</P12>}
		</div>
	);
};

HistoryForm.defaultProps = {
	isEditForm: false,
	titleValue: '',
	isRemoveForm: false,
	isCreateForm: false,
};

HistoryForm.propTypes = {
	isEditForm: bool,
	titleValue: string,
	title: string,
	isRemoveForm: bool,
	isCreateForm: bool,
	onClose: func.isRequired,
	setSearchHistory: func.isRequired,
	editSearchHistory: func.isRequired,
	removeSavedSearch: func.isRequired,
	savedSearchId: number,
};

export default connect(null, {
	setSearchHistory,
	editSearchHistory,
	removeSavedSearch,
})(memo(HistoryForm));
