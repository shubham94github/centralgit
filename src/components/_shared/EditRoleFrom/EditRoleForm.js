import React, { memo, useMemo, useState } from 'react';
import { arrayOf, bool, func } from 'prop-types';
import { useForm } from 'react-hook-form';
import { schema } from './schema';
import DataTable from 'react-data-table-component';
import Select from '@components/_shared/form/Select';
import { P12 } from '@components/_shared/text';
import GridContainer from '@components/layouts/GridContainer';
import {
	fieldNames,
	placeHolders,
	errorMessages,
	hintText,
	alreadyExistRoleText,
	roleWithSameNameErrorText,
} from './constants';
import PrimaryButton from '@components/_shared/buttons/PrimaryButton';
import LoadingOverlay from '@components/_shared/LoadingOverlay';
import { findExistingRole, generateColumns, generateNameOptions, generateTableData } from './utils';
import incrementNameCount from '@utils/incrementNameCount';
import TextInput from '@components/_shared/form/TextInput';
import { infoIcon } from '@components/AdminPanel/RolesAndPermissions/constants';
import Markdown from 'markdown-to-jsx';
import { userRoleType } from '@constants/types';
import { deepEqual, isEmpty } from '@utils/js-helpers';
import replaceBreakLinesWithAsterisk from '@utils/replaceBreakLinesWithAsterisk';
import enums from '@constants/enums';
import { yupResolver } from '@hookform/resolvers/yup';

import './EditRoleForm.scss';

const EditRoleForm = ({
	onClose,
	onSave,
	isLoading,
	userRoles,
	editingUserRole,
}) => {
	const defaultTableData = useMemo(() => generateTableData(editingUserRole), [editingUserRole]);
	const nameOptions = generateNameOptions(userRoles);

	const [tableData, setTableData] = useState(defaultTableData);
	const [similarRole, setSimilarRole] = useState();

	const defaultValues = schema.default();

	const {
		register,
		setValue,
		handleSubmit,
		watch,
		control,
		errors,
		setError,
		clearErrors,
		formState: { isDirty, dirtyFields },
	} = useForm({
		resolver: yupResolver(schema),
		defaultValues: {
			...defaultValues,
			[fieldNames.name]: editingUserRole?.name || defaultValues.name,
		},
		mode: enums.validationMode.onTouched,
		reValidateMode: enums.validationMode.onChange,
	});

	const setPermission = value => {
		const updatedTableData = tableData.map(item => {
			if (item.value !== value) return item;

			return {
				...item,
				isChecked: !item.isChecked,
			};
		});

		const similarRole = findExistingRole(userRoles, updatedTableData);

		setSimilarRole(similarRole);
		setTableData(updatedTableData);
	};

	const columns = generateColumns({ setPermission });

	const updatePermissionsBySelectName = userRole => {
		const chosenRole = userRoles.find(item => userRole?.value === item.id);

		if (!chosenRole || !chosenRole.permissions) return setTableData(defaultTableData);

		const updatedTableData = tableData.map(item => ({
			...item,
			isChecked: chosenRole.permissions.includes(item.value),
		}));

		setTableData(updatedTableData);

		const role = findExistingRole(userRoles, updatedTableData);

		setSimilarRole(role);
	};

	const onSelectChange = fieldName => option => {
		if (!option) {
			clearErrors(fieldName);
			setValue(fieldName, null);
			setValue(fieldNames.name, !!editingUserRole ? editingUserRole.name : '');
			setTableData(defaultTableData);
		} else {
			const incrementedName = incrementNameCount(option.label, nameOptions.map(item => item.label));

			updatePermissionsBySelectName(option);
			clearErrors(fieldName);
			setValue(fieldName, option, { shouldValidate: true });
			setValue(fieldNames.name, incrementedName, { shouldValidate: true });
		}
	};

	const handleSave = values => {
		const isNameInExistingRole = userRoles.some(role => role.name === values.name);

		if (!editingUserRole && isNameInExistingRole)
			return setError(fieldNames.name, { message: errorMessages.existingRoleName });

		onSave({
			name: values.name,
			permissions: tableData.filter(item => item.isChecked).map(item => item.value),
			id: editingUserRole?.id,
		});
	};

	const isEmptyPermissions = useMemo(() =>
		tableData.filter(item => !item.isCategory).every(item => !item.isChecked),
	[tableData]);

	const formIsChanged = !!editingUserRole
		&& ((!isEmpty(dirtyFields) && isDirty) || !deepEqual(tableData, defaultTableData));

	const sameRolePermissionsExistMessage = useMemo(() => {
		return similarRole
			? alreadyExistRoleText
			: '';
	}, [similarRole]);

	const isSaveBtnDisabled = useMemo(() => {
		return (!editingUserRole ? !watch(fieldNames.name) : !formIsChanged)
			|| isEmptyPermissions
			|| !!similarRole
			|| !isEmpty(errors);
	}, [editingUserRole, formIsChanged, isEmptyPermissions, similarRole, watch, errors]);

	const validateRoleName = value => {
		if (userRoles.some(item => item.name === value))
			setError(fieldNames.name, { message: roleWithSameNameErrorText });
	};

	const handleClearErrorField = fieldName => () => clearErrors(fieldName);

	return (
		<div className='edit-role-form'>
			<GridContainer>
				<div className='description'>
					<div className='icon'>{infoIcon}</div>
					<Markdown options={{ forceInline: true, wrapper: 'div' }}>
						{replaceBreakLinesWithAsterisk(hintText)}
					</Markdown>
				</div>
			</GridContainer>
			<GridContainer template={'1fr 1fr'} gap={'30px'}>
				<div className='field-container'>
					<TextInput
						onChange={handleClearErrorField(fieldNames.name)}
						onBlur={validateRoleName}
						isLightTheme
						isError={!!errors[fieldNames.name]}
						name={fieldNames.name}
						isBorder={false}
						id={fieldNames.name}
						register={register}
						control={control}
						placeholder={placeHolders[fieldNames.name]}
						setValue={setValue}
						value={watch(fieldNames.name)}
					/>
					{errors[fieldNames.name] && <P12 className='warning-text'>{errors[fieldNames.name].message}</P12>}
				</div>
				<div className='field-container'>
					<Select
						isBorder={false}
						isClearable
						control={control}
						isCreatable={false}
						isError={!!errors.copyRightFrom}
						isSearchable={false}
						name={fieldNames.copyRightFrom}
						onChange={onSelectChange(fieldNames.copyRightFrom)}
						options={nameOptions}
						placeholder={placeHolders.copyRightFrom}
						register={register}
						value={watch(fieldNames.copyRightFrom)}
						isMulti={false}
						contentEditable={false}
						isFilter={false}
					/>
					{!!errors[fieldNames.copyRightFrom]
						&& <P12 className='warning-text'>{errors.copyRightFrom.message}</P12>
					}
				</div>
			</GridContainer>
			<div className='permissions-table main-table'>
				<DataTable
					withFilters={false}
					withPagination={false}
					data={tableData}
					columns={columns}
				/>
			</div>
			{sameRolePermissionsExistMessage
				&& <GridContainer>
					<P12 className='error-text'>{sameRolePermissionsExistMessage}</P12>
				</GridContainer>
			}
			<div className='btn-container'>
				<PrimaryButton
					onClick={onClose}
					isOutline
					isFullWidth
				>
					Cancel
				</PrimaryButton>
				<PrimaryButton
					onClick={handleSubmit(handleSave)}
					disabled={isSaveBtnDisabled}
					isFullWidth
				>
					Save
				</PrimaryButton>
			</div>
			{isLoading && <LoadingOverlay/>}
		</div>
	);
};

EditRoleForm.propTypes = {
	onClose: func,
	onSave: func,
	isLoading: bool,
	userRoles: arrayOf(userRoleType),
	editingUserRole: userRoleType,
};

export default memo(EditRoleForm);
