import React from 'react';
import { Icons } from '@icons';

export const getTableCell = (paymentPlan, propName) => {
	if (typeof paymentPlan[propName] === 'number')
		return <span className='bold'>{`$${paymentPlan[propName] / 100}`}</span>;
	else if ((propName === 'singleUser' && paymentPlan.multipleCompanyUsers === false) || !!paymentPlan[propName] / 100)
		return Icons.checked();
};
