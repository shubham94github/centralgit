import React, { memo, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { array, bool, func } from 'prop-types';
import { updateRelatedTags } from '@ducks/settings/actions';
import { getAllTags } from '@ducks/common/actions';
import { userType } from '@constants/types';
import { schema } from './schema';
import RelatedTags from '@components/Auth/GettingStarted/RelatedTags';

function RelatedTagsHOC({
	isLoading,
	updateRelatedTags,
	tags,
	getAllTags,
	chosenTags,
}) {
	const [userTags, setUserTags] = useState([]);

	useEffect(() => {
		if (!tags.length) getAllTags();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (chosenTags?.length && tags?.length) {
			const items = tags.filter(tag => chosenTags.includes(tag.name));

			setUserTags(items);
		}
	}, [chosenTags, tags]);

	const onSubmit = values => updateRelatedTags({
		tags: values.relatedTags.map(item => item.label),
	});

	return (
		<div>
			<RelatedTags
				schema={schema}
				isLoading={isLoading}
				onSubmit={onSubmit}
				tags={tags}
				userTags={userTags}
			/>
		</div>
	);
}

RelatedTagsHOC.propTypes = {
	isLoading: bool,
	updateRelatedTags: func.isRequired,
	getAllTags: func.isRequired,
	tags: array,
	user: userType,
	chosenTags: array,
};

RelatedTags.defaultProps = {
	tags: [],
};

const mapStateToProps = ({ auth: { isLoading, user }, common: { tags } }) => ({
	isLoading,
	tags,
	chosenTags: user?.startup?.tags,
});

export default connect(mapStateToProps, {
	updateRelatedTags,
	getAllTags,
})(memo(RelatedTagsHOC));
