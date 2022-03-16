import { client } from '@api/clientApi';
import promiseMemoize from '@utils/promiseMemoize';
import { imageConverter, svgConverter } from '@utils/imageConverter';

const { FILE_UPLOADER_URI } = process.env;

export const uploadUserLogo = file => {
	const formData = new FormData();
	formData.append('file', file);

	return client.post(`${FILE_UPLOADER_URI}/v1/user-avatar/upload`, formData);
};

export const uploadCroppedUserLogo = file => {
	const formData = new FormData();
	formData.append('file', file);

	return client.post(`${FILE_UPLOADER_URI}/v1/user-avatar/upload/crop`, formData);
};

export const uploadCompanyLogo = file => {
	const formData = new FormData();
	formData.append('file', file);

	return client.post(`${FILE_UPLOADER_URI}/v1/logo/upload`, formData);
};

export const uploadCroppedCompanyLogo = file => {
	const formData = new FormData();
	formData.append('file', file);

	return client.post(`${FILE_UPLOADER_URI}/v1/logo/upload/crop`, formData);
};

export const uploadAttachedDocuments = async files => {
	return await Promise.all(Array.from(files).map(async file => {
		const formData = new FormData();
		formData.append('file', file);

		return client.post(`${FILE_UPLOADER_URI}/v1/document/upload`, formData);
	}));
};

export const getFileThumbnails = async fileIds => {
	return await Promise.all(fileIds.map(id => {
		if (!id) return Promise.resolve(null);

		return client.get(`${FILE_UPLOADER_URI}/v1/document/download/${id}`, {
			responseType: 'blob',
		});
	})).then(async resp => {
		const thumbnails = await Promise.all(resp.map(blob => blob ? imageConverter(blob) : null));

		return thumbnails.map((thumbnail, i) => ({
			thumbnailId: fileIds[i],
			image: thumbnail,
		}));
	});
};

export const downloadUserAvatar = promiseMemoize(id => {
	if (!id) return Promise.resolve();

	return client.get(`${FILE_UPLOADER_URI}/v1/user-avatar/download/${id}`, {
		responseType: 'blob',
	}).then(blob => {
		return imageConverter(blob);
	});
});

export const downloadDocument = promiseMemoize(id => {
	if (!id) return Promise.resolve();

	return client.get(`${FILE_UPLOADER_URI}/v1/user-avatar/download/${id}`, {
		responseType: 'blob',
	}).then(blob => {
		return imageConverter(blob);
	});
});

export const downloadCategoryIcon  = promiseMemoize(id => {
	return client.get(`${FILE_UPLOADER_URI}/v1/user-avatar/download/${id}`, {
		responseType: 'text',
	}).then(svgString => {
		return svgConverter(svgString);
	});
});

export const downloadCompanyAvatar = promiseMemoize(id => {
	if (!id) return Promise.resolve();

	return client.get(`${FILE_UPLOADER_URI}/v1/logo/download/${id}`, {
		responseType: 'blob',
	}).then(blob => {
		return imageConverter(blob);
	});
});
