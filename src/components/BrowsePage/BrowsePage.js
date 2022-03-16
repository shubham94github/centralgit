import React, { lazy, memo } from 'react';
import SearchPanel from './SearchPanel';
import { connect } from 'react-redux';
import { bool } from 'prop-types';
import LoadingOverlay from '@components/_shared/LoadingOverlay';
import Navbar from './Navbar';
import cn from 'classnames';
import withSuspense from '@utils/withSuspense';
import { retryLoad } from '@utils/retryReload';
import { getItemFromStorage } from '@utils/storage';
import { P16 } from '@components/_shared/text';

import('./BrowsePage.scss');

const SearchForStartups = withSuspense(lazy(() => retryLoad(() => import('./SearchForStartups'))));
const SortForStartupsBrowseHOC = withSuspense(lazy(() => retryLoad(() =>
	import('./SortForStartups/SortForStartupsBrowseHOC'))));
const ListOfStartupBrowseHOC = withSuspense(lazy(() => retryLoad(() =>
	import('@components/BrowsePage/ListOfStartupBrowseHOC'))));

const BrowsePage = ({ isLoading, isTrial }) => {
	const classes = cn('browse-page-container', { 'hide': isLoading });

	return (
		<>
			{isLoading && <LoadingOverlay/>}
			<div className={classes}>
				<SearchPanel/>
				<div className='browse-page-content-wrapper'>
					<div className='browse-page-content'>
						<Navbar/>
						<SearchForStartups/>
						{isTrial
							&& <P16 className='trial-message'>
								During the trial period, you have restrictions on the number of searches
								<br/>
								and the number of Startup profiles you can view.
							</P16>
						}
						<SortForStartupsBrowseHOC/>
						<ListOfStartupBrowseHOC/>
					</div>
				</div>
			</div>
		</>
	);
};

BrowsePage.propTypes = {
	isLoading: bool,
	isTrial: bool,
};

BrowsePage.defaultProps = {
	isLoading: false,
	isTrial: false,
};

const mapStateToProps = ({ common: { isLoading }, auth }) => {
	const user = auth?.user || getItemFromStorage('user');
	const propName = !!user?.retailer ? 'retailer' : 'member';

	return ({
		isLoading,
		isTrial: user[propName].stripePaymentSettings?.isTrial,
	});
};

export default connect(mapStateToProps)(memo(BrowsePage));
