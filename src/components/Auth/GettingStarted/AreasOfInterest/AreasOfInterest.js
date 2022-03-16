import React, { memo } from 'react';
import { array, bool, func, string } from 'prop-types';
import FormWithAccordion from '@components/Auth/GettingStarted/FormWithAccordion';
import { areasOfInterestGuidelines } from '@constants/common';

const AreasOfInterest = ({
	sendAreasOfInterest,
	getCategories,
	isLoading,
	categories,
	stepText,
	title,
	selectedValues,
	isResetButton,
}) => (
	<FormWithAccordion
		sendChosenItems={sendAreasOfInterest}
		getCategories={getCategories}
		isLoading={isLoading}
		itemsName='areas'
		title={title}
		submitTitle='Save'
		categories={categories}
		stepText={stepText}
		guidelineText={areasOfInterestGuidelines}
		selectedFullValues={selectedValues}
		isResetButton={isResetButton}
	/>
);

AreasOfInterest.propTypes = {
	sendAreasOfInterest: func.isRequired,
	getCategories: func.isRequired,
	isLoading: bool,
	categories: array,
	stepText: string,
	title: string,
	selectedValues: array,
	isResetButton: bool,
};

export default memo(AreasOfInterest);
