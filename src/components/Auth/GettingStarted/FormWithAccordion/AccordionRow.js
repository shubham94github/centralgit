import React, { memo } from 'react';
import { array, bool, func, object } from 'prop-types';
import { P12, P14 } from '@components/_shared/text';
import { isEmpty } from '@utils/js-helpers';
import SubItems from './SubItems';
import { Icons } from '@icons';
import Tooltip from '@components/_shared/Tooltip';

const chevronDown = Icons.chevronDown();
const chevronUp = Icons.chevronUp();

const AccordionRow = ({
	item,
	onClick,
	openTabs,
	onChange,
	checkedValues,
	isMaxCheckedValues,
}) => {
	const isOpen = !openTabs.includes(item.id);
	const rowIcon = isOpen ? chevronUp : chevronDown;

	const handleClick = () => onClick(item.id);

	return (
		<div className='accordion-row'>
			<div
				className='row-header'
				onClick={handleClick}
			>

				<P14 className='row-text' bold>
					<Tooltip
						placement='top-start'
						message={
							<P12 className='parent-paths'>
								<P14 className='row-text'>{item.name}</P14>
							</P12>
						}
						width='215px'
					>
						<span>{item.name}</span>
					</Tooltip>
				</P14>
				<div className='spacer'/>
				<div className='row-icon'>
					{rowIcon}
				</div>
			</div>
			{(isOpen && !isEmpty(item.items))
				&& <div className='row-content'>
					<SubItems
						items={item.items}
						openTabs={openTabs}
						classPrefix='sub'
						onClick={onClick}
						onChange={onChange}
						checkedValues={checkedValues}
						isMaxCheckedValues={isMaxCheckedValues}
					/>
				</div>
			}
		</div>
	);
};

AccordionRow.propTypes = {
	item: object.isRequired,
	onClick: func.isRequired,
	openTabs: array.isRequired,
	onChange: func.isRequired,
	checkedValues: array.isRequired,
	isMaxCheckedValues: bool.isRequired,
};

export default memo(AccordionRow);
