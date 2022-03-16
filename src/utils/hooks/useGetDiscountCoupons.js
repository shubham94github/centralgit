import { useEffect, useState } from 'react';
import { fetchDiscountCoupons } from '@api/adminApi';
import { deepEqual, isEmpty } from '@utils/js-helpers';
import usePrevious from '@utils/hooks/usePrevious';
import { invalidTokenErr } from '@components/AdminPanel/SubscriptionPlans/DiscountCoupons/constants';

export const useGetDiscountCoupons = ({
	wasUpdatedBackend = false,
	setWasUpdatedBackend,
	setSnackbar,
	tableMeta,
	logOut,
}) => {
	const [discountCoupons, setDiscountCoupons] = useState([]);
	const [isLoading, setIsLoading] = useState(false);

	const prevTableMeta = usePrevious(tableMeta);

	useEffect(() => {
		const getDiscountCoupons = async () => {
			if ((!isEmpty(discountCoupons) && !wasUpdatedBackend) && (deepEqual(prevTableMeta, tableMeta))) return;

			try {
				setIsLoading(true);

				const res = await fetchDiscountCoupons(tableMeta.code);

				setDiscountCoupons(res.items);
			} catch (e) {
				if (e.error === invalidTokenErr || e?.response?.status === 401) logOut();

				setSnackbar({
					type: 'error',
					text: `Something went wrong. Please try again later. Error message - ${e.message}`,
				});
			} finally {
				if (wasUpdatedBackend) setWasUpdatedBackend(false);
				setIsLoading(false);
			}
		};

		if (!isLoading)	getDiscountCoupons();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [setSnackbar, tableMeta, setWasUpdatedBackend, wasUpdatedBackend]);

	return { isLoading, setIsLoading, discountCoupons };
};
