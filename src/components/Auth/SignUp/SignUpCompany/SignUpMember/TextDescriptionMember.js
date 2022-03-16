import React, { memo } from 'react';
import { P14 } from '@components/_shared/text';
import { bool, func } from 'prop-types';
import { signUpFormTypes } from '@constants/types';

const TextDescriptionMember = ({
	isIndividuals,
	completedFormData,
	goBackToBusinessType,
	resetMemberSettings,
}) => {
	const brandName = completedFormData?.companyShortName;
	const emailDomain = completedFormData?.emailDomain;

	return (
		<P14>
			{isIndividuals
				? <>
					The Company <b>{brandName}</b> already exists in the app. Do you want to join as a member?
					Otherwise go back and change Brand name.
				</>
				: <>
					The Company <b>{brandName}</b> with the same <b>{emailDomain}</b> Email Domain already exists in the
					app. You can join <b>{brandName}</b> as a member. Otherwise change&nbsp;
					<span
						onClick={resetMemberSettings}
						className='blue-link'>
					Brand Name
					</span>
					&nbsp;or&nbsp;
					<span
						onClick={goBackToBusinessType}
						className='blue-link'>
						Email domain
					</span>.
				</>
			}
		</P14>
	);
};

TextDescriptionMember.propTypes = {
	resetMemberSettings: func.isRequired,
	isIndividuals: bool.isRequired,
	completedFormData: signUpFormTypes,
	goBackToBusinessType: func.isRequired,
};

export default memo(TextDescriptionMember);
