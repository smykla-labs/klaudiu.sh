import type { PageServerLoad } from './$types';
import { highlightCode } from '$lib/highlight.server';

const brewSnippet = `brew install smykla-skalski/tap/klaudiush`;

const curlSnippet = `curl -sSfL https://klaudiu.sh/install.sh | sh`;

const setupSnippet = `klaudiush init --global`;

export const load: PageServerLoad = async () => {
	const [brewHtml, curlHtml, setupHtml] = await Promise.all([
		highlightCode(brewSnippet, 'bash'),
		highlightCode(curlSnippet, 'bash'),
		highlightCode(setupSnippet, 'bash')
	]);

	return { brewHtml, curlHtml, setupHtml };
};
