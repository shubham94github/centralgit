import React, { memo } from 'react';
import { connect } from 'react-redux';
import { Icons } from '@icons';
import { colors } from '@colors';
import { P14 } from '@components/_shared/text';
import PrimaryButton from '@components/_shared/buttons/PrimaryButton';
import { bool, func } from 'prop-types';

import './ManageCategoriesHeader.scss';

const infoIcon = Icons.infoIcon(colors.grass50);
const plusIcon = Icons.plus(colors.white);

const ManageCategoriesHeader = ({
	toggleModal,
	isCategoryEditPermission,
}) => (
	<div className='categories-header'>
		<div className='description'>
			{infoIcon}
			<P14>
				This section displays the list of categories based on approved structure.
				Various actions (<b>add, edit, delete, show/hide</b>) related to
				each category can be performed in this section.
			</P14>
		</div>
		{isCategoryEditPermission
			&& <PrimaryButton onClick={toggleModal}>
				{plusIcon}
				Add new Category
			</PrimaryButton>
		}
	</div>
);

ManageCategoriesHeader.propTypes = {
	toggleModal: func.isRequired,
	isCategoryEditPermission: bool,
};

export default connect(({ auth }) => {
	const { listOfPermissions } = auth;

	return {
		isCategoryEditPermission: listOfPermissions?.isCategoryEditPermission,
	};
})(memo(ManageCategoriesHeader));
