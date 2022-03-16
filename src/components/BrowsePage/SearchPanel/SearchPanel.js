import React, { memo, useEffect } from 'react';
import { connect } from 'react-redux';
import { P16, P14 } from '@components/_shared/text';
import ToggleSection from '@components/_shared/ToggleSection';
import Found from '@components/BrowsePage/SearchPanel/Found';
import CheckboxFilters from '@components/BrowsePage/SearchPanel/CheckboxFilters';
import { checkboxFields, companyTypeOptions, narrowCategories } from './constanst';
import { getStartupFilter, setDefaultFieldForFilter } from '@ducks/browse/action';
import { getCountries, getAllTags } from '@ducks/common/actions';
import { array, func, string } from 'prop-types';
import { isEmpty } from '@utils/js-helpers';
import MultiselectFilter from '@components/BrowsePage/SearchPanel/MultiselectFilter';
import { extremesForRangesTypes } from '@constants/types';
import RadioFilter from '@components/BrowsePage/SearchPanel/RadioFilter';
import CategoriesMenuBrowseHOC from '@components/BrowsePage/SearchPanel/CategoriesMenuBrowseHOC';

import './SearchPanel.scss';

const SearchPanel = ({
	getStartupFilter,
	getCountries,
	countries,
	countryIds,
	tags,
	getAllTags,
	allTags,
	companyType,
	narrowCategory,
	setDefaultFieldForFilter,
}) => {
	useEffect(() => {
		if (isEmpty(countries)) getCountries();
	}, [getCountries, countries]);

	useEffect(() => {
		if (isEmpty(allTags)) getAllTags();
	}, [getAllTags, allTags]);

	const onClearHandler = () => {
		setDefaultFieldForFilter();
		getStartupFilter();
	};

	return (
		<div className='search-bar-menu'>
			<CategoriesMenuBrowseHOC/>
			<div className='search-bar-filters-container'>
				<div className='subheader'>
					Advanced filters
				</div>
				<ToggleSection
					isFullWidth
					isWhiteArrow
					button={
						<P14 className='text-white' bold>
							{narrowCategories.title}
						</P14>
					}
				>
					<div>
						<RadioFilter
							fieldName={narrowCategories.name}
							fields={narrowCategories.values}
							checkedValue={narrowCategory}
						/>
					</div>
				</ToggleSection>
				<P16 className='separator-line' bold>
					Startup Parameters
				</P16>
				<ToggleSection
					isFullWidth
					isWhiteArrow
					button={
						<P14 className='text-white' bold>
							Country
						</P14>
					}
				>
					<div>
						<MultiselectFilter
							options={countries}
							placeholder='Countries'
							selectedValues={countryIds}
							fieldName='countryIds'
						/>
					</div>
				</ToggleSection>
				<ToggleSection
					isFullWidth
					isWhiteArrow
					button={
						<P14 className='text-white' bold>
							Startup found
						</P14>
					}
				>
					<div>
						<Found/>
					</div>
				</ToggleSection>
				<ToggleSection
					isFullWidth
					isWhiteArrow
					button={
						<P14 className='text-white' bold>
							Company type
						</P14>
					}
				>
					<div>
						<MultiselectFilter
							options={companyTypeOptions}
							placeholder='Select company type'
							selectedValues={companyType}
							fieldName='companyType'
							keyValue='value'
						/>
					</div>
				</ToggleSection>
				{
					Object.keys(checkboxFields).map((key, i) => {
						const { title, name, values } = checkboxFields[key];

						return (
							<ToggleSection
								key={`${i}${key}`}
								isFullWidth
								isWhiteArrow
								button={
									<P14 className='text-white' bold>
										{title}
									</P14>
								}
							>
								<div>
									<CheckboxFilters fieldName={name} fields={values}/>
								</div>
							</ToggleSection>
						);
					})
				}
				<ToggleSection
					isFullWidth
					isWhiteArrow
					button={
						<P14 className='text-white' bold>
							Associated tags
						</P14>
					}
				>
					<div>
						<MultiselectFilter
							options={allTags}
							placeholder='Add a tag'
							selectedValues={tags}
							fieldName='tags'
							keyValue='value'
							isAssociatedTag
						/>
					</div>
				</ToggleSection>
				<P14 className='clear-link' onClick={onClearHandler}>
					Clear all
				</P14>
			</div>
		</div>
	);
};

SearchPanel.propTypes = {
	getStartupFilter: func.isRequired,
	getCountries: func.isRequired,
	getAllTags: func.isRequired,
	countries: array,
	countryIds: array.isRequired,
	companyType: array.isRequired,
	tags: array.isRequired,
	allTags: array.isRequired,
	extremesForRanges: extremesForRangesTypes,
	narrowCategory: string,
	setDefaultFieldForFilter: func.isRequired,
};

SearchPanel.defaultProps = {
	countries: [],
	narrowCategory: '',
};

const mapStateToProps = ({ common: { countries, tags }, browse: { filterCategories, extremesForRanges } }) => ({
	countries,
	countryIds: filterCategories.countryIds,
	companyType: filterCategories.companyType,
	tags: filterCategories.tags,
	allTags: tags,
	extremesForRanges,
	narrowCategory: filterCategories.narrowCategories,
});

export default connect(mapStateToProps, {
	getStartupFilter,
	getCountries,
	getAllTags,
	setDefaultFieldForFilter,
})(memo(SearchPanel));
