export const uint8ArrayToUtf8 = uint8Array => {
	const utf8decoder = new TextDecoder();

	return JSON.parse(utf8decoder.decode(uint8Array));
};
