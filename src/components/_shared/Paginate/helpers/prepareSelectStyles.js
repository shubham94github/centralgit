import { colors } from '@colors';

export const PrepareSelectPageStyles = {
	control: (base, state) => {
		const backgroundColor = state.isDisabled ? colors.gray10 : colors.white;
		const borderRadius = state.menuIsOpen ? '0px 0px 6px 6px' : '6px';
		const border = state.isDisabled ? `1px solid ${colors.gray40}` : `1px solid ${colors.grass50}`;

		return {
			...base,
			backgroundColor,
			borderRadius,
			border,
			height: '40px',
			minWidth: '50px',
			width: 'auto',
			boxShadow: 'none',
			padding: '0px',
			display: 'flex',
			justifyContent: 'center',
			alignItems: 'center',

			'&:hover': {
				border: `1px solid ${colors.darkblue20}`,
			},
		};
	},
	singleValue: base => ({
		...base,
		padding: '0px',
	}),
	dropdownIndicator: () => ({
		display: 'none',
	}),
	indicatorsContainer: () => ({
		display: 'none',
	}),
	indicatorSeparator: () => ({
		display: 'none',
	}),
	valueContainer: () => ({
		padding: '0px',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
	}),
	menu: base => ({
		...base,
		margin: '0',
		minWidth: '50px',
		width: 'auto',
	}),
};

export const prepareSelectCountOfRecordsStyles = {
	control: (base, state) => {
		const backgroundColor = state.isDisabled ? colors.gray10 : colors.white;
		const borderRadius = state.menuIsOpen ? '6px 6px 0px 0px' : '6px';
		const border = state.isDisabled ? `1px solid ${colors.gray40}` : `1px solid ${colors.grass50}`;

		return {
			...base,
			backgroundColor,
			borderRadius,
			border,
			height: '40px',
			minWidth: '60px',
			width: 'auto',
			boxShadow: 'none',
			paddingLeft: '10px',
			display: 'flex',
			justifyContent: 'center',
			alignItems: 'center',

			'&:hover': {
				border: `1px solid ${colors.darkblue20}`,
			},
		};
	},
	singleValue: base => ({
		...base,
	}),
	indicatorSeparator: () => ({
		display: 'none',
	}),
	valueContainer: () => ({
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
	}),
	menu: base => ({
		...base,
		margin: '0',
		minWidth: '60px',
		width: 'auto',
	}),
};
