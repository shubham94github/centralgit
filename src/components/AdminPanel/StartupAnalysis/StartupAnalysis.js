import React, { memo, useEffect, useState } from 'react';
import MainTable from '@components/_shared/MainTable';
import StartupAnalysisHeader from '@components/AdminPanel/StartupAnalysis/StartupAnalysisHeader';
import { connect } from 'react-redux';
import { getReports } from '@ducks/admin/actions';
import { array, bool, func, number } from 'prop-types';
import { getColumns } from '@components/AdminPanel/StartupAnalysis/columns';
import { downloadReportFile } from '@api/adminApi';
import { generateReport, cancelReport } from '@api/websocketApi';
import { tableMetaType } from '@constants/types';

import './StartupAnalysis.scss';

const StartupAnalysis = ({
	getReports,
	reports,
	tableMeta,
	isLoading,
	reportsCount,
}) => {
	const columns = getColumns({
		generateReport,
		cancelReport,
		downloadReportFile,
	});
	const [pageCount, setPageCount] = useState(0);

	useEffect(() => setPageCount(Math.ceil(reportsCount / tableMeta.pageSize)),
		[setPageCount, tableMeta.pageSize, reportsCount]);

	useEffect(() => {
		getReports(tableMeta);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const onSort = (column, direction) => getReports({
		...tableMeta,
		sort: {
			direction: direction.toUpperCase(),
			fieldName: column.property,
		},
	});

	const onChangePage = page => getReports({
		...tableMeta,
		page: page + 1,
	});

	const onChangeCountOfRecords = size => getReports({
		...tableMeta,
		pageSize: size,
		page: 1,
	});

	return (
		<div className='startup-analysis-container'>
			<MainTable
				title='Startup Analysis'
				tableHeader={StartupAnalysisHeader}
				generateReport={generateReport}
				columns={columns}
				withPagination={true}
				isLoading={isLoading}
				data={reports}
				pageCount={pageCount}
				countOfRecords={reportsCount}
				onSort={onSort}
				tableMeta={tableMeta}
				onChangePage={onChangePage}
				onChangeCountOfRecords={onChangeCountOfRecords}
			/>
		</div>
	);
};

StartupAnalysis.defaultProps = {
	reports: [],
};

StartupAnalysis.propTypes = {
	getReports: func.isRequired,
	reports: array,
	tableMeta: tableMetaType.isRequired,
	isLoading: bool.isRequired,
	reportsCount: number.isRequired,
};

export default connect(({ admin: {
	reports,
	reportsTableMeta,
	isLoading,
	reportsCount,
} }) => {
	return {
		reports,
		tableMeta: reportsTableMeta,
		isLoading,
		reportsCount,
	};
}, {
	getReports,
})(memo(StartupAnalysis));
