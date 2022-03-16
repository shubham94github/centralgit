import React, { memo, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup/dist/yup';
import { schema } from './schema';
import GridContainer from '@components/layouts/GridContainer';
import TextInput from '@components/_shared/form/TextInput';
import { P12 } from '@components/_shared/text';
import PrimaryButton from '@components/_shared/buttons/PrimaryButton';
import { isEmpty } from '@utils/js-helpers';
import { func } from 'prop-types';
import { withoutLettersAndSymbolsRegExp } from '@utils/validation';
import { memberGroupsType } from '@constants/types';

import './MemberGroupsModal.scss';

const MemberGroupsModal = ({
	onClose,
	createNewMemberGroup,
	editMemberGroup,
	selectedMemberGroup,
}) => {
	const saveButtonText = selectedMemberGroup ? 'Update' : 'Add';
	const {
		register,
		handleSubmit,
		errors,
		control,
		watch,
		setValue,
		reset,
	} = useForm({
		resolver: yupResolver(schema),
		defaultValues: schema.default(),
		mode: 'onBlur',
	});

	useEffect(() => {
		if (!selectedMemberGroup) return;

		reset(selectedMemberGroup);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const maxMembers = watch('maxMembers');

	const handleSave = memberGroupData => {
		if (!selectedMemberGroup) createNewMemberGroup(memberGroupData, onClose);
		else editMemberGroup({ groupId: selectedMemberGroup.id, memberGroupData, onClose });
	};

	useEffect(() => {
		if (!maxMembers) return;

		const value = maxMembers.toString();

		setValue('maxMembers', value.replaceAll(withoutLettersAndSymbolsRegExp, ''));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [maxMembers]);

	return (
		<div className='member-groups-modal'>
			<form onSubmit={handleSubmit(handleSave)}>
				<GridContainer>
					<TextInput
						id='name'
						type='name'
						name='name'
						register={register}
						control={control}
						isLightTheme
						placeholder='Group name'
						error={errors.name?.message}
					/>
					{errors.name && <P12 className='warning-text'>{errors.name.message}</P12>}
				</GridContainer>
				<GridContainer customClassName='custom-line'>
					<TextInput
						id='maxMembers'
						type='maxMembers'
						name='maxMembers'
						register={register}
						control={control}
						isLightTheme
						placeholder='Number of members'
						error={errors.maxMembers?.message}
						readOnly={!!selectedMemberGroup}
					/>
					{errors.maxMembers && <P12 className='warning-text'>{errors.maxMembers.message}</P12>}
				</GridContainer>
				<GridContainer
					customClassName='custom-line'
					columns={2}
				>
					<PrimaryButton
						text='Cancel'
						isOutline
						isDarkTheme={false}
						onClick={onClose}
						isFullWidth
					/>
					<PrimaryButton
						text={saveButtonText}
						isDarkTheme={false}
						onClick={handleSubmit(handleSave)}
						isFullWidth
						disabled={!isEmpty(errors)}
					/>
				</GridContainer>
			</form>
		</div>
	);
};

MemberGroupsModal.propTypes = {
	onClose: func.isRequired,
	createNewMemberGroup: func.isRequired,
	editMemberGroup: func.isRequired,
	selectedMemberGroup: memberGroupsType,
};

export default memo(MemberGroupsModal);
