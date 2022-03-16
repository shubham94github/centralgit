import React, { memo, useEffect, useMemo } from 'react';
import { array, bool, func, number, oneOfType, string } from 'prop-types';
import enums from '@constants/enums';
import { Col, Container, Row } from 'react-bootstrap';
import { P12, P14 } from '@components/_shared/text';
import TextArea from '@components/_shared/form/TextArea';
import RatingStars from '@components/_shared/RatingStars';
import PrimaryButton from '@components/_shared/buttons/PrimaryButton';
import RadioGroup from '@components/_shared/form/RadioGroup';
import { isContactOptions, textPlaceholder } from './constants';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { schema } from './schema';
import { isEmpty } from '@utils/js-helpers';

import './PopupFeedback.scss';

const PopupFeedback = ({
	idProfile,
	createFeedback,
	isLoading,
	isEditMode,
	editModeHandler,
	feedbacks,
	idEditFeedback,
	isAdmin,
}) => {
	const { register, errors, watch, handleSubmit, reset, setValue } = useForm({
		resolver: yupResolver(schema),
		mode: enums.validationMode.all,
		reValidateMode: enums.reValidationMode.onChange,
		defaultValues: schema.default(),
	});

	const selectedFeedback = useMemo(() => {
		if (isAdmin)
			return feedbacks.filter(feedback => feedback.id === idEditFeedback);

		return feedbacks.filter(feedback => feedback.isMy);
	}, [feedbacks, isAdmin, idEditFeedback]);

	const closePopup = () => editModeHandler(false);

	const onSubmit = values => {
		const data = {
			...values,
			isContact: values.isContact !== 'false',
			feedbackId: isAdmin ? selectedFeedback[0]?.id : null,
		};

		createFeedback({ data, id: idProfile, isEditMode });
		closePopup();
	};

	useEffect(() => {
		if (isEditMode && !isEmpty(selectedFeedback)) {
			const selectedItem = selectedFeedback[0];

			reset({
				...schema.default(),
				isContact: selectedItem.isContact ? 'true' : 'false',
				rate: selectedItem.rate.toString(),
				text: selectedItem.text,
			});}
		 else {
			reset({
				...schema.default(),
			});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedFeedback, isEditMode]);

	const onChangeTextArea = fieldName => ({ currentTarget: { value } }) => setValue(fieldName, value);

	return (
		<Container className='feedback-page-container'>
			<Row>
				<Col>
					<P14 className='pb-2'>
						Did you find what you need or connect with this start-up on Retailhub?
					</P14>
					<RadioGroup
						buttons={isContactOptions}
						name={'isContact'}
						defaultChecked={watch('isContact')}
						register={register}
						marginRight='30px'
					/>
				</Col>
				{errors.isContact
						&& <P12 className='warning-text'>{errors.isContact.message}</P12>
				}
			</Row>
			<Row>
				<Col>
					<P12>
						Rate this Startup
					</P12>
					<RatingStars
						isClickable={true}
						name={'rate'}
						value={watch('rate')}
						register={register}
					/>
				</Col>
				{errors.rate
						&& <P12 className='warning-text mt-2'>{errors.rate.message}</P12>
				}
			</Row>
			<Row>
				<Col>
					<P14 className='pb-1'>Add your feedback</P14>
					<TextArea
						id='text'
						name='text'
						isVisibleLabel={false}
						register={register}
						isError={!!errors.text}
						classNames='textarea-full-width'
						value={watch('text')}
						isBorder={false}
						placeholder={textPlaceholder}
						onChange={onChangeTextArea('text')}
					/>
				</Col>
				{errors.text
						&& <P12 className='warning-text'>{errors.text.message}</P12>
				}
			</Row>
			<Row className='g-3'>
				<Col>
					<PrimaryButton
						onClick={closePopup}
						isOutline
						isFullWidth
					>
						Cancel
					</PrimaryButton>
				</Col>
				<Col>
					<PrimaryButton
						onClick={handleSubmit(onSubmit)}
						type='submit'
						isFullWidth
						disabled={!!Object.keys(errors)?.length}
						isLoading={isLoading}
					>
						{isEditMode ? 'Update' : 'Submit'}
					</PrimaryButton>
				</Col>
			</Row>
		</Container>
	);
};

PopupFeedback.propTypes = {
	idProfile: oneOfType([string, number]).isRequired,
	createFeedback: func,
	isLoading: bool,
	isEditMode: bool,
	isAdmin: bool,
	editModeHandler: func,
	feedbacks: array,
	idEditFeedback: number,
};

export default memo(PopupFeedback);
