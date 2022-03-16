import React, { memo, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { P12, P14, P16, S14, S16 } from '@components/_shared/text';
import Select from '@components/_shared/form/Select';
import TextInput from '@components/_shared/form/TextInput';
import DatePicker from '@components/_shared/form/DatePicker';
import PrepareSelectStyles from '../form/Select/prepareSelectStyles';
import {
	companyTypes,
	radioFields,
	targetRegions,
	accountType,
	retailerGridArea,
	startupGridArea,
	retailerRoles,
	infoIcon,
} from './constants';
import PrimaryButton from '@components/_shared/buttons/PrimaryButton';
import RadioButton from '@components/_shared/form/RadioButton';
import TextArea from '@components/_shared/form/TextArea';
import { handleCreateSelectOption } from '@utils/hooks/handleCreateSelectOption';
import { array, bool, func, object, oneOf, oneOfType, string } from 'prop-types';
import enums from '@constants/enums';
import { onSelectChange } from '@utils/onSelectChange';
import { prepareSelectFields } from '@utils/prepareSelectFields';
import prepareSelectStyles from '@utils/prepareSelectSyles';
import LoadingOverlay from '@components/_shared/LoadingOverlay';
import { withoutLettersAndSymbolsRegExp } from '@utils/validation';
import { conditionsForSendConfirm } from '@utils/conditionForSendConfirm';
import AppModal from '@components/Common/AppModal';
import ConfirmSubmit from '@components/_shared/CompanyInfo/ConfirmSubmit';
import Confirm from '@components/_shared/ModalComponents/Confirm';
import { resetCountry } from '@utils/resetValue';
import GridContainer from '@components/layouts/GridContainer';

import {
	companyDescriptionPlaceholder,
	solutionsProductsAndServicesPlaceholder,
} from '@components/_shared/CompanyInfo/constants';
import Tooltip from '@components/_shared/Tooltip';
import { replaceHtmlTags, replaceTagBr, replaceTagP } from '@utils/replaceHtmlTags';

import './CompanyDetailsForm.scss';

const { accountTypesAdminPanel } = enums;

const CompanyDetailsForm = ({
	countries,
	profile,
	updateCompanyDetails,
	toggleCompanyDetailsEditModal,
	isLoading,
	platformPartners,
	isStartup,
	textFields,
	selectedDefaultValues,
	selectedAccountType,
	setSelectedAccountType,
	revalidateTargetMarket,
	numberOfClientsError,
	numberOfClientsValidationHandler,
	schema,
	fullTopLevelCategories,
	tags,
}) => {
	const [isShowConfirm, setIsShowConfirm] = useState(false);
	const [isWarningsLengthMessage, setIsWarningsLengthMessage] = useState({
		isWarningCompanyDescription: false,
		isWarningSolutionProductsServices: false,
	});

	const isIncompleteOrImported = useMemo(() =>
		selectedAccountType === accountTypesAdminPanel.INCOMPLETE
		|| selectedAccountType === accountTypesAdminPanel.IMPORTED, [selectedAccountType]);

	const maxDate = new Date();
	const selectStyles = useMemo(() => prepareSelectStyles(), []);

	const {
		clearErrors,
		control,
		errors,
		getValues,
		handleSubmit,
		register,
		reset,
		setError,
		setValue,
		watch,
		trigger,
	} = useForm({
		resolver: yupResolver(schema),
		mode: enums.validationMode.all,
		reValidateMode: enums.reValidationMode.all,
		criteriaMode: enums.criteriaMode.firstError,
		defaultValues: {
			...schema.default(),
			city: profile?.city || schema.default().city,
			companyLegalName: profile?.companyLegalName || schema.default().companyLegalName,
			companyShortName: profile?.companyShortName || schema.default().companyShortName,
			linkedInCompanyPage: profile?.linkedInCompanyPage || schema.default().linkedInCompanyPage,
			urlOfCompanyWebsite: profile?.urlOfCompanyWebsite || schema.default().urlOfCompanyWebsite,
			companyDescription: profile?.companyDescription
				? profile?.companyDescription
				: schema.default().companyDescription,
			phoneNumber: profile?.phoneNumber?.toString() || schema.default().phoneNumber,
			...selectedDefaultValues,
		},
	});

	useEffect(() => {
		/* eslint-disable react/prop-types */
		const field = profile.country;

		resetCountry(field, setValue, countries);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [countries?.length, isStartup]);

	const hideImportedProfile = profile.accountType !== 'Imported';

	const onChangeAccountTypeHandler = value => () => {
		setSelectedAccountType(value);
		clearErrors();
	};

	const closeConfirm = () => setIsShowConfirm(false);

	const onSubmit = async values => {
		const preparedFields = prepareSelectFields(values);
		const companyDescriptionLength
			= replaceHtmlTags(replaceTagP(replaceTagBr(values?.companyDescription)))?.trim().length;
		const solutionProductsServicesLength
			= replaceHtmlTags(replaceTagP(replaceTagBr(values?.solutionProductsServices)))?.trim().length;

		const data = isStartup
			? {
				...preparedFields,
				accountType: selectedAccountType,
				countryId: values.countryId?.id && values.countryId.id,
				foundedAt: values.foundedAt && values.foundedAt.getTime(),
				targetMarket: values.targetMarket && values.targetMarket.map(({ label }) => label),
				clientsList: values.clientsList?.map(({ value }) => value),
				companyType: values.companyType?.value && values.companyType.value,
				platformPartners: values.platformPartners && values.platformPartners.map(({ value }) => value),
				presenceInCountriesIds: values.presenceInCountriesIds
					&& values.presenceInCountriesIds.map(({ id }) => id),
				numberOfClients: +values.numberOfClients,
				totalFundingAmount: +values.totalFundingAmount,
				companyDescription: companyDescriptionLength
					? values.companyDescription
					: null,
				solutionProductsServices: solutionProductsServicesLength
					? values.solutionProductsServices
					: null,
			}
			: {
				...preparedFields,
				countryId: values.countryId?.id && values.countryId.id,
				categoryIds: values.categoryIds
					&& values.categoryIds.map(({ id }) => id),
				tags: values.tags
					&& values.tags.map(({ value }) => value),
				brandName: values.companyShortName,
				companyDescription: companyDescriptionLength
					? values.companyDescription
					: null,
				legalName: values.companyLegalName.trim().length
					? values.companyLegalName
					: null,
			};

		closeConfirm();
		toggleCompanyDetailsEditModal();
		updateCompanyDetails({ data, id: profile.id });
	};

	useEffect(() => {
		if (isStartup)
			revalidateTargetMarket(setValue, watch('targetMarket'));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [watch('targetMarket'), isStartup]);

	const trimValues = fieldName => value => setValue(fieldName, value.trim(), { shouldValidate: true });

	const onDateChange = fieldName => date => {
		if (!date)
			setError(fieldName, { message: `Founded date is required field` });
		 else
			clearErrors(fieldName);

		setValue(fieldName, date ? new Date(date) : date);
	};

	useEffect(() => {
		if (isStartup)
			numberOfClientsValidationHandler(watch, setValue, 'clientsList');
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ watch('clientsList'), isStartup]);

	useEffect(() => {
		if (isStartup)
			numberOfClientsValidationHandler(watch, setValue, 'numberOfClients');
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ watch('numberOfClients'), isStartup]);

	useEffect(() => {
		const value = getValues('totalFundingAmount');

		setValue('totalFundingAmount', value?.replaceAll(withoutLettersAndSymbolsRegExp, ''));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [watch('totalFundingAmount')]);

	const handleConditionsForSendConfirm = () => {
		if (!isStartup) return handleSubmit(onSubmit)();

		const {
			isWarningCompanyDescription,
			isWarningSolutionProductsServices,
		} = conditionsForSendConfirm(watch('companyDescription'), watch('solutionProductsServices'));

		if (isStartup && (isWarningCompanyDescription || isWarningSolutionProductsServices)) {
			setIsShowConfirm(true);
			setIsWarningsLengthMessage({ isWarningCompanyDescription, isWarningSolutionProductsServices });
		}
		else
			handleSubmit(onSubmit)();
	};

	const handleSuccessSendConfirm = () => {
		closeConfirm();
		handleSubmit(onSubmit)();
	};

	const onTextInputChange = fieldName => e => {
		if (fieldName === 'phoneNumber') return setValue(fieldName, e);

		setValue(fieldName, e.target.value);
	};

	const countryId = watch('countryId');

	useEffect(() => {
		trigger();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedAccountType, countryId]);

	return (
		<div className='company-detail-container'>
			{isShowConfirm
				&& <AppModal
					className='confirm-save-pop-up'
					width='690px'
					onClose={closeConfirm}
					title='Are you sure you want to save?'
					outerProps={{
						component: ConfirmSubmit,
						confirmTextButton: 'Proceed to Save',
						declineTextButton: 'Cancel',
						successConfirm: handleSuccessSendConfirm,
						componentProps: { isWarningsLengthMessage },
					}}
					component={Confirm}
				/>
			}
			{profile
				&& <form onSubmit={handleSubmit(onSubmit)}>
					<GridContainer template={isStartup ? '570px auto' : '560px auto'}>
						<div>
							<GridContainer
								columns={2}
								gridTemplateAreas={isStartup ? startupGridArea : retailerGridArea}
							>
								{textFields.map(({ name, id, placeholder, type }) => {
									return (
										<div style={{ gridArea: id }} key={name+id}>
											{id === 'countryId'
												? <Select
													control={control}
													isCreatable={false}
													isError={!!errors.name}
													isSearchable
													name={name}
													onChange={onSelectChange({
														fieldName: name,
														setError,
														setValue,
														clearErrors,
													})}
													options={countries}
													placeholder={isStartup ? 'HQ Country' : 'Country'}
													register={register}
													value={watch(name)}
													isFilterForStart
													isTopPlaceholder
												/>
												: id === 'founded'
													? <DatePicker
														control={control}
														isSingleDate={true}
														label={placeholder}
														maxDate={maxDate}
														name={name}
														onChange={onDateChange(name)}
														register={register}
														value={watch(name)}
														isWithInput
														setValue={setValue}
														reset={reset}
														clearErrors={clearErrors}
														isError={!!errors[name]}
														setError={setError}
														isValidOrEmpty={isIncompleteOrImported}
														placeholder='DD/MM/YYYY'
													/>
													: <TextInput
														control={control}
														id={id}
														isError={!!errors[name]}
														isLightTheme
														name={name}
														onBlur={trimValues(name)}
														placeholder={placeholder}
														register={register}
														value={watch(name)}
														type={type}
														onChange={onTextInputChange(name)}
														setValue={setValue}
													/>
											}
											<P12 className='warning-text'>
												{!!errors[name] && errors[name].message}
											</P12>
										</div>
									);
								})
								}
							</GridContainer>
						</div>
						<GridContainer columns={isStartup ? 1 : 2} customClassName='company-types'>
							{isStartup && Object.keys(accountType).map((key, i) => {
								const { title, name, values } = accountType[key];

								return (
									<div key={`${i}${key}`}>
										<div className='mb-10'>
											<S16 bold>{title}</S16>
										</div>
										{
											values.map(({ value, label, id }) => {
												if (hideImportedProfile && value === 'Imported') return;

												return (
													<div className='checkbox-margin' key={id}>
														<RadioButton
															isFilter={true}
															id={id}
															key={id}
															label={label}
															name={name}
															checked={selectedAccountType === value}
															value={value}
															onChange={onChangeAccountTypeHandler}
														/>
													</div>
												);
											})
										}
										<P12 className='warning-text'>
											{!!errors[name] && errors[name].message}
										</P12>
									</div>
								);
							})
							}
							{!isStartup && Object.keys(retailerRoles).map((key, i) => {
								const { title, name, values } = retailerRoles[key];
								const disabled = key === 'individualRoles'
									? false
									: profile.isPublic;

								return (
									<div key={`${i}${key}`}>
										<div className='mb-10 type-title'>
											<S16 bold>{title}</S16>
											{key !== 'individualRoles' && disabled
												&& <Tooltip
													placement='bottom'
													width='188px'
													message={
														<P12 className='parent-paths'>
															Email domain should not be public
															to select this company type
														</P12>
													}
												>
													<div>{infoIcon}</div>
												</Tooltip>
											}
										</div>
										{
											values.map(({ value, label, id }) => {
												return (
													<div className='checkbox-margin' key={id}>
														<RadioButton
															id={id}
															type='radio'
															name={name}
															value={value}
															label={label}
															defaultChecked={watch('role') === value}
															register={register}
															disabled={disabled}
														/>
													</div>
												);
											})
										}
										<P12 className='warning-text'>
											{!!errors[name] && errors[name].message}
										</P12>
									</div>
								);
							})
							}
						</GridContainer>
					</GridContainer>
					{isStartup
						&& <>
							<GridContainer template='270px auto'>
								<div>
									<P16 className='mb-10'>Company type</P16>
									<Select
										control={control}
										isCreatable={false}
										isError={!!errors.companyType}
										isSearchable={true}
										isMulti={false}
										name='companyType'
										onChange={onSelectChange({
											fieldName: 'companyType',
											setError,
											setValue,
											clearErrors,
										})}
										options={companyTypes}
										placeholder='Select Company type'
										register={register}
										value={watch('companyType')}
										customStyles={selectStyles}
									/>
									<P12 className='warning-text'>
										{!!errors.companyType && errors.companyType.message}
									</P12>
								</div>
							</GridContainer>
							{Object.keys(radioFields).map((key, i) => {
								const { title, name, values } = radioFields[key];

								return (
									<GridContainer key={`${i}${key}`}>
										<div className='startup-radio-group-title'>
											<S16 className='mb-10'>{title}</S16>
										</div>
										<div className='radio-fields'>
											{values.map(({ value, label, id }) => {
												return (
													<div className='checkbox-margin' key={id}>
														<RadioButton
															defaultChecked={watch(name) === value}
															id={id}
															key={id}
															label={label}
															name={name}
															register={register}
															value={value}
														/>
													</div>
												);
											})}
										</div>
										<P12 className='warning-text'>
											{!!errors[name] && errors[name].message}
										</P12>
									</GridContainer>
								);
							})
							}
							<GridContainer template='570px'>
								<div>
									<div className='field-group-title'>
										<S16 className='mb-10'>
											What’s your target market? (Choose more than 1 region if applicable)
										</S16>
									</div>
									<div>
										<Select
											control={control}
											isCreateable={false}
											isMulti={true}
											isSearchable={true}
											name='targetMarket'
											onChange={onSelectChange({
												fieldName: 'targetMarket',
												setValue,
												setError,
												clearErrors,
											})}
											options={targetRegions}
											placeholder='Regions'
											register={register}
											value={watch('targetMarket')}
											isError={!!errors.targetMarket}
										/>
										<P12 className='warning-text'>
											{!!errors.targetMarket && errors.targetMarket.message}
										</P12>
									</div>
								</div>
							</GridContainer>
						</>
					}
					<GridContainer template={isStartup ? '570px' : '560px'}>
						<div>
							<S14>Company Description</S14>
							<TextArea
								classNames='company-description'
								id='companyDescription'
								name='companyDescription'
								register={register}
								isError={!!errors.companyDescription}
								placeholder={companyDescriptionPlaceholder}
								control={control}
								trigger={trigger}
								value={watch('companyDescription')}
								isEditText
							/>
							<P12 className='warning-text'>
								{!!errors.companyDescription && errors.companyDescription.message}
							</P12>
						</div>
						{isStartup
							&& <div>
								<S14>Solutions, products and services</S14>
								<TextArea
									classNames='solution-products-services'
									id='solutionProductsServices'
									isError={!!errors.solutionProductsServices}
									name='solutionProductsServices'
									register={register}
									placeholder={solutionsProductsAndServicesPlaceholder}
									control={control}
									trigger={trigger}
									value={watch('solutionProductsServices')}
									isEditText
								/>
								<P12 className='warning-text'>
									{!!errors.solutionProductsServices && errors.solutionProductsServices.message}
								</P12>
							</div>
						}
					</GridContainer>
					{!isStartup
						&& <>
							<GridContainer template='560px'>
								<div>
									<div className='traction-group-title'>
										<S16 bold>Sectors of interest</S16>
									</div>
									<Select
										control={control}
										id='categoryIds'
										isClearable={true}
										isCreatable={false}
										isError={!!errors.categoryIds}
										isMulti={true}
										handleCreateOpt={handleCreateSelectOption({
											setValue,
											getValues,
											setError,
											clearErrors,
											fieldName: 'categoryIds',
										})}
										name='categoryIds'
										onChange={onSelectChange({
											fieldName: 'categoryIds',
											setValue,
											setError,
											clearErrors,
										})}
										placeholder='Select company sectors'
										register={register({ required: true })}
										options={fullTopLevelCategories}
										menuPlacement='auto'
									/>
									<P12 className='warning-text'>
										{!!errors.categoryIds && errors.categoryIds.message}
									</P12>
								</div>
							</GridContainer>
							<GridContainer template='560px'>
								<div>
									<div className='traction-group-title'>
										<S16 bold>Associated tags</S16>
										<P14 className='mt-3'>
											Add or update tags associated with your Business.
											This will help RetailHub promote your Startup to
											the appropriate Retailers. You can add up to 12 tags.
										</P14>
									</div>
								</div>
								<div>
									<Select
										control={control}
										id='tags'
										isClearable={true}
										isCreatable={true}
										isError={!!errors.tags}
										isMulti={true}
										handleCreateOpt={handleCreateSelectOption({
											setValue,
											getValues,
											setError,
											clearErrors,
											fieldName: 'tags',
										})}
										name='tags'
										onChange={onSelectChange({
											fieldName: 'tags',
											setValue,
											setError,
											clearErrors,
										})}
										placeholder='Add a tag'
										register={register}
										options={tags}
										menuPlacement='auto'
										customStyles={PrepareSelectStyles(null, null, null, true)}
									/>
									<P12 className='warning-text'>
										{!!errors.tags && errors.tags.message}
									</P12>
								</div>
							</GridContainer>
						</>
					}
					{isStartup
						&& <>
							<GridContainer template='570px'>
								<div>
									<div className='traction-group-title pt-2'>
										<S16>Traction</S16>
									</div>
									<Select
										control={control}
										id='platformPartners'
										isClearable={true}
										isCreatable={true}
										isError={!!errors.platformPartners}
										isMulti={true}
										handleCreateOpt={handleCreateSelectOption({
											setValue,
											getValues,
											setError,
											clearErrors,
											fieldName: 'platformPartners',
										})}
										name='platformPartners'
										onChange={onSelectChange({
											fieldName: 'platformPartners',
											setValue,
											clearErrors,
											setError,
										})}
										placeholder='Platform Partners (Google, Amazon...)'
										register={register}
										options={platformPartners}
									/>
									<P12 className='warning-text'>
										{!!errors.platformPartners && errors.platformPartners.message}
									</P12>
								</div>
							</GridContainer>
							<GridContainer template='570px'>
								<div>
									<Select
										control={control}
										id='clientsList'
										isClearable={true}
										isCreatable={true}
										isError={!!errors.clientsList}
										isMulti={true}
										handleCreateOpt={handleCreateSelectOption({
											setValue,
											getValues,
											setError,
											clearErrors,
											fieldName: 'clientsList',
										})}
										name='clientsList'
										onChange={onSelectChange({
											fieldName: 'clientsList',
											setValue,
											clearErrors,
											setError,
										})}
										placeholder='Clients list (Best Buy, Walmart, B2C...)'
										register={register}
										handleOptionsMessage={() => null}
									/>
									<P12 className='warning-text'>
										{!!errors.clientsList && errors.clientsList.message}
									</P12>
								</div>
							</GridContainer>
							<GridContainer template='270px 270px'>
								<div>
									<TextInput
										id='numberOfClients'
										isError={!!errors.numberOfClients}
										isLightTheme
										name='numberOfClients'
										placeholder='Number of Clients'
										register={register}
										value={watch('numberOfClients')}
										onChange={onTextInputChange('numberOfClients')}
									/>
									<P12 className='warning-text'>
										{!!errors.numberOfClients
											? errors.numberOfClients.message
											: !!numberOfClientsError
												? numberOfClientsError
												: ''
										}
									</P12>
								</div>
								<div>
									<TextInput
										id='integrationTiming'
										isError={!!errors.integrationTiming}
										isLightTheme
										name='integrationTiming'
										placeholder='Integration Timing'
										register={register}
										value={watch('integrationTiming')}
										onChange={onTextInputChange('integrationTiming')}
									/>
									<P12 className='warning-text'>
										{!!errors.integrationTiming && errors.integrationTiming.message}
									</P12>
								</div>
							</GridContainer>
							<GridContainer template='570px'>
								<div>
									<Select
										control={control}
										id='presenceInCountriesIds'
										isClearable={true}
										isCreatable={false}
										isError={!!errors.presenceInCountriesIds}
										isMulti={true}
										handleCreateOpt={handleCreateSelectOption({
											setValue,
											getValues,
											setError,
											clearErrors,
											fieldName: 'presenceInCountriesIds',
										})}
										name='presenceInCountriesIds'
										onChange={onSelectChange({
											fieldName: 'presenceInCountriesIds',
											setValue,
											setError,
											clearErrors,
										})}
										placeholder='Presence in other Countries'
										register={register}
										options={countries}
										isFilterForStart
									/>
									<P12 className='warning-text'>
										{!!errors.presenceInCountriesIds && errors.presenceInCountriesIds.message}
									</P12>
								</div>
							</GridContainer>
						</>
					}
					<GridContainer
						template={isStartup ? '270px 270px' : '260px 260px'}
						customClassName={isStartup ? 'justify-content-end' : 'justify-content-start'}
					>
						<PrimaryButton
							onClick={toggleCompanyDetailsEditModal}
							text='Cancel'
							isOutline
							isFullWidth
						/>
						<PrimaryButton
							disabled={!!Object.keys(errors)?.length || !!numberOfClientsError}
							onClick={handleConditionsForSendConfirm}
							isFullWidth
						>
							Update
						</PrimaryButton>
					</GridContainer>
				</form>}
			{isLoading && <LoadingOverlay isCentered/>}
		</div>
	);
};

CompanyDetailsForm.propTypes = {
	countries: array.isRequired,
	updateCompanyDetails: func.isRequired,
	toggleCompanyDetailsEditModal: func,
	isLoading: bool,
	platformPartners: array,
	isStartup: bool.isRequired,
	profile: object.isRequired,
	textFields: array.isRequired,
	selectedDefaultValues: object.isRequired,
	revalidateTargetMarket: func,
	selectedAccountType: string,
	setSelectedAccountType: func,
	numberOfClientsError: oneOfType([string, oneOf([null])]),
	numberOfClientsValidationHandler: func,
	schema: object.isRequired,
	fullTopLevelCategories: array,
	tags: array,
};

CompanyDetailsForm.defaultProps = {
	platformPartners: [],
};

export default memo(CompanyDetailsForm);
