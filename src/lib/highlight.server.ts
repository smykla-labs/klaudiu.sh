import { createHighlighter } from 'shiki';

type Highlighter = Awaited<ReturnType<typeof createHighlighter>>;

let highlighterPromise: Promise<Highlighter> | null = null;

export function getHighlighter(): Promise<Highlighter> {
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
				'markdown',
				'nix'
			]
		});
	}
	return highlighterPromise;
}

export async function highlightCode(code: string, lang: string): Promise<string> {
	const highlighter = await getHighlighter();
	return highlighter.codeToHtml(code, {
		lang,
		theme: 'github-light'
	});
}
