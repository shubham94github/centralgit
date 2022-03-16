import React, { memo } from 'react';
import Checkbox from '@components/_shared/form/Checkbox';
import { array, bool, func, string } from 'prop-types';
import { isEmpty } from '@utils/js-helpers';
import { Icons } from '@icons';
import { P12, P14 } from '@components/_shared/text';
import Tooltip from '@components/_shared/Tooltip';

const chevronDown = Icons.chevronDown();
const chevronUp = Icons.chevronUp();

const SubItems = ({
	items,
	openTabs,
	classPrefix,
	onClick,
	onChange,
	checkedValues,
	isMaxCheckedValues,
}) => items.map((subItem, i) => {
	const isOpen = openTabs.includes(subItem.id);
	const rowIcon = isOpen ? chevronUp : chevronDown;

	const checked = !!checkedValues.find(checkedValue => checkedValue.id === subItem.id);

	const handleClick = () => onClick(subItem.id);

	const handleChange = () => onChange(subItem);

	return (
		<div
			className={`${classPrefix}-item`}
			key={`${subItem.id}-${i}-${subItem.name}`}
		>
			<div className={`${classPrefix}-item-header`}>
				<Checkbox
					name={`${subItem.id}-${subItem.name}`}
					label={
						<P14 className='row-text'>
							<Tooltip
								placement='top-start'
								width='215px'
								message={
									<P12 className='parent-paths'>
										<P14 className='row-text'>{subItem.name}</P14>
									</P12>
								}
							>
								<span>{subItem.name}</span>
							</Tooltip>
						</P14>
					}
					onChange={handleChange}
					isSelectedAndDisabled={false}
					checked={checked}
					disabled={isMaxCheckedValues}
				/>
				{subItem.items
					&& <div
						className={`${classPrefix}-item-icon`}
						onClick={handleClick}
					>
						{rowIcon}
					</div>
				}
			</div>
			{isOpen
				&& <div className='sub-item-content'>
					{!isEmpty(subItem.items)
						? <SubItems
							items={subItem.items}
							openTabs={openTabs}
							classPrefix='child'
							onClick={onClick}
							onChange={onChange}
							checkedValues={checkedValues}
							isMaxCheckedValues={isMaxCheckedValues}
						/>
						: <div className={`${classPrefix}-item-checkbox`}>
							<Checkbox
								name={subItem.name}
								label={subItem.name}
								onChange={onChange}
								isSelectedAndDisabled={false}
								checked={checked}
								disabled={isMaxCheckedValues}
							/>
						</div>
					}
				</div>
			}
		</div>
	);
});

SubItems.propTypes = {
	items: array.isRequired,
	isMaxCheckedValues: bool.isRequired,
	openTabs: array.isRequired,
	classPrefix: string.isRequired,
	onClick: func,
	onChange: func.isRequired,
	checkedValues: array.isRequired,
};

export default memo(SubItems);
