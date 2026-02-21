import type { MarkedExtension } from 'marked';

function slugify(text: string): string {
	return text
		.replace(/<[^>]*>/g, '')
		.toLowerCase()
		.trim()
		.replace(/[^\w\s-]/g, '')
		.replace(/[\s_]+/g, '-')
		.replace(/^-+|-+$/g, '');
}

export function headingIds(): MarkedExtension {
	const used = new Map<string, number>();

	return {
		renderer: {
			heading({ text, depth }) {
				let id = slugify(text);
				const count = used.get(id) || 0;
				used.set(id, count + 1);
				if (count > 0) id = `${id}-${count}`;
				return `<h${depth} id="${id}">${text}</h${depth}>\n`;
			}
		}
	};
}
