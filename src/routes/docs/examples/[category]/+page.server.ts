import { error } from '@sveltejs/kit';
import { findExampleCategory } from '$lib/examples';
import { loadExampleCategory } from '$lib/examples/loader.server';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const category = findExampleCategory(params.category);
	if (!category) {
		error(404, { message: `Example category not found: ${params.category}` });
	}

	const { readmeHtml, files } = await loadExampleCategory(params.category);

	return {
		category,
		readmeHtml,
		files
	};
};
