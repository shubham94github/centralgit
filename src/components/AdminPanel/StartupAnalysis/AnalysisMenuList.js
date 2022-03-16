import React, { memo } from 'react';
import { S16 } from '@components/_shared/text';
import { func, number } from 'prop-types';

import './AnalysisMenuList.scss';

const AnalysisMenuList = ({
	regenerateReport,
	downloadReport,
	cancel,
	xlsxId,
}) => (
	<ul className='analysis-menu-list'>
		<li className='analysis-menu-list__item'>
			<div onClick={regenerateReport}>
				<S16>Regenerate</S16>
			</div>
		</li>
		{xlsxId
		&& <li className='analysis-menu-list__item'>
			<div onClick={downloadReport}>
				<S16>Download report</S16>
			</div>
		</li>
		}
		<li className='analysis-menu-list__item'>
			<div onClick={cancel}>
				<S16>Cancel</S16>
			</div>
		</li>
	</ul>
);

AnalysisMenuList.propTypes = {
	regenerateReport: func.isRequired,
	downloadReport: func.isRequired,
	cancel: func.isRequired,
	xlsxId: number,
};

export default memo(AnalysisMenuList);
