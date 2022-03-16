import React, { memo, useCallback, useState, useRef, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { P14, S12 } from '@components/_shared/text';
import ReactCrop from 'react-image-crop';
import PrimaryButton from '@components/_shared/buttons/PrimaryButton';
import { bool, func } from 'prop-types';
import cn from 'classnames';
import { MAX_SINGLE_FILE_SIZE } from '@constants/validationConstants';
import { validationErrMessages } from '@constants/common';

import 'react-image-crop/lib/ReactCrop.scss';
import './UploadAvatar.scss';

const { fileSize, fileExtension } = validationErrMessages;

const generateCroppedImage = ({
	canvas,
	crop,
	fileName,
	uploadLogo,
	closeModal,
	isAdmin,
	uploadLogoByAdmin,
}) => {
	if (!crop || !canvas) return;

	canvas.toBlob(
		blob => {
			const file = new File( [blob], fileName, { type: `image/${fileName.split('.')[1]}` });
			if (isAdmin) {
				uploadLogoByAdmin(file);
				closeModal();
			} else {
				uploadLogo(file);
				closeModal();
			}
		},
		`image/${fileName.split('.')[1]}`,
		1,
	);
};

const UploadAvatar = ({ onClose, uploadLogo, isAdmin, uploadLogoByAdmin }) => {
	const [file, setFile] = useState(null);
	const [fileName, setFileName] = useState('');
	const imgRef = useRef(null);
	const previewCanvasRef = useRef(null);
	const [completedCrop, setCompletedCrop] = useState(null);
	const acceptExtensions = ['image/jpeg', 'image/png', 'image/jpg'];
	const [error, setError] = useState('');
	const [crop, setCrop] = useState({
		unit: '%',
		width: 30,
		aspect: 3 / 3,
	});
	const imageStyles = {
		width: 'auto',
		maxHeight: 417,
	};

	const dropZoneClasses = cn('drop-zone', {
		'is-error': !!error,
	});

	const onDrop = useCallback(acceptedFiles => {
		if (!acceptedFiles.length) return;

		if (acceptedFiles[0].size > MAX_SINGLE_FILE_SIZE)
			setError(fileSize);
		else if (!acceptExtensions.find(acceptExtension => acceptExtension === acceptedFiles[0].type))
			setError(fileExtension);
		else {
			setError('');
			setFileName(acceptedFiles[0].name);
			setFile(URL.createObjectURL(acceptedFiles[0]));
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	const { getRootProps, getInputProps } = useDropzone({
		onDrop,
		maxFiles: 1,
	});

	const onLoad = useCallback(img => imgRef.current = img, []);

	useEffect(() => {
		if (!completedCrop || !previewCanvasRef.current || !imgRef.current) return;

		const image = imgRef.current;
		const canvas = previewCanvasRef.current;
		const crop = completedCrop;

		const scaleX = image.naturalWidth / image.width;
		const scaleY = image.naturalHeight / image.height;
		const ctx = canvas.getContext('2d');
		const pixelRatio = window.devicePixelRatio;

		canvas.width = crop.width * pixelRatio;
		canvas.height = crop.height * pixelRatio;

		ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
		ctx.imageSmoothingQuality = 'high';

		ctx.drawImage(
			image,
			crop.x * scaleX,
			crop.y * scaleY,
			crop.width * scaleX,
			crop.height * scaleY,
			0,
			0,
			crop.width,
			crop.height,
		);
	}, [completedCrop]);

	const uploadImage = () => generateCroppedImage({
		canvas: previewCanvasRef.current,
		crop: completedCrop,
		fileName,
		uploadLogo,
		closeModal: onClose,
		isAdmin,
		uploadLogoByAdmin,
	});

	const setNewCrop = newCrop => setCrop(newCrop);

	const setNewCompletedCrop = newCompletedCrop => setCompletedCrop(newCompletedCrop);

	return (
		<div className='upload-avatar'>
			<div {...getRootProps()} className={dropZoneClasses}>
				<input {...getInputProps()}/>
				<P14 className='drop-zone-text'>Drag ‘n’ drop some files here, or click to select files</P14>
			</div>
			{file
				&& <ReactCrop
					src={file}
					crop={crop}
					className='image-cropper'
					imageStyle={imageStyles}
					onImageLoaded={onLoad}
					onChange={setNewCrop}
					onComplete={setNewCompletedCrop}
				/>
			}
			{error && <S12 className='error'>{error}</S12>}
			<canvas
				ref={previewCanvasRef}
				style={{
					display: 'none',
					width: Math.round(completedCrop?.width ?? 0),
					height: Math.round(completedCrop?.height ?? 0),
				}}
			/>
			<div className='upload-file-action'>
				<PrimaryButton
					isOutline={true}
					onClick={onClose}
				>Cancel</PrimaryButton>
				<PrimaryButton
					onClick={uploadImage}
					className='apply-btn'
				>Apply</PrimaryButton>
			</div>
		</div>
	);
};

UploadAvatar.defaultProps = {
	onClose: () => {},
	uploadLogoByAdmin: () => {},
	isAdmin: false,
};

UploadAvatar.propTypes = {
	onClose: func.isRequired,
	uploadLogo: func,
	isAdmin: bool,
	uploadLogoByAdmin: func,
};

export default memo(UploadAvatar);
