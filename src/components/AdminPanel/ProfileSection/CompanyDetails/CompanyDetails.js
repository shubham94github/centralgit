import React, { memo, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Col, Row } from 'react-bootstrap';
import { P12, P14, P16 } from '@components/_shared/text';
import Tooltip from '@components/_shared/Tooltip';
import { isEmpty } from '@utils/js-helpers';
import TextToggle from '@components/_shared/TextToggle';
import CategoriesButtons from '@components/_shared/buttons/CategoriesButtons';
import { colors } from '@colors';
import { array, bool, func, number, string } from 'prop-types';
import AppModal from '@components/Common/AppModal';
import FormWithAccordion from '@components/Auth/GettingStarted/FormWithAccordion';
import { getCategories } from '@ducks/auth/actions';
import {
	handleUpdateSectorOfCompetenceProfile,
	handleUpdateAreasOfInterestProfile,
	handleUpdateTagsProfile,
} from '@ducks/admin/actions';
import AssociatedTags from './AssociatedTags';
import { currencyFormatter } from '@utils/currencyFormatter';
import { Icons } from '@icons';
import CompanyDetailsFormStartupHOC from './CompanyDetailsFormStartupHOC';
import CompanyDetailsFormUserHOC from './CompanyDetailsFormRetailerHOC';
import { openWebsite } from '@utils/openWebsiteHelper';

import './CompanyDetails.scss';

const sectorsGuidelineText = `A sector of competence is the area in which your business
	share the same or related product or service.`;

const areasGuidelineText = `An area of interest is the area in which your
	business share the same or related product or service.`;

const CompanyDetails = ({
	tags,
	areasOfInterest,
	categories,
	solutionProductsServices,
	companyDescription,
	companyType,
	totalFundingAmount,
	presenceInCountries,
	numberOfClients,
	clientsList,
	integrationTiming,
	platformPartners,
	targetMarket,
	companyStatus,
	businessModel,
	phoneNumber,
	linkedInCompanyPage,
	urlOfCompanyWebsite,
	getCategories,
	sectorOfCategories,
	handleUpdateSectorOfCompetenceProfile,
	handleUpdateAreasOfInterestProfile,
	handleUpdateTagsProfile,
	owner,
	id,
	isLoadingCategories,
	companySectors,
	isStartup,
	isEditPermission,
}) => {
	const [isEditCompanyDetails, setIsEditCompanyDetails] = useState(false);
	const [isSectorOfCompetence, setIsSectorOfCompetence] = useState(false);
	const [isAreasOfInterest, setIsAreasOfInterest] = useState(false);
	const [isAssociatedTags, setIsAssociatedTags] = useState(false);

	useEffect(() => {
		getCategories();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const toggleCompanyDetailsEditModal = () => setIsEditCompanyDetails(prevState => !prevState);

	const editSectorOfCompetence = () => setIsSectorOfCompetence(prevState => !prevState);

	const editAreasOfInterest = () => setIsAreasOfInterest(prevState => !prevState);

	const editAssociatedTags = () => setIsAssociatedTags(prevState => !prevState);

	const updateCompetenceProfile = value => {
		editSectorOfCompetence();
		handleUpdateSectorOfCompetenceProfile({ data: { categoriesId: value.categoryIds }, id });
	};

	const updateAreasOfInterestProfile = value => {
		editAreasOfInterest();
		handleUpdateAreasOfInterestProfile({ data: { categoriesId: value.categoryIds }, id });
	};

	const updateTagsProfile = tags => {
		editAssociatedTags();
		handleUpdateTagsProfile({ data: tags, id });
	};

	const openLinkedInPage = () => openWebsite(linkedInCompanyPage);

	const openCompanyWebsite = () => openWebsite(urlOfCompanyWebsite);

	return (
		<>
			{isEditCompanyDetails
				&& <AppModal
					component={isStartup ? CompanyDetailsFormStartupHOC : CompanyDetailsFormUserHOC}
					className='company-details-pop-up'
					onClose={toggleCompanyDetailsEditModal}
					outerProps={{
						toggleCompanyDetailsEditModal,
					}}
					isScrollable
					title={isStartup ? 'Company details' : 'Company information'}
					width={isStartup ? '850px' : '1015px'}
				/>
			}
			{isSectorOfCompetence
				&& <AppModal
					component={FormWithAccordion}
					className='sector-of-competence-pop-up'
					onClose={editSectorOfCompetence}
					isScrollable
					title='Sector of competence'
					outerProps={{
						isAdminPanel: false,
						isForModal: true,
						selectedFullValues: categories,
						submitTitle: 'Update',
						isLoading: isLoadingCategories,
						getCategories,
						sendChosenItems: updateCompetenceProfile,
						itemsName: 'sectors',
						categories: sectorOfCategories,
						step: 3,
						stepCount: 5,
						onClose: editSectorOfCompetence,
						guidelineText: sectorsGuidelineText,
						isCancelButton: true,
					}}
				/>
			}
			{isAreasOfInterest
				&& <AppModal
					component={FormWithAccordion}
					className='sector-of-competence-pop-up'
					onClose={editAreasOfInterest}
					isScrollable
					title='Areas of interest'
					outerProps={{
						isAdminPanel: false,
						isForModal: true,
						selectedFullValues: areasOfInterest,
						submitTitle: 'Update',
						isLoading: isLoadingCategories,
						getCategories,
						sendChosenItems: updateAreasOfInterestProfile,
						itemsName: 'sectors',
						categories: sectorOfCategories,
						step: 3,
						stepCount: 5,
						onClose: editAreasOfInterest,
						guidelineText: areasGuidelineText,
						isCancelButton: true,
					}}
				/>
			}
			{isAssociatedTags
				&& <AppModal
					component={AssociatedTags}
					className='tags-pop-up'
					onClose={editAssociatedTags}
					title='Associated tags'
					outerProps={{
						initialTags: tags,
						onSubmitHandler: updateTagsProfile,
						onClose: editAssociatedTags,
					}}
				/>
			}
			<Row className='company-detail-wrapper'>
				<Col
					sm={12}
					md={4}
					className='mb-4'
				>
					<P16 className='pb-3' bold>
						Company information
					</P16>
					<div className='company-short-info-wrapper'>
						{phoneNumber && (
							<P12 className='pb-1'>
								<span className='text__bold'>Phone: </span>{phoneNumber}
							</P12>
						)}
						{owner && (
							<P12 className='pb-1'>
								<span className='text__bold'>Founder: </span>{owner}
							</P12>
						)}
						{companyType && (
							<P12 className='pb-1'>
								<span className='text__bold'>Company type: </span>{companyType}
							</P12>
						)}
						{businessModel && (
							<P12 className='pb-1'>
								<span className='text__bold'>Business model: </span>{businessModel}
							</P12>
						)}
						{companyStatus && (
							<P12 className='pb-1'>
								<span className='text__bold'>Company status: </span>{companyStatus}
							</P12>
						)}
						{!!targetMarket.length && (
							<P12 className='pb-1'>
								<span className='text__bold'>Target markets: </span>
								{
									targetMarket.map((market, index) => (
										<span key={market + index}>{index !== 0 && ', '}{market}</span>
									))
								}
							</P12>
						)}
						{!isStartup && urlOfCompanyWebsite && (
							<P12 className='pb-1 d-flex'>
								<span className='text__bold'>Website:&nbsp;</span>
								<span
									className='blue-link truncate'
									onClick={openCompanyWebsite}
									rel='noreferrer'
								>
									{urlOfCompanyWebsite}
								</span>
							</P12>
						)}
						{linkedInCompanyPage && (
							<P12 className='pb-1 d-flex'>
								<span className='text__bold'>LinkedIn:&nbsp;</span>
								<span
									className='blue-link truncate'
									onClick={openLinkedInPage}
									rel='noreferrer'
								>
									{linkedInCompanyPage}
								</span>
							</P12>
						)}
						{isStartup
							&& <>
								<P16 className='mt-4 pb-3' bold>
								Traction
								</P16>
								{!!platformPartners.length && (
									<P12 className='pb-1'>
										<span className='text__bold'>Platform Partners: </span>
										{
											platformPartners.map((platform, index) => (
												<span key={platform + index}>{index !== 0 && ', '}{platform}</span>
											))
										}
									</P12>
								)}
								{!!clientsList.length && (
									<P12 className='pb-1'>
										<span className='text__bold'>Clients list: </span>
										{
											clientsList.map((client, index) => (
												<span key={client + index}>{index !== 0 && ', '}{client}</span>
											))
										}
									</P12>
								)}
								{integrationTiming && (
									<P12>
										<span className='text__bold'>Integration Timing: </span>
										{integrationTiming}
									</P12>
								)}
								<Tooltip
									isVisibleTooltip={!isEmpty(clientsList)}
									placement='right'
									message={
										<P12>
											{
												clientsList.map((exampleItem, index) => (
													<span key={index + exampleItem + index}>{index !== 0 && ', '}
														{exampleItem}
													</span>
												))
											}
										</P12>
									}
								>
									<div className='d-inline-block'>
										<P12 className='pb-1'>
											<span className='text__bold number-of-clients'>
												Number of Clients:&nbsp;
											</span>
											{numberOfClients}
										</P12>
									</div>
								</Tooltip>
								{!!presenceInCountries.length && (
									<P12 className='pb-1'>
										<span className='text__bold'>Presence in other Countries: </span>
										{
											presenceInCountries.map((country, index) => (
												<span key={country.id}>{index !== 0 && ', '}{country.name}</span>
											))
										}
									</P12>
								)}
								<P12>
									<span className='text__bold'>Total Funding Amount: </span>
									{currencyFormatter.format(totalFundingAmount)}
								</P12>
							</>
						}
					</div>
				</Col>
				<Col sm={12} md={8}>
					<P14
						className='flex-section edit-icon-container'
						bold
					>
						Company Description:
						{isEditPermission
							&& <span
								onClick={toggleCompanyDetailsEditModal}
								className='clickable edit-icon'
							>
								{Icons.editIcon(colors.darkblue70)}
							</span>
						}
					</P14>
					<TextToggle text={companyDescription}/>
					{isStartup
						&& <>
							<P14 className='pt-2' bold>
								Solutions, products and services:
							</P14>
							{solutionProductsServices && (
								<TextToggle text={solutionProductsServices}/>
							)}
							<P16
								className='flex-section pt-4 pb-3 edit-icon-container'
								bold
							>
								Sector of competence
								{isEditPermission
									&& <span className='clickable edit-icon center' onClick={editSectorOfCompetence}>
										{Icons.editIcon(colors.darkblue70)}
									</span>
								}
							</P16>
							{!isEmpty(categories)
								&& <CategoriesButtons categories={categories}/>
							}
							<P16
								className='flex-section pt-4 pb-3 edit-icon-container'
								bold
							>
							Areas of interest
								{isEditPermission
									&& <span className='clickable edit-icon center' onClick={editAreasOfInterest}>
										{Icons.editIcon(colors.darkblue70)}
									</span>
								}
							</P16>
							{!isEmpty(areasOfInterest)
								&& <CategoriesButtons categories={areasOfInterest}/>
							}
						</>
					}
					{!isStartup
						&& <>
							<P16
								className='flex-section pt-4 pb-3 edit-icon-container'
								bold
							>
								Sectors of interest
							</P16>
							{!isEmpty(companySectors)
								&& <CategoriesButtons categories={companySectors}/>
							}
						</>}
					<P16
						className='flex-section pt-4 pb-3 edit-icon-container'
						bold
					>
						Associated tags
						{isStartup && isEditPermission
							&& <span className='clickable edit-icon center' onClick={editAssociatedTags}>
								{Icons.editIcon(colors.darkblue70)}
							</span>
						}
					</P16>
					{!isEmpty(tags)
						&& <div className='categories-buttons'>
							{
								tags.map((tag, index) =>
									<div key={index + tag + index} className='categories-buttons_item'>
										<P12 className='text__white text-uppercase'>{tag}</P12>
									</div>,
								)
							}
						</div>
					}
				</Col>
			</Row>
		</>
	);
};

CompanyDetails.propTypes = {
	tags: array,
	areasOfInterest: array,
	companySectors: array,
	categories: array,
	companyDescription: string,
	solutionProductsServices: string,
	companyType: string,
	totalFundingAmount: number,
	presenceInCountries: array,
	numberOfClients: number,
	clientsList: array,
	integrationTiming: string,
	platformPartners: array,
	targetMarket: array,
	companyStatus: string,
	businessModel: string,
	phoneNumber: string,
	linkedInCompanyPage: string,
	urlOfCompanyWebsite: string,
	getCategories: func.isRequired,
	sectorOfCategories: array,
	handleUpdateSectorOfCompetenceProfile: func.isRequired,
	handleUpdateAreasOfInterestProfile: func.isRequired,
	handleUpdateTagsProfile: func.isRequired,
	id: number.isRequired,
	owner: string,
	isLoadingCategories: bool.isRequired,
	isStartup: bool.isRequired,
	isEditPermission: bool,
};

CompanyDetails.defaultProps = {
	tags: [],
	companySectors: [],
	areasOfInterest: [],
	categories: [],
	companyDescription: '',
	solutionProductsServices: '',
	companyType: '',
	totalFundingAmount: null,
	presenceInCountries: [],
	numberOfClients: null,
	clientsList: [],
	integrationTiming: '',
	platformPartners: [],
	targetMarket: [],
	companyStatus: '',
	businessModel: '',
	phoneNumber: '',
	linkedInCompanyPage: '',
	urlOfCompanyWebsite: '',
	sectorOfCategories: [],
	owner: '',
};

export default connect(({ admin: { profile }, auth, common }) => {
	const isStartup = !!profile?.startup;
	const profileData = isStartup ? profile.startup : profile.retailer;
	const { listOfPermissions } = auth;
	const isEditPermission = isStartup
		? listOfPermissions?.isStartupsEditDetailsPermission
		: listOfPermissions.isRetailersEditDetailsInfoPermission;

	const {
		tags,
		companyDescription,
		phoneNumber,
		linkedInCompanyPage,
		id,
		areasOfInterest,
		categories,
		solutionProductsServices,
		companyType,
		totalFundingAmount,
		presenceInCountries,
		numberOfClients,
		clientsList,
		integrationTiming,
		platformPartners,
		targetMarket,
		companyStatus,
		businessModel,
		owner,
		companySectors,
		urlOfCompanyWebsite,
	} = profileData;

	return {
		isStartup,
		tags,
		areasOfInterest,
		categories,
		companyDescription,
		solutionProductsServices,
		companyType,
		totalFundingAmount,
		presenceInCountries,
		numberOfClients,
		clientsList,
		integrationTiming,
		platformPartners,
		targetMarket,
		companyStatus,
		businessModel,
		phoneNumber,
		linkedInCompanyPage,
		sectorOfCategories: auth.categories,
		owner,
		id,
		isLoadingCategories: common.isLoading,
		companySectors,
		urlOfCompanyWebsite,
		isEditPermission,
	};
}, {
	getCategories,
	handleUpdateSectorOfCompetenceProfile,
	handleUpdateAreasOfInterestProfile,
	handleUpdateTagsProfile,
})(memo(CompanyDetails));
