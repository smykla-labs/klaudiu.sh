import type { ErrorCategory } from '$lib/config';

export const ERROR_CODE_PATTERN = /^(GIT|FILE|SEC|SHELL|GH|PLUG|SESS)\d{3}$/;

export function isValidErrorCode(code: string): boolean {
	return ERROR_CODE_PATTERN.test(code.toUpperCase());
}

export function parseCategory(code: string): ErrorCategory | null {
	const upper = code.toUpperCase();
	const match = upper.match(/^(GIT|FILE|SEC|SHELL|GH|PLUG|SESS)/);
	return match ? (match[1] as ErrorCategory) : null;
}

export function normalizeCode(code: string): string {
	return code.toUpperCase();
}

export interface ErrorDoc {
	code: string;
	title: string;
	category: ErrorCategory;
}

export function parseTitleFromMarkdown(content: string): string {
	const firstLine = content.split('\n').find((line) => line.startsWith('# '));
	if (!firstLine) return '';
	// Format: "# GIT001: Missing signoff flag" -> "Missing signoff flag"
	const colonIndex = firstLine.indexOf(':');
	if (colonIndex !== -1) {
		return firstLine.slice(colonIndex + 1).trim();
	}
	return firstLine.replace(/^#\s+/, '').trim();
}
