import FormWithAccordion from '@components/Auth/GettingStarted/FormWithAccordion';
import { retailerGuides, startupGuides } from '@constants/common';
import { array, bool, func, string } from 'prop-types';
import React, { memo } from 'react';

const SectorsOfCompetence = ({
	sendSectorsOfCompetence,
	getCategories,
	isLoading,
	categories,
	title,
	isRetailer,
	stepText,
	isResetButton,
	selectedValues,
}) => (
	<FormWithAccordion
		title={title}
		submitTitle='Save'
		isLoading={isLoading}
		getCategories={getCategories}
		sendChosenItems={sendSectorsOfCompetence}
		itemsName='sectors'
		categories={categories}
		guidelineText={isRetailer
			? retailerGuides
			: startupGuides
		}
		stepText={stepText}
		isResetButton={isResetButton}
		selectedFullValues={selectedValues}
	/>
);

SectorsOfCompetence.propTypes = {
	sendSectorsOfCompetence: func.isRequired,
	getCategories: func.isRequired,
	isLoading: bool,
	status: string,
	categories: array,
	title: string,
	isRetailer: bool,
	stepText: string,
	isResetButton: bool,
	selectedValues: array,
};

export default memo(SectorsOfCompetence);
