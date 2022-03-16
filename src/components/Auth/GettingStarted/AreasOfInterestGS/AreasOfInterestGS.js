import React, { memo } from 'react';
import { connect } from 'react-redux';
import { array, bool, func } from 'prop-types';
import { sendAreasOfInterest, getCategories } from '@ducks/auth/actions';
import { redirectToCorrectPageByStatus } from '@components/Auth/utils';
import enums from '@constants/enums';
import { userType } from '@constants/types';
import AreasOfInterest from '@components/Auth/GettingStarted/AreasOfInterest';

const { gettingStartedStatuses } = enums;

const AreasOfInterestHOC = ({
	sendAreasOfInterest,
	getCategories,
	isLoading,
	categories,
	user,
}) => {
	if (!!user && user.status !== gettingStartedStatuses.sectorsOfCompetence)
		return redirectToCorrectPageByStatus(user);

	return (
		<div>
			<AreasOfInterest
				title='Areas of interest'
				sendAreasOfInterest={sendAreasOfInterest}
				getCategories={getCategories}
				isLoading={isLoading}
				categories={categories}
				stepText='Step 5 of 6'
			/>
		</div>
	);
};

AreasOfInterestHOC.propTypes = {
	sendAreasOfInterest: func.isRequired,
	getCategories: func.isRequired,
	isLoading: bool,
	categories: array,
	user: userType,
};

const mapStateToProps = ({ auth: { isLoading, user, categories } }) => {
	return {
		isLoading,
		categories,
		user,
	};
};

export default connect(mapStateToProps, {
	sendAreasOfInterest,
	getCategories,
})(memo(AreasOfInterestHOC));
