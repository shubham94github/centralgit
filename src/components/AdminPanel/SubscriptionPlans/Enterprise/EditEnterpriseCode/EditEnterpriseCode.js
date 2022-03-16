import React, { memo } from 'react';
import { bool, func, string } from 'prop-types';
import { enterpriseType } from '@constants/types';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { schema } from './schema';
import GridContainer from '@components/layouts/GridContainer';
import TextInput from '@components/_shared/form/TextInput/TextInput';
import { P12 } from '@components/_shared/text';
import PrimaryButton from '@components/_shared/buttons/PrimaryButton';
import { generateId } from '@utils/generateId';
import { isEmpty } from '@utils/js-helpers';
import enums from '@constants/enums';

const EditEnterpriseCode = ({
	enterpriseCode,
	updateCode,
	onClose,
	isLoading,
	submitButtonText,
}) => {
	const {
		handleSubmit,
		errors,
		setValue,
		register,
		watch,
		control,
		formState: { dirtyFields },
	} = useForm({
		resolver: yupResolver(schema),
		mode: enums.validationMode.onTouched,
		defaultValues: {
			...schema.default(),
			code: enterpriseCode.code,
		},
	});

	const onSubmit = values => updateCode({
		id: enterpriseCode.id,
		enterpriseCode: {
			...enterpriseCode,
			code: values.code,
		},
	});

	const generateEnterpriseCode = () => {
		const code = generateId();

		setValue('code', code, { shouldValidate: true, shouldDirty: true });
	};

	return (
		<form className='edit-enterprise-code'>
			<GridContainer template='3fr 1fr' gap='15px'>
				<div className='field-container'>
					<TextInput
						control={control}
						name='code'
						id='code'
						register={register}
						isError={!!errors?.code}
						isLightTheme
						placeholder='Enterprise сode'
						value={watch('code')}
					/>
					<P12 className='warning-text'>{!!errors.code && errors.code.message}</P12>
				</div>
				<div className='field-container'>
					<PrimaryButton
						className='filter-btn admin-primary full-width'
						onClick={generateEnterpriseCode}
					>
						Generate
					</PrimaryButton>
				</div>
			</GridContainer>
			<GridContainer columns={2} gap='15px'>
				<PrimaryButton isOutline onClick={onClose}>Cancel</PrimaryButton>
				<PrimaryButton
					onClick={handleSubmit(onSubmit)}
					isLoading={isLoading}
					disabled={!isEmpty(errors) || !watch('code') || !dirtyFields.code}
				>
					{submitButtonText}
				</PrimaryButton>
			</GridContainer>
		</form>
	);
};

EditEnterpriseCode.propTypes = {
	enterpriseCode: enterpriseType,
	updateCode: func,
	onClose: func,
	submitButtonText: string,
	isLoading: bool,
};

export default memo(EditEnterpriseCode);
