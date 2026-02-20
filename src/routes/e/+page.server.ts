import type { PageServerLoad } from './$types';
import { getAvailableErrorDocs } from '$lib/errors/loader.server';
import { categories } from '$lib/config';

export const load: PageServerLoad = async () => {
	const errorDocs = await getAvailableErrorDocs();

	const categoryCounts = categories
		.map((cat) => ({
			...cat,
			count: errorDocs.filter((doc) => doc.category === cat.prefix).length
		}))
		.filter((cat) => cat.count > 0);

	return { errorDocs, categoryCounts };
};
