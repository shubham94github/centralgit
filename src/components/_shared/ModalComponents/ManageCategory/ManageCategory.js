import React, { memo, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { schema } from './schema';
import { Col, Row } from 'react-bootstrap';
import TextInput from '@components/_shared/form/TextInput';
import { P12 } from '@components/_shared/text';
import PrimaryButton from '@components/_shared/buttons/PrimaryButton';
import { func, object } from 'prop-types';
import { connect } from 'react-redux';
import {
	handleCreateCategory,
	handleUpdateCategory,
} from '@ducks/admin/actions';
import Select from '@components/_shared/form/Select';
import { getOptions } from './selectData';
import { getCategoryIcon } from '@utils/getCategoryIcon';
import Tooltip from '@components/_shared/Tooltip';
import { isEmpty } from '@utils/js-helpers';
import { Icons } from '@icons';
import GridContainer from '@components/layouts/GridContainer';

import './ManageCategory.scss';

const FilesExtensions = '.svg';

const ManageCategory = ({
	onClose,
	handleCreateCategory,
	categoryForEdit,
	setSelectedCategory,
	handleUpdateCategory,
	parentCategory,
	setParentCategory,
}) => {
	const { register, handleSubmit, errors, control, watch, setError, setValue, clearErrors, reset } = useForm({
		resolver: yupResolver(schema),
		defaultValues: schema.default(),
		mode: 'onBlur',
	});
	const [sectorsCategoryIcon, setSectorsCategoryIcon] = useState();
	const [areasCategoryIcon, setAreasCategoryIcon] = useState();
	const sectorsIcon = getCategoryIcon(sectorsCategoryIcon
		? { image: URL.createObjectURL(sectorsCategoryIcon) }
		: categoryForEdit?.logo);
	const areasIcon = getCategoryIcon(areasCategoryIcon
		? { image: URL.createObjectURL(areasCategoryIcon) }
		: categoryForEdit?.areasLogo);
	const sectorsFileInputRef = useRef();
	const areasFileInputRef = useRef();
	const editIcon = Icons.editIcon();
	const options = getOptions();
	const isAvailableEditIcons = (!categoryForEdit || categoryForEdit.level === 1) && !parentCategory;

	useEffect(() => {
		if (categoryForEdit) {
			reset({
				...categoryForEdit,
				weight: options.find(option => option.value === categoryForEdit.weight),
			});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const handleCancel = () => {
		if (categoryForEdit) setSelectedCategory(null);
		if (parentCategory) setParentCategory(null);
		onClose();
	};

	const handleSave = data => {
		if (categoryForEdit) {
			handleUpdateCategory({
				...data,
				id: categoryForEdit.id,
				weight: data.weight.value,
				parentId: categoryForEdit.parentId,
				parentNames: categoryForEdit.parentNames,
				sectorsIcon: sectorsCategoryIcon ? sectorsCategoryIcon : null,
				areasIcon: areasCategoryIcon ? areasCategoryIcon : null,
			});
		} else if (parentCategory) {
			handleCreateCategory({
				...data,
				weight: data.weight.value,
				parentId: parentCategory.id,
			});
		} else {
			handleCreateCategory({
				...data,
				weight: data.weight.value,
				parentId: null,
				sectorsIcon: sectorsCategoryIcon ? sectorsCategoryIcon : null,
				areasIcon: areasCategoryIcon ? areasCategoryIcon : null,
			});
		}

		handleCancel();
	};

	const onSelectChange = fieldName => option => {
		if (!option)
			setError(fieldName, { message: `Weight is required field` });
		else if (!!option.length) {
			setValue(fieldName, option);
			clearErrors(fieldName);
		}

		clearErrors(fieldName);
		setValue(fieldName, option);
	};

	const sectorsHandleChange = e => setSectorsCategoryIcon(e.target.files[0]);

	const areasHandleChange = e => setAreasCategoryIcon(e.target.files[0]);

	const sectorsHandleClick = () => sectorsFileInputRef.current.click();
	const areasHandleClick = () => areasFileInputRef.current.click();

	return (
		<div className='manage-category'>
			<form
				onSubmit={handleSubmit(handleSave)}
			>
				<Row>
					<Col>
						<TextInput
							id='name'
							type='name'
							name='name'
							register={register({ required: true })}
							isLightTheme
							placeholder='Category name'
							error={errors.name?.message}
						/>
						<P12 className='warning-text'>{errors.name && errors.name.message}</P12>
					</Col>
				</Row>
				<Row className='title'>
					<Col>
						<TextInput
							id='childHeader'
							type='childHeader'
							name='childHeader'
							register={register({ required: true })}
							isLightTheme
							placeholder='Title for Subcategories list'
							error={errors.childHeader?.message}
						/>
						<P12 className='warning-text'>{errors.childHeader && errors.childHeader.message}</P12>
					</Col>
				</Row>
				<GridContainer
					customClassName='custom-line'
					template='111px 210px 210px'
				>
					<div>
						<Select
							name='weight'
							control={control}
							register={register({ required: true })}
							options={options}
							placeholder='Weight'
							value={watch('weight')}
							onChange={onSelectChange('weight')}
							isClearable
							isError={!!errors?.weight?.message}
						/>
					</div>
					{isAvailableEditIcons
						&& <div className='upload-icon'>
							<input
								ref={sectorsFileInputRef}
								type='file'
								hidden
								className='file-input'
								onChange={sectorsHandleChange}
								accept={FilesExtensions}
							/>
							<Tooltip
								placement='top-start'
								message={
									<P12>
										Please use svg extension. Max size<br/>of icon is 5mb
									</P12>
								}
							>
								{sectorsIcon
									? <div onClick={sectorsHandleClick}>{sectorsIcon}</div>
									: <div
										className='edit-icon'
										onClick={sectorsHandleClick}
									>
										<div className='edit-logo-icon'>
											{editIcon}
										</div>
									</div>
								}
							</Tooltip>
							<P12 className='upload-text'>
								<span className='bold'>Sectors of Competence:<br/></span>
								{sectorsIcon
									? 'update an icon'
									: 'upload an icon'
								}
							</P12>
						</div>
					}
					{isAvailableEditIcons
						&& <div className='upload-icon'>
							<input
								ref={areasFileInputRef}
								type='file'
								hidden
								className='file-input'
								onChange={areasHandleChange}
								accept={FilesExtensions}
							/>
							<Tooltip
								placement='top-start'
								message={
									<P12>
										Please use svg extension. Max size<br/>of icon is 5mb
									</P12>
								}
							>
								{areasIcon
									? <div onClick={areasHandleClick}>{areasIcon}</div>
									: <div
										className='edit-icon'
										onClick={areasHandleClick}
									>
										<div className='edit-logo-icon'>
											{editIcon}
										</div>
									</div>
								}
							</Tooltip>
							<P12 className='upload-text'>
								<span className='bold'>Areas of Interest:<br/></span>
								{areasIcon
									? 'update an icon'
									: 'upload an icon'
								}
							</P12>
						</div>
					}
				</GridContainer>
				<P12 className='warning-text warning-text__width'>{errors.weight && errors.weight.message}</P12>
				<Row className='actions-row'>
					<Col>
						<PrimaryButton
							isOutline={true}
							isDarkTheme={false}
							onClick={handleCancel}
							isFullWidth={true}
						>
							Cancel
						</PrimaryButton>
					</Col>
					<Col>
						<PrimaryButton
							isDarkTheme={false}
							onClick={handleSubmit(handleSave)}
							isFullWidth={true}
							disabled={!isEmpty(errors)}
						>
							Save
						</PrimaryButton>
					</Col>
				</Row>
			</form>
		</div>
	);
};

ManageCategory.propTypes = {
	onClose: func.isRequired,
	handleCreateCategory: func.isRequired,
	handleUpdateCategory: func.isRequired,
	categoryForEdit: object,
	setSelectedCategory: func,
	parentCategory: object,
	setParentCategory: func,
};

ManageCategory.defaultProps = {};

export default connect(null, {
	handleCreateCategory,
	handleUpdateCategory,
})(memo(ManageCategory));
