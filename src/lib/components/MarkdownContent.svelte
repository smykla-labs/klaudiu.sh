<script lang="ts">
	import type { Snippet } from 'svelte';
	import { copyCode } from '$lib/actions/copy-code';
	import { anchorHeadings } from '$lib/actions/anchor-headings';

	interface Props {
		children: Snippet;
	}

	let { children }: Props = $props();
</script>

<article class="markdown-content prose prose-stone max-w-none dark:prose-invert" use:copyCode use:anchorHeadings>
	{@render children()}
</article>

<style>
	.markdown-content {
		--tw-prose-body: oklch(0.35 0.01 67);
		--tw-prose-headings: oklch(0.15 0.01 67);
		--tw-prose-links: oklch(0.15 0.01 67);
		--tw-prose-bold: oklch(0.15 0.01 67);
		--tw-prose-counters: oklch(0.55 0.01 67);
		--tw-prose-bullets: oklch(0.7 0.005 67);
		--tw-prose-hr: oklch(0.87 0.005 67);
		--tw-prose-quotes: oklch(0.15 0.01 67);
		--tw-prose-quote-borders: oklch(0.87 0.005 67);
		--tw-prose-captions: oklch(0.55 0.01 67);
		--tw-prose-th-borders: oklch(0.87 0.005 67);
		--tw-prose-td-borders: oklch(0.92 0.003 67);
	}

	.markdown-content :global(h2) {
		margin-top: 2em;
		margin-bottom: 0.75em;
		font-size: 1.35rem;
		font-weight: 600;
		letter-spacing: -0.01em;
		border-bottom: 1px solid oklch(0.92 0.003 67);
		padding-bottom: 0.4em;
	}

	.markdown-content :global(h3) {
		margin-top: 1.5em;
		margin-bottom: 0.5em;
		font-size: 1.15rem;
		font-weight: 600;
	}

	.markdown-content :global(code:not(pre code)) {
		background: oklch(0.96 0.005 67);
		border: 1px solid oklch(0.9 0.005 67);
		border-radius: 0.25rem;
		padding: 0.15em 0.35em;
		font-size: 0.85em;
		font-weight: 500;
		color: oklch(0.25 0.01 67);
		display: inline-block;
		vertical-align: middle;
	}

	.markdown-content :global(code:not(pre code)::before),
	.markdown-content :global(code:not(pre code)::after) {
		content: none;
	}

	.markdown-content :global(pre) {
		background: oklch(0.97 0.003 67) !important;
		border: 1px solid oklch(0.9 0.005 67);
		border-radius: 0.5rem;
		padding: 1em 1.25em;
		overflow-x: auto;
		font-size: 0.875rem;
		line-height: 1.65;
	}

	.markdown-content :global(pre code) {
		background: none;
		border: none;
		padding: 0;
		font-size: inherit;
		font-weight: 400;
	}

	.markdown-content :global(pre code .line:empty::after) {
		content: ' ';
	}

	.markdown-content :global(table) {
		width: 100%;
		border-collapse: collapse;
		font-size: 0.875rem;
	}

	.markdown-content :global(th) {
		background: oklch(0.96 0.005 67);
		font-weight: 600;
		text-align: left;
		padding: 0.6em 1em;
		border: 1px solid oklch(0.87 0.005 67);
	}

	.markdown-content :global(td) {
		padding: 0.5em 1em;
		border: 1px solid oklch(0.92 0.003 67);
	}

	.markdown-content :global(tr:nth-child(even)) {
		background: oklch(0.985 0.001 67);
	}

	.markdown-content :global(a) {
		color: oklch(0.45 0.12 250);
		text-decoration: underline;
		text-underline-offset: 2px;
	}

	.markdown-content :global(a:hover) {
		color: oklch(0.35 0.14 250);
	}

	.markdown-content :global(strong) {
		font-weight: 650;
	}

	.markdown-content :global(ul) {
		list-style-type: disc;
		padding-left: 1.5em;
	}

	.markdown-content :global(li) {
		margin-top: 0.35em;
		margin-bottom: 0.35em;
	}

	.markdown-content :global(p) {
		margin-top: 0.75em;
		margin-bottom: 0.75em;
		line-height: 1.7;
	}

	.markdown-content :global(hr) {
		border-color: oklch(0.92 0.003 67);
	}

	.markdown-content :global(blockquote) {
		border-left: 3px solid oklch(0.87 0.005 67);
		padding-left: 1em;
		color: oklch(0.45 0.01 67);
		font-style: italic;
	}
</style>
