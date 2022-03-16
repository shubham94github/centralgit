import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { sendAccountInfo, uploadLogo } from '@ducks/auth/actions';
import { getDepartments, getPositions, getCountries } from '@ducks/common/actions';
import AccountInfo from '../AccountInfo';
import { redirectToCorrectPageByStatus } from '@components/Auth/utils';
import enums from '@constants/enums';
import { arrayOf, bool, func, number, shape, string } from 'prop-types';
import { countryType, departmentType, positionType, userAvatarType, userType } from '@constants/types';
import schema from './schema';
import parsePhoneNumber from 'libphonenumber-js';
import { isEmpty } from '@utils/js-helpers';
import { getItemFromStorage } from '@utils/storage';

const {
	registrationStatuses,
	userRoles: {
		startup,
		admin,
		superAdmin,
		member,
	},
} = enums;

const AccountInfoHOC = ({
	sendAccountInfo,
	userLogo,
	emailForSignUp,
	status,
	isLoading,
	user,
	userAvatar,
	getDepartments,
	getPositions,
	departments,
	positions,
	uploadLogo,
	countries,
	getCountries,
}) => {
	const isRetailer = user.role !== admin && user.role !== startup && user.role !== superAdmin && user.role !== member;
	const isStartup = user.role === startup;

	const initialData = {
		firstName: user?.firstName,
		lastName: user?.lastName,
		position: positions.find(item => item.name === user?.position) || null,
		department: departments.find(item => item.name === user?.department) || null,
		email: emailForSignUp,
		phoneNumber: user?.phoneNumber || null,
		isEnabled2fa: false,
		avatar60: user?.avatar60 || null,
	};

	const onSubmit = values => {
		sendAccountInfo({
			accountInfo: {
				...values,
				...userLogo,
				phoneNumber: values.phoneNumber ? parsePhoneNumber(values.phoneNumber).number : null,
				isEnabled: true,
				password: values.password || null,
				position: values.position ? values.position.label : null,
				department: values.department ? values.department.label : null,
			},
		});
	};

	useEffect(() => {
		if (isEmpty(departments)) getDepartments();
		if (isEmpty(positions)) getPositions();
		if (isEmpty(countries)) getCountries();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	if (user
		&& ((isStartup && status !== registrationStatuses.accountRegistration)
			|| (!isStartup && status !== registrationStatuses.paymentMethod)))
		return redirectToCorrectPageByStatus(user);

	return (
		<div>
			<AccountInfo
				schema={schema}
				onSubmit={onSubmit}
				isLoading={isLoading}
				user={initialData}
				departments={departments}
				positions={positions}
				isRetailer={isRetailer}
				emailForSignUp={emailForSignUp}
				userAvatar={userAvatar}
				stepText={isRetailer ? 'Step 1 of 3' : 'Step 1 of 6'}
				uploadLogo={uploadLogo}
				countries={countries}
				isGettingStarted
				userId={user?.id}
			/>
		</div>
	);
};

AccountInfoHOC.propTypes = {
	sendAccountInfo: func.isRequired,
	userLogo: shape({
		name: string,
		id: number,
	}),
	emailForSignUp: string,
	status: string,
	isLoading: bool,
	user: userType,
	userAvatar: userAvatarType,
	uploadLogo: func.isRequired,
	getDepartments: func.isRequired,
	getPositions: func.isRequired,
	getCountries: func.isRequired,
	departments: arrayOf(departmentType),
	positions: arrayOf(positionType),
	countries: arrayOf(countryType),
};

const mapStateToProps = ({
	auth: {
		isLoading,
		userLogo,
		user,
		userAvatar,
	},
	common: {
		departments,
		positions,
		countries,
	},
}) => {
	const localUser = getItemFromStorage('user');

	return {
		isLoading,
		userLogo,
		emailForSignUp: user?.email || localUser?.email,
		status: user?.status || localUser?.status,
		user: user || localUser,
		userAvatar,
		departments,
		positions,
		countries,
	};
};

export default connect(mapStateToProps, {
	sendAccountInfo,
	uploadLogo,
	getDepartments,
	getPositions,
	getCountries,
})(AccountInfoHOC);
