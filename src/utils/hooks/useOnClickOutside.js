import { useEffect } from 'react';

export function useOnClickOutside(arrayOfRef = [], handler, isDisableClickOutside) {
	useEffect(
		() => {
			const listener = e => {
				const filteredArrayOfRef = arrayOfRef.filter(ref => ref.current);

				if (!filteredArrayOfRef) return;

				const isRefClicked = filteredArrayOfRef.some(({ current }) =>
					!current || current?.contains(e.target));

				if (isRefClicked || isDisableClickOutside) return;

				handler(e);
			};

			document.addEventListener('mousedown', listener);
			document.addEventListener('touchstart', listener);

			return () => {
				document.removeEventListener('mousedown', listener);
				document.removeEventListener('touchstart', listener);
			};
		},
		[arrayOfRef, handler, isDisableClickOutside],
	);
}

