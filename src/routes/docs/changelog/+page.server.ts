import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { Marked } from 'marked';
import markedShiki from 'marked-shiki';
import { getHighlighter } from '$lib/highlight.server';
import { headingIds } from '$lib/markdown/heading-ids';
import type { PageServerLoad } from './$types';

const CHANGELOG_PATH = resolve('klaudiush/CHANGELOG.md');

export const load: PageServerLoad = async () => {
	const content = await readFile(CHANGELOG_PATH, 'utf-8');

	// Strip the H1 title and preamble (first 6 lines)
	const lines = content.split('\n');
	const body = lines.slice(6).join('\n');

	const highlighter = await getHighlighter();
	const marked = new Marked();
	marked.use(
		markedShiki({
			highlight(code, lang) {
				return highlighter.codeToHtml(code, {
					lang: lang || 'text',
					theme: 'github-light'
				});
			}
		}),
		headingIds()
	);

	const html = await marked.parse(body);

	return { html };
};
