import { redirectToCorrectPageByStatus } from '@components/Auth/utils';
import enums from '@constants/enums';
import { getCategories, sendSectorsOfCompetence } from '@ducks/auth/actions';
import { array, bool, func, string } from 'prop-types';
import React, { memo } from 'react';
import { connect } from 'react-redux';
import { userType } from '@constants/types';
import SectorsOfCompetence from '@components/Auth/GettingStarted/SectorsOfCompetence';
import { getItemFromStorage } from '@utils/storage';

const { gettingStartedStatuses, userRoles } = enums;

const SectorsOfCompetenceHOC = ({
	sendSectorsOfCompetence,
	getCategories,
	isLoading,
	categories,
	user,
}) => {
	if (!!user && user.status !== gettingStartedStatuses.gallery) return redirectToCorrectPageByStatus(user);

	const isRetailer = !!(user.role === userRoles.retailerEntrepreneur || user.role === userRoles.retailerCompany);
	const title = isRetailer ? 'Company sectors' : 'Sectors of competence';

	return (
		<div>
			<SectorsOfCompetence
				title={title}
				sendSectorsOfCompetence={sendSectorsOfCompetence}
				getCategories={getCategories}
				isLoading={isLoading}
				categories={categories}
				isRetailer={isRetailer}
				stepText={isRetailer ? 'Step 4 of 4' : 'Step 4 of 6'}
			/>
		</div>
	);
};

SectorsOfCompetenceHOC.propTypes = {
	sendSectorsOfCompetence: func.isRequired,
	getCategories: func.isRequired,
	isLoading: bool,
	status: string,
	categories: array,
	role: string,
	user: userType,
};

const mapStateToProps = ({ auth: { isLoading, user, categories } }) => {
	return {
		isLoading,
		categories,
		user: user || getItemFromStorage('user'),
	};
};

export default connect(mapStateToProps, {
	sendSectorsOfCompetence,
	getCategories,
})(memo(SectorsOfCompetenceHOC));
