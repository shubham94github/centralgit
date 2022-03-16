import { useEffect, useState } from 'react';
import { getAuthorityCountById,
	getAuthorityWithPermissions,
	getAuthorityWithPermissionsForProfile,
} from '@api/adminApi';
import { useLocation } from 'react-router-dom';

export const useGetAuthorities = ({ wasUpdatedBackend = false, setWasUpdatedBackend, setSnackbar }) => {
	const location = useLocation();
	const [authorities, setAuthorities] = useState();
	const [permissions, setPermissions] = useState();
	const [counts, setCounts] = useState();
	const [isLoading, setIsLoading] = useState(false);
	const isActivityProfiles = location.pathname.includes('/activity/profiles');

	useEffect(() => {
		const getAuthorities = async () => {
			if (authorities && !wasUpdatedBackend) return;

			try {
				setIsLoading(true);

				const authorityWithPermissionsApi = isActivityProfiles
					? getAuthorityWithPermissionsForProfile
					: getAuthorityWithPermissions;

				const { authorities, permissions } = await authorityWithPermissionsApi();

				setAuthorities(authorities);
				setPermissions(permissions);

				const countRes = await Promise.all(authorities.items.map(authority =>
					getAuthorityCountById(authority.id)));

				setCounts(countRes.map((item, i) => ({ count: item.count, id: authorities.items[i].id })));
			} catch (e) {
				setSnackbar({
					type: 'error',
					text: `Something went wrong. Please try again later. Error message - ${e.message}`,
				});
			} finally {
				if (setWasUpdatedBackend) setWasUpdatedBackend(false);
				setIsLoading(false);
			}
		};

		getAuthorities();
	}, [authorities, setSnackbar, setWasUpdatedBackend, wasUpdatedBackend, isActivityProfiles]);

	return { authorities, permissions, counts, isLoading, setIsLoading };
};
