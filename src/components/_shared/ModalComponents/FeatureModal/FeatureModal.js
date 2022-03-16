import React, { memo, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup/dist/yup';
import { schema } from './schema';
import GridContainer from '@components/layouts/GridContainer';
import TextInput from '@components/_shared/form/TextInput';
import { P12 } from '@components/_shared/text';
import { getOptions } from './utils';
import Select from '@components/_shared/form/Select';
import PrimaryButton from '@components/_shared/buttons/PrimaryButton';
import { isEmpty } from '@utils/js-helpers';
import { func } from 'prop-types';
import { featureType } from '@constants/types';

import './FeaturesModal.scss';

const FeaturesModal = ({
	createNewFeature,
	onClose,
	selectedFeature,
	editFeature,
}) => {
	const {
		register,
		handleSubmit,
		errors,
		control,
		watch,
		setError,
		setValue,
		clearErrors,
		reset,
	} = useForm({
		resolver: yupResolver(schema),
		defaultValues: schema.default(),
		mode: 'onBlur',
	});
	const options = getOptions();
	const submitText = selectedFeature ? 'Update' : 'Add';

	useEffect(() => {
		if (!selectedFeature) return;

		reset({
			title: selectedFeature.title,
			sortOrdering: { value: selectedFeature.sortOrdering, label: selectedFeature.sortOrdering },
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const onSelectChange = fieldName => option => {
		if (!option)
			setError(fieldName, { message: 'Please select a sort order' });
		else if (!!option.length) {
			setValue(fieldName, option);
			clearErrors(fieldName);
		}

		clearErrors(fieldName);
		setValue(fieldName, option);
	};

	const handleSave = values => {
		if (!selectedFeature) {
			createNewFeature({
				...values,
				sortOrdering: values.sortOrdering.value,
				isEnterpriseUser: false,
				isMultiUser: false,
				isSingleUser: false,
			}, onClose);
		} else {
			editFeature({
				featuresData: [{
					...selectedFeature,
					...values,
					sortOrdering: values.sortOrdering.value,
				}],
				onClose,
			});
		}
	};

	return (
		<div className='features-modal'>
			<form onSubmit={handleSubmit(handleSave)}>
				<GridContainer>
					<TextInput
						id='title'
						type='title'
						name='title'
						register={register}
						isLightTheme
						placeholder='Feature name'
						error={errors.title?.message}
					/>
					{!!errors.title && <P12 className='warning-text'>{errors.title.message}</P12>}
				</GridContainer>
				<GridContainer
					customClassName='custom-line'
					template='140px'
				>
					<Select
						name='sortOrdering'
						control={control}
						register={register}
						options={options}
						placeholder='Sort order'
						value={watch('sortOrdering')}
						onChange={onSelectChange('sortOrdering')}
						isClearable
						isSearchable={false}
					/>
					{!!errors.sortOrdering && <P12 className='warning-text'>{errors.sortOrdering.message}</P12>}
				</GridContainer>
				<GridContainer
					customClassName='custom-line'
					columns={2}
				>
					<PrimaryButton
						text='Cancel'
						isOutline={true}
						isDarkTheme={false}
						onClick={onClose}
						isFullWidth={true}
					/>
					<PrimaryButton
						text={submitText}
						isDarkTheme={false}
						onClick={handleSubmit(handleSave)}
						isFullWidth={true}
						disabled={!isEmpty(errors)}
					/>
				</GridContainer>
			</form>
		</div>
	);
};

FeaturesModal.propTypes = {
	onClose: func.isRequired,
	createNewFeature: func.isRequired,
	editFeature: func.isRequired,
	selectedFeature: featureType,
};

export default memo(FeaturesModal);
