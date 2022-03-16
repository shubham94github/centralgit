import React, { memo } from 'react';
import { object } from 'prop-types';
import { P16 } from '@components/_shared/text';

const ConfirmSubmit = ({ isWarningsLengthMessage }) => {
	const { isWarningCompanyDescription, isWarningSolutionProductsServices } = isWarningsLengthMessage;

	return (
		<>
			{isWarningCompanyDescription
				&& <P16 className='text-start mb-2'>
					<b>Company Description:</b> You are below recommended <b>500</b> characters.
					<br/>
				</P16>
			}
			{isWarningSolutionProductsServices
				&& <P16 className='text-start pb-3'>
					<b>Solutions, products and services:</b>  You are below recommended <b>1000</b> characters.
					<br/>
				</P16>
			}
		</>
	);
};

ConfirmSubmit.propTypes = {
	isWarningsLengthMessage: object.isRequired,
};

export default memo(ConfirmSubmit);
