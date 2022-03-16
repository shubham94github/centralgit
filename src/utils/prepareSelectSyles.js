import { colors } from '@colors';

const prepareSelectStyles = () => (
	{
		control: (base, state) => {
			const borderRadius = state.menuIsOpen ? '8px 8px 0px 0px' : '8px';

			return {
				...base,
				borderRadius,
				width: 'auto',
				height: '50px',
				boxShadow: 'none',
				border: 'none',
			};
		},
		'select-top-placeholder': () => ({
			display: 'none',
		}),
		singleValue: base => ({
			...base,
			color: colors.darkblue70,
			paddingTop: 0,
		}),
		menu: base => ({
			...base,
			margin: '0',
			zIndex: 2,
			borderRadius: '0',
			borderTop: 'none',
			boxShadow: 'none',
		}),
		option: (base, state) => {
			const backgroundColor = state.isSelected ? colors.grass20 : colors.white;

			return {
				...base,
				backgroundColor,
				padding: '6px',
				color: colors.darkblue70,

				'&:hover': {
					background: colors.grass10,
				},
			};
		},
	}
);

export default prepareSelectStyles;
