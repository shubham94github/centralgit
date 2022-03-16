export default function replaceBreakLinesWithAsterisk(string) {
	return string.replace(/\n\n\*\*/g, '**');
}
