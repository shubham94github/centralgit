import React, { memo, useState } from 'react';
import { array, bool, func, number, shape, string } from 'prop-types';
import FormWrapper from '@components/_shared/form/FormWrapper';
import { P16, P14 } from '@components/_shared/text';
import GridContainer from '@components/layouts/GridContainer';
import PrimaryButton from '@components/_shared/buttons/PrimaryButton';
import TextDescriptionMember from './TextDescriptionMember';
import Select from '@components/_shared/form/Select';
import { signUpFormTypes } from '@constants/types';
import { Icons } from '@icons';
import { trialPeriodError } from '@constants/errorCodes';

const exclamationPointIcon = Icons.exclamationPointIcon();

const SignUpMember = ({
	resetMemberSettings,
	isCompanyType,
	isIndividuals,
	completedFormData,
	goBackToBusinessType,
	handleSubmit,
	listOfCompaniesOptions,
	retailerInfoForMember,
	setRetailerInfoForMember,
	isLoadingSubmitForm,
	isMemberRegisterError,
	setIsMemberRegisterError,
	errorType,
	setErrorType,
}) => {
	const [isOpenListOfCompanies, setIsOpenListOfCompanies] = useState(false);
	const isTrialPeriodError = errorType === trialPeriodError;

	const onClickJoinHandler = () => {
		if (isOpenListOfCompanies || isCompanyType) {
			handleSubmit({
				...completedFormData,
				retailerId: retailerInfoForMember.value,
			});
		}
		else if (isIndividuals) setIsOpenListOfCompanies(true);
	};

	const onClickBackHandler = () => {
		if (!isOpenListOfCompanies) return resetMemberSettings();

		setIsOpenListOfCompanies(false);
	};

	const onCloseMemberRegisterError = () => {
		setIsMemberRegisterError(false);
		setErrorType(null);
	};

	const handleChangeRetailer = option => setRetailerInfoForMember(option);

	return (
		<FormWrapper className='sign-up-member-page-container'>
			{isMemberRegisterError
				? <div className='error-container'>
					<div className='icon'>
						{exclamationPointIcon}
					</div>
					<P16
						className='title'
						bold
					>
						Sorry, you can’t join this company.
					</P16>
					<P14>
						{isTrialPeriodError
							? <>
								You can try to join later or contact him by email&nbsp;
								<strong>{retailerInfoForMember?.email}</strong>.
							</>
							: <>
								It has reached the maximum allowed number of members.
								<br/>
								We will inform the company, and the manager will contact you.
							</>}

					</P14>
				</div>
				: isOpenListOfCompanies
					? <GridContainer columns={1} gap='20px'>
						<P16>
							Please select Company Brand Name and Domain <br/> to join.
						</P16>
						<Select
							options={listOfCompaniesOptions}
							onChange={handleChangeRetailer}
							isSearchable={false}
							placeholder='Brand Name / Domain'
							isFilter
							isCreateable={false}
							value={retailerInfoForMember}
							disabled={!listOfCompaniesOptions.length}
						/>
					</GridContainer>
					: <TextDescriptionMember
						goBackToBusinessType={goBackToBusinessType}
						isIndividuals={isIndividuals}
						resetMemberSettings={resetMemberSettings}
						completedFormData={completedFormData}
					/>
			}
			<GridContainer
				columns={isMemberRegisterError ? 1 : 2}
				gap='15px'
				customClassName='pt-15 justify-content-center'
				template={isMemberRegisterError ? '210px' : '200px 200px'}
			>
				{isMemberRegisterError
					? <PrimaryButton
						text='Ok'
						onClick={onCloseMemberRegisterError}
					/>
					: <>
						<PrimaryButton
							text='Back'
							isOutline
							onClick={onClickBackHandler}
						/>
						<PrimaryButton
							text='Join'
							onClick={onClickJoinHandler}
							disabled={isOpenListOfCompanies && !retailerInfoForMember?.value}
							isLoading={isLoadingSubmitForm}
						/>
					</>
				}
			</GridContainer>
		</FormWrapper>
	);
};

SignUpMember.propTypes = {
	resetMemberSettings: func.isRequired,
	isCompanyType: bool.isRequired,
	isIndividuals: bool.isRequired,
	completedFormData: signUpFormTypes,
	goBackToBusinessType: func.isRequired,
	handleSubmit: func.isRequired,
	listOfCompaniesOptions: array.isRequired,
	retailerInfoForMember: shape({ value: number }),
	setRetailerInfoForMember: func.isRequired,
	isLoadingSubmitForm: bool,
	isMemberRegisterError: bool.isRequired,
	setIsMemberRegisterError: func.isRequired,
	errorType: string,
	setErrorType: func.isRequired,
};

export default memo(SignUpMember);
