import React from 'react';
import { bool, func } from 'prop-types';
import Gallery from '@components/_shared/Gallery';
import { saveGallery } from '@ducks/admin/actions';
import { connect } from 'react-redux';
import { logOut } from '@ducks/auth/actions';
import { profileStartupType } from '@constants/types';

import './GalleryInfo.scss';

const GalleryHOC = ({ saveGallery, logOut, profile, isLoading, isStartupsEditGalleryPermission }) => {
	const defaultValues = {
		videoLink: profile.startup.marketingVideo?.link,
		videoDescription: profile.startup.marketingVideo?.description,
		videoTitle: profile.startup.marketingVideo?.title,
		documents: profile.startup.documents,
		videoId: profile.startup.marketingVideo?.id,
	};

	const handleSaveGallery = async galleryData => await saveGallery({ galleryData, id: profile.id });

	return (
		<div className='admin-panel-gallery'>
			<Gallery
				parentIsLoading={isLoading}
				saveGallery={handleSaveGallery}
				logOut={logOut}
				defaultValues={defaultValues}
				isSkipButton={false}
				isStartupsEditPermission={isStartupsEditGalleryPermission}
				isInputsWithBorder
			/>
		</div>
	);
};

GalleryHOC.propTypes = {
	saveGallery: func,
	logOut: func,
	profile: profileStartupType,
	isLoading: bool,
	isStartupsEditGalleryPermission: bool,
};

const mapStateToProps = ({ admin: { profile, isLoading }, auth }) => {
	const { listOfPermissions } = auth;

	return ({
		profile,
		isLoading,
		isStartupsEditGalleryPermission: listOfPermissions?.isStartupsEditGalleryPermission,
	});
};

export default connect(mapStateToProps, {
	saveGallery,
	logOut,
})(GalleryHOC);
