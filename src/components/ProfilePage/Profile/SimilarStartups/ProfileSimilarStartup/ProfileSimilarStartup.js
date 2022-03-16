import React, { memo, useCallback } from 'react';
import { number, object, string } from 'prop-types';
import Avatar from '@components/_shared/Avatar';
import Markdown from 'markdown-to-jsx';
import { H2 } from '@components/_shared/text';
import { useHistory } from 'react-router-dom';

import './ProfileSimilarStartup.scss';

const ProfileSimilarStartup = ({
	id,
	companyShortName,
	companyDescription,
	logo120,
}) => {
	const history = useHistory();
	const onClickStartupHandler = useCallback(() => history.push(`/profile/startup/${id}`), [history, id]);

	return (
		<div className='profile-similar-startup-wrapper'>
			<div
				onClick={onClickStartupHandler}
				className='img-similar-startup'
			>
				<Avatar logo={logo120}/>
			</div>
			<div>
				<H2
					className='company-short-name'
					bold
				>
					<span onClick={onClickStartupHandler}>{companyShortName}</span>
				</H2>
				{!!companyDescription
					&& <div className='company-description' >
						<Markdown options={{ forceInline: true, wrapper: 'div' }}>
							{companyDescription}
						</Markdown>
					</div>
				}
			</div>
		</div>
	);
};

ProfileSimilarStartup.propTypes = {
	id: number.isRequired,
	companyShortName: string,
	companyDescription: string,
	logo120: object.isRequired,
};

ProfileSimilarStartup.defaultProps = {
	companyShortName: '',
	companyDescription: '',
};

export default memo(ProfileSimilarStartup);
