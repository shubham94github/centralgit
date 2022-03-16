import React, { useState, memo } from 'react';
import { arrayOf, bool, func, object, objectOf, string } from 'prop-types';
import { P12, P14, P16, S12 } from '@components/_shared/text';
import TextInput from '@components/_shared/form/TextInput';
import TooltipForPassword from '../TooltipForPassword';
import PasswordHint from '@components/Auth/SignUp/SignUpCompany/PasswordHint';
import Select from '@components/_shared/form/Select';
import Checkbox from '@components/_shared/form/Checkbox';
import PrimaryButton from '@components/_shared/buttons/PrimaryButton';
import { isEmpty } from '@utils/js-helpers';
import FormWrapper from '@components/_shared/form/FormWrapper';
import { onSelectChange } from '@utils/onSelectChange';
import GridContainer from '@components/layouts/GridContainer';
import { selectValueType } from '@constants/types';
import { chevronLeft, submitBtnText, privacyPolicyText } from './constants';

const SignUpForm = ({
	goBack,
	isStartup,
	register,
	errors,
	email,
	isCompanyType,
	control,
	countries,
	isIndividuals,
	watch,
	checkIsMember,
	isLoading,
	setError,
	setValue,
	clearErrors,
}) => {
	const textTitle = isStartup ? 'Add Startup' : 'Add Company';
	const [isPasswordFieldActive, setIsPasswordFieldActive] = useState(false);

	const togglePasswordFieldState = state => setIsPasswordFieldActive(state);

	const onBlurPasswordHandler = () => togglePasswordFieldState(false);

	const onFocusPasswordHandler = () => togglePasswordFieldState(true);

	return (
		<FormWrapper className='signup-company-wrapper'>
			<GridContainer gap='15px'>
				<GridContainer gap='0px' template='10px auto'>
					<div className='back-btn' onClick={goBack}>
						{chevronLeft}
					</div>
					<div>
						<P16 className='text-center' bold>
							{textTitle}
						</P16>
					</div>
				</GridContainer>
				<div>
					<P14>
						Account information
					</P14>
				</div>
			</GridContainer>
			<GridContainer template='270px 270px' gap='15px 30px'>
				<div>
					<TextInput
						id='firstName'
						type='text'
						name='firstName'
						isLightTheme
						placeholder='First name'
						register={register({ required: true })}
						error={errors.firstName?.message}
						setValue={setValue}
					/>
					<P12 className='warning-text'>{!!errors.firstName && errors.firstName.message}</P12>
				</div>
				<div>
					<TextInput
						id='lastName'
						type='text'
						name='lastName'
						isLightTheme
						placeholder='Last name'
						register={register({ required: true })}
						error={errors.lastName?.message}
						setValue={setValue}
					/>
					<P12 className='warning-text'>{!!errors.lastName && errors.lastName.message}</P12>
				</div>
				<div>
					<TextInput
						id='email'
						type='email'
						name='email'
						isLightTheme
						placeholder='E-mail'
						readOnly={true}
						register={register({ required: true })}
						error={errors.email?.message}
						value={email}
					/>
					<P12 className='warning-text'>{!!errors.email && errors.email.message}</P12>
				</div>
				<div>
					<TooltipForPassword
						placement='top'
						component={PasswordHint}
						isVisibleTooltip={!!errors.password?.message && isPasswordFieldActive}
					>
						<TextInput
							id='password'
							type='password'
							name='password'
							isLightTheme
							placeholder='Password'
							register={register({ required: true })}
							error={errors.password?.message}
							onBlur={onBlurPasswordHandler}
							onFocus={onFocusPasswordHandler}
						/>
					</TooltipForPassword>
					<P12 className='warning-text'>{!!errors.password && errors.password.message}</P12>
				</div>
			</GridContainer>
			<GridContainer gap='15px 30px'>
				<div>
					<P14>
						Company details
					</P14>
				</div>
				<GridContainer
					template={isCompanyType ? '270px 270px' : 'auto'}
					gap={isCompanyType ? '15px 30px' : '0px 30px'}
				>
					<div>
						<Select
							id='countryId'
							name='countryId'
							control={control}
							register={register({ required: true })}
							options={countries}
							placeholder='Country'
							value={watch('countryId')}
							onChange={onSelectChange({
								fieldName: 'countryId',
								setError,
								setValue,
								clearErrors,
							})}
							isClearable
							isError={!!errors?.countryId?.message}
							isFilterForStart
							isTopPlaceholder
						/>
						<P12 className='warning-text'>
							{!!errors?.countryId?.message && errors.countryId.message}
						</P12>
					</div>
					<div>
						{!isStartup && !isIndividuals
							&& <TextInput
								id='emailDomain'
								type='text'
								name='emailDomain'
								isLightTheme
								placeholder='Company E-mail domain'
								register={register}
								readOnly={true}
							/>
						}
					</div>
				</GridContainer>
				<div>
					<TextInput
						id='companyLegalName'
						type='text'
						name='companyLegalName'
						isLightTheme
						placeholder='Legal name'
						register={register({ required: true })}
						error={errors.companyLegalName?.message}
					/>
					<P12 className='warning-text'>
						{!!errors.companyLegalName && errors.companyLegalName.message}
					</P12>
				</div>
				<div>
					<TextInput
						id='companyShortName'
						type='text'
						name='companyShortName'
						isLightTheme
						register={register({ required: true })}
						placeholder='Brand name'
						error={errors.companyShortName?.message}
					/>
					<P12 className='warning-text'>
						{!!errors.companyShortName && errors.companyShortName.message}
					</P12>
				</div>
				<div>
					<Checkbox
						type='checkbox'
						name='policyConfirmed'
						register={register({ required: true })}
						label={<S12>{privacyPolicyText}</S12>}
					/>
				</div>
				<div className='d-flex justify-content-center'>
					<PrimaryButton
						onClick={checkIsMember}
						text={submitBtnText}
						isFullWidth={true}
						disabled={!watch('policyConfirmed') || !watch('countryId') || !isEmpty(errors)}
						isLoading={isLoading}
					/>
				</div>
			</GridContainer>
		</FormWrapper>
	);
};

SignUpForm.propTypes = {
	goBack: func.isRequired,
	isStartup: bool.isRequired,
	errors: objectOf(object).isRequired,
	register: func.isRequired,
	email: string,
	isCompanyType: bool.isRequired,
	control: object.isRequired,
	countries: arrayOf(selectValueType),
	isIndividuals: bool.isRequired,
	watch: func.isRequired,
	checkIsMember: func.isRequired,
	isLoading: bool,
	setError: func.isRequired,
	setValue: func.isRequired,
	clearErrors: func.isRequired,
};

export default memo(SignUpForm);
