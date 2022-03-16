// eslint-disable

import React from 'react';
import CompanyInfo from '@components/_shared/CompanyInfo';
import {
	clearDocuments,
	getProfile,
	getTopLevelCategories,
	sendCompanyInfo,
	uploadCompanyLogo,
} from '@ducks/auth/actions';
import { getAllTags, getCountries, getPlatformPartners } from '@ducks/common/actions';
import { textFields } from '@components/_shared/CompanyInfo/fields';
import { connect } from 'react-redux';
import { array, arrayOf, bool, func, number, object, oneOfType, shape, string } from 'prop-types';
import { redirectToCorrectPageByStatus } from '@components/Auth/utils';
import enums from '@constants/enums';
import { getItemFromStorage } from '@utils/storage';

function CompanyInfoHOC({
	company,
	companyAvatar,
	companyDocuments,
	companyInfo,
	companyLogo,
	companyShortName,
	countries,
	isLoading,
	status,
	textFields,
	title,
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
	uploadCompanyLogo,
}) {
	const isStartup = userRole === enums.userRoles.startup;

	const initialData = isStartup
		? {
			companyLegalName: companyInfo?.companyLegalName || '',
			companyShortName: companyInfo?.companyShortName || '',
			country: companyInfo?.country && {
				...companyInfo?.country,
				label: companyInfo?.country.name,
				value: companyInfo?.country.id,
			},
		}
		: {
			companyLegalName: companyInfo?.companyLegalName || '',
			companyShortName: companyInfo?.companyShortName || '',
			country: companyInfo?.country && {
				...companyInfo?.country,
				label: companyInfo?.country.name,
				value: companyInfo?.country.id,
			},
			emailDomain: companyInfo?.emailDomain || '',
		};

	if (status !== enums.gettingStartedStatuses.accountInfo) return redirectToCorrectPageByStatus(user);

	const stepText = userRole === enums.userRoles.startup ? 'Step 2 of 6' : 'Step 2 of 3';

	return (
		<div className='company-info-container'>
			<CompanyInfo
				getCountries={getCountries}
				getProfile={getProfile}
				sendCompanyInfo={sendCompanyInfo}
				getAllTags={getAllTags}
				getTopLevelCategories={getTopLevelCategories}
				getPlatformPartners={getPlatformPartners}
				company={company}
				companyAvatar={companyAvatar}
				companyDocuments={companyDocuments}
				companyInfo={initialData}
				companyLogo={companyLogo}
				companyShortName={companyShortName}
				countries={countries}
				isLoading={isLoading}
				status={status}
				textFields={textFields}
				title={title}
				user={user}
				userRole={userRole}
				tags={tags}
				topLevelCategories={topLevelCategories}
				platformPartners={platformPartners}
				stepText={stepText}
				uploadCompanyLogo={uploadCompanyLogo}
			/>
		</div>
	);
}

CompanyInfoHOC.propTypes = {
	countries: arrayOf(shape({
		label: string,
		value: oneOfType([string, number]),
	})),
	textFields: array,
	userRole: string.isRequired,
	title: string.isRequired,
	isLoading: bool,
	sendCompanyInfo: func.isRequired,
	companyDocuments: array,
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
	user: object,
	companyAvatar: object,
	company: object,
	companyShortName: string,
	getAllTags: func.isRequired,
	getPlatformPartners: func.isRequired,
	tags: array,
	platformPartners: array,
	getTopLevelCategories: func,
	topLevelCategories: array,
	uploadCompanyLogo: func.isRequired,
};

const mapStateToProps = ({ auth, common: { countries, tags, platformPartners } }) => {
	const user = auth.user || getItemFromStorage('user');
	const companyShortName = user.startup ? user.startup.companyShortName : user?.retailer?.companyShortName;
	const { role, startup, retailer, status } = user;

	return {
		companyInfo: auth.user?.retailer || auth.user?.startup,
		companyLogo: retailer
			? { ...auth.companyLogo, image: retailer.logo60?.image }
			: { ...auth.companyLogo, image: startup.logo60?.image },
		company: retailer ? retailer : startup,
		companyAvatar: auth.companyAvatar,
		companyDocuments: auth.companyDocuments,
		companyShortName,
		countries,
		isLoading: auth.isLoading,
		profileLogo: auth.profile?.logo60,
		status: status,
		textFields: textFields.filter(item => item.role.includes(role)),
		title: 'Company details',
		user,
		userRole: role,
		tags,
		topLevelCategories: auth.topLevelCategories,
		platformPartners,
	};
};

export default connect(mapStateToProps, {
	clearDocuments,
	getCountries,
	getProfile,
	sendCompanyInfo,
	getAllTags,
	getTopLevelCategories,
	getPlatformPartners,
	uploadCompanyLogo,
})(CompanyInfoHOC);
