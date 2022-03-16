import { useEffect, useState } from 'react';
import { fetchAdminUsers } from '@api/adminApi';
import { downloadUserAvatar } from '@api/fileUploadingApi';
import usePrevious from '@utils/hooks/usePrevious';
import { deepEqual, isEmpty } from '@utils/js-helpers';
import { invalidTokenErr } from '@ducks/common/sagas';

export const useGetAdminUsers = ({
	wasUpdatedBackend = false,
	setWasUpdatedBackend,
	setSnackbar,
	tableMeta,
	filter,
	queryFilter,
	logOut,
}) => {
	const [adminUsers, setAdminUsers] = useState([]);
	const [counts, setCounts] = useState(0);
	const [isLoading, setIsLoading] = useState(false);

	const prevTableMeta = usePrevious(tableMeta);
	const prevFilter = usePrevious(filter);

	useEffect(() => {
		const getAdminUsers = async () => {
			if ((!isEmpty(adminUsers) && !wasUpdatedBackend) && (deepEqual(prevTableMeta, tableMeta))
				&& (deepEqual(prevFilter, filter))) return;

			try {
				setIsLoading(true);

				const res = await fetchAdminUsers(
					tableMeta,
					(isEmpty(adminUsers) && queryFilter)
						? filter.find(item => item.fieldName === queryFilter.fieldName)
							? filter.map(item => item.fieldName === queryFilter.fieldName ? queryFilter : item)
							: [...filter, queryFilter]
						: filter,
				);

				const avatars = await Promise.all(
					res.items
						.map(user => {
							if (!user.avatar30) return Promise.resolve();

							return downloadUserAvatar(user.avatar30.id);
						}),
				);

				setAdminUsers(res.items.map((user, i) => ({ ...user, avatar: { image: avatars[i] } })));
				setCounts(res.size);
			} catch (error) {
				if (error.error === invalidTokenErr || error?.response?.status === 401)
					logOut();

				setSnackbar({
					type: 'error',
					text: `Something went wrong. Please try again later. Error message - ${error.message}`,
				});
			} finally {
				if (setWasUpdatedBackend) setWasUpdatedBackend(false);
				setIsLoading(false);
			}
		};

		if (!isLoading) getAdminUsers();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [setSnackbar, setWasUpdatedBackend, wasUpdatedBackend, tableMeta, filter]);

	return { counts, isLoading, setIsLoading, adminUsers };
};
