<script lang="ts">
	import AdrCard from '$lib/components/AdrCard.svelte';
	import { Button } from '$lib/components/ui/button';
	import DocSidebar from '$lib/components/DocSidebar.svelte';
	import { ArrowLeft } from '@lucide/svelte';

	let { data } = $props();
</script>

<svelte:head>
	<title>Architecture decision records - klaudiush docs</title>
</svelte:head>

<div class="flex gap-10">
	<DocSidebar />

	<div class="min-w-0 flex-1 space-y-8">
		<div>
			<Button variant="ghost" href="/docs/" class="mb-4 gap-2 pl-2">
				<ArrowLeft class="h-4 w-4" />
				All docs
			</Button>
		</div>

		<div class="space-y-1">
			<h1 class="text-2xl font-bold tracking-tight">Architecture decision records</h1>
			<p class="text-lg text-muted-foreground">
				Records of technical decisions and their rationale.
			</p>
		</div>

		<div class="grid gap-4 sm:grid-cols-2">
			{#each data.adrs as adr (adr.id)}
				<AdrCard {adr} />
			{/each}
		</div>
	</div>
</div>
