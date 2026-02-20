<script lang="ts">
	interface Props {
		html: string;
	}

	let { html }: Props = $props();
</script>

<div class="shiki-block">
	<!-- eslint-disable-next-line svelte/no-at-html-tags -- server-highlighted code -->
	{@html html}
</div>

<style>
	.shiki-block :global(pre) {
		background: oklch(0.97 0.003 67) !important;
		border: 1px solid oklch(0.9 0.005 67);
		border-radius: 0.5rem;
		padding: 1em 1.25em;
		overflow-x: auto;
		font-size: 0.875rem;
		line-height: 1.65;
		margin: 0;
	}

	.shiki-block :global(code) {
		background: none;
		border: none;
		padding: 0;
		font-size: inherit;
		font-weight: 400;
	}

	.shiki-block :global(.line:empty::after) {
		content: ' ';
	}
</style>
