import { readFile, readdir, stat } from 'node:fs/promises';
import { join, resolve, extname, basename } from 'node:path';
import { Marked } from 'marked';
import markedShiki from 'marked-shiki';
import { getHighlighter, highlightCode } from '$lib/highlight.server';

const EXAMPLES_DIR = resolve('klaudiush/examples');

export interface ExampleFile {
	filename: string;
	title: string;
	description: string;
	lang: string;
	lineCount: number;
	highlightedHtml: string;
	raw: string;
}

function detectLang(filename: string): string {
	const ext = extname(filename).toLowerCase();
	if (ext === '.toml') return 'toml';
	if (ext === '.sh') return 'bash';
	return 'text';
}

function parseFileHeader(content: string, filename: string): { title: string; description: string } {
	const lines = content.split('\n');
	let startIdx = 0;

	// Skip #:schema line
	if (lines[0]?.startsWith('#:schema')) {
		startIdx = 1;
	}

	// For shell scripts, skip shebang
	if (lines[0]?.startsWith('#!')) {
		startIdx = 1;
		// Skip blank lines after shebang
		while (startIdx < lines.length && lines[startIdx]?.trim() === '') {
			startIdx++;
		}
	}

	// Parse title from first comment line
	let title = basename(filename, extname(filename));
	const titleLine = lines[startIdx];
	if (titleLine?.startsWith('# ')) {
		title = titleLine
			.replace(/^# /, '')
			.replace(/^Example:\s*/i, '')
			.replace(/\s+examples?$/i, '')
			.replace(/\s+configuration$/i, '')
			.trim();
		startIdx++;
	}

	// Parse description from subsequent comment lines
	const descLines: string[] = [];
	// Skip leading blank comment lines
	if (lines[startIdx]?.trim() === '#') {
		startIdx++;
	}
	for (let i = startIdx; i < lines.length; i++) {
		const line = lines[i];
		if (line?.startsWith('# ')) {
			descLines.push(line.replace(/^# /, ''));
		} else {
			break;
		}
	}

	return { title, description: descLines.join(' ').trim() };
}

function sortFiles(files: ExampleFile[]): ExampleFile[] {
	return files.sort((a, b) => {
		const nameA = a.filename.toLowerCase();
		const nameB = b.filename.toLowerCase();
		if (nameA.startsWith('minimal') && !nameB.startsWith('minimal')) return -1;
		if (!nameA.startsWith('minimal') && nameB.startsWith('minimal')) return 1;
		if (nameA.startsWith('basic') && !nameB.startsWith('basic')) return -1;
		if (!nameA.startsWith('basic') && nameB.startsWith('basic')) return 1;
		return nameA.localeCompare(nameB);
	});
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

async function scanDirectory(
	dirPath: string,
	prefix: string = ''
): Promise<{ readmeContent: string | null; files: { filename: string; content: string }[] }> {
	let readmeContent: string | null = null;
	const files: { filename: string; content: string }[] = [];

	const entries = await readdir(dirPath);
	for (const entry of entries) {
		const fullPath = join(dirPath, entry);
		const entryStat = await stat(fullPath);

		if (entryStat.isDirectory()) {
			// Scan one level deep (for plugins/exec-shell/ case)
			const sub = await scanDirectory(fullPath, entry + '/');
			if (sub.readmeContent && !readmeContent) {
				readmeContent = sub.readmeContent;
			}
			files.push(...sub.files);
		} else if (entry.toLowerCase() === 'readme.md') {
			readmeContent = await readFile(fullPath, 'utf-8');
		} else {
			const content = await readFile(fullPath, 'utf-8');
			files.push({ filename: prefix + entry, content });
		}
	}

	return { readmeContent, files };
}

export async function loadExampleCategory(
	slug: string
): Promise<{ readmeHtml: string | null; files: ExampleFile[] }> {
	const dirPath = join(EXAMPLES_DIR, slug);
	const { readmeContent, files: rawFiles } = await scanDirectory(dirPath);

	let readmeHtml: string | null = null;
	if (readmeContent) {
		const marked = await getMarkedInstance();
		readmeHtml = await marked.parse(readmeContent);
	}

	const files: ExampleFile[] = await Promise.all(
		rawFiles.map(async ({ filename, content }) => {
			const lang = detectLang(filename);
			const { title, description } = parseFileHeader(content, filename);
			const trimmed = content.trimEnd();
			const lineCount = trimmed.split('\n').length;
			const highlightedHtml = await highlightCode(trimmed, lang);
			return { filename, title, description, lang, lineCount, highlightedHtml, raw: trimmed };
		})
	);

	return { readmeHtml, files: sortFiles(files) };
}

export async function getExampleFileCount(slug: string): Promise<number> {
	const dirPath = join(EXAMPLES_DIR, slug);

	async function countFiles(dir: string): Promise<number> {
		let count = 0;
		const entries = await readdir(dir);
		for (const entry of entries) {
			const fullPath = join(dir, entry);
			const entryStat = await stat(fullPath);
			if (entryStat.isDirectory()) {
				count += await countFiles(fullPath);
			} else if (entry.toLowerCase() !== 'readme.md') {
				count++;
			}
		}
		return count;
	}

	return countFiles(dirPath);
}
