import { editorIcons } from '@components/_shared/form/EditorTextArea/constants';

const { italic, underline, bold, bulletList, orderedList } = editorIcons;

export function overwriteDefaultQuillIcons(icons) {
	icons.italic = italic;
	icons.underline = underline;
	icons.bold = bold;
	icons.list.bullet = bulletList;
	icons.list.ordered = orderedList;
}
