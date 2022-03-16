import React, { memo, useEffect, useMemo } from 'react';
import { connect } from 'react-redux';
import CompanyDetailsForm from '@components/_shared/CompanyDetailsForm';
import { array, bool, func, object, string } from 'prop-types';
import { textFields } from '@components/_shared/CompanyDetailsForm/constants';
import { getAllTags, getCountries } from '@ducks/common/actions';
import { retailerSchema } from '@components/_shared/CompanyDetailsForm/schema';
import { getTopLevelCategories } from '@ducks/auth/actions';
import { updateCompanyDetails } from '@ducks/admin/actions';
import { getDefaultValuesRetailer } from '@utils/getDefaultCompanyDetailsValues';

const CompanyDetailsFormRetailerHOC = ({
	toggleCompanyDetailsEditModal,
	profile,
	role,
	isLoading,
	countries,
	getCountries,
	userType,
	getTopLevelCategories,
	topLevelCategories,
	getAllTags,
	tags,
	updateCompanyDetails,
}) => {
	const filteredTextFields = textFields.filter(item => item.role.includes(role));
	const selectedDefaultValues = useMemo(() => getDefaultValuesRetailer(profile, countries, userType),
		[profile, countries, userType]);

	useEffect(() => {
		if (!tags.length) getAllTags();
		if (!topLevelCategories.length) getTopLevelCategories();
		if (!countries?.length) getCountries();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<CompanyDetailsForm
			isStartup={false}
			toggleCompanyDetailsEditModal={toggleCompanyDetailsEditModal}
			profile={profile}
			textFields={filteredTextFields}
			countries={countries}
			isLoading={isLoading}
			selectedDefaultValues={selectedDefaultValues}
			updateCompanyDetails={updateCompanyDetails}
			schema={retailerSchema}
			fullTopLevelCategories={topLevelCategories}
			tags={tags}
		/>
	);
};

CompanyDetailsFormRetailerHOC.propTypes = {
	toggleCompanyDetailsEditModal: func.isRequired,
	profile: object.isRequired,
	role: string.isRequired,
	isLoading: bool,
	getCountries: func.isRequired,
	countries: array.isRequired,
	userType: string.isRequired,
	getTopLevelCategories: func.isRequired,
	getAllTags: func.isRequired,
	topLevelCategories: array,
	tags: array,
	updateCompanyDetails: func.isRequired,
};

const mapStateToProps = ({
	admin,
	common: { countries, tags, isLoading },
	auth: { topLevelCategories },
}) => {
	const { profile: { retailer, role, userType } } = admin;

	return {
		profile: retailer,
		role,
		isLoading,
		countries,
		userType,
		topLevelCategories,
		tags,
	};
};

export default connect(mapStateToProps, {
	getCountries,
	getTopLevelCategories,
	getAllTags,
	updateCompanyDetails,
})(memo(CompanyDetailsFormRetailerHOC));
