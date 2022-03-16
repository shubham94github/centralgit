import enums from '@constants/enums';
import { getCategories } from '@ducks/auth/actions';
import { updateSectorsOfCompetence } from '@ducks/settings/actions';
import { array, bool, func, string } from 'prop-types';
import React, { memo } from 'react';
import { connect } from 'react-redux';
import { userType } from '@constants/types';
import SectorsOfCompetence from '@components/Auth/GettingStarted/SectorsOfCompetence';
import { getItemFromStorage } from '@utils/storage';

const { userRoles } = enums;

const SectorsOfCompetenceHOC = ({
	updateSectorsOfCompetence,
	getCategories,
	isLoading,
	categories,
	user,
}) => {
	const isRetailer = !!(user.role === userRoles.retailerEntrepreneur || user.role === userRoles.retailerCompany);
	const title = isRetailer ? 'Company sectors' : 'Sectors of competence';
	const selectedValues = user?.startup?.categories;

	return (
		<div>
			<SectorsOfCompetence
				title={title}
				sendSectorsOfCompetence={updateSectorsOfCompetence}
				getCategories={getCategories}
				isLoading={isLoading}
				categories={categories}
				isRetailer={isRetailer}
				isResetButton
				selectedValues={selectedValues}
			/>
		</div>
	);
};

SectorsOfCompetenceHOC.propTypes = {
	updateSectorsOfCompetence: func.isRequired,
	getCategories: func.isRequired,
	isLoading: bool,
	status: string,
	categories: array,
	role: string,
	user: userType,
};

const mapStateToProps = ({ auth: { user, categories }, settings: { isLoading } }) => {
	return {
		isLoading,
		categories,
		user: user || getItemFromStorage('user'),
	};
};

export default connect(mapStateToProps, {
	updateSectorsOfCompetence,
	getCategories,
})(memo(SectorsOfCompetenceHOC));
