import React, { memo, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { object, array, bool, func, string } from 'prop-types';
import PrimaryButton from '@components/_shared/buttons/PrimaryButton';
import FormWrapper from '@components/_shared/form/FormWrapper';
import Select from '@components/_shared/form/Select';
import LoadingOverlay from '@components/_shared/LoadingOverlay';
import { P14, P16 } from '@components/_shared/text';
import enums from '@constants/enums';
import { handleCreateSelectOption } from '@utils/hooks/handleCreateSelectOption';
import { yupResolver } from '@hookform/resolvers/yup';
import GridContainer from '@components/layouts/GridContainer';
import { isEmpty } from '@utils/js-helpers';
import prepareSelectStyles from '@components/_shared/form/Select/prepareSelectStyles';

import './RelatedTags.scss';

function RelatedTags({
	schema,
	isLoading,
	onSubmit,
	tags,
	redirectToFinalPage,
	stepText,
	userTags,
}) {
	const {
		register,
		handleSubmit,
		setValue,
		control,
		errors,
		setError,
		clearErrors,
		getValues,
		reset,
	} = useForm({
		mode: enums.validationMode.all,
		resolver: yupResolver(schema),
		reValidateMode: enums.reValidationMode.onChange,
		defaultValues: schema.default(),
	});

	useEffect(() => {
		if (userTags?.length) reset({ relatedTags: [ ...userTags ] });
	}, [userTags, reset]);

	const onSelectChange = fieldName => option => {
		if (!option)
			setError(fieldName, { message: `Related tags is required field` });

		clearErrors(fieldName);
		setValue(fieldName, option);
	};

	const resetTags = () => reset({ relatedTags: [ ...userTags ] });

	return (
		<FormWrapper
			className='related-tags-container'
			onSubmit={onSubmit}
		>
			{stepText
				&& <GridContainer>
					<P14 className='step-style'>
						{stepText}
					</P14>
				</GridContainer>
			}
			<GridContainer>
				<P16 bold={true} className='mb-3'>
					Associated tags
				</P16>
			</GridContainer>
			<GridContainer>
				<P14 className='mb-3'>
					Add or update tags associated with your Business.
					This will help RetailHub promote your Startup to the appropriate Retailers.
					You can add up to 12 tags.
				</P14>
			</GridContainer>
			<GridContainer>
				<Select
					id='relatedTags'
					name='relatedTags'
					options={tags}
					isError={!!errors.relatedTags}
					errorMessage={errors?.relatedTags?.message}
					register={register}
					placeholder='Add a tag'
					isMulti={true}
					isClearable={true}
					isCreatable={true}
					customStyles={prepareSelectStyles(null, null, null, true)}
					control={control}
					onChange={onSelectChange('relatedTags')}
					handleCreateOpt={handleCreateSelectOption({
						setValue,
						getValues,
						setError,
						clearErrors,
						fieldName: 'relatedTags',
					})}
				/>
			</GridContainer>
			<GridContainer
				columns={2}
				customClassName='actions'
			>
				{stepText
					? <PrimaryButton
						className='float-right'
						onClick={redirectToFinalPage}
						disabled={isLoading}
						text='Skip the step'
						isOutline
					/>
					: <PrimaryButton
						className='float-right'
						onClick={resetTags}
						disabled={isLoading || isEmpty(getValues().relatedTags)}
						text='Reset'
						isOutline
					/>
				}
				<PrimaryButton
					className='float-right'
					onClick={handleSubmit(onSubmit)}
					disabled={isLoading || isEmpty(getValues().relatedTags)}
					text={stepText ? 'Continue' : 'Save'}
				/>
			</GridContainer>
			{isLoading && <LoadingOverlay/>}
		</FormWrapper>
	);
}

RelatedTags.defaultProps = {
	tags: [],
	userTags: [],
};

RelatedTags.propTypes = {
	schema: object.isRequired,
	isLoading: bool,
	onSubmit: func.isRequired,
	redirectToFinalPage: func,
	tags: array,
	stepText: string,
	userTags: array,
};

export default memo(RelatedTags);
