import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { findAdr } from '$lib/docs';

export const load: PageServerLoad = async ({ params }) => {
	const adr = findAdr(params.id);
	if (!adr) {
		error(404, { message: `ADR not found: ${params.id}` });
	}
	return { adr };
};
