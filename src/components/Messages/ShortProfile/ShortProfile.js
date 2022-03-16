import React, { memo } from 'react';
import { bool, func, number, object } from 'prop-types';
import { connect } from 'react-redux';
import { P12, H1 } from '@components/_shared/text';
import { colors } from '@colors';
import Avatar from '@components/_shared/Avatar';
import { toColor } from '@utils';
import { setIsShortProfileOpen } from '@ducks/messages/actions';
import { useHistory } from 'react-router-dom';
import { isEmpty } from '@utils/js-helpers';
import CategoriesSwiper from '@components/_shared/CategoriesSwiper';
import TextToggleForHeight from '@components/_shared/TextToggleForHeight';
import TagButtons from '@components/_shared/buttons/TagButtons';
import { Icons } from '@icons';
import Tooltip from '@components/_shared/Tooltip';
import tooltipsText from '@constants/tooltipsText';
import { openWebsite } from '@utils/openWebsiteHelper';
import { setSnackbar } from '@ducks/common/actions';

import './ShortProfile.scss';

const { linkToProfileTooltipText } = tooltipsText;

const actionLinkIcon = Icons.actionLink();
const closeIcon = Icons.close(colors.darkblue70);
const locationIcon = Icons.locationIcon(colors.grass50);
const actionWebsiteIcon = Icons.actionWebsite();

function ShortProfile({
	profile,
	isCreator,
	setIsShortProfileOpen,
	idForFullProfile,
	setSnackbar,
}) {
	const {
		areasOfInterest,
		categories,
		city,
		companyShortName,
		country,
		urlOfCompanyWebsite,
		companyDescription,
		companySectors,
		id,
		logo60,
		solutionProductsServices,
		tags,
		isBlocked,
	} = profile;

	const history = useHistory();
	const avatar = {
		image: logo60?.image,
		name: `${companyShortName}`,
		color: toColor(id.toString()),
	};
	const pathToFullProfile = `/profile/${isCreator ? 'startup' : 'retailer'}/${idForFullProfile}`;

	const goToFullProfile = () => {
		if (isBlocked) {
			setSnackbar({
				type: 'error',
				text: 'This Startup is blocked. You can\'t view his profile.',
			});

			return;
		}

		history.push(pathToFullProfile);
	};

	const closeShortProfile = e => {
		e.stopPropagation();
		setIsShortProfileOpen(false);
	};

	const openCompanyWebsite = () => openWebsite(urlOfCompanyWebsite);

	return (
		<div className='short-profile'>
			<div className='title-profile'>
				<div className='actions'>
					<Tooltip
						placement='bottom-end'
						message={
							<P12>{linkToProfileTooltipText}</P12>
						}
					>
						<div className='pb-1'>
							<div
								className='action-icon'
								onClick={goToFullProfile}
							>
								{actionLinkIcon}
							</div>
						</div>
					</Tooltip>
					<span className='action-icon' onClick={closeShortProfile}>{closeIcon}</span>
				</div>
			</div>
			<div className='profile-card'>
				<Avatar logo={avatar}/>
				<div className='card-info'>
					<H1 className='text__black text-start me-70'>
						{companyShortName}
					</H1>
					<div className='address'>
						{locationIcon}
						<P12 className='truncate-text'>
							{`${city}, ${country.name}`}
						</P12>
					</div>
					{urlOfCompanyWebsite && !isCreator
						&& <div className='website'>
							{actionWebsiteIcon}
							<P12>
								<span
									className='blue-link truncate-link'
									onClick={openCompanyWebsite}
								>
									{urlOfCompanyWebsite}
								</span>
							</P12>
						</div>
					}
				</div>
			</div>
			<div className='short-profile-wrapper'>
				{
					isCreator
					&& <div>
						<H1 className='text__black text-start pb-3' bold>
							Company Description
						</H1>
						<TextToggleForHeight text={companyDescription}/>
					</div>
				}
				<div className='mt-40 '>
					<H1 className='text__black text-start pb-3' bold>
						{isCreator ? 'Solutions, products and services' : 'Company Description'}
					</H1>
					<TextToggleForHeight text={
						isCreator
							? solutionProductsServices
							: companyDescription
					}
					/>
				</div>
				{
					isCreator
						? <>
							<div>
								{
									!isEmpty(categories)
									&& <>
										<H1
											className='text__black text-start mt-40'
											bold
										>
											Sector of competence
										</H1>
										<CategoriesSwiper
											id='categories'
											selectedCategories={categories}
										/>
									</>
								}
							</div>
							<div>
								{
									!isEmpty(areasOfInterest)
									&& <>
										<H1
											className='text__black text-start mt-40'
											bold
										>
											Areas of interest
										</H1>
										<CategoriesSwiper
											id='areasOfInterest'
											selectedCategories={areasOfInterest}
										/>
									</>
								}
							</div>
						</>
						: <div className='mgt-15'>
							{
								!isEmpty(companySectors)
								&& <>
									<H1
										className='text__black text-start pt-4'
										bold
									>
										Business Sectors of Interest
									</H1>
									<CategoriesSwiper
										id='companySectors'
										selectedCategories={companySectors}
									/>
								</>
							}
						</div>
				}
				<div className='mgt-15'>
					{!isEmpty(tags)
						&& <>
							<H1
								className='text__black text-start mt-40 pb-3'
								bold
							>
								Associated tags
							</H1>
							<TagButtons tags={tags}/>
						</>
					}
				</div>
			</div>
		</div>
	);
}

ShortProfile.propTypes = {
	profile: object,
	setIsShortProfileOpen: func.isRequired,
	setSnackbar: func.isRequired,
	isCreator: bool,
	idForFullProfile: number.isRequired,
};

const mapStateToProps = ({
	auth: {
		user,
	},
	messaging: {
		activeChannelId,
		channels,
		newChannel,
	},
}) => {
	const channel = activeChannelId === 'new' ? newChannel : channels.find(channel => channel.id === activeChannelId);
	const isCreator = user.id === channel.creator?.id;
	const profile = isCreator ? channel.participant.startup : channel.creator.retailer;
	const idForFullProfile = isCreator ? channel.participant.startup.id : channel.creator.id;

	return {
		isCreator,
		profile,
		idForFullProfile,
	};
};

export default connect(mapStateToProps, {
	setIsShortProfileOpen,
	setSnackbar,
})(memo(ShortProfile));
