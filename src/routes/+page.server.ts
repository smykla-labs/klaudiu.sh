import type { PageServerLoad } from './$types';
import { highlightCode } from '$lib/highlight.server';

const brewSnippet = `brew tap smykla-skalski/tap
brew install klaudiush`;

const curlSnippet = `curl -fsSL https://klaudiu.sh/install | sh`;

const setupSnippet = `klaudiush init --global
klaudiush doctor`;

const configSnippet = `{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash|Write|Edit",
        "hooks": [
          {
            "type": "command",
            "command": "klaudiush validate"
          }
        ]
      }
    ]
  }
}`;

export const load: PageServerLoad = async () => {
	const [brewHtml, curlHtml, setupHtml, configHtml] = await Promise.all([
		highlightCode(brewSnippet, 'bash'),
		highlightCode(curlSnippet, 'bash'),
		highlightCode(setupSnippet, 'bash'),
		highlightCode(configSnippet, 'json')
	]);

	return { brewHtml, curlHtml, setupHtml, configHtml };
};
