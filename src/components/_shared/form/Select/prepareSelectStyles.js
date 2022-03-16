import { colors } from '@colors';

const PrepareSelectStyles = (isError, isBorder, isTopPlaceholder, isAssociatedTags) => ({
	control: (base, state) => {
		const backgroundColor = state.isDisabled ? colors.gray10 : colors.white;
		const borderRadius = state.menuIsOpen ? '8px 8px 0px 0px' : '8px';
		const border = state.isDisabled ? `1px solid ${colors.gray40}` : `1px solid ${colors.darkblue20}`;

		return {
			...base,
			backgroundColor,
			borderRadius,
			border: isBorder ? border : 'none',
			minHeight: '50px',
			boxShadow: 'none',
			padding: '0',

			'&:hover': {
				border: isBorder ? `1px solid ${colors.darkblue20}` : 'none',
			},
		};
	},
	indicatorSeparator: () => ({}),
	singleValue: (base, state) => {
		const color = state.isDisabled ? colors.gray40 : colors.black;

		return ({
			...base,
			fontFamily: 'Montserrat',
			fontSize: '16px',
			lineHeight: '24px',
			fontWeight: 400,
			color,
			paddingLeft: '2px',
			paddingTop: isTopPlaceholder ? '15px' : '0px',
			margin: 0,
		});
	},
	input: base => ({
		...base,
		position: 'relative',
		top: isTopPlaceholder ? '6px' : undefined,
	}),
	clearIndicator: base => {
		return {
			...base,
			position: 'relative',
			left: '36px',
			background: 'white',
			borderRadius: '4px',
			marginRight: '5px',
			paddingRight: '2px',
		};
	},
	placeholder: base => ({
		...base,
		color: isError ? colors.red50 : colors.gray40,
		whiteSpace: 'nowrap',
	}),
	menu: base => ({
		...base,
		margin: '0',
		zIndex: 4,
	}),
	menuList: base => ({
		...base,
		scrollbarWidth: 'thin',
	}),
	option: (base, state) => {
		const backgroundColor = state.isSelected ? colors.grass50 : colors.white;
		const color = state.isSelected ? colors.white : colors.darkblue70;

		return {
			...base,
			backgroundColor,
			color,
			padding: '6px',

			'&:hover': {
				background: colors.grass10,
				color: colors.darkblue70,
			},
		};
	},
	multiValue: (base, state) => {
		const backgroundColor = state.isDisabled ? colors.gray05 : colors.gray10;

		return {
			...base,
			borderRadius: '4px',
			backgroundColor,
		};
	},
	multiValueRemove: (base, state) => {
		const color = state.isDisabled ? colors.gray40 : colors.black;

		return {
			...base,
			color,
		};
	},
	multiValueLabel: base => ({
		...base,
		textTransform: isAssociatedTags ? 'uppercase' : 'unset',
	}),
});

export default PrepareSelectStyles;
