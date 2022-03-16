import { colors } from '@colors';

export const prepareSelectStyles = () => (
	{
		option: (base, state) => {
			const backgroundColor = state.isSelected ? colors.grass20 : colors.white;

			return {
				...base,
				backgroundColor,
				padding: '6px',
				color: colors.darkblue70,
				overflow: 'hidden',
				textOverflow: 'ellipsis',
				whiteSpace: 'nowrap',

				'&:hover': {
					background: colors.grass10,
				},
			};
		},
		multiValue: base => ({
			...base,
			maxWidth: '400px',
		}),
	}
);
