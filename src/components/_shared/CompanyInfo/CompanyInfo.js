import React, { memo, useEffect, useMemo, useState } from 'react';
import { array, arrayOf, bool, func, number, oneOfType, shape, string, object } from 'prop-types';
import { useForm } from 'react-hook-form';
import { P12, P14, P16, S16, S14 } from '@components/_shared/text';
import TextInput from '@components/_shared/form/TextInput';
import FormWrapper from '@components/_shared/form/FormWrapper';
import { yupResolver } from '@hookform/resolvers/yup';
import PrepareSelectStyles from '../form/Select/prepareSelectStyles';
import { getRetailSchema, startupSchema } from './schema';
import RadioButton from '@components/_shared/form/RadioButton';
import Select from '@components/_shared/form/Select';
import {
	targetRegions,
	radioFields,
	companyTypes,
	startupGridArea,
	tractionGridArea,
	retailerGridArea,
} from './fields';
import TextArea from '@components/_shared/form/TextArea';
import DatePicker from '@components/_shared/form/DatePicker';
import PrimaryButton from '@components/_shared/buttons/PrimaryButton';
import { toColor } from '@utils';
import LoadingOverlay from '@components/_shared/LoadingOverlay';
import { getCompanyIcon } from '@utils/getCompanyIcon';
import AppModal from '@components/Common/AppModal';
import UploadAvatar from '@components/_shared/ModalComponents/UploadAvatar';
import { handleCreateSelectOption } from '@utils/hooks/handleCreateSelectOption';
import { Icons } from '@icons';
import Tooltip from '@components/_shared/Tooltip';
import enums from '@constants/enums';
import { onSelectChange } from '@utils/onSelectChange';
import { prepareSelectFields } from '@utils/prepareSelectFields';
import { withoutLettersAndSymbolsRegExp } from '@utils/validation';
import GridContainer from '@components/layouts/GridContainer';
import Confirm from '@components/_shared/ModalComponents/Confirm';
import { conditionsForSendConfirm } from '@utils/conditionForSendConfirm';
import ConfirmSubmit from '@components/_shared/CompanyInfo/ConfirmSubmit';
import {
	companyDescriptionPlaceholder,
	solutionsProductsAndServicesPlaceholder,
} from '@components/_shared/CompanyInfo/constants';
import { isEmpty } from '@utils/js-helpers';
import { valuesMapper, prepareSelectStyles } from '@components/_shared/CompanyInfo/utils';
import './CompanyInfo.scss';

import cn from 'classnames';

const editIcon = Icons.editIcon();

function CompanyInfo({
	companyAvatar,
	companyInfo,
	companyLogo,
	companyShortName,
	countries,
	getCountries,
	isLoading,
	sendCompanyInfo,
	textFields,
	title,
	user,
	userRole,
	tags,
	getAllTags,
	getTopLevelCategories,
	topLevelCategories,
	getPlatformPartners,
	platformPartners,
	stepText,
	isResetButton,
	uploadCompanyLogo,
	isSettings,
	refreshUserData,
}) {
	const [isShowConfirm, setIsShowConfirm] = useState(false);
	const [isWarningsLengthMessage, setIsWarningsLengthMessage] = useState({
		isWarningCompanyDescription: false,
		isWarningSolutionProductsServices: false,
	});
	const companyName = companyAvatar?.name || companyShortName;
	const id = user?.retailer?.id || user.startup?.id;
	const iconColor = companyAvatar?.color || toColor(id.toString());
	const maxDate = new Date();
	const isStartup = userRole === enums.userRoles.startup;
	const isIncompleteAccount = user?.startup?.accountType === 'Incomplete';

	const companyIcon = getCompanyIcon(companyLogo, companyName, iconColor);
	const [isModal, setIsModal] = useState(false);
	const [fullTopLevelCategories, setFullTopLevelCategories] = useState([]);
	const [numberOfClientsError, setNumberOfClientsError] = useState(null);
	const [isDirtyLogos, setIsDirtyLogos] = useState(false);
	const selectStyles = useMemo(() => prepareSelectStyles(), []);
	const actionsClassNames = cn('actions', { 'end-flex': !isResetButton && !isStartup });

	const isCompanyLogos = !!companyLogo.image
		&& !!companyLogo.logo
		&& !!companyLogo.logo30Id
		&& !!companyLogo.logo60Id
		&& !!companyLogo.logo120Id;

	useEffect(() => {
		if (isEmpty(countries)) getCountries();
		if (isEmpty(tags)) getAllTags();
		if (isEmpty(fullTopLevelCategories)) getTopLevelCategories();
		if (isEmpty(platformPartners) && isStartup) getPlatformPartners();

		if (typeof refreshUserData === 'function') refreshUserData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (!isCompanyLogos) return;

		setIsDirtyLogos(true);
	}, [isCompanyLogos]);

	useEffect(() => {
		if (isEmpty(fullTopLevelCategories) && !isEmpty(topLevelCategories))
			setFullTopLevelCategories(topLevelCategories);
	}, [fullTopLevelCategories, topLevelCategories]);

	const toggleModal = () => setIsModal(prevState => !prevState);

	const schema = isStartup ? startupSchema : getRetailSchema(userRole);
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
		formState: { dirtyFields },
	} = useForm({
		resolver: yupResolver(schema),
		mode: enums.validationMode.onTouched,
		reValidateMode: enums.reValidationMode.onChange,
		criteriaMode: enums.criteriaMode.firstError,
		defaultValues: schema.default(),
	});

	const closeConfirm = () => setIsShowConfirm(false);

	useEffect(() => {
		if (!companyInfo) return;

		const currentFormValues = getValues();
		const formValues = valuesMapper({
			companyInfo,
			currentFormValues,
			user,
			isStartup,
			isIncompleteAccount,
		});

		reset(formValues);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [companyInfo, user]);

	const totalFundingAmount = watch('totalFundingAmount');

	useEffect(() => {
		if (!totalFundingAmount) return;

		const value = totalFundingAmount.toString();

		setValue('totalFundingAmount', value.replaceAll(withoutLettersAndSymbolsRegExp, ''));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [totalFundingAmount]);

	const numberOfClientsValidationHandler = watchingFieldName => {
		const countOfClientsList = watch('clientsList')?.length;
		const numberOfClients = watch('numberOfClients');

		if (numberOfClients < countOfClientsList) {
			switch (watchingFieldName) {
				case 'clientsList':
					setValue('numberOfClients', countOfClientsList);
					break;
				case 'numberOfClients':
					setNumberOfClientsError('Number of Clients shouldn\'t be less than Clients list');
					break;
				default: break;
			}
		}

		if (numberOfClients >= countOfClientsList) setNumberOfClientsError(null);
	};

	const clientsList = watch('clientsList');

	useEffect(() => {
		numberOfClientsValidationHandler('clientsList');
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [clientsList]);

	const numberOfClients = watch('numberOfClients');

	useEffect(() => {
		numberOfClientsValidationHandler('numberOfClients');
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [numberOfClients]);

	const handleSaveCompanyInfo = values => {
		const preparedFields = prepareSelectFields(values);

		const data = isStartup
			? {
				...preparedFields,
				linkedInCompanyPage: values.linkedInCompanyPage || null,
				urlOfCompanyWebsite: values.urlOfCompanyWebsite || null,
				countryId: values.country.id,
				founded: values.founded.getTime(),
				targetMarket: values.targetMarket.map(({ label }) => label),
				documentId: null,
				...companyLogo,
				clientsList: values.clientsList?.map(({ value }) => value),
				companyType: values.companyType.value,
				platformPartners: values.platformPartners && values.platformPartners.map(({ value }) => value),
				presenceInCountriesIds: values.presenceInCountriesIds
					&& values.presenceInCountriesIds.map(({ id }) => id),
				numberOfClients: +values.numberOfClients,
				totalFundingAmount: +values.totalFundingAmount,
				companyDescription: preparedFields.companyDescription === '\n\n'
					? null
					: preparedFields.companyDescription,
				solutionProductsServices: preparedFields.solutionProductsServices === '\n\n'
					? null
					: preparedFields.solutionProductsServices,
			}
			: {
				...preparedFields,
				countryId: values.country.id,
				tags: values.tags.map(tag => tag.value),
				...companyLogo,
				categoryIds: values.categoryIds.map(category => category.id),
				companyDescription: preparedFields.companyDescription === '\n\n'
					? null
					: preparedFields.companyDescription,
			};

		closeConfirm();
		sendCompanyInfo(data);
	};

	const onDateChange = fieldName => date => {
		if (!date)
			setError(fieldName, { message: `Founded date  is required field` });
		else clearErrors(fieldName);

		setValue(fieldName, date ? new Date(date) : date, { shouldDirty: true });
	};

	const trimValues = fieldName => value => setValue(fieldName, value.trim(), { shouldValidate: true });

	const handleConditionsForSendConfirm = values => {
		if (!isStartup) return handleSaveCompanyInfo(values);

		const {
			isWarningCompanyDescription,
			isWarningSolutionProductsServices,
		} = conditionsForSendConfirm(watch('companyDescription'), watch('solutionProductsServices'));

		if (isWarningCompanyDescription || isWarningSolutionProductsServices) {
			setIsShowConfirm(true);
			setIsWarningsLengthMessage({ isWarningCompanyDescription, isWarningSolutionProductsServices });
		}
		else
			handleSaveCompanyInfo(values);
	};

	const handleSuccessSendConfirm = () => {
		closeConfirm();
		handleSaveCompanyInfo(getValues());
	};

	const onTextInputChange = fieldName => e => {
		if (fieldName === 'phoneNumber') return setValue(fieldName, e);

		setValue(fieldName, e.target.value);
	};

	const resetValues = () => {
		const userCompany = user[isStartup ? 'startup': 'retailer'];

		const companyValues = isStartup
			? {
				country: countries.find(country => userCompany.country.id === country.id),
				city: userCompany.city,
				companyLegalName: userCompany.companyLegalName,
				companyShortName: userCompany.companyShortName,
				owner: isStartup
					&& `${user.firstName || ''} ${user.lastName || ''}`,
				phoneNumber: userCompany.phoneNumber,
				linkedInCompanyPage: userCompany.linkedInCompanyPage,
				urlOfCompanyWebsite: userCompany.urlOfCompanyWebsite,
				founded: new Date(userCompany.foundedAt),
				totalFundingAmount: userCompany.totalFundingAmount,
				companyType: { label: userCompany.companyType, value: userCompany.companyType },
				businessModel: userCompany.businessModel,
				companyStatus: userCompany.companyStatus,
				companyDescription: userCompany.companyDescription,
				solutionProductsServices: userCompany.solutionProductsServices,
				platformPartners: userCompany.platformPartners?.map(item => ({ value: item, label: item })),
				clientsList: userCompany.clientsList?.map(item => ({ value: item, label: item })),
				numberOfClients: userCompany.numberOfClients,
				integrationTiming: userCompany.integrationTiming,
				targetMarket: userCompany.targetMarket.map(item => ({ value: item, label: item })),
				presenceInCountriesIds: userCompany.presenceInCountries.map(({ id }) =>
					countries.find(country => country.id === id)),
			}
			: {
				country: countries.find(country => userCompany.country.id === country.id),
				city: userCompany.city,
				companyLegalName: userCompany.companyLegalName,
				companyShortName: userCompany.companyShortName,
				phoneNumber: userCompany.phoneNumber,
				linkedInCompanyPage: userCompany.linkedInCompanyPage,
				urlOfCompanyWebsite: userCompany.urlOfCompanyWebsite,
				companyDescription: userCompany.companyDescription,
				categoryIds: userCompany.companySectors?.map(sector =>
					({ id: sector.id, value: sector.id, label: sector.name })),
				tags: userCompany.tags.map(tag => ({ value: tag, label: tag })),
				emailDomain: userCompany.emailDomain ? userCompany.emailDomain : null,
				...companyLogo,
			};

		reset(companyValues);
	};

	const isDisableSubmit = isSettings
		? isEmpty(dirtyFields) && !isDirtyLogos && isEmpty(errors) && !numberOfClientsError
		: !isEmpty(errors) || !!numberOfClientsError;

	return (
		<FormWrapper
			className='company-info-container'
			onSubmit={handleSubmit(handleConditionsForSendConfirm)}
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
					{title}
				</P16>
			</GridContainer>
			<GridContainer
				template='570px 70px'
			>
				<GridContainer
					columns={2}
					gridTemplateAreas={isStartup ? startupGridArea : retailerGridArea}
				>
					{
						textFields.map(({ name, id, placeholder, isReadOnly, type }) => {
							return (
								<div style={{ gridArea: id }} key={name+id}>
									{id === 'country'
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
												isSingleDate
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
												errorMessage='Please add the date of foundation'
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
												readOnly={isReadOnly?.includes(userRole)}
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
				<GridContainer
					customClassName='upload-file'
				>
					<Tooltip
						placement='bottom-start'
						message={<P12 className='black-tooltip'>Change company photo</P12>}
					>
						<span
							className='startup-logo'
							onClick={toggleModal}
						>
							{companyIcon}
							<span className='startup-logo-icon'>
								{editIcon}
							</span>
						</span>
					</Tooltip>
				</GridContainer>
			</GridContainer>
			{isStartup
				&& <GridContainer template='270px auto'>
					<div>
						<P16 className='company-type-label'>Company type</P16>
						<Select
							control={control}
							isCreatable={false}
							isError={!!errors.companyType}
							isSearchable={true}
							isMulti={false}
							name='companyType'
							onChange={onSelectChange({
								fieldName: 'companyType',
								setValue,
								setError,
								clearErrors,
							})}
							options={companyTypes}
							placeholder='Select Company type'
							register={register}
							value={watch('companyType')}
						/>
						<P12 className='warning-text'>
							{!!errors.companyType && errors.companyType.message}
						</P12>
					</div>
				</GridContainer>
			}
			{isStartup
				&& Object.keys(radioFields).map((key, i) => {
					const { title, name, values } = radioFields[key];

					return (
						<GridContainer
							key={`${i}${key}`}
						>
							<div className='startup-radio-group-title'>
								<S16>{title}</S16>
							</div>
							<div className='radio-fields'>
								{
									values.map(({ value, label, id, checkedByDefault }) => {
										return (
											<div className='checkbox-margin' key={id}>
												<RadioButton
													defaultChecked={checkedByDefault}
													id={id}
													key={id}
													label={label}
													name={name}
													register={register}
													value={value}
												/>
											</div>
										);
									})
								}
							</div>
							<P12 className='warning-text'>
								{!!errors[name] && errors[name].message}
							</P12>
						</GridContainer>
					);
				})
			}
			{isStartup
				&& <>
					<GridContainer template='570px'>
						<div className='field-group-title'>
							<S16>
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
							/>
							<P12 className='warning-text'>
								{!!errors.targetMarket && errors.targetMarket.message}
							</P12>
						</div>
					</GridContainer>
					<GridContainer template='570px'>
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
								isEditText
								value={watch('companyDescription')}
							/>
							<P12 className='warning-text'>
								{!!errors.companyDescription && errors.companyDescription.message}
							</P12>
						</div>
					</GridContainer>
					<GridContainer template='570px'>
						<div>
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
								isEditText
								value={watch('solutionProductsServices')}
							/>
							<P12 className='warning-text'>
								{!!errors.solutionProductsServices
									&& errors.solutionProductsServices.message}
							</P12>
						</div>
					</GridContainer>
					<div className='traction-group-title'>
						<S16>Traction</S16>
					</div>
					<GridContainer template='570px auto'>
						<GridContainer
							columns={2}
							gridTemplateAreas={tractionGridArea}
						>
							<div style={{ gridArea: 'platformPartners' }}>
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
										setError,
										clearErrors,
									})}
									options={platformPartners}
									placeholder='Platform Partners (Google, Amazon...)'
									register={register}
									value={watch('platformPartners')}
								/>
								<P12 className='warning-text'>
									{!!errors.platformPartners && errors.platformPartners.message}
								</P12>
							</div>
							<div style={{ gridArea: 'clientsList' }}>
								<Select
									register={register}
									control={control}
									id='clientsList'
									isClearable={true}
									isCreatable={true}
									value={watch('clientsList')}
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
										setError,
										clearErrors,
									})}
									placeholder='Clients list (Best Buy, Walmart, B2C...)'
									handleOptionsMessage={() => null}
								/>
								<P12 className='warning-text'>
									{!!errors.clientsList && errors.clientsList.message}
								</P12>
							</div>
							<div style={{ gridArea: 'numberOfClients' }}>
								<TextInput
									id='numberOfClients'
									isError={!!errors.numberOfClients}
									isLightTheme
									name='numberOfClients'
									placeholder='Number of Clients'
									register={register}
									type='number'
									value={watch('numberOfClients')}
								/>
								<P12 className='warning-text'>
									{!!errors.numberOfClients
										? errors.numberOfClients.message
										: !!numberOfClientsError
											? numberOfClientsError
											:''
									}
								</P12>
							</div>
							<div style={{ gridArea: 'integrationTiming' }}>
								<TextInput
									id='integrationTiming'
									isError={!!errors.integrationTiming}
									isLightTheme
									name='integrationTiming'
									placeholder='Integration Timing'
									register={register}
									value={watch('integrationTiming')}
								/>
								<P12 className='warning-text'>
									{!!errors.integrationTiming && errors.integrationTiming.message}
								</P12>
							</div>
							<div style={{ gridArea: 'presenceInCountriesIds' }}>
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
									menuPlacement='top'
									isFilterForStart
								/>
								<P12 className='warning-text'>
									{!!errors.presenceInCountriesIds && errors.presenceInCountriesIds.message}
								</P12>
							</div>
						</GridContainer>
					</GridContainer>
				</>
			}
			{!isStartup
			&& <>
				<GridContainer template='570px'>
					<div>
						<div className='retailer-company-description-label'>
							<S14>Company description</S14>
						</div>
						<TextArea
							classNames='company-description'
							id='companyDescription'
							isError={!!errors.companyDescription}
							isFixedHeightLabel={true}
							name='companyDescription'
							register={register}
							placeholder={`Provide a brief company description to enable intelligent search and recommendations. (min recommended 100 characters)`}
							control={control}
							trigger={trigger}
							isEditText
						/>
						<P12 className='warning-text'>
							{!!errors.companyDescription && errors.companyDescription.message}
						</P12>
					</div>
				</GridContainer>
				<GridContainer template='570px'>
					<div>
						<div className='interests-title'>
							<S16 bold>Sectors of interest</S16>
						</div>
						<Select
							control={control}
							id='categoryIds'
							isClearable
							isCreatable={false}
							isError={!!errors.categoryIds}
							isMulti
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
							register={register}
							options={fullTopLevelCategories}
							menuPlacement='auto'
							customStyles={selectStyles}
						/>
						<P12 className='warning-text'>
							{!!errors.categoryIds && errors.categoryIds.message}
						</P12>
					</div>
				</GridContainer>
				<GridContainer template='570px'>
					<div className='field-group-title'>
						<div className='associated-tags-title'>
							<S16 bold>Associated tags</S16>
						</div>
						<P14>
							Add or update tags associated with your Business.
							This will help RetailHub promote your Startup to
							the appropriate Retailers. You can add up to 12 tags.
						</P14>
					</div>
					<div className='associated-tags-select'>
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
			<GridContainer
				customClassName={actionsClassNames}
				template={(isResetButton && isStartup) ? '570px auto' : '570px'}
			>
				<GridContainer>
					<div className='actions-container'>
						{isResetButton
							&& <PrimaryButton
								onClick={resetValues}
								isDarkTheme={false}
								text='Reset'
								disabled={isEmpty(getValues())}
								isOutline
								className='reset'
							/>
						}
						<PrimaryButton
							className={`${isStartup ? 'startup' : 'retailer'}-float-end`}
							disabled={isDisableSubmit}
							onClick={handleSubmit(handleConditionsForSendConfirm)}
						>
							Save
						</PrimaryButton>
					</div>
				</GridContainer>
			</GridContainer>
			{isLoading && <LoadingOverlay isCentered/>}
			{isModal
				&& <AppModal
					component={UploadAvatar}
					onClose={toggleModal}
					outerProps={{
						uploadLogo: uploadCompanyLogo,
					}}
				/>
			}
			{isShowConfirm
				&& <AppModal
					className='confirm-save-pop-up'
					width='690px'
					onClose={closeConfirm}
					title='Are you sure you want to save?'
					outerProps={{
						component: ConfirmSubmit,
						successConfirm: handleSuccessSendConfirm,
						componentProps: { isWarningsLengthMessage },
					}}
					component={Confirm}
				/>
			}
		</FormWrapper>
	);
}

CompanyInfo.defaultProps = {
	countries: null,
	tags: [],
	platformPartners: [],
	isResetButton: false,
	isSettings: false,
	refreshUserData: () => {},
};

CompanyInfo.propTypes = {
	countries: arrayOf(shape({
		label: string,
		value: oneOfType([string, number]),
	})),
	textFields: array,
	userRole: string.isRequired,
	title: string.isRequired,
	isLoading: bool,
	sendCompanyInfo: func.isRequired,
	companyDocuments: array,
	companyLogo: shape({
		name: string,
		id: number,
		image: string,
	}),
	status: string.isRequired,
	getCountries: func,
	companyInfo: shape({
		companyLegalName: string,
		companyShortName: string,
		country: object,
		position: string,
	}),
	user: object,
	companyAvatar: object,
	companyShortName: string,
	getAllTags: func.isRequired,
	getPlatformPartners: func.isRequired,
	tags: array,
	platformPartners: array,
	getTopLevelCategories: func,
	topLevelCategories: array,
	stepText: string,
	isResetButton: bool,
	uploadCompanyLogo: func.isRequired,
	isSettings: bool,
	refreshUserData: func.isRequired,
};

export default memo(CompanyInfo);
