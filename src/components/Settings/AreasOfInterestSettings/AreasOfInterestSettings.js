import React, { memo } from 'react';
import { connect } from 'react-redux';
import { array, bool, func } from 'prop-types';
import { getCategories } from '@ducks/auth/actions';
import { updateAreasOfInterests } from '@ducks/settings/actions';
import AreasOfInterest from '@components/Auth/GettingStarted/AreasOfInterest';
import { userType } from '@constants/types';

const AreasOfInterestHOC = ({
	updateAreasOfInterests,
	getCategories,
	isLoading,
	categories,
	user,
}) => {
	const selectedValues = user?.startup?.areasOfInterest;

	return (
		<div>
			<AreasOfInterest
				title='Areas of interest'
				sendAreasOfInterest={updateAreasOfInterests}
				getCategories={getCategories}
				isLoading={isLoading}
				categories={categories}
				selectedValues={selectedValues}
				isResetButton
			/>
		</div>
	);
};

AreasOfInterestHOC.propTypes = {
	updateAreasOfInterests: func.isRequired,
	getCategories: func.isRequired,
	isLoading: bool,
	categories: array,
	user: userType,
};

const mapStateToProps = ({ auth: { user, categories }, settings: { isLoading } }) => {
	return {
		isLoading,
		categories,
		user,
	};
};

export default connect(mapStateToProps, {
	updateAreasOfInterests,
	getCategories,
})(memo(AreasOfInterestHOC));
