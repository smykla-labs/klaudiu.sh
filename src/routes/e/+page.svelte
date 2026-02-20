<script lang="ts">
	import CategoryCard from '$lib/components/CategoryCard.svelte';
	import ErrorCodeCard from '$lib/components/ErrorCodeCard.svelte';
	import SearchInput from '$lib/components/SearchInput.svelte';

	let { data } = $props();
</script>

<svelte:head>
	<title>Error reference - klaudiush</title>
</svelte:head>

<div class="space-y-8">
	<section class="space-y-4 text-center">
		<h1 class="font-mono text-4xl font-bold tracking-tight">klaudiush</h1>
		<p class="text-lg text-muted-foreground">Error documentation for klaudiush</p>
		<div class="mx-auto max-w-md">
			<SearchInput />
		</div>
	</section>

	<section class="grid gap-4 sm:grid-cols-3">
		{#each data.categoryCounts as cat (cat.prefix)}
			<CategoryCard category={cat} count={cat.count} href="#{cat.prefix}" />
		{/each}
	</section>

	<section class="space-y-8">
		{#each data.categoryCounts as cat (cat.prefix)}
			{@const catDocs = data.errorDocs.filter((d) => d.category === cat.prefix)}
			{#if catDocs.length > 0}
				<div id={cat.prefix}>
					<h2 class="mb-3 text-xl font-semibold">{cat.name} errors</h2>
					<div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
						{#each catDocs as doc (doc.code)}
							<ErrorCodeCard code={doc.code} title={doc.title} category={doc.category} />
						{/each}
					</div>
				</div>
			{/if}
		{/each}
	</section>
</div>
