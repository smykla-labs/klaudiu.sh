<script lang="ts">
	import { Copy, Check } from '@lucide/svelte';

	let copied = $state(false);
	let button = $state<HTMLButtonElement>();

	async function copy() {
		const pre = button?.closest('.group')?.querySelector('pre');
		if (!pre) return;
		const text = pre.textContent?.replace(/\n$/, '') ?? '';
		await navigator.clipboard.writeText(text);
		copied = true;
		setTimeout(() => (copied = false), 2000);
	}
</script>

<button
	bind:this={button}
	onclick={copy}
	class="copy-btn absolute right-2 top-2 rounded-md p-1.5 opacity-0 transition-opacity group-hover:opacity-100"
	aria-label="Copy to clipboard"
>
	{#if copied}
		<Check class="h-3.5 w-3.5" style="color: oklch(0.45 0.16 145)" />
	{:else}
		<Copy class="h-3.5 w-3.5" style="color: oklch(0.55 0.01 67)" />
	{/if}
</button>

<style>
	.copy-btn {
		border: 1px solid oklch(0.9 0.005 67);
		background: oklch(0.94 0.005 67 / 0.9);
		cursor: pointer;
	}

	.copy-btn:hover {
		background: oklch(0.90 0.005 67);
	}
</style>
