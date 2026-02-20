<script lang="ts">
	import DocCard from '$lib/components/DocCard.svelte';
	import AdrCard from '$lib/components/AdrCard.svelte';
	import { Button } from '$lib/components/ui/button';
	import { ArrowLeft } from '@lucide/svelte';

	let { data } = $props();
</script>

<svelte:head>
	<title>Documentation - klaudiush</title>
</svelte:head>

<div class="space-y-10">
	<div>
		<Button variant="ghost" href="/" class="mb-4 gap-2 pl-2">
			<ArrowLeft class="h-4 w-4" />
			Home
		</Button>
	</div>

	<section class="space-y-4">
		<h1 class="text-3xl font-bold tracking-tight">Documentation</h1>
		<p class="text-lg text-muted-foreground">
			Guides for configuring and extending klaudiush.
		</p>
	</section>

	<section class="space-y-4">
		<h2 class="text-xl font-semibold">Guides</h2>
		<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
			{#each data.guides as guide (guide.slug)}
				<DocCard {guide} />
			{/each}
		</div>
	</section>

	<section class="space-y-4">
		<h2 class="text-xl font-semibold">Architecture decision records</h2>
		<div class="grid gap-4 sm:grid-cols-2">
			{#each data.adrs as adr (adr.id)}
				<AdrCard {adr} />
			{/each}
		</div>
	</section>

	<section class="space-y-4">
		<h2 class="text-xl font-semibold">Changelog</h2>
		<p class="text-sm text-muted-foreground">
			Version history and release notes.
			<a href="/docs/changelog" class="underline underline-offset-2 hover:text-foreground"
				>View changelog</a
			>
		</p>
	</section>
</div>
