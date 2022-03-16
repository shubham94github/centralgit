import { colors } from '@colors';

export const prepareSelectStyles = {
	control: (base, state) => {
		const backgroundColor = state.isDisabled ? colors.gray10 : colors.white;
		const borderRadius = state.menuIsOpen ? '4px 4px 0px 0px' : '4px';
		const border = state.isDisabled ? `1px solid ${colors.gray40}` : `1px solid ${colors.darkblue20}`;

		return {
			...base,
			backgroundColor,
			borderRadius,
			border,
			height: '35px',
			boxShadow: 'none',
			padding: '0',

			'&:hover': {
				border: `1px solid ${colors.darkblue20}`,
			},
		};
	},
	singleValue: base => ({
		...base,
		paddingTop: '0',
	}),
};
