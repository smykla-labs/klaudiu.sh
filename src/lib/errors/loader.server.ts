import { readFile, readdir } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { Marked } from 'marked';
import markedShiki from 'marked-shiki';
import { createHighlighter } from 'shiki';
import { isValidErrorCode, parseCategory, parseTitleFromMarkdown, type ErrorDoc } from './index';

const ERRORS_DIR = resolve('klaudiush/docs/errors');

let highlighterPromise: ReturnType<typeof createHighlighter> | null = null;

function getHighlighter() {
	if (!highlighterPromise) {
		highlighterPromise = createHighlighter({
			themes: ['github-light'],
			langs: [
				'bash',
				'shell',
				'json',
				'yaml',
				'toml',
				'go',
				'typescript',
				'javascript',
				'python',
				'hcl',
				'dockerfile',
				'markdown'
			]
		});
	}
	return highlighterPromise;
}

async function getMarkedInstance() {
	const highlighter = await getHighlighter();
	const instance = new Marked();
	instance.use(
		markedShiki({
			highlight(code, lang) {
				return highlighter.codeToHtml(code, {
					lang: lang || 'text',
					theme: 'github-light'
				});
			}
		})
	);
	return instance;
}

export async function getAvailableErrorDocs(): Promise<ErrorDoc[]> {
	const files = await readdir(ERRORS_DIR);
	const docs: ErrorDoc[] = [];

	for (const file of files) {
		if (!file.endsWith('.md')) continue;
		const code = file.replace('.md', '');
		if (!isValidErrorCode(code)) continue;

		const content = await readFile(join(ERRORS_DIR, file), 'utf-8');
		const title = parseTitleFromMarkdown(content);
		const category = parseCategory(code);
		if (!category) continue;

		docs.push({ code, title, category });
	}

	return docs.sort((a, b) => a.code.localeCompare(b.code));
}

export async function loadErrorMarkdown(
	code: string
): Promise<{ html: string; title: string } | null> {
	const upper = code.toUpperCase();
	const filePath = join(ERRORS_DIR, `${upper}.md`);

	try {
		const content = await readFile(filePath, 'utf-8');
		const title = parseTitleFromMarkdown(content);
		// Remove the first heading line since we render it separately
		const bodyContent = content.replace(/^#\s+.*\n/, '');
		const markedInstance = await getMarkedInstance();
		const html = await markedInstance.parse(bodyContent);
		return { html, title };
	} catch {
		return null;
	}
}
