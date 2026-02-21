<script lang="ts">
	import DocSidebar from '$lib/components/DocSidebar.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import Collapsible from '$lib/components/Collapsible.svelte';
	import MarkdownContent from '$lib/components/MarkdownContent.svelte';
	import { Button } from '$lib/components/ui/button';
	import { ArrowLeft, FileCode2, Terminal, FileText } from '@lucide/svelte';
	const langIcons = { toml: FileCode2, bash: Terminal, text: FileText } as const;

	let { data } = $props();

	const toc = $derived(
		data.files.map((f) => ({
			id: f.filename.replace(/[^a-z0-9]+/gi, '-').toLowerCase(),
			label: f.title
		}))
	);
</script>

<svelte:head>
	<title>{data.category.title} examples - klaudiush</title>
</svelte:head>

<div class="flex gap-10">
	<DocSidebar {toc} />

	<div class="min-w-0 flex-1 space-y-8">
		<div>
			<Button variant="ghost" href="/docs/examples/" class="mb-4 gap-2 pl-2">
				<ArrowLeft class="h-4 w-4" />
				All examples
			</Button>
		</div>

		<div class="space-y-1">
			<h1 class="text-2xl font-bold tracking-tight">{data.category.title} examples</h1>
			<p class="text-lg text-muted-foreground">{data.category.subtitle}</p>
		</div>

		{#if data.readmeHtml}
			<MarkdownContent>
				<!-- eslint-disable-next-line svelte/no-at-html-tags -- server-rendered README -->
				{@html data.readmeHtml}
			</MarkdownContent>
		{/if}

		<div class="space-y-4">
			{#each data.files as file (file.filename)}
				{@const anchorId = file.filename.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}
				{@const LangIcon = langIcons[file.lang as keyof typeof langIcons] ?? FileText}
				<Collapsible id={anchorId} class="scroll-mt-20">
					{#snippet summary()}
						<span class="font-medium">{file.title}</span>
						{#if file.description}
							<p class="mt-1 text-sm text-muted-foreground">{file.description}</p>
						{/if}
					{/snippet}
					{#snippet badge()}
						<div class="flex items-center gap-2 bg-background px-2">
							<span class="font-mono text-xs text-muted-foreground">{file.filename}</span>
							<span class="h-3 w-px bg-border"></span>
							<span class="text-xs text-muted-foreground">{file.lineCount} lines</span>
							<span class="h-3 w-px bg-border"></span>
							<LangIcon class="h-3 w-3 text-muted-foreground" />
						</div>
					{/snippet}
					<CodeBlock html={file.highlightedHtml} />
				</Collapsible>
			{/each}
		</div>
	</div>
</div>
