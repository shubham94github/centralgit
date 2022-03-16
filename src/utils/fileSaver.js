import FileSaver from 'file-saver';

export const fileSaver = (blob, fileName) => {
	FileSaver.saveAs(blob, fileName);
};
