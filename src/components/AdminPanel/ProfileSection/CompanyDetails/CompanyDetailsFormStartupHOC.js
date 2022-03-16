import React, { memo, useEffect, useMemo, useState } from 'react';
import { connect } from 'react-redux';
import CompanyDetailsForm from '@components/_shared/CompanyDetailsForm';
import { array, bool, func, object, string } from 'prop-types';
import { textFields } from '@components/_shared/CompanyDetailsForm/constants';
import { getCountries, getPlatformPartners } from '@ducks/common/actions';
import { updateCompanyDetails } from '@ducks/admin/actions';
import {
	startupSchemaDemo,
	startupSchemaIncomplete,
	startupSchemaStandard,
} from '@components/_shared/CompanyDetailsForm/schema';
import enums from '@constants/enums';
import { getDefaultValuesStartup } from '@utils/getDefaultCompanyDetailsValues';

const { accountTypesAdminPanel } = enums;

const CompanyDetailsFormStartupHOC = ({
	toggleCompanyDetailsEditModal,
	profile,
	role,
	isLoading,
	countries,
	platformPartners,
	getCountries,
	getPlatformPartners,
	updateCompanyDetails,
}) => {
	const filteredTextFields = textFields.filter(item => item.role.includes(role));
	const [selectedAccountType, setSelectedAccountType] = useState(profile.accountType || 'Incomplete');
	const [numberOfClientsError, setNumberOfClientsError] = useState(null);

	const schema = useMemo(() => (
		selectedAccountType === accountTypesAdminPanel.STANDARD
			? startupSchemaStandard
			: selectedAccountType === accountTypesAdminPanel.DEMO
				? startupSchemaDemo
				: startupSchemaIncomplete
	), [selectedAccountType]);

	const handleSelectAccountType = accountType => setSelectedAccountType(accountType);

	const selectedDefaultValues = useMemo(() =>
		getDefaultValuesStartup(profile, schema, countries, selectedAccountType),
	[profile, schema, countries, selectedAccountType]);

	useEffect(() => {
		if (!countries?.length) getCountries();
		if (!platformPartners?.length) getPlatformPartners();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const revalidateTargetMarket = (setValue, targetMarket) => {
		if (!targetMarket?.length)
			setValue('targetMarket', null, { shouldValidate: true });
	};

	const numberOfClientsValidationHandler = (watch, setValue, fieldName) => {
		const countOfClientsList = watch('clientsList')?.length;
		const numberOfClients = watch('numberOfClients');

		if (numberOfClients < countOfClientsList) {
			switch (fieldName) {
				case 'clientsList':
					setValue('numberOfClients', countOfClientsList);
					break;
				case 'numberOfClients':
					setNumberOfClientsError('Number of Clients shoudn\'t be less than Clients list');
					break;
				default: break;
			}
		}

		if (numberOfClients >= countOfClientsList)
			setNumberOfClientsError(null);
	};

	return (
		<CompanyDetailsForm
			isStartup
			toggleCompanyDetailsEditModal={toggleCompanyDetailsEditModal}
			profile={profile}
			textFields={filteredTextFields}
			countries={countries}
			isLoading={isLoading}
			platformPartners={platformPartners}
			selectedDefaultValues={selectedDefaultValues}
			selectedAccountType={selectedAccountType}
			setSelectedAccountType={handleSelectAccountType}
			updateCompanyDetails={updateCompanyDetails}
			revalidateTargetMarket={revalidateTargetMarket}
			numberOfClientsError={numberOfClientsError}
			numberOfClientsValidationHandler={numberOfClientsValidationHandler}
			schema={schema}
		/>
	);
};

CompanyDetailsFormStartupHOC.propTypes = {
	toggleCompanyDetailsEditModal: func.isRequired,
	profile: object.isRequired,
	role: string.isRequired,
	isLoading: bool,
	platformPartners: array,
	getPlatformPartners: func.isRequired,
	getCountries: func.isRequired,
	countries: array.isRequired,
	updateCompanyDetails: func.isRequired,
};

CompanyDetailsFormStartupHOC.defaultProps = {
	platformPartners: [],
};

const mapStateToProps = ({
	admin,
	common: { countries, platformPartners, isLoading },
}) => {
	const { profile: { startup, role } } = admin;

	return {
		profile: startup,
		role,
		isLoading,
		countries,
		platformPartners,
	};
};

export default connect(mapStateToProps, {
	getCountries,
	getPlatformPartners,
	updateCompanyDetails,
})(memo(CompanyDetailsFormStartupHOC));
