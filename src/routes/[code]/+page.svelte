<script lang="ts">
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import MarkdownContent from '$lib/components/MarkdownContent.svelte';
	import { ArrowLeft } from '@lucide/svelte';

	let { data } = $props();
</script>

<svelte:head>
	<title>{data.code}: {data.title} - klaudiush</title>
</svelte:head>

<div class="space-y-6">
	<div>
		<Button variant="ghost" href="/" class="mb-4 gap-2 pl-2">
			<ArrowLeft class="h-4 w-4" />
			Back to all errors
		</Button>
	</div>

	<div class="flex items-center gap-3">
		<h1 class="font-mono text-2xl font-bold">{data.code}</h1>
		<Badge variant="outline">{data.category}</Badge>
	</div>

	<MarkdownContent>
		<!-- eslint-disable-next-line svelte/no-at-html-tags -- server-rendered markdown from trusted submodule -->
		{@html data.html}
	</MarkdownContent>
</div>
