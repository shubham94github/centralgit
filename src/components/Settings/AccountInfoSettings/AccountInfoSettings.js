import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { changePassword, enableTwoFa, getUser, sendAccountInfo } from '@ducks/settings/actions';
import { getDepartments, getPositions, getCountries } from '@ducks/common/actions';
import AccountInfo from '@components/Auth/GettingStarted/AccountInfo';
import enums from '@constants/enums';
import { arrayOf, bool, func, number, shape, string, object } from 'prop-types';
import { countryType, departmentType, positionType, userAvatarType, userType } from '@constants/types';
import schema from './schema';
import parsePhoneNumber from 'libphonenumber-js';
import { isEmpty } from '@utils/js-helpers';
import { uploadNewLogo, uploadLogo, getProfile } from '@ducks/auth/actions';
import { getItemFromStorage } from '@utils/storage';

const {
	userRoles: {
		startup,
		admin,
		superAdmin,
	},
} = enums;

const AccountInfoHOC = ({
	sendAccountInfo,
	userLogo,
	emailForSignUp,
	isLoading,
	user,
	userAvatar,
	getDepartments,
	getPositions,
	departments,
	positions,
	changePassword,
	getProfile,
	uploadNewLogo,
	newUserLogo,
	countries,
	getCountries,
	enableTwoFa,
	getUser,
}) => {
	const [isAvatarChanged, setIsAvatarChanged] = useState(false);
	const isRetailer = user.role !== admin && user.role !== startup && user.role !== superAdmin;

	const handleUploadNewLogo = newLogo => {
		setIsAvatarChanged(true);

		uploadNewLogo(newLogo);
	};

	const initialData = {
		firstName: user?.firstName,
		lastName: user?.lastName,
		position: positions.find(item => item.name === user?.position) || null,
		department: departments.find(item => item.name === user?.department) || null,
		email: emailForSignUp,
		phoneNumber: user?.phoneNumber || null,
		isEnabled2fa: user?.isEnabled2fa,
		avatar60: user?.avatar60 || null,
	};

	const onSubmit = values => {
		const accountInfo = {
			...values,
			...(newUserLogo || userLogo),
			phoneNumber: values.phoneNumber ? parsePhoneNumber(values.phoneNumber).number : null,
			isEnabled: true,
			password: values.password || null,
			position: values.position ? values.position.label : null,
			department: values.department ? values.department.label : null,
		};

		sendAccountInfo({ accountInfo, isRetailer });
	};

	useEffect(() => {
		if (isEmpty(departments)) getDepartments();

		if (isEmpty(positions)) getPositions();

		if (isEmpty(countries)) getCountries();

		if (user) getProfile(user.id);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const handleChangePassword = data => changePassword(data);

	return (
		<AccountInfo
			schema={schema}
			onSubmit={onSubmit}
			isLoading={isLoading}
			user={initialData}
			departments={departments}
			positions={positions}
			isRetailer={isRetailer}
			emailForSignUp={emailForSignUp}
			userAvatar={{ ...userAvatar, image: newUserLogo?.image || userAvatar?.image }}
			isResetButton
			handleChangePassword={handleChangePassword}
			uploadLogo={handleUploadNewLogo}
			countries={countries}
			enableTwoFa={enableTwoFa}
			userLogo={newUserLogo || userLogo}
			getUser={getUser}
			userId={user?.id}
			isAvatarChanged={isAvatarChanged}
		/>
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
	departments: arrayOf(departmentType),
	positions: arrayOf(positionType),
	changePassword: func.isRequired,
	getProfile: func.isRequired,
	countries: arrayOf(countryType),
	getCountries: func.isRequired,
	enableTwoFa: func.isRequired,
	getUser: func.isRequired,
	uploadNewLogo: func,
	newUserLogo: object,
};

const mapStateToProps = ({
	auth: {
		userLogo,
		newUserLogo,
		user,
		userAvatar,
		isLoading,
	},
	common: {
		departments,
		positions,
		countries,
	},
	settings,
}) => {
	const localUser = getItemFromStorage('user');

	return {
		newUserLogo,
		isLoading: settings.isLoading || isLoading,
		userLogo,
		emailForSignUp: user?.email || localUser?.email,
		status: user?.status || localUser?.status,
		user: user || localUser,
		userAvatar: userAvatar ? { ...userAvatar, image: user?.avatar?.image } : { image: user?.avatar?.image },
		departments,
		positions,
		countries,
	};
};

export default connect(mapStateToProps, {
	sendAccountInfo,
	uploadLogo,
	uploadNewLogo,
	getDepartments,
	getPositions,
	changePassword,
	getProfile,
	getCountries,
	enableTwoFa,
	getUser,
})(AccountInfoHOC);
