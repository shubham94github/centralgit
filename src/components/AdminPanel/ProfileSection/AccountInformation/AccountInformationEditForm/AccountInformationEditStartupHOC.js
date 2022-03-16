import React, { memo, useEffect, useMemo } from 'react';
import { connect } from 'react-redux';
import AccountInformationEditForm from './AccountInformationEditForm';
import { arrayOf, bool, func, number, string } from 'prop-types';
import enums from '@constants/enums';
import { otherTypesSchema, standardSchema } from './schema';
import { checkEmailForExistingAccountInformation, handleUpdateAccountInformation } from '@ducks/admin/actions';
import { getDepartments, getPositions } from '@ducks/common/actions';
import { departmentType, positionType } from '@constants/types';
import { isEmpty } from '@utils/js-helpers';

const { accountTypesAdminPanel } = enums;

const AccountInformationEditStartupHOC = ({
	onClose,
	isLoading,
	accountType,
	firstName,
	lastName,
	email,
	position,
	department,
	phoneNumber,
	id,
	departments,
	positions,
	handleUpdateAccountInformation,
	checkEmailForExistingAccountInformation,
	getDepartments,
	getPositions,
	isEnabled2fa,
}) => {
	const schema = useMemo(() => (
		accountType === accountTypesAdminPanel.STANDARD
			? standardSchema
			: otherTypesSchema
	), [accountType]);

	useEffect(() => {
		if (isEmpty(positions)) getPositions();
		if (isEmpty(departments)) getDepartments();
	}, [departments, getDepartments, getPositions, positions]);

	return (
		<AccountInformationEditForm
			onClose={onClose}
			schema={schema}
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

AccountInformationEditStartupHOC.propTypes = {
	onClose: func.isRequired,
	accountType: string.isRequired,
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
			startup: {
				accountType,
				id,
			},
		},
	} = admin;
	const { positions, departments } = common;

	return {
		isLoading,
		accountType,
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
})(memo(AccountInformationEditStartupHOC));
