<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import DocSidebar from '$lib/components/DocSidebar.svelte';
	import MarkdownContent from '$lib/components/MarkdownContent.svelte';
	import { ArrowLeft } from '@lucide/svelte';

	let { data } = $props();
</script>

<svelte:head>
	<title>Changelog - klaudiush</title>
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
			<h1 class="text-2xl font-bold tracking-tight">Changelog</h1>
			<p class="text-lg text-muted-foreground">
				Version history and release notes for klaudiush.
			</p>
		</div>

		<MarkdownContent>
			<!-- eslint-disable-next-line svelte/no-at-html-tags -- server-rendered markdown from trusted submodule -->
			{@html data.html}
		</MarkdownContent>
	</div>
</div>
