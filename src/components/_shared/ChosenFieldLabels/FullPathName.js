import React  from 'react';
import { arrayOf, string } from 'prop-types';
import { S12 } from '@components/_shared/text';

const FullPathName = ({ parentNames }) => (
	<S12>
		{
			parentNames.map((parentName, index) => (
				<span key={parentName+index}>
					{index !== 0 && ' > '}{parentName}
				</span>
			))
		}
	</S12>
);

FullPathName.propTypes = {
	parentNames: arrayOf(string),
};

export default FullPathName;
