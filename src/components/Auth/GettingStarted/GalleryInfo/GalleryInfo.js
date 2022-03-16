import React from 'react';
import { func } from 'prop-types';
import Gallery from '@components/_shared/Gallery';
import { saveGallery, logOut } from '@ducks/auth/actions';
import { connect } from 'react-redux';
import { userType } from '@constants/types';
import enums from '@constants/enums';
import { redirectToCorrectPageByStatus } from '@components/Auth/utils';

const GalleryHOC = ({ user, saveGallery, logOut }) => {
	if (!!user && user.status !== enums.gettingStartedStatuses.companyInfo) return redirectToCorrectPageByStatus(user);

	return (
		<Gallery
			isSkipButton
			saveGallery={saveGallery}
			user={user}
			logOut={logOut}
			currentStepsText='Step 3 of 6'
		/>
	);
};

GalleryHOC.propTypes = {
	user: userType,
	saveGallery: func,
	logOut: func,
};

const mapStateToProps = ({ auth: { user } }) => ({ user });

export default connect(mapStateToProps, {
	saveGallery,
	logOut,
})(GalleryHOC);
