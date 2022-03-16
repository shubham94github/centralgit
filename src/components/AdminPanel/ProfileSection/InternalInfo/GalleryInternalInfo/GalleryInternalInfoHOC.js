import React from 'react';
import { bool, func } from 'prop-types';
import Gallery from '@components/_shared/Gallery';
import { connect } from 'react-redux';
import { saveInternalGallery } from '@ducks/admin/actions';
import { profileStartupType } from '@constants/types';
import { logOut } from '@ducks/auth/actions';

function GalleryInternalInfoHoc({
	logOut,
	saveInternalGallery,
	profile,
	isStartupsEditInternalPermission,
}) {
	const handleSaveGallery = async galleryData => {
		await saveInternalGallery({ ...galleryData, id: profile.id });
	};

	const defaultValues = {
		videoLink: profile.startup.interviewVideo?.link,
		videoDescription: profile.startup.interviewVideo?.description,
		videoTitle: profile.startup.interviewVideo?.title,
		documents: profile.startup.documents,
		videoId: profile.startup.interviewVideo?.id,
	};

	return (
		<div className='gallery-internal-info'>
			<Gallery
				saveGallery={handleSaveGallery}
				logOut={logOut}
				defaultValues={defaultValues}
				isSkipButton={false}
				isResetButton={false}
				isFileUploading={false}
				isStartupsEditPermission={isStartupsEditInternalPermission}
				isInputsWithBorder
			/>
		</div>
	);
}

GalleryInternalInfoHoc.propTypes = {
	saveInternalGallery: func,
	logOut: func,
	profile: profileStartupType,
	isStartupsEditInternalPermission: bool,
};

const mapStateToProps = ({ admin: { profile }, auth }) => {
	const { listOfPermissions } = auth;

	return ({
		profile,
		isStartupsEditInternalPermission: listOfPermissions?.isStartupsEditInternalPermission,
	});
};

export default connect(mapStateToProps, {
	saveInternalGallery,
	logOut,
})(GalleryInternalInfoHoc);
