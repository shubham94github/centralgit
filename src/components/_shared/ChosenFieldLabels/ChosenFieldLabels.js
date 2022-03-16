import React from 'react';
import { arrayOf, func, string, object } from 'prop-types';
import { S12, S14 } from '@components/_shared/text';
import { colors } from '@colors';
import Tooltip from '@components/_shared/Tooltip';
import { Icons } from '@icons';

import './ChosenFieldsLabel.scss';

function ChosenFieldLabels({ title, items, removeItem }) {
	return (
		<div className='chosen-labels-container'>
			<S14>{title}</S14>
			<div className='items-container'>
				{
					items?.map(item => {
						const handleRemove = () => removeItem(item.id);
						const fullPathName = item.parentNames?.map((parentName, index) => (
							<span key={parentName+index}>
								{index !== 0 && ' > '}{parentName}
							</span>
						));
						return fullPathName?.length && (
							<Tooltip
								key={item.id}
								message={
									<S12>
										{fullPathName}
									</S12>
								}
							>
								<div className='chosen-categories-buttons_item'>
									<S14>{item.name}</S14>
									<span
										onClick={handleRemove}
										className='close-label-icon'
									>
										{Icons.close(colors.white)}
									</span>
								</div>
							</Tooltip>
						);
					})
				}
			</div>
		</div>
	);
}

ChosenFieldLabels.defaultProps = {
	items: [],
};

ChosenFieldLabels.propTypes = {
	title: string,
	items: arrayOf(object),
	removeItem: func,
};

export default ChosenFieldLabels;
