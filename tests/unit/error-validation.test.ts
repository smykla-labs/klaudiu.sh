import { describe, it, expect } from 'vitest';
import {
	isValidErrorCode,
	normalizeCode,
	parseCategory,
	parseTitleFromMarkdown
} from '$lib/errors';

describe('isValidErrorCode', () => {
	it('accepts GIT001', () => {
		expect(isValidErrorCode('GIT001')).toBe(true);
	});

	it('accepts git001 (case-insensitive)', () => {
		expect(isValidErrorCode('git001')).toBe(true);
	});

	it('accepts FILE001', () => {
		expect(isValidErrorCode('FILE001')).toBe(true);
	});

	it('accepts SEC001', () => {
		expect(isValidErrorCode('SEC001')).toBe(true);
	});

	it('accepts SHELL001', () => {
		expect(isValidErrorCode('SHELL001')).toBe(true);
	});

	it('accepts GH001', () => {
		expect(isValidErrorCode('GH001')).toBe(true);
	});

	it('accepts PLUG001', () => {
		expect(isValidErrorCode('PLUG001')).toBe(true);
	});

	it('accepts GIT016', () => {
		expect(isValidErrorCode('GIT016')).toBe(true);
	});

	it('rejects INVALID001', () => {
		expect(isValidErrorCode('INVALID001')).toBe(false);
	});

	it('rejects GIT alone', () => {
		expect(isValidErrorCode('GIT')).toBe(false);
	});

	it('rejects random/path', () => {
		expect(isValidErrorCode('random/path')).toBe(false);
	});

	it('rejects GIT1 (too few digits)', () => {
		expect(isValidErrorCode('GIT1')).toBe(false);
	});

	it('rejects GIT1234 (too many digits)', () => {
		expect(isValidErrorCode('GIT1234')).toBe(false);
	});

	it('rejects empty string', () => {
		expect(isValidErrorCode('')).toBe(false);
	});
});

describe('normalizeCode', () => {
	it('uppercases lowercase input', () => {
		expect(normalizeCode('git001')).toBe('GIT001');
	});

	it('preserves already uppercase input', () => {
		expect(normalizeCode('SEC001')).toBe('SEC001');
	});

	it('handles mixed case', () => {
		expect(normalizeCode('File003')).toBe('FILE003');
	});
});

describe('parseCategory', () => {
	it('parses GIT category', () => {
		expect(parseCategory('GIT001')).toBe('GIT');
	});

	it('parses FILE category', () => {
		expect(parseCategory('FILE001')).toBe('FILE');
	});

	it('parses SEC category', () => {
		expect(parseCategory('SEC001')).toBe('SEC');
	});

	it('parses SHELL category', () => {
		expect(parseCategory('SHELL001')).toBe('SHELL');
	});

	it('parses GH category', () => {
		expect(parseCategory('GH001')).toBe('GH');
	});

	it('parses PLUG category', () => {
		expect(parseCategory('PLUG001')).toBe('PLUG');
	});

	it('handles lowercase input', () => {
		expect(parseCategory('git001')).toBe('GIT');
	});

	it('returns null for invalid prefix', () => {
		expect(parseCategory('INVALID001')).toBeNull();
	});

	it('returns null for empty string', () => {
		expect(parseCategory('')).toBeNull();
	});
});

describe('parseTitleFromMarkdown', () => {
	it('extracts title after colon', () => {
		expect(parseTitleFromMarkdown('# GIT001: Missing signoff flag\n\n## Error')).toBe(
			'Missing signoff flag'
		);
	});

	it('falls back to full heading without colon', () => {
		expect(parseTitleFromMarkdown('# Some Title\n\nContent')).toBe('Some Title');
	});

	it('returns empty for no heading', () => {
		expect(parseTitleFromMarkdown('No heading here')).toBe('');
	});
});
