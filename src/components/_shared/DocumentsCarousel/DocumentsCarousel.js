import React, { memo, useEffect, useState } from 'react';
import { func, number } from 'prop-types';
import SwiperCore, { Navigation } from 'swiper/core';
import { Swiper, SwiperSlide } from 'swiper/react';
import { colors } from '@colors';
import { isEmpty } from '@utils/js-helpers';
import Tooltip from '@components/_shared/Tooltip/Tooltip';
import ReactPlayer from 'react-player';
import { getVideoAttributes } from '@api/commonApi';
import { profileDocumentsType, marketingVideoType } from '@constants/types';
import { Icons } from '@icons';
import cn from 'classnames';
import { useLocation } from 'react-router-dom';
import { Routes } from '@routes';
import AppModal from '@components/Common/AppModal';
import PdfViewer from '@components/_shared/PdfViewer';
import ImageViewer from '@components/_shared/ImageViewer';
import { extensionsForImage } from '@components/_shared/ImageViewer/constants';

import 'swiper/swiper.min.css';
import 'swiper/components/pagination/pagination.min.css';
import 'swiper/components/navigation/navigation.min.css';

import './DocumentsCarousel.scss';

SwiperCore.use([Navigation]);

const leftArrowIcon = Icons.leftArrowIcon(colors.gray90);
const rightArrowIcon = Icons.rightArrowIcon(colors.gray90);
const closeIcon = Icons.close(colors.white);

const { ADMIN_PANEL, SETTINGS, AUTH: { GETTING_STARTED } } = Routes;

function DocumentsCarousel({
	documents,
	profileId,
	marketingVideo,
	removeFile,
	spaceBetween,
}) {
	const location = useLocation();
	const isVisibleCloseIcon = location.pathname.includes(ADMIN_PANEL.INDEX)
		|| location.pathname.includes(SETTINGS.INDEX)
		|| location.pathname.includes(GETTING_STARTED.INDEX);
	const [videoAttributes, setVideoAttributes] = useState(null);
	const [isPlayVideo, setIsPlayVideo] = useState(null);
	const [isPdfViewer, setIsPdfViewer] = useState(false);
	const [isImageViewer, setIsImageViewer] = useState(false);
	const [pdfId, setPdfId] = useState(null);
	const [pdfTitle, setPdfTitle] = useState('');
	const [imageDate, setImageDate] = useState(null);

	const closePdfViewer = () => setIsPdfViewer(false);

	const closeImageViewer = () => setIsImageViewer(false);

	useEffect(() => {
		const getVideoAttr = async videoUrl => {
			if (!videoUrl?.length) return;

			const videoAttributes = await getVideoAttributes(videoUrl);

			setVideoAttributes(videoAttributes);
		};

		if (marketingVideo?.link) getVideoAttr(marketingVideo.link);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const classNextEl = `swiper-button-next-unique-${profileId}`;
	const classPrevEl = `swiper-button-prev-unique-${profileId}`;

	const playVideo = () => setIsPlayVideo(true);
	const onStopVideo = () => setIsPlayVideo(false);
	const isMultiDocument = documents.length > 2;

	return (
		<div className='documents-carousel'>
			{isMultiDocument && <div className={`${classPrevEl} swiper-button-prev-unique`}>{leftArrowIcon}</div>}
			{(!isEmpty(documents) || videoAttributes?.thumbnail)
				&& <Swiper
					slidesPerView='auto'
					watchOverflow
					spaceBetween={spaceBetween}
					navigation={{
						nextEl: `.${classNextEl}`,
						prevEl: `.${classPrevEl}`,
					}}
					className='swiper'
				>
					{marketingVideo?.id && videoAttributes?.thumbnail
						&& <SwiperSlide key={`video${marketingVideo.id}`}>
							<div className='document-preview video'>
								<Tooltip
									message={marketingVideo?.title}
									key={marketingVideo.id}
									placement='right'
								>
									{marketingVideo?.link?.length && isPlayVideo
										? <ReactPlayer
											url={marketingVideo.link}
											height='100%'
											width='100%'
											playing={isPlayVideo}
											onEnded={onStopVideo}
											controls={true}
										/>
										: <>
											{videoAttributes?.thumbnail
												&& <img
													src={videoAttributes.thumbnail}
													alt={'video-poster'}
												/>
											}
											<span
												className='default-video-icon'
												onClick={playVideo}
											>
												{Icons.video()}
											</span>
										</>
									}
								</Tooltip>
							</div>
						</SwiperSlide>
					}
					{documents.map((document, i) => {
						const thumbnailCssStyle = { backgroundImage: document.thumbnail?.image && `url(${document.thumbnail.image})` };
						const handleRemoveDocument = e => {
							e.stopPropagation();
							removeFile(document.id);
						};
						const documentIcon = Icons.defaultDocuments[document.extension.toLowerCase()]();
						const classNames = cn(`format-icon`, {
							'small': document.thumbnail?.image,
							'big': !document.thumbnail?.image,
						});
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
							<SwiperSlide key={`${document.id}${i}${document.name}`}>
								<Tooltip message={document.filename} key={document.id}>
									<div
										className='document-preview'
										style={thumbnailCssStyle}
										onClick={onClickDocument}
									>
										{isVisibleCloseIcon
											&& <span
												className='close'
												onClick={handleRemoveDocument}
											>
												{closeIcon}
											</span>
										}
										<span className={classNames}>
											{documentIcon}
										</span>
									</div>
								</Tooltip>
							</SwiperSlide>
						);
					})}
				</Swiper>}
			{isMultiDocument && <div className={`${classNextEl} swiper-button-next-unique`}>{rightArrowIcon}</div>}
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
		</div>
	);
}

DocumentsCarousel.defaultProps = {
	spaceBetween: 45,
};

DocumentsCarousel.propTypes = {
	documents: profileDocumentsType,
	profileId: number,
	marketingVideo: marketingVideoType,
	removeFile: func,
	spaceBetween: number,
};

export default memo(DocumentsCarousel);
