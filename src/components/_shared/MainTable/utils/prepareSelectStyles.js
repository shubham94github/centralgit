import { colors } from '@colors';

const prepareSelectStyles = () => (
	{
		control: (base, state) => {
			const borderRadius = state.menuIsOpen ? '8px 8px 0px 0px' : '8px';
			const border = state.isDisabled ? `1px solid ${colors.gray40}` : `1px solid ${colors.darkblue20}`;

			return {
				...base,
				borderRadius,
				border,
				height: '50px',
				width: '190px',
				boxShadow: 'none',

				'&:hover': {
					border: `1px solid ${colors.darkblue20}`,
				},
			};
		},
		singleValue: base => ({
			...base,
			color: colors.darkblue70,
		}),
		menu: base => ({
			...base,
			width: '190px',
			margin: '0',
			zIndex: 2,
			borderRadius: '0',
			border: `1px solid ${colors.darkblue20}`,
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
