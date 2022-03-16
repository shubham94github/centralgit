import React, { useState, memo, useEffect, useCallback } from 'react';
import { connect } from 'react-redux';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import { func, number } from 'prop-types';
import { pageNavigationPlugin } from '@react-pdf-viewer/page-navigation';
import { zoomPlugin } from '@react-pdf-viewer/zoom';
import { fullScreenPlugin } from '@react-pdf-viewer/full-screen';
import { thumbnailPlugin } from '@react-pdf-viewer/thumbnail';
import { SelectionMode, selectionModePlugin } from '@react-pdf-viewer/selection-mode';
import { setSnackbar } from '@ducks/common/actions';
import { downloadDocument } from '@api/fileUploadingApi';
import LoadingOverlay from '@components/_shared/LoadingOverlay';

import enums from '@constants/enums';

import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/page-navigation/lib/styles/index.css';
import '@react-pdf-viewer/full-screen/lib/styles/index.css';
import '@react-pdf-viewer/thumbnail/lib/styles/index.css';

import './PdfViewer.scss';

const PdfViewer = ({
	id,
	setSnackbar,
}) => {
	const pageNavigationPluginInstance = pageNavigationPlugin();
	const zoomPluginInstance = zoomPlugin();
	const fullScreenPluginInstance = fullScreenPlugin();
	const thumbnailPluginInstance = thumbnailPlugin();
	const {
		CurrentPageInput,
		GoToNextPageButton,
		GoToPreviousPageButton,
		CurrentPageLabel,
	} = pageNavigationPluginInstance;
	const selectionModePluginInstance = selectionModePlugin();

	const { ZoomInButton, ZoomOutButton, CurrentScale } = zoomPluginInstance;
	const { EnterFullScreenButton } = fullScreenPluginInstance;
	const { Thumbnails } = thumbnailPluginInstance;
	const { SwitchSelectionModeButton } = selectionModePluginInstance;

	const [selectionMode, setSelectionMode] = useState(SelectionMode.Hand);
	const [isLoading, setIsLoading] = useState(false);
	const [pdfDocument, setPdfDocument] = useState(null);

	const downloadPdf = useCallback(async id => {
		try {
			setIsLoading(true);

			const document = await downloadDocument(id);

			setPdfDocument(document);
		} catch {
			setSnackbar({
				text: `Something went wrong. Please try again later.`,
				type: enums.snackbarTypes.error,
			});
		} finally {
			setIsLoading(false);
		}
	}, [setSnackbar]);

	useEffect(() => {
		if (id) downloadPdf(id);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const onChangeSelectionMode = () => {
		switch (selectionMode) {
			case SelectionMode.Text:
				setSelectionMode(SelectionMode.Hand);
				break;
			case SelectionMode.Hand:
				setSelectionMode(SelectionMode.Text);
				break;
			default: return;
		}
	};

	return (isLoading
		? <LoadingOverlay/>
		: <Worker workerUrl='https://unpkg.com/pdfjs-dist@2.12.313/build/pdf.worker.min.js'>
			<div className='pdf-viewer-container'>
				<div className='thumbnails-container'>
					<div className='thumbnails'>
						<Thumbnails/>
					</div>
				</div>
				<div className='document-content'>
					<div className='nav-panel'>
						<div className='nav-elements left-side'>
							<div>
								<CurrentPageLabel>
									{({ numberOfPages }) => (
										<div className='pages-content'>
											<div className='text-input'><CurrentPageInput/></div>
											<div>of {numberOfPages}</div>
										</div>
									)}
								</CurrentPageLabel>
							</div>
							<div>
								<GoToPreviousPageButton/>
							</div>
							<div>
								<GoToNextPageButton/>
							</div>
						</div>
						<div className='nav-elements right-side'>
							<div onClick={onChangeSelectionMode}>
								<SwitchSelectionModeButton mode={selectionMode}/>
							</div>
							<div>
								<CurrentScale/>
							</div>
							<div>
								<ZoomInButton/>
							</div>
							<div>
								<ZoomOutButton/>
							</div>
							<div>
								<EnterFullScreenButton/>
							</div>
						</div>
					</div>
					<div className='viewer'>
						{!!pdfDocument
							&& <Viewer
								fileUrl={pdfDocument}
								plugins={[
									pageNavigationPluginInstance,
									zoomPluginInstance,
									fullScreenPluginInstance,
									thumbnailPluginInstance,
									selectionModePluginInstance,
								]}
								defaultScale={1}
							/>
						}
					</div>
				</div>
			</div>
		</Worker>
	);
};

PdfViewer.propTypes = {
	id: number.isRequired,
	setSnackbar: func.isRequired,
};

export default connect(null, {
	setSnackbar,
})(memo(PdfViewer));
