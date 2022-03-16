import React, { memo, useCallback, useEffect, useState } from 'react';
import { func } from 'prop-types';
import { setSnackbar } from '@ducks/common/actions';
import { connect } from 'react-redux';
import { downloadDocument } from '@api/fileUploadingApi';
import enums from '@constants/enums';
import LoadingOverlay from '@components/_shared/LoadingOverlay';
import { FullScreen, useFullScreenHandle } from 'react-full-screen';
import { Icons } from '@icons';
import { documentType } from '@constants/types';

import './ImageViewer.scss';

const fullScreen = Icons.fullScreen();
const disableFullScreen = Icons.disableFullScreen();

const ImageViewer = ({
	imageDate,
	setSnackbar,
}) => {
	const [previewImage, setPreviewImage] = useState(null);
	const [fullImage, setFullImage] = useState(null);
	const [isLoadingPreview, setIsLoadingPreview] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const handleFullScreen = useFullScreenHandle();

	const downloadPreviewImage = useCallback(async imageDate => {
		try {
			setIsLoadingPreview(true);

			if (imageDate?.previewId) {
				const image = await downloadDocument(imageDate?.previewId);

				setPreviewImage(image);
			} else {
				const image = await downloadDocument(imageDate.id);

				setPreviewImage(image);
				setFullImage(image);
			}
		} catch {
			setSnackbar({
				text: `Something went wrong. Please try again later.`,
				type: enums.snackbarTypes.error,
			});
		} finally {
			setIsLoadingPreview(false);
		}
	}, [setSnackbar]);

	const downloadFullImage = useCallback(async imageDate => {
		try {
			setIsLoading(true);

			if (!!fullImage) return;

			const image = await downloadDocument(imageDate.id);

			setFullImage(image);
		} catch {
			setSnackbar({
				text: `Something went wrong. Please try again later.`,
				type: enums.snackbarTypes.error,
			});
		} finally {
			setIsLoading(false);
		}
	}, [setSnackbar, fullImage]);

	const setFullscreenHandler = () => {
		downloadFullImage(imageDate);
		handleFullScreen.enter();
	};

	useEffect(() => {
		if (!!imageDate) downloadPreviewImage(imageDate);
	}, [imageDate, downloadPreviewImage]);

	return (<div className='image-wrapper'>
		{
			isLoadingPreview && !previewImage
				? <LoadingOverlay/>
				: <>
					<img
						className='image'
						src={previewImage}
						alt={imageDate.filename}
					/>
					<div className='bottom-menu'>
						<div onClick={setFullscreenHandler} className='full-screen-button'>
							{fullScreen}
						</div>
					</div>
					<FullScreen handle={handleFullScreen}>
						{isLoading && !fullImage
							? <LoadingOverlay classNames='fullscreen-loader'/>
							: <div className='full-image-container'>
								<img
									className='image'
									src={fullImage}
									alt={imageDate.filename}
								/>
							</div>
						}
						<div className='bottom-menu'>
							<div onClick={handleFullScreen.exit} className='full-screen-button'>
								{disableFullScreen}
							</div>
						</div>
					</FullScreen>
				</>
		}
	</div>
	);
};

ImageViewer.propTypes = {
	imageDate: documentType,
	setSnackbar: func.isRequired,
};

export default connect(null, {
	setSnackbar,
})(memo(ImageViewer));
