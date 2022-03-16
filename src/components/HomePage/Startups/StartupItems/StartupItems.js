import React, { memo, useCallback } from 'react';
import { connect } from 'react-redux';
import { Routes } from '@routes';
import { array, bool, func, object, string } from 'prop-types';
import Avatar from '@components/_shared/Avatar';
import {
	setFieldOutsideForFilter,
	setDefaultFieldForFilter,
	setWarningOfSearchRestriction,
} from '@ducks/browse/action';
import { useHistory } from 'react-router-dom';
import PrimaryButton from '@components/_shared/buttons/PrimaryButton';
import { setWarningOfProfileRestriction } from '@ducks/profile/actions';
import Markdown from 'markdown-to-jsx';

import './StartupItems.scss';

const StartupItems = ({
	startups,
	setFieldOutsideForFilter,
	setDefaultFieldForFilter,
	sortData,
	setWarningOfProfileRestriction,
	trialData,
	isTrial,
	setWarningOfSearchRestriction,
}) => {
	const history = useHistory();
	const onClickStartupHandler = useCallback(id => history.push(`/profile/startup/${id}`), [history]);

	const successfulHandleSearch = () => {
		const isRelatedFilter = sortData === 'Related';
		const data = {
			field: isRelatedFilter ? 'browseType' : 'sort',
			data: sortData,
		};

		setDefaultFieldForFilter();
		setFieldOutsideForFilter(data);
		history.push(Routes.BROWSE_PAGE);
	};

	const onRedirectHandler = () => {
		if (!isTrial || trialData?.isTrialSearch)
			successfulHandleSearch();
		else setWarningOfSearchRestriction();
	};

	return (
		<div className='startups-items-wrapper'>
			<div className='startups-items-greed'>
				{
					startups.map(startup => {
						const onClickHandler = () => {
							if (!isTrial || trialData?.isTrialProfile)
								onClickStartupHandler(startup.id);
							else setWarningOfProfileRestriction();
						};

						return (
							<div
								key={startup.id}
								className='startup-item'
								onClick={onClickHandler}
							>
								<div className='item-container'>
									<div
										className='d-flex justify-content-center img-wrapper-home'
									>
										<Avatar logo={startup.logo120}/>
									</div>
									<div>
										<div className='d-flex justify-content-start'>
											<span
												className='company-short-name truncate-short-name clickable'
											>
												{startup.companyShortName}
											</span>
										</div>
										{!!startup.companyDescription
											&& <div className='text-descriptions'>
												<Markdown options={{ forceInline: true, wrapper: 'div' }}>
													{startup.companyDescription}
												</Markdown>
											</div>
										}
									</div>
								</div>
							</div>
						);
					})
				}
			</div>
			<div className='see-all-button'>
				<PrimaryButton
					text='View all'
					onClick={onRedirectHandler}
					isFullWidth
				/>
			</div>
		</div>
	);
};

StartupItems.propTypes = {
	startups: array.isRequired,
	setFieldOutsideForFilter: func.isRequired,
	setDefaultFieldForFilter: func.isRequired,
	sortData: string.isRequired,
	setWarningOfProfileRestriction: func.isRequired,
	trialData: object,
	isTrial: bool,
	setWarningOfSearchRestriction: func.isRequired,
};

export default connect(({ common: { trialData }, auth: { user } }) => ({
	trialData,
	isTrial: user?.retailer?.stripePaymentSettings?.isTrial || trialData?.isTrial,
}),
{
	setFieldOutsideForFilter,
	setDefaultFieldForFilter,
	setWarningOfProfileRestriction,
	setWarningOfSearchRestriction,
})(memo(StartupItems));
