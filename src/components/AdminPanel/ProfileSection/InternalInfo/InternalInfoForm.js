import React, { memo, useEffect } from 'react';
import { schema } from './schema';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import TextArea from '@components/_shared/form/TextArea';
import enums from '@constants/enums';
import { P12 } from '@components/_shared/text';
import { Col, Row } from 'react-bootstrap';
import PrimaryButton from '@components/_shared/buttons/PrimaryButton';
import { isEmpty } from '@utils/js-helpers';
import { func, number, string } from 'prop-types';
import { connect } from 'react-redux';
import { updateAdminNoteProfile } from '@ducks/admin/actions';

const InternalInfoForm = ({
	onClose,
	updateAdminNoteProfile,
	adminNote,
	startupId,
}) => {
	const {
		register,
		errors,
		handleSubmit,
		reset,
		watch,
		formState: { isDirty },
	} = useForm({
		resolver: yupResolver(schema),
		mode: enums.validationMode.onTouched,
		reValidateMode: enums.reValidationMode.onChange,
		defaultValues: schema.default(),
	});

	useEffect(() => {
		if (adminNote)
			reset({ adminNote });
	}, [adminNote, reset]);

	const onSubmit = values => {
		updateAdminNoteProfile({ data: values, id: startupId });
		onClose();
	};

	return (
		<>
			<Row>
				<TextArea
					id='adminNote'
					name='adminNote'
					isVisibleLabel={false}
					register={register}
					isError={!!errors.adminNote}
					classNames='textarea-full-width'
					value={watch('adminNote')}
				/>
				{
					errors.adminNote
						&& <P12 className='warning-text'>{errors.adminNote.message}</P12>
				}
			</Row>
			<Row className='mt-3'>
				<Col>
					<PrimaryButton
						onClick={onClose}
						text='Cancel'
						isOutline
						isFullWidth
					/>
				</Col>
				<Col>
					<PrimaryButton
						onClick={handleSubmit(onSubmit)}
						text='Update'
						isFullWidth
						disabled={!isEmpty(errors) || !isDirty}
					/>
				</Col>
			</Row>
		</>
	);
};

InternalInfoForm.propTypes={
	onClose: func.isRequired,
	updateAdminNoteProfile: func.isRequired,
	adminNote: string,
	startupId: number.isRequired,
};

InternalInfoForm.defaultProps ={
	adminNote: '',
};

export default connect(({ admin }) => {
	const {
		profile: {
			startup: {
				adminNote,
				id: startupId,
			},
		},
	} = admin;

	return {
		adminNote,
		startupId,
	};
}, {
	updateAdminNoteProfile,
})(memo(InternalInfoForm));
