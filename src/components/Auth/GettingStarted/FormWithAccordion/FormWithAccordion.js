import React, { memo, useEffect, useMemo, useState } from 'react';
import { array, bool, func, number, string } from 'prop-types';
import { P14, P16, S14 } from '@components/_shared/text';
import { colors } from '@colors';
import Checkbox from '@components/_shared/form/Checkbox';
import PrimaryButton from '@components/_shared/buttons/PrimaryButton';
import ChosenFieldLabels from '@components/_shared/ChosenFieldLabels';
import { maxTagsLength } from '@components/Auth/constants';
import { isEmpty } from '@utils/js-helpers';
import AccordionRow from '@components/Auth/GettingStarted/FormWithAccordion/AccordionRow';
import hideSomeFirstLevelCategories from '@utils/hideSomeFirstLevelCategories';
import { Icons } from '@icons';

import './FormWithAccordion.scss';

function FormWithAccordion({
	sendChosenItems,
	getCategories,
	isLoading,
	title,
	submitTitle,
	categories,
	guidelineText,
	selectedFullValues,
	isAdminPanel,
	onClose,
	stepText,
	isResetButton,
	narrowCategoriesDefaultValues,
	isCancelButton,
	isMission,
}) {
	const [isSectors, setIsSectors] = useState(true);
	const [isAreas, setIsAreas] = useState(true);
	const [openTabs, setOpenTabs] = useState([]);
	const [isOpenGuidelines, setIsOpenGuidelines] = useState(true);
	const [checkedValues, setCheckedValues] = useState([]);

	const withoutHiddenCategories = hideSomeFirstLevelCategories(categories);

	useEffect(() => {
		if (!isEmpty(selectedFullValues)) {
			const withoutImportCategories = selectedFullValues.filter(selectedFullValue =>
				selectedFullValue.parentNames[0] !== 'Import');

			setCheckedValues(withoutImportCategories);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedFullValues]);

	useEffect(() => {
		if (narrowCategoriesDefaultValues?.length) {
			if (narrowCategoriesDefaultValues.find(item => item.fieldName === 'categoryIds'))
				setIsSectors(true);
			else setIsSectors(false);

			if (narrowCategoriesDefaultValues.find(item => item.fieldName === 'areaIds'))
				setIsAreas(true);
			else setIsAreas(false);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (isEmpty(categories)) getCategories();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const onSubmit = () => {
		const preparedIds = checkedValues.map(checkedValue => checkedValue.id);

		if (isAdminPanel) {
			sendChosenItems({
				categoryIds: isSectors ? preparedIds : [],
				areaIds: isAreas ? preparedIds : [],
			});
		} else if (isMission) {
			sendChosenItems({
				checkedValues,
			});
		}
		else {
			sendChosenItems({
				categoryIds: preparedIds,
			});
		}
	};

	const toggleAccordion = id => {
		const isOpen = openTabs.find(tabId => tabId === id);

		if (isOpen) setOpenTabs(openTabs.filter(tab => tab !== id));
		else setOpenTabs([...openTabs, id]);
	};

	const isMaxCheckedValues = useMemo(() => checkedValues.length === maxTagsLength, [checkedValues]);

	const handleRemoveField = id => setCheckedValues(checkedValues.filter(checkedValue => checkedValue.id !== id));

	const toddleGuidelines = () => setIsOpenGuidelines(!isOpenGuidelines);

	const goInside = (acc, category) => {
		if (!acc.includes(category.id))
			acc.push(category.id);

		category.items?.forEach(subCategory => {
			if (!subCategory.items?.length) return;

			acc.push(subCategory.id);

			if (subCategory.items) goInside(acc, subCategory);
		});

		return acc;
	};

	useEffect(() => {
		if (categories?.length) {
			const openTabsIds = categories.reduce((acc, category) => {
				if (!category.items?.length) return acc;

				return goInside(acc, category);
			}, []);

			setOpenTabs(openTabsIds);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [setOpenTabs, categories]);

	const onChangeSectors = () => {
		if (!isAreas) return;

		setIsSectors(!isSectors);
	};

	const onChangeAreas = () => {
		if (!isSectors) return;

		setIsAreas(!isAreas);
	};

	const onChange = checkedItem => {
		if (checkedValues.find(checkedValue => checkedValue.id === checkedItem.id))
			setCheckedValues(checkedValues.filter(checkedValue => checkedValue.id !== checkedItem.id));
		else  setCheckedValues([...checkedValues, checkedItem]);
	};

	const resetData = () => setCheckedValues(selectedFullValues);

	return (
		<div className='accordion-custom'>
			<div className='accordion-header'>
				{stepText
					&& <P14 className='step-style'>
						{stepText}
					</P14>
				}
				{title
					&& <div className='title'>
						<div>
							<P16 bold={true} className='mb-3'>
								{title}
							</P16>
						</div>
					</div>
				}
				{guidelineText
					&& <div className='guidelines'>
						<S14 onClick={toddleGuidelines}>
							{Icons.infoIcon(isOpenGuidelines ? colors.grass50 : colors.darkblue50)}
						</S14>
						{isOpenGuidelines
							? <P14 className='guideline-text'>
								{guidelineText}
							</P14>
							: <P14 className='guideline-text'>Guidelines</P14>
						}
					</div>
				}
				{isAdminPanel
					&& <div>
						<P14 bold className='guideline-text'>Narrow categories</P14>
						<div className='filter-type'>
							<Checkbox
								name='sectors'
								label='Sectors'
								onChange={onChangeSectors}
								checked={isSectors}
							/>
							<Checkbox
								name='areas'
								label='Areas'
								onChange={onChangeAreas}
								checked={isAreas}
							/>
						</div>
					</div>
				}
				<div className='accordion-chosen-items'>
					<ChosenFieldLabels
						items={checkedValues}
						removeItem={handleRemoveField}
					/>
				</div>
			</div>
			<div className='accordion-rows'>
				{!isEmpty(withoutHiddenCategories)
					&& withoutHiddenCategories.map(category => {
						return (
							<AccordionRow
								item={category}
								key={category.id}
								onClick={toggleAccordion}
								openTabs={openTabs}
								onChange={onChange}
								checkedValues={checkedValues}
								isMaxCheckedValues={isMaxCheckedValues}
							/>
						);
					})
				}
			</div>
			{isAdminPanel
				? <div className='accordion-actions'>
					<PrimaryButton
						onClick={onClose}
						text='Reset'
						isOutline
						className='me-3'
					/>
					<PrimaryButton
						className='float-right'
						isLoading={isLoading}
						onClick={onSubmit}
						disabled={isLoading || !checkedValues.length}
						text={submitTitle}
					/>
				</div>
				: <div className='accordion-actions'>
					{isResetButton
						&& <PrimaryButton
							onClick={resetData}
							text='Reset'
							isOutline
							className='me-3'
						/>
					}
					{isCancelButton
						&& <PrimaryButton
							onClick={onClose}
							text='Cancel'
							isOutline
							className='me-3'
						/>
					}
					<PrimaryButton
						className='float-right'
						isLoading={isLoading}
						onClick={onSubmit}
						disabled={isLoading || !checkedValues.length}
						text={submitTitle}
					/>
				</div>
			}
		</div>
	);
}

FormWithAccordion.defaultProps={
	selectedFullValues: [],
	isAdminPanel: false,
	getCategories: () => {},
	title: '',
	isCancelButton: false,
	isMission: false,
};

FormWithAccordion.propTypes = {
	sendChosenItems: func.isRequired,
	getCategories: func,
	isLoading: bool,
	title: string,
	submitTitle: string.isRequired,
	itemsName: string.isRequired,
	categories: array,
	stepCount: number,
	step: number,
	guidelineText: string,
	selectedFullValues: array,
	isAdminPanel: bool,
	onClose: func,
	stepText: string,
	isResetButton: bool,
	narrowCategoriesDefaultValues: array,
	isCancelButton: bool,
	isMission: bool,
};

export default memo(FormWithAccordion);
