import React, { useEffect, useState } from 'react';
import { func, string } from 'prop-types';
import cn from 'classnames';
import { useDelayUnmount } from '@utils/hooks/useDelayUnmount';

import './Snackbar.scss';

function Snackbar({ onClick, id, type, text }) {
	const [isMounted, setIsMounted] = useState(true);
	const shouldRender = useDelayUnmount(isMounted, 100);

	const deleteSnackbar = () => setIsMounted(!isMounted);

	useEffect(() => {
		if (!isMounted) {
			setTimeout(() => {
				onClick(id);
			}, 100);
		}
	}, [id, isMounted, onClick]);

	return shouldRender && (
		<div
			className={cn(`snackbar ${type}Type`, {
				'removeSnackbar': !isMounted,
			})}
			onClick={deleteSnackbar}
		>
			{text}
		</div>
	);
}

Snackbar.propTypes = {
	onClick: func.isRequired,
	id: string.isRequired,
	type: string.isRequired,
	text: string.isRequired,
};

export default Snackbar;
