export function replaceAllDotsExceptFirst(str) {
	return str.replace( /^([^.]*\.)(.*)$/, (_, p1, p2) => {
		return p1 + p2.replace( /\./g, '');
	});
}
