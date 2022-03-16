import React, { memo, useEffect } from 'react';
import { func, number } from 'prop-types';
import Gallery from '@components/_shared/Gallery';
import { connect } from 'react-redux';
import { saveGallery } from '@ducks/settings/actions';
import { logOut, getProfile } from '@ducks/auth/actions';
import { profileStartupType } from '@constants/types';

import './GalleryInfo.scss';

const SettingGalleryHOC = ({ saveGallery, logOut, user, userId, getProfile }) => {
	const defaultValues = {
		videoLink: user?.startup.marketingVideo?.link,
		videoDescription: user?.startup.marketingVideo?.description,
		videoTitle: user?.startup.marketingVideo?.title,
		documents: user?.startup.documents,
		videoId: user?.startup.marketingVideo?.id,
	};

	const handleSaveGallery = async galleryData => {
		await saveGallery({ galleryData, id: user.startup.id });
	};

	useEffect(() => {
		if (!user && userId) getProfile(userId);
	}, [getProfile, user, userId]);

	return (
		<div className='settings-panel-gallery'>
			<Gallery
				saveGallery={handleSaveGallery}
				logOut={logOut}
				defaultValues={defaultValues}
				isSkipButton={false}
				isInputsWithBorder={false}
				isResetButton
			/>
		</div>
	);
};

SettingGalleryHOC.propTypes = {
	saveGallery: func,
	logOut: func,
	user: profileStartupType,
	getProfile: func.isRequired,
	userId: number,
};

const mapStateToProps = ({ auth: { user } }) => {
	return {
		userId: user?.id,
		user,
	};
};

export default connect(mapStateToProps, {
	saveGallery,
	logOut,
	getProfile,
})(memo(SettingGalleryHOC));
