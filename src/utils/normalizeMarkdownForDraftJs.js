import replaceBreakLinesWithAsterisk from '@utils/replaceBreakLinesWithAsterisk';

export function normalizeMarkdownForDraftJs(str) {
	return replaceBreakLinesWithAsterisk(str.replace(/<ins>/g, '<u>').replace(/<\/ins>/g, '</u>'));
}
