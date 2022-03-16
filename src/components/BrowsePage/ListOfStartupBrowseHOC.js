import React, { memo } from 'react';
import { connect } from 'react-redux';
import { array, bool, func, number, object } from 'prop-types';
import ListOfStartup from '@components/_shared/ListOfStartup';
import { setFieldForFilter, setIsBookmark } from '@ducks/browse/action';
import { openChat, setWarningOfChatRestriction } from '@ducks/messages/actions';
import { setWarningOfProfileRestriction } from '@ducks/profile/actions';

const ListOfStartupBrowseHOC = ({
	startups,
	isLoading,
	countOfRecords,
	page,
	pageSize,
	setFieldForFilter,
	trialData,
	isTrial,
	openChat,
	setWarningOfProfileRestriction,
	setWarningOfChatRestriction,
	setIsBookmark,
}) => {
	return (
		<ListOfStartup
			startups={startups}
			isLoading={isLoading}
			countOfRecords={countOfRecords}
			page={page}
			pageSize={pageSize}
			setFieldForFilter={setFieldForFilter}
			trialData={trialData}
			isTrial={isTrial}
			openChat={openChat}
			setWarningOfProfileRestriction={setWarningOfProfileRestriction}
			setWarningOfChatRestriction={setWarningOfChatRestriction}
			setIsBookmark={setIsBookmark}
		/>
	);
};

ListOfStartupBrowseHOC.propTypes = {
	startups: array.isRequired,
	isLoading: bool.isRequired,
	countOfRecords: number,
	page: number.isRequired,
	pageSize: number.isRequired,
	setFieldForFilter: func.isRequired,
	trialData: object,
	isTrial: bool,
	openChat: func.isRequired,
	setWarningOfProfileRestriction: func.isRequired,
	setWarningOfChatRestriction: func.isRequired,
	setIsBookmark: func.isRequired,
};

const mapStateToProps = ({
	browse: {
		startups,
		isLoading,
		filterCategories,
		countOfRecords,
	},
	common: { trialData },
	auth: { user },
}) => {
	const propName = user?.retailer ? 'retailer' : 'member';

	return {
		startups,
		isLoading,
		pageSize: filterCategories.pageSize,
		countOfRecords,
		page: filterCategories.page,
		trialData,
		isTrial: user[propName]?.stripePaymentSettings?.isTrial || trialData?.isTrial,
	};
};

export default connect(mapStateToProps, {
	setFieldForFilter,
	openChat,
	setWarningOfProfileRestriction,
	setWarningOfChatRestriction,
	setIsBookmark,
})(memo(ListOfStartupBrowseHOC));
