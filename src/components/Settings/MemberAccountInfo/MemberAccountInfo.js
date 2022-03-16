import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { changePassword, sendAccountInfo } from '@ducks/settings/actions';
import { getCountries, getDepartments, getPositions } from '@ducks/common/actions';
import { getItemFromSessionStorage } from '@utils/sessionStorage';
import AccountInfo from '@components/Auth/GettingStarted/AccountInfo';
import enums from '@constants/enums';
import { arrayOf, bool, func, number, shape, string } from 'prop-types';
import { countryType, departmentType, positionType, userAvatarType, userType } from '@constants/types';
import { isEmpty } from '@utils/js-helpers';
import { uploadLogo } from '@ducks/auth/actions';
import { editMemberSchema } from '../CompanyMembersSettings/schema';

const {
	userRoles: {
		member,
	},
} = enums;

const MemberAccountInfoHOC = ({
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
	uploadLogo,
	countries,
	getCountries,
}) => {
	const isMember = user?.role === member;

	const initialData = {
		firstName: user?.firstName,
		lastName: user?.lastName,
		position: positions.find(item => item.name === user?.position) || null,
		department: departments.find(item => item.name === user?.department) || null,
		email: emailForSignUp,
		country: countries.find(item => item.id === user?.member?.country?.id) || null,
		city: user?.member?.city,
		avatar60: user?.avatar60 || null,
	};

	const onSubmit = values => {
		const accountInfo = {
			...values,
			...userLogo,
			position: values.position ? values.position.label : null,
			department: values.department ? values.department.label : null,
			countryId: values.country ? values.country.id : null,
			note: null,
		};

		sendAccountInfo({ accountInfo, isMember });
	};

	useEffect(() => {
		if (isEmpty(departments))
			getDepartments();

		if (isEmpty(positions))
			getPositions();

		if (isEmpty(countries))
			getCountries();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const handleChangePassword = data => changePassword(data);

	return (
		<AccountInfo
			schema={editMemberSchema}
			onSubmit={onSubmit}
			isLoading={isLoading}
			user={initialData}
			departments={departments}
			positions={positions}
			isRetailer={false}
			isMember={isMember}
			emailForSignUp={emailForSignUp}
			userAvatar={userAvatar}
			isResetButton
			handleChangePassword={handleChangePassword}
			uploadLogo={uploadLogo}
			countries={countries}
		/>
	);
};

MemberAccountInfoHOC.propTypes = {
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
	countries: arrayOf(countryType),
	changePassword: func.isRequired,
	getCountries: func.isRequired,
};

const mapStateToProps = ({
	auth: {
		userLogo,
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
	const localUser = getItemFromSessionStorage('user');

	return {
		isLoading: settings.isLoading || isLoading,
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
	changePassword,
	getCountries,
})(MemberAccountInfoHOC);
