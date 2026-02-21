<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		open?: boolean;
		id?: string;
		class?: string;
		summary: Snippet;
		badge?: Snippet;
		children: Snippet;
	}

	let { open = false, id, class: className = '', summary, badge, children }: Props = $props();
</script>

<details {id} class="collapsible rounded-lg border border-border {className}" {open}>
	<summary class="relative flex cursor-pointer items-center gap-3 px-4 py-3">
		<svg
			class="chevron h-4 w-4 shrink-0 text-muted-foreground transition-transform"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
		>
			<path d="m9 18 6-6-6-6" />
		</svg>
		<div class="min-w-0 flex-1">
			{@render summary()}
		</div>
		{#if badge}
			<div class="absolute bottom-0 right-3 translate-y-1/2">
				{@render badge()}
			</div>
		{/if}
	</summary>
	<div class="border-t border-border px-4 pb-4 pt-3">
		{@render children()}
	</div>
</details>

<style>
	.collapsible summary {
		list-style: none;
	}

	.collapsible summary::-webkit-details-marker {
		display: none;
	}

	.collapsible[open] > summary .chevron {
		transform: rotate(90deg);
	}

	.collapsible summary:hover {
		background: oklch(0.98 0.002 67);
		border-radius: 0.5rem;
	}

	.collapsible[open] > summary:hover {
		border-radius: 0.5rem 0.5rem 0 0;
	}
</style>
