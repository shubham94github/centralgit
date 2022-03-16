import React from 'react';
import CustomDropdown from '@components/_shared/CustomDropdown';
import { Icons } from '@icons';
import { colors } from '@constants/colors';
import { func } from 'prop-types';
import AnalysisMenuList from './AnalysisMenuList';
import { dateFormattingWithTime } from '@utils/date';
import Tooltip from '@components/_shared/Tooltip';
import { S12 } from '@components/_shared/text';

/* eslint-disable */

export const getColumns = ({
	generateReport,
	cancelReport,
	downloadReportFile,
}) => {
	const menuIcon = Icons.threeDotsMenuIcon(colors.black);

	return [
		{
			name: 'Keywords',
			grow: 1,
			property: 'keywords',
			selector: 'keywords',
			width: '300px',
			sortable: false,
			omit: false,
			disableOmit: true,
			cell: ({ keywords }) => {
				const text = keywords.join(', ');

				return (
					keywords && <Tooltip
						trigger={['hover', 'focus']}
						message={
							<S12>{text}</S12>
						}
						width='150px'
					>
						<div className='category-name'>{text}</div>
					</Tooltip>
				);
			},
		},
		{
			name: 'Status',
			grow: 2,
			property: 'Status',
			selector: 'analysisType',
			sortable: true,
			omit: false,
			disableOmit: true,
			width: '150px',
		},
		{
			name: 'Found Startups',
			grow: 2,
			property: 'countStartups',
			selector: 'countStartups',
			sortable: false,
			omit: false,
			disableOmit: false,
		},
		{
			name: 'Date',
			grow: 2,
			property: 'Date',
			selector: 'createdAt',
			sortable: true,
			omit: false,
			disableOmit: false,
			width: '200px',
			cell: ({ createdAt }) => (<div>{dateFormattingWithTime(createdAt)}</div>),
		},
		{
			name: 'Actions',
			grow: 1,
			property: 'actions',
			selector: 'actions',
			width: '100px',
			sortable: false,
			cell: ({ id, xlsxId, keywords }) => {
				const regenerateReport = () => generateReport({ certainWords: [ ...keywords ] });
				const downloadReport = async () => await downloadReportFile(xlsxId);
				const cancel = () => cancelReport(id);
				const outerProps = {
					regenerateReport,
					downloadReport,
					cancel,
					xlsxId,
				};

				return (
					<CustomDropdown
						className='dropdown-menu-table'
						button={menuIcon}
						component={AnalysisMenuList}
						outerProps={outerProps}
					/>
				);
			},
			disableOmit: true,
		},
	];
};

getColumns.PropTypes = {
	generateReport: func.isRequired,
	cancelReport: func.isRequired,
	getFileThumbnails: func.isRequired,
};
