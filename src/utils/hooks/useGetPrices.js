import { useEffect, useState } from 'react';
import { getPrices } from '@api/subscriptionPansApi';

export const useGetPrices = ({ wasUpdatedBackend = false, setWasUpdatedBackend, setSnackbar }) => {
	const [prices, setPrices] = useState();
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		const fetchPrices = async () => {
			if (prices && !wasUpdatedBackend) return;

			try {
				setIsLoading(true);

				const { items } = await getPrices();

				setPrices(items);
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

		fetchPrices();
	}, [prices, setSnackbar, setWasUpdatedBackend, wasUpdatedBackend]);

	return { isLoading, prices };
};
