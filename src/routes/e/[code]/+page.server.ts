import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { isValidErrorCode, normalizeCode, parseCategory } from '$lib/errors';
import { loadErrorMarkdown } from '$lib/errors/loader.server';

export const load: PageServerLoad = async ({ params }) => {
	const code = normalizeCode(params.code);

	if (!isValidErrorCode(code)) {
		error(404, { message: `Invalid error code: ${params.code}` });
	}

	const doc = await loadErrorMarkdown(code);
	if (!doc) {
		error(404, { message: `Error documentation not found: ${code}` });
	}

	const category = parseCategory(code)!;

	return {
		code,
		category,
		title: doc.title,
		html: doc.html
	};
};
