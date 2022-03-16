import React  from 'react';
import { arrayOf, bool, func, object } from 'prop-types';
import MemberForm from '@components/_shared/ModalComponents/MemberForm';
import { countryType, departmentType, positionType, userType } from '@constants/types';
import LoadingOverlay from '@components/_shared/LoadingOverlay';
import { optionsMapper } from '@utils/optionsMapper';

const EditMemberAdmin = ({
	onClose,
	schema,
	countries,
	departments,
	positions,
	isLoading,
	member,
	onSubmit,
	changeMemberStatus,
}) => {
	const memberUser = {
		...member,
		country: !!member.country && {
			...member.country,
			label: member.country.name,
			value: member.country.id,
		},
		department: !!member.department && {
			...member.department,
			label: member.department.name,
			value: member.department.id,
		},
		position: !!member.position && {
			...member.position,
			label: member.position.name,
			value: member.position.id,
		},
		note: member.member.note,
	};

	return (
		<div className='add-new-member-admin'>
			<MemberForm
				onSubmit={onSubmit}
				onClose={onClose}
				schema={schema}
				countries={optionsMapper(countries)}
				departments={optionsMapper(departments)}
				positions={optionsMapper(positions)}
				memberUser={memberUser}
				changeMemberStatus={changeMemberStatus}
			/>
			{isLoading && <LoadingOverlay/>}
		</div>
	);
};

EditMemberAdmin.propTypes = {
	onClose: func.isRequired,
	onSubmit: func.isRequired,
	schema: object.isRequired,
	countries: arrayOf(countryType).isRequired,
	departments: arrayOf(departmentType).isRequired,
	positions: arrayOf(positionType).isRequired,
	isLoading: bool,
	member: userType.isRequired,
	changeMemberStatus: func.isRequired,
};

export default EditMemberAdmin;
