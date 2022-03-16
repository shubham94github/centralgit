import React, { memo, useEffect, useMemo, useState } from 'react';
import { array, bool, func, number, oneOfType, string } from 'prop-types';
import { yupResolver } from '@hookform/resolvers/yup';
import enums from '@constants/enums';
import { useForm } from 'react-hook-form';
import { isEmpty } from '@utils/js-helpers';
import { Col, Row } from 'react-bootstrap';
import { setRateOptions, defaultPageSize } from '../../ProfilePage/constants';
import { P12, S14 } from '@components/_shared/text';
import Select from '@components/_shared/form/Select';
import Paginate from '@components/_shared/Paginate';
import PrimaryButton from '@components/_shared/buttons/PrimaryButton';
import LoadingOverlay from '@components/_shared/LoadingOverlay';
import { schema } from './schema';
import { CustomOption, SingleValue } from './CustomizeSelect';
import prepareSelectStyles from './prepareSelectStyles';
import ItemFeedback from '@components/_shared/Feedbacks/ItemFeedback';
import AppModal from '@components/Common/AppModal';
import Confirm from '@components/_shared/ModalComponents/Confirm';
import Tooltip from '@components/_shared/Tooltip';
import PopupFeedback from '@components/_shared/Feedbacks/PopupFeedback';
import RatingStars from '@components/_shared/RatingStars';
import cn from 'classnames';

const FeedbacksContent = ({
	feedbacks,
	countOfRecords,
	isLoadingFeedbacks,
	idProfile,
	getFeedbacksInfo,
	removeFeedback,
	createFeedback,
	isExistsFeedback,
	rateStars,
	isAdmin,
	isStartup,
	rateCountFixed,
	countAllFeedbacks,
	isStartupsEditFeedbacksPermission,
}) => {
	const { register, errors, watch, control, setValue, reset } = useForm({
		resolver: yupResolver(schema),
		mode: enums.validationMode.all,
		reValidateMode: enums.reValidationMode.onChange,
		defaultValues: {
			starsCount: { label: `All Stars (${countAllFeedbacks})`, value: 0 },
		},
	});

	const [pageCount, setPageCount] = useState(0);
	const [pageSize, setPageSize] = useState(defaultPageSize);
	const [initialPage, setInitialPage] = useState(0);
	const rateOptions = useMemo(() => setRateOptions(countAllFeedbacks), [countAllFeedbacks]);
	const selectStyles = useMemo(() => prepareSelectStyles(), []);
	const [isShowConfirm, setIsShowConfirm] = useState(false);
	const [selectedRemove, setSelectedRemove] = useState(null);
	const confirmMessage = 'Are you sure you want to delete feedback?';
	const [isLeaveFeedback, setIsLeaveFeedback] = useState(false);
	const [isEditMode, setIsEditMode] = useState(false);
	const [idEditFeedback, setIdEditFeedback] = useState(null);
	const isEmptyFeedbacks = !isLoadingFeedbacks && isEmpty(feedbacks);
	const classes = cn({ 'mt-4 mb-4': !isAdmin, 'd-flex': isAdmin });

	const openPopupFeedback = () => setIsLeaveFeedback(prevState => !prevState);

	const editModeHandler = isEditMode => {
		setIsEditMode(isEditMode);
		openPopupFeedback();
	};

	const toggleConfirm = () => setIsShowConfirm(prevState => !prevState);

	useEffect(() => {
		reset({
			starsCount: { label: `All Stars (${countAllFeedbacks || 0})`, value: 0 },
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [countAllFeedbacks]);

	const removeFeedbackHandler = () => {
		const data = {
			isAllStars: true,
			page: 0,
			pageSize,
			rate: null,
			id: selectedRemove,
		};

		removeFeedback({ data, id: idProfile });
		toggleConfirm();
	};

	const handlePageClick = page => setInitialPage(page.selected);

	const changePageSizeHandler = size => {
		setPageSize(size);
		setInitialPage(0);
	};

	const onSelectChange = fieldName => option => {
		setValue(fieldName, option);
		setInitialPage(0);
	};

	useEffect(() => {
		if (!getFeedbacksInfo) return;

		const isAllStars = watch('starsCount').value === 0 || watch('starsCount').value === null;
		const rate = isAllStars ? null : watch('starsCount').value;
		const data = {
			isAllStars,
			page: initialPage,
			pageSize,
			rate,
		};

		getFeedbacksInfo({ data, id: idProfile });
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [initialPage, idProfile, pageSize, watch('starsCount').value]);

	useEffect(() => setPageCount(Math.ceil(countOfRecords / pageSize)), [countOfRecords, setPageCount, pageSize]);

	return (
		<div className='feedbacks-content'>
			{isLeaveFeedback
				&& <AppModal
					title='Rate and give Feedback about the current startup'
					className='profile-pop-up'
					onClose={openPopupFeedback}
					component={PopupFeedback}
					outerProps={{
						idProfile,
						isEditMode,
						editModeHandler,
						idEditFeedback,
						createFeedback,
						isAdmin,
						isLoading: isLoadingFeedbacks,
						feedbacks,
					}}
				/>
			}
			{isShowConfirm
				&& <AppModal
					className='profile-pop-up'
					onClose={toggleConfirm}
					title={confirmMessage}
					outerProps={{
						successConfirm: removeFeedbackHandler,
						onClose: toggleConfirm,
					}}
					component={Confirm}
				/>
			}
			<Row className='rating-line'>
				<Col className={classes}>
					{isAdmin
						&& <div className={isAdmin && 'rating-stars-viewing'}>
							<RatingStars rate={rateStars}/>
							<S14 className='ms-2' bold>{rateCountFixed}</S14>
						</div>
					}
					{!isStartup && <Select
						name='starsCount'
						control={ control }
						register={ register }
						options={ rateOptions }
						value={ watch('starsCount') }
						onChange={ onSelectChange('starsCount') }
						isError={ !!errors.starsCount }
						isSearchable={ false }
						isClearable={ false }
						isCreatable={ false }
						components={ { Option: CustomOption, SingleValue: SingleValue } }
						customStyles={ selectStyles }
						disabled={ isLoadingFeedbacks }
					/>
					}
				</Col>
			</Row>
			{isEmptyFeedbacks
				&& <div className='no-results'>
					<P12>No feedbacks</P12>
				</div>
			}
			{isLoadingFeedbacks
				? <LoadingOverlay classNames='feedbacks-loader mb-4'/>
				: feedbacks.map(feedback =>
					<ItemFeedback
						key={feedback.id}
						feedback={feedback}
						editModeHandler={editModeHandler}
						setSelectedRemove={setSelectedRemove}
						toggleConfirm={toggleConfirm}
						isAdmin={isAdmin}
						setIdEditFeedback={setIdEditFeedback}
						isStartupsEditFeedbacksPermission={isStartupsEditFeedbacksPermission}
					/>,
				)
			}
			{(!isAdmin || !isStartup)
				&& <Row>
					<Col
						sm={{ span: 6, offset: 6 }}
						md={{ span: 5, offset: 7 }}
						lg={{ span: 4, offset: 8 }}
						xl={{ span: 3, offset: 9 }}
						className='mb-5'
					>
						<Tooltip
							placement='top'
							isVisibleTooltip={isExistsFeedback}
							message={
								<P12>
									You can leave only one feedback for the Startup
								</P12>
							}
						>
							{!isStartup
								&& <div className='pt-2'>
									<PrimaryButton
										onClick={ openPopupFeedback }
										text='Leave your feedback'
										isFullWidth
										disabled={ isExistsFeedback || isLoadingFeedbacks }
									/>
								</div>
							}
						</Tooltip>
					</Col>
				</Row>
			}
			{(!isEmptyFeedbacks && !isStartup)
				&& <Row>
					<Col
						sm={12}
						xl={12}
					>
						<Paginate
							handlePageClick={handlePageClick}
							pageCount={pageCount}
							forcePage={initialPage}
							countOfRecords={countOfRecords}
							pageSize={pageSize}
							changePageSizeHandler={changePageSizeHandler}
						/>
					</Col>
				</Row>
			}
		</div>
	);
};

FeedbacksContent.propTypes = {
	getFeedbacksInfo: func,
	countOfRecords: number,
	countAllFeedbacks: number,
	isExistsFeedback: bool,
	feedbacks: array.isRequired,
	isLoadingFeedbacks: bool,
	idProfile: oneOfType([string, number]).isRequired,
	removeFeedback: func,
	createFeedback: func,
	isAdmin: bool,
	rateStars: number,
	rateCountFixed: number,
	isStartupsEditFeedbacksPermission: bool,
	isStartup: bool,
};

FeedbacksContent.defaultProps = {
	isAdmin: false,
	rateCountFixed: 0,
};

export default memo(FeedbacksContent);
