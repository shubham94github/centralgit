import React, { memo, useEffect } from 'react';
import CompanyInfo from '@components/_shared/CompanyInfo';
import {
	getProfile,
	getTopLevelCategories,
	uploadCompanyLogo,
} from '@ducks/auth/actions';
import { setItemToSessionStorage } from '@utils/sessionStorage';
import { getUser, sendCompanyInfo } from '@ducks/settings/actions';
import { getAllTags, getCountries, getPlatformPartners } from '@ducks/common/actions';
import { companyTypes, textFields } from '@components/_shared/CompanyInfo/fields';
import { connect } from 'react-redux';
import { array, arrayOf, bool, func, number, object, oneOfType, shape, string } from 'prop-types';
import enums from '@constants/enums';
import { userType } from '@constants/types';
import { getItemFromStorage } from '@utils/storage';

function CompanyInfoSettingsHOC({
	companyAvatar,
	companyInfo,
	companyLogo,
	companyShortName,
	countries,
	isLoading,
	status,
	textFields,
	user,
	userRole,
	tags,
	topLevelCategories,
	platformPartners,
	getCountries,
	getProfile,
	sendCompanyInfo,
	getAllTags,
	getTopLevelCategories,
	getPlatformPartners,
	isRetailer,
	uploadCompanyLogo,
	getUser,
}) {
	const isStartup = userRole === enums.userRoles.startup;

	const initialData = isStartup
		? {
			...companyInfo,
			companyLegalName: companyInfo?.companyLegalName || '',
			companyShortName: companyInfo?.companyShortName || '',
			country: companyInfo?.country && {
				...companyInfo?.country,
				label: companyInfo?.country.name,
				value: companyInfo?.country.id,
			},
			companyType: companyTypes.find(companyType => companyType.value === companyInfo?.companyType),
			targetMarket: companyInfo?.targetMarket?.map(item => ({ value: item, label: item })),
			platformPartners: companyInfo?.platformPartners?.map(item => ({ value: item, label: item })),
			clientsList: companyInfo?.clientsList?.map(item => ({ value: item, label: item })),
			presenceInCountriesIds: companyInfo?.presenceInCountries?.map(item =>
				({ id: item.id, label: item.name, value: item.id })),
			categoryIds: companyInfo?.companySectors?.map(sector =>
				({ id: sector.id, value: sector.id, label: sector.name })),
		}
		: {
			...companyInfo,
			companyLegalName: companyInfo?.companyLegalName || '',
			companyShortName: companyInfo?.companyShortName || '',
			country: companyInfo?.country && {
				...companyInfo?.country,
				label: companyInfo?.country.name,
				value: companyInfo?.country.id,
			},
			emailDomain: companyInfo?.emailDomain || '',
			companyDescription: companyInfo?.companyDescription || '',
			categoryIds: companyInfo?.companySectors?.map(sector =>
				({ ...sector, value: sector.name, label: sector.name })),
			tags: companyInfo?.tags?.map(tag => ({ value: tag, label: tag })),
		};

	const handleSaveCompanyInfo = companyInfo => sendCompanyInfo(companyInfo, isRetailer);

	useEffect(() => {
		getUser();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		setItemToSessionStorage('user', user);
	}, [user]);

	return (
		<div className='company-info-container'>
			<CompanyInfo
				getCountries={getCountries}
				getProfile={getProfile}
				sendCompanyInfo={handleSaveCompanyInfo}
				getAllTags={getAllTags}
				getTopLevelCategories={getTopLevelCategories}
				getPlatformPartners={getPlatformPartners}
				companyAvatar={companyAvatar}
				companyInfo={initialData}
				companyLogo={companyLogo}
				companyShortName={companyShortName}
				countries={countries}
				isLoading={isLoading}
				status={status}
				textFields={textFields}
				title='Company details'
				user={user}
				userRole={userRole}
				tags={tags}
				topLevelCategories={topLevelCategories}
				platformPartners={platformPartners}
				isResetButton
				uploadCompanyLogo={uploadCompanyLogo}
				isSettings
				refreshUserData={getUser}
			/>
		</div>
	);
}

CompanyInfoSettingsHOC.propTypes = {
	countries: arrayOf(shape({
		label: string,
		value: oneOfType([string, number]),
	})),
	textFields: array,
	userRole: string.isRequired,
	isLoading: bool,
	sendCompanyInfo: func.isRequired,
	companyLogo: shape({
		name: string,
		id: number,
	}),
	status: string.isRequired,
	getCountries: func,
	getProfile: func,
	companyInfo: shape({
		companyLegalName: string,
		companyShortName: string,
		country: object,
		position: string,
	}),
	user: userType,
	companyAvatar: object,
	companyShortName: string,
	getAllTags: func.isRequired,
	getPlatformPartners: func.isRequired,
	tags: array,
	platformPartners: array,
	getTopLevelCategories: func,
	topLevelCategories: array,
	isRetailer: bool,
	uploadCompanyLogo: func.isRequired,
	getUser: func.isRequired,
};

const mapStateToProps = ({ auth, common: { countries, tags, platformPartners } }) => {
	const user = auth.user || getItemFromStorage('user');
	const companyShortName = user.startup ? user.startup.companyShortName : user?.retailer?.companyShortName;
	const { role, startup, retailer, status } = user;

	return {
		companyAvatar: auth.companyAvatar,
		companyInfo: auth.user?.retailer || auth.user?.startup,
		companyLogo: retailer
			? { ...auth.companyLogo, image: retailer?.logo60?.image }
			: { ...auth.companyLogo, image: startup?.logo60?.image },
		companyShortName,
		countries,
		isLoading: auth.isLoading,
		status: status,
		textFields: textFields.filter(item => item.role.includes(role)),
		user,
		userRole: role,
		tags,
		topLevelCategories: auth.topLevelCategories,
		platformPartners,
		isRetailer: user.role !== enums.userRoles.startup && user.role !== enums.userRoles.admin,
	};
};

export default connect(mapStateToProps, {
	getCountries,
	getProfile,
	sendCompanyInfo,
	getAllTags,
	getTopLevelCategories,
	getPlatformPartners,
	uploadCompanyLogo,
	getUser,
})(memo(CompanyInfoSettingsHOC));
