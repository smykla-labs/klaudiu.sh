import { exampleCategories, exampleGroups } from '$lib/examples';
import { getExampleFileCount } from '$lib/examples/loader.server';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const categories = await Promise.all(
		exampleCategories.map(async (cat) => ({
			...cat,
			fileCount: await getExampleFileCount(cat.slug)
		}))
	);

	return { categories, groups: exampleGroups };
};
