export const getUserRestriction = (type, maxMembers) => {
	switch (type) {
		case 'SINGLE_USER': return 'Single Account';
		case 'MULTI_USER':
		case 'ENTERPRISE': return `up to ${maxMembers} Accounts`;
		default: return;
	}
};

export const getFormattedPrice = price => price % 1 === 0 ? price :Number(price).toFixed(2);

