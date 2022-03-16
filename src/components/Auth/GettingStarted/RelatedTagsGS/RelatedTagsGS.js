import React, { memo, useEffect } from 'react';
import { connect } from 'react-redux';
import { array, bool, func } from 'prop-types';
import { redirectToCorrectPageByStatus } from '@components/Auth/utils';
import enums from '@constants/enums';
import { sendRelatedTags } from '@ducks/auth/actions';
import { getAllTags } from '@ducks/common/actions';
import { userType } from '@constants/types';
import { schema } from './schema';
import RelatedTags from '@components/Auth/GettingStarted/RelatedTags';

function RelatedTagsHOC({
	isLoading,
	sendRelatedTags,
	tags,
	getAllTags,
	user,
}) {
	useEffect(() => {
		if (!tags.length) getAllTags();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const onSubmit = values => sendRelatedTags({
		tags: values.relatedTags.map(item => item.label),
	});

	const redirectToFinalPage = () => sendRelatedTags({ tags: [] });

	if (!!user && user.status !== enums.gettingStartedStatuses.areasOfInterest) redirectToCorrectPageByStatus(user);

	return (
		<div>
			<RelatedTags
				schema={schema}
				isLoading={isLoading}
				onSubmit={onSubmit}
				redirectToFinalPage={redirectToFinalPage}
				tags={tags}
				stepText='Step 6 of 6'
			/>
		</div>
	);
}

RelatedTagsHOC.propTypes = {
	isLoading: bool,
	sendRelatedTags: func.isRequired,
	getAllTags: func.isRequired,
	tags: array,
	user: userType,
};

RelatedTags.defaultProps = {
	tags: [],
};

const mapStateToProps = ({ auth: { isLoading, user }, common: { tags } }) => ({
	isLoading,
	tags,
	user,
});

export default connect(mapStateToProps, {
	sendRelatedTags,
	getAllTags,
})(memo(RelatedTagsHOC));
