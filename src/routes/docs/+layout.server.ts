import type { LayoutServerLoad } from './$types';
import { guides, adrs } from '$lib/docs';

export const load: LayoutServerLoad = async () => {
	return { guides, adrs };
};
