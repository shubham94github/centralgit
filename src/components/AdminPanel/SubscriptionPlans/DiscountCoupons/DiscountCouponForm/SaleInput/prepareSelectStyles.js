import { colors } from '@colors';

const prepareSelectStyles = () => ({
	control: (base, state) => {
		const borderRadius = state.menuIsOpen ? '0px 8px 0px 0px' : '0px 8px 8px 0px';
		const backgroundColor = state.isDisabled ? colors.gray10 : colors.white;

		return {
			...base,
			borderRadius,
			border: 'none',
			height: '50px',
			boxShadow: 'none',
			backgroundColor,

			'&:hover': {
				border: `none`,
			},
		};
	},
	singleValue: (base, state) => {
		const color = state.isDisabled ? colors.gray40 : colors.darkblue70;

		return ({
			...base,
			color,
			marginTop: '4px',
		});
	},
	menu: base => ({
		...base,
		margin: '0',
		zIndex: 4,
		borderRadius: '0',
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
});

export default prepareSelectStyles;
