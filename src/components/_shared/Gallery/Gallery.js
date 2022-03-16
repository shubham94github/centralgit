import React, { memo, useEffect, useMemo, useRef, useState } from 'react';
import { arrayOf, bool, func, number, object, shape, string } from 'prop-types';
import TextInput from '@components/_shared/form/TextInput';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { fieldNames, schema } from './schema';
import { P12, P14, P16, S16 } from '@components/_shared/text';
import { errorText, fileTypes, placeholders, titles } from './contants';
import Tooltip from '@components/_shared/Tooltip';
import { colors } from '@colors';
import ReactPlayer from 'react-player';
import TextArea from '@components/_shared/form/TextArea';
import enums from '@constants/enums';
import usePrevious from '@utils/hooks/usePrevious';
import { Spinner } from 'react-bootstrap';
import FileUploadButton from '@components/_shared/buttons/FileUploadButton';
import { MAX_SINGLE_FILE_SIZE } from '@constants/validationConstants';
import { getVideoAttributes } from '@api/commonApi';
import { getFileThumbnails, uploadAttachedDocuments } from '@api/fileUploadingApi';
import LoadingOverlay from '@components/_shared/LoadingOverlay';
import { invalidTokenErr, onServerErrorHandler } from '@ducks/common/sagas';
import PrimaryButton from '@components/_shared/buttons/PrimaryButton';
import { isEmpty, deepEqual } from '@utils/js-helpers';
import { Icons } from '@icons';
import chooseDefaultIconForFile from '@utils/chooseDefaultIconForFile';
import AppModal from '@components/Common/AppModal';
import DocumentsCarousel from '@components/_shared/DocumentsCarousel';
import Confirm from '@components/_shared/ModalComponents/Confirm';
import { validationErrMessages } from '@constants/common';
import PdfViewer from '@components/_shared/PdfViewer';
import cn from 'classnames';
import ImageViewer from '@components/_shared/ImageViewer/ImageViewer';
import { extensionsForImage } from '@components/_shared/ImageViewer/constants';
import { extensionDocumentError } from '@constants/errorCodes';

import './Gallery.scss';

const { videoLink, videoTitle, videoDescription } = fieldNames;
const getVideoAttrDelay = 1000;
const closeIcon = Icons.close(colors.white);
const greenInfoIcon = Icons.infoIcon(colors.grass50);
const removeConfirmationTitle = 'Are you sure you want to delete document?';

const Gallery = ({
	saveGallery,
	logOut,
	defaultValues,
	isSkipButton,
	isResetButton,
	currentStepsText,
	isInputsWithBorder,
	isFileUploading,
	parentIsLoading,
	isStartupsEditPermission,
}) => {
	const [videoAttributes, setVideoAttributes] = useState(null);
	const [isPlayVideo, setIsPlayVideo] = useState(false);
	const [isVideoMetaLoading, setIsVideoMetaLoading] = useState(false);
	const [documentsError, setDocumentsError] = useState(null);
	const [galleryDocuments, setGalleryDocuments] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [savingGalleryError, setSavingGalleryError] = useState(null);
	const [isDocumentChanged, setIsDocumentChanged] = useState(false);
	const [isRemoveFileConfirmModal, setIsRemoveFileConfirmModal] = useState(false);
	const [removingFileId, setRemovingFileId] = useState(null);
	const [isPdfViewer, setIsPdfViewer] = useState(false);
	const [pdfId, setPdfId] = useState(null);
	const [pdfTitle, setPdfTitle] = useState('');
	const [isImageViewer, setIsImageViewer] = useState(false);
	const [imageDate, setImageDate] = useState(null);

	const timer = useRef();
	const formRef = useRef();

	const closePdfViewer = () => setIsPdfViewer(false);

	const closeImageViewer = () => setIsImageViewer(false);

	const prevDocuments = usePrevious(galleryDocuments);

	const isDocumentsChanged = !!prevDocuments && prevDocuments.length !== galleryDocuments.length;

	const defaultValuesWithSavedFields = useMemo(() => {
		return {
			...schema.default(),
			...Object.keys(defaultValues).reduce((acc, fieldName) => {
				if (!defaultValues[fieldName]) acc[fieldName] = '';
				else acc[fieldName] = defaultValues[fieldName];

				return acc;
			}, {}),
		};
	}, [defaultValues]);

	const {
		watch,
		register,
		setValue,
		errors,
		control,
		getValues,
		clearErrors,
		setError,
		handleSubmit,
		trigger,
		reset,
		formState: { dirtyFields },
	} = useForm({
		resolver: yupResolver(schema),
		defaultValues: defaultValuesWithSavedFields,
		mode: enums.validationMode.all,
		reValidateMode: enums.validationMode.all,
	});

	const prevVideoUrl = usePrevious(getValues(videoLink));
	const prevValues = usePrevious(getValues());
	const values = getValues();
	const isDisabledSaveButton = !isEmpty(errors)
	|| isLoading
	|| isVideoMetaLoading
	|| (!defaultValues.videoId
		&& !watch(videoLink)
		&& (!galleryDocuments.length
			&& !isDocumentsChanged))
	|| (isEmpty(dirtyFields) && !isDocumentChanged)
	|| !isStartupsEditPermission;

	const getVideoInfo = async () => {
		const videoUrl = watch(videoLink);

		if (!videoUrl?.length) return;

		const videoAttributes = await getVideoAttributes(videoUrl);

		setVideoAttributes(videoAttributes);

		setValue(videoTitle, videoAttributes.title);
		setValue(videoDescription, videoAttributes.description);
		clearErrors(videoTitle);
		clearErrors(videoDescription);
	};

	const getVideoInfoWithDebounce = () => {
		clearTimeout(timer.current);

		timer.current = setTimeout(async () => {
			setIsVideoMetaLoading(true);

			await getVideoInfo()
				.catch(() => {
					setError(videoLink, { message: errorText.wrongLink });
					setVideoAttributes(null);
					setValue(videoTitle, '');
					setValue(videoDescription, '');
				})
				.finally(() => {
					setIsVideoMetaLoading(false);
				});

			timer.current = undefined;
		}, getVideoAttrDelay);
	};

	const fetchThumbnailsForDocuments = async documents => {
		try {
			setIsLoading(true);
			const documentsThumbnailIds = documents.map(file => file.thumbnailId);

			if (!isEmpty(documentsThumbnailIds)) {
				const thumbnails = await getFileThumbnails(documentsThumbnailIds);

				setGalleryDocuments(documents.map(file => ({
					...file,
					thumbnail: thumbnails.find(item => item.thumbnailId === file.thumbnailId).image,
				})));
			}
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		const getVideoAttr = async videoUrl => {
			if (!videoUrl?.length || isLoading) return;

			const videoAttributes = await getVideoAttributes(videoUrl);

			setVideoAttributes(videoAttributes);

			if (!defaultValues[videoTitle]) {
				setValue(videoTitle, videoAttributes.title);
				setValue(videoDescription, videoAttributes.description);
			}
		};

		if (defaultValues[videoLink]) getVideoAttr(defaultValues[videoLink]);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [defaultValues]);

	useEffect(() => {
		const getThumbnailsAndUpdateDocuments = async documents => {
			await fetchThumbnailsForDocuments(documents);
		};

		if (defaultValues.documents) getThumbnailsAndUpdateDocuments(defaultValues.documents);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [defaultValues.documents]);

	const clearSubmitErrorOnChange = () => {
		setSavingGalleryError(null);
	};

	useEffect(() => {
		if (!deepEqual(prevValues, getValues())) clearSubmitErrorOnChange();
	}, [getValues, prevValues, values]);

	useEffect(() => {
		return () => {
			if (timer.current) clearTimeout(timer.current);
		};
	}, []);

	useEffect(() => {
		reset(defaultValuesWithSavedFields);
	}, [defaultValues, defaultValuesWithSavedFields, reset]);

	const clearField = fieldName => async () => {
		const input = formRef.current.querySelector(`#${fieldName}`);

		setValue(fieldName, '');

		input.focus();
		input.blur();

		setValue(fieldName, schema.default()[fieldName]);

		if (fieldName === videoLink) {
			setValue(videoDescription, '');
			setValue(videoTitle, '');
			setVideoAttributes(null);
			setIsPlayVideo(false);
			clearErrors();
		}
	};

	const fetchVideoInfo = videoUrl => {
		if (videoUrl?.length
			&& prevVideoUrl?.trim() !== videoUrl?.trim()
			&& !isLoading
			&& !isVideoMetaLoading)
			getVideoInfoWithDebounce();
	};

	const onVideoLinkChanged = e => {
		if (!e.target.value?.length && timer.current) {
			clearTimeout(timer.current);
			timer.current = undefined;
			setValue(videoTitle, '');
			setValue(videoDescription, '');
			setVideoAttributes(null);
		} else if (e.target.value?.length) clearErrors(videoLink);

		clearSubmitErrorOnChange();
		fetchVideoInfo(e.target.value);
	};

	const onVideoLinkBlur = () => {
		if (!timer.current && !videoAttributes)
			getVideoInfoWithDebounce();
	};

	const playVideo = () => {
		if (!videoAttributes) return;

		setIsPlayVideo(true);
	};

	const onStopVideo = () => setIsPlayVideo(false);

	const clearFileInputValue = () => {
		const node = document.querySelector('#documentToAttach');

		node.value = null;
	};

	const handleUploadDocuments = async e => {
		const filesArray = Array.from(e.target.files);

		const allFilesLength = galleryDocuments.length + filesArray.length;

		if (filesArray.length > 5 || allFilesLength > 5) return setDocumentsError(errorText.fileCountUploadError);

		if (filesArray.find(file => file.size > MAX_SINGLE_FILE_SIZE))
			return setDocumentsError(errorText.fileSizeUploadError);

		try {
			setIsLoading(true);
			setDocumentsError(null);

			const res = await uploadAttachedDocuments(e.target.files);

			const thumbnailIds = res.filter(file => file.thumbnailId).map(file => file.thumbnailId);
			const thumbnails = await getFileThumbnails(thumbnailIds);

			const newDocs = [
				...galleryDocuments,
				...res.map(file => ({
					...file,
					thumbnail: thumbnails.find(item => item.thumbnailId === file.thumbnailId)?.image,
				})),
			];

			setGalleryDocuments(newDocs);

			const isDocumentChanged =  newDocs.length !== defaultValues.documents.length
				? true
				: !newDocs.every(item =>
					defaultValues.documents.find(doc => doc.id === item.id));

			setIsDocumentChanged(isDocumentChanged);

			clearFileInputValue();
		} catch (e) {
			if (e?.code === extensionDocumentError) setDocumentsError(errorText.extensionError);
			else setDocumentsError(errorText.uploadingError);

			onServerErrorHandler(e);
		} finally {
			setIsLoading(false);
		}
	};

	const removeGalleryDocument = fileId => {
		const newDocs = galleryDocuments.filter(item => item.id !== fileId);
		setGalleryDocuments(newDocs);

		const isDocumentChanged = newDocs?.length !== defaultValues.documents?.length
			|| !newDocs.every(item => defaultValues.documents.find(doc => doc.id === item.id));

		setIsDocumentChanged(isDocumentChanged);
	};

	const closeFileConfirmModal = () => setIsRemoveFileConfirmModal(false);

	const handleRemoveFile = fileId => {
		setRemovingFileId(fileId);
		setIsRemoveFileConfirmModal(true);
	};

	const removeUploadedFile = fileId => {
		removeGalleryDocument(fileId);
		setDocumentsError(null);
	};

	const confirmFileRemoving = () => {
		removeUploadedFile(removingFileId);
		setRemovingFileId(null);
		closeFileConfirmModal();
	};

	const handleSaveGallery = async () => {
		try {
			setIsLoading(true);
			const formValues = getValues();
			const link = formValues[videoLink];
			const title = formValues[videoTitle];

			if (link && !title) {
				setError(videoTitle, 'Video can\'t be saved without title');
				return;
			}

			const source = link.includes('youtu.be') ? enums.videoSource.youtube : enums.videoSource.vimeo;
			const fileId = galleryDocuments.map(doc => doc.id);

			const galleryData = {
				title: formValues[videoTitle],
				description: formValues[videoDescription],
				fileId,
				link,
				source,
				videoId: defaultValues.videoId,
			};

			await saveGallery(galleryData);
		} catch (e) {
			setSavingGalleryError(errorText.uploadingError);
		} finally {
			setIsLoading(false);
			setIsDocumentChanged(false);
		}
	};

	const handleSkipThisStep = async () => {
		try {
			setIsLoading(true);
			await saveGallery();
		} catch (e) {
			if (e.error === invalidTokenErr || e?.response?.status === 401) logOut();

			setIsLoading(false);
			setSavingGalleryError(errorText.uploadingError);
		}
	};

	const handleReset = async () => {
		reset(defaultValuesWithSavedFields);
		setVideoAttributes(null);
		setSavingGalleryError(null);

		clearSubmitErrorOnChange();

		const videoAttributes = await getVideoAttributes(watch(videoLink));
		await fetchThumbnailsForDocuments(defaultValues.documents);

		setVideoAttributes(videoAttributes);
	};

	const previewsContainerStyle = {
		gridTemplateColumns: galleryDocuments.length < 3
			? `repeat(auto-fit, minmax(287px, 1fr)) 115px`
			: '',
		display: galleryDocuments.length < 3 ? 'grid' : 'block',
	};

	useEffect(() => {
		if (!!watch(videoLink) && !watch(videoTitle)?.length)
			setError(videoTitle, { message: validationErrMessages.videoTitle });
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [watch(videoLink), watch(videoTitle)]);

	return (
		<div className='gallery' ref={formRef}>
			{isPdfViewer
				&& <AppModal
					className='pdf-pop-up'
					onClose={closePdfViewer}
					component={PdfViewer}
					outerProps={{
						id: pdfId,
					}}
					width='1115px'
					title={pdfTitle}
				/>
			}
			{isImageViewer
				&& <AppModal
					title={imageDate?.filename}
					onClose={closeImageViewer}
					component={ImageViewer}
					outerProps={{
						imageDate: imageDate,
					}}
					isScrollable
					isCentered
					width='1115px'
				/>
			}
			<P14 className='step-style'>{currentStepsText}</P14>
			<div className='video-fields'>
				<S16 bold className='title'>{titles.pageTitle}</S16>
				<S16 className='description'>{titles.pageDescription}</S16>
				<S16 className='instruction'>{titles.pageInstruction}&nbsp;
					<Tooltip
						message={<P12 className='black-tooltip'>{titles.pageTooltipContent}</P12>}
						placement='right'>{Icons.infoIcon(colors.black)}
					</Tooltip>
				</S16>
				<div className='input-container'>
					<TextInput
						id={videoLink}
						type='text'
						name={videoLink}
						placeholder={placeholders.videoLink}
						isLightTheme
						register={register}
						isError={!!errors[videoLink]}
						onChange={onVideoLinkChanged}
						onBlur={onVideoLinkBlur}
						isBorder={isInputsWithBorder}
						trigger={trigger}
						isWithoutTopPlaceholder
					/>
					{!!watch(videoLink)?.length && !isVideoMetaLoading
					&& <span className='close' onClick={clearField(videoLink)}>{Icons.close()}</span>
					}
					{isVideoMetaLoading && <div className='spinner'>
						<Spinner
							animation='border'
							variant='danger'
							size='sm'
						/>
					</div>}
					{errors[videoLink] && <P12 className='warning-text'>{errors[videoLink].message}</P12>}
				</div>
				<div className='d-flex'>
					<div className='l-40'>
						<div className='video-preview'>
							<div className='preview-title'>Video Preview</div>
							<div className='video-preview-poster'>
								{videoLink?.length && isPlayVideo
									? <ReactPlayer
										url={watch(videoLink)}
										height='100%'
										width='100%'
										playing={isPlayVideo}
										onEnded={onStopVideo}
										controls={true}
									/>
									: <>
										<div className='default-video-icon' onClick={playVideo}>{Icons.video()}</div>
										{videoAttributes?.thumbnail
											&& <img
												src={videoAttributes.thumbnail}
												alt={'video-poster'}
											/>
										}
									</>
								}
							</div>
						</div>
					</div>
					<div className='r-60'>
						<div className='video-attr'>
							<div className='input-label'>Video title</div>
							<div className='input-container'>
								<TextInput
									id={videoTitle}
									type='text'
									name={videoTitle}
									placeholder={placeholders.videoTitle}
									isLightTheme
									register={register}
									isError={!!errors[videoTitle]}
									onChange={clearSubmitErrorOnChange}
									readOnly={!watch(videoLink) || !!errors[videoLink]}
									disabled={!watch(videoLink) || !!errors[videoLink]}
									isBorder={isInputsWithBorder}
									isWithoutTopPlaceholder
								/>
								{!!watch(videoTitle)?.length
									&& <span className='close' onClick={clearField(videoTitle)}>{Icons.close()}</span>
								}
								{errors[videoTitle] && <P12 className='warning-text'>{errors[videoTitle].message}</P12>}
							</div>
							<div className='input-label'>Video description</div>
							<div className='input-container'>
								<TextArea
									isEditText
									isVisibleLabel={false}
									id={videoDescription}
									type='text'
									name={videoDescription}
									placeholder={placeholders.videoDescription}
									isLightTheme
									register={register}
									isError={!!errors[videoDescription]}
									rows={5}
									control={control}
									value={watch(videoDescription)}
									readOnly={!watch(videoLink) || !!errors[videoLink]}
									isBorder={isInputsWithBorder}
									trigger={trigger}
									onChange={clearSubmitErrorOnChange}
									disabled={!watch(videoLink) || !!errors[videoLink]}
								/>
								{errors[videoDescription]
									&& <P12 className='warning-text'>{errors[videoDescription].message}</P12>
								}
							</div>
						</div>
					</div>
				</div>
			</div>
			{isFileUploading
				&& <>
					<P16 bold className='title'>{titles.files}</P16>
					<P16 className='files-description'>{titles.filesDescription}</P16>
					<P14 className='files-content-types'>{titles.filesContentTypes}</P14>
					<P14 className='description-info'>
						<span>{greenInfoIcon}</span>
						<span>{titles.descriptionInfo}</span>
					</P14>
					<FileUploadButton
						id='documentToAttach'
						name='documentToAttach'
						onChange={handleUploadDocuments}
						accept={fileTypes}
						removeUploadedFile={removeUploadedFile}
						title={titles.chooseFileBtnTitle}
						iconColor={colors.darkblue40}
						isTooltip={false}
						multiple
					/>
					<div className={`documents-uploading-container${
						galleryDocuments.length <= 2 ? ' no-carousel' : ''
					}`}>
						<div
							className='previews-container'
							style={previewsContainerStyle}
						>
							{galleryDocuments.length > 2
								? <DocumentsCarousel
									spaceBetween={25}
									documents={galleryDocuments.map(doc => ({
										...doc,
										thumbnail: { image: doc.thumbnail },
									}))}
									removeFile={handleRemoveFile}
								/>
								: galleryDocuments.map(document => {
									const defaultIcon = chooseDefaultIconForFile(document.filename);
									const documentPreviewStyle = { backgroundImage: `url(${ document.thumbnail })` };
									const documentIcon = Icons.defaultDocuments[document.extension.toLowerCase()]();
									const classNames = cn(`format-icon`, {
										'small': document?.thumbnail,
										'big': !document?.thumbnail,
									});
									const handleRemoveDocument = e => {
										e.stopPropagation();
										handleRemoveFile(document.id);
									};
									const isPdf = document.extension.toLowerCase() === 'pdf';
									const isImage = extensionsForImage.includes(document.extension.toLowerCase());

									const onClickDocument = () => {
										if (isPdf || document?.pdfId) {
											setIsPdfViewer(true);
											setPdfId(document?.pdfId ? document?.pdfId : document.id);
											setPdfTitle(document.filename);
										} else if (isImage) {
											setIsImageViewer(true);
											setImageDate(document);
										}
									};

									return (
										<Tooltip message={document.filename} key={document.id}>
											<div
												className='document-preview'
												style={documentPreviewStyle}
												onClick={onClickDocument}
											>
												{!document.thumbnail
													&& <div className={'default-doc-icon'}>{defaultIcon}</div>
												}
												<span className='close-icon' onClick={handleRemoveDocument}>
													{closeIcon}
												</span>
												{document.thumbnail
													&& <span className={classNames}>{documentIcon}</span>
												}
											</div>
										</Tooltip>
									);
								})}
						</div>
					</div>
				</>
			}
			{documentsError
				&& <P12 className='warning-text docs-uploading-error'>{documentsError}</P12>
			}
			<div className='buttons-container'>
				{isSkipButton
					&& <PrimaryButton
						onClick={handleSkipThisStep}
						text='Skip the step'
						isOutline
					/>
				}
				{isResetButton
					&& <PrimaryButton
						onClick={handleReset}
						text='Reset'
						disabled={isLoading || isVideoMetaLoading}
						isOutline
					/>
				}
				<Tooltip
					placement='top'
					isVisibleTooltip={!isStartupsEditPermission}
					message={
						<P12>
							You don’t have enough access rights.
						</P12>
					}
				>
					<PrimaryButton
						onClick={handleSubmit(handleSaveGallery)}
						text='Save'
						disabled={isDisabledSaveButton}
					/>
				</Tooltip>
			</div>
			{!!savingGalleryError
				&& <P12 className='warning-text docs-uploading-error float-end'>{errorText.uploadingError}</P12>
			}
			{(isLoading && !parentIsLoading) && <LoadingOverlay/>}
			{isRemoveFileConfirmModal
				&& <AppModal
					width='630px'
					isHeader={false}
					onClose={closeFileConfirmModal}
					component={Confirm}
					outerProps={{
						onClose: closeFileConfirmModal,
						successConfirm: confirmFileRemoving,
						component: S16,
						componentProps: {
							bold: true,
							className: 'mb-1',
							children: removeConfirmationTitle,
						},
					}}
				/>
			}
		</div>
	);
};

Gallery.defaultProps = {
	defaultValues: {
		documents: [],
	},
	isSkipButton: true,
	isResetButton: false,
	isInputsWithBorder: false,
	isFileUploading: true,
	parentIsLoading: false,
	isStartupsEditPermission: true,
};

Gallery.propTypes = {
	saveGallery: func.isRequired,
	logOut: func.isRequired,
	defaultValues: shape({
		[videoLink]: string,
		[videoTitle]: string,
		[videoDescription]: string,
		videoId: number,
		documents: arrayOf(object),
	}),
	isSkipButton: bool,
	isResetButton: bool,
	currentStepsText: string,
	isInputsWithBorder: bool,
	isFileUploading: bool,
	parentIsLoading: bool,
	isStartupsEditPermission: bool,
};

export default memo(Gallery);
