import { fieldNames } from './schema';

export const placeholders = {
	videoLink: 'Enter the link to the video',
	videoTitle: 'Enter the title of the video',
	videoDescription: `Briefly describe the video (up to 255 characters)`,
};

export const titles = {
	pageTitle: 'Video',
	pageDescription: 'Upload a video you would like to share on your profile',
	pageInstruction: 'Add a URL or “ember code” to the video',
	pageTooltipContent: 'Please copy the link to the video from the browser URL bar.',
	videoPreview: 'Video Preview',
	videoTitle: 'Video title',
	videoDescription: 'Video description',
	files: 'Files',
	filesDescription: 'Upload a marketing file you would like to share on your profile',
	filesContentTypes: 'Company Profile, Pitch, Business plan (Max of 5 files no more than 5MB)',
	addFileBtnTitle: 'Add a new file',
	chooseFileBtnTitle: 'Choose File',
	descriptionInfo: 'Max size of files should be no more than 5MB. Possible extensions: csv, '
		+ 'doc, docx, pdf, pps, ppt, pptx, rtf, txt, xls, xlsx, bmp, gif, jpeg, jpg, png.',
};

export const errorText = {
	[fieldNames.videoLink]: 'Video link is a required field',
	wrongLink: 'Please add the correct link',
	fileCountUploadError: 'Can\'t upload more then 5 files',
	fileSizeUploadError: 'Each file must be less than 5 MB',
	uploadingError: 'Something went wrong, try again later',
	extensionError: 'This extension is not allowed',
};

export const fileTypes = '.csv, .doc, .docx, .pdf, .pps, .ppt, .pptx, .rtf, .txt, .xls,'
	+ ' .xlsx, .bmp, .gif, .jpeg, .jpg, .png';
