import React, { memo, useEffect } from 'react';
import { connect } from 'react-redux';
import AccountInformationEditForm from './AccountInformationEditForm';
import { arrayOf, bool, func, number, string } from 'prop-types';
import { standardSchema } from './schema';
import { checkEmailForExistingAccountInformation, handleUpdateAccountInformation } from '@ducks/admin/actions';
import { getDepartments, getPositions } from '@ducks/common/actions';
import { departmentType, positionType } from '@constants/types';
import { isEmpty } from '@utils/js-helpers';

const AccountInformationEditRetailerHOC = ({
	onClose,
	isLoading,
	firstName,
	lastName,
	email,
	position,
	department,
	phoneNumber,
	id,
	departments,
	positions,
	checkEmailForExistingAccountInformation,
	getDepartments,
	getPositions,
	handleUpdateAccountInformation,
	isEnabled2fa,
}) => {
	useEffect(() => {
		if (isEmpty(positions)) getPositions();
		if (isEmpty(departments)) getDepartments();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<AccountInformationEditForm
			onClose={onClose}
			schema={standardSchema}
			isLoading={isLoading}
			firstName={firstName}
			lastName= { lastName }
			email={email}
			position={position}
			department={department}
			phoneNumber={phoneNumber}
			id={id}
			departments={departments}
			positions={positions}
			handleUpdateAccountInformation={handleUpdateAccountInformation}
			checkEmailForExistingAccountInformation={checkEmailForExistingAccountInformation}
			isEnabled2fa={isEnabled2fa}
		/>
	);
};

AccountInformationEditRetailerHOC.propTypes = {
	onClose: func.isRequired,
	handleUpdateAccountInformation: func.isRequired,
	checkEmailForExistingAccountInformation: func.isRequired,
	firstName: string,
	lastName: string,
	email: string,
	position: positionType,
	department: departmentType,
	phoneNumber: string,
	id: number.isRequired,
	isLoading: bool,
	positions: arrayOf(positionType),
	departments: arrayOf(departmentType),
	getDepartments: func.isRequired,
	getPositions: func.isRequired,
	isEnabled2fa: bool,
};

const mapStateToProps = ({ admin, common }) => {
	const {
		isLoading,
		profile: {
			firstName,
			lastName,
			email,
			position,
			department,
			phoneNumber,
			isEnabled2fa,
			retailer: {
				id,
			},
		},
	} = admin;
	const { positions, departments } = common;

	return {
		isLoading,
		firstName,
		lastName,
		email,
		position: position ? { label: position.name, value: position.name, id: position.id } : null,
		department: department ? { label: department.name, value: department.name, id: department.id } : null,
		phoneNumber,
		id,
		departments,
		positions,
		isEnabled2fa,
	};
};

export default connect(mapStateToProps, {
	handleUpdateAccountInformation,
	checkEmailForExistingAccountInformation,
	getDepartments,
	getPositions,
})(memo(AccountInformationEditRetailerHOC));
