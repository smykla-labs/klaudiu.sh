<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import DocSidebar from '$lib/components/DocSidebar.svelte';
	import { ArrowLeft } from '@lucide/svelte';
	import Rules from '$lib/docs/content/Rules.svelte';
	import Backup from '$lib/docs/content/Backup.svelte';
	import Plugins from '$lib/docs/content/Plugins.svelte';
	import Sessions from '$lib/docs/content/Sessions.svelte';
	import Exceptions from '$lib/docs/content/Exceptions.svelte';

	let { data } = $props();

	const tocBySlug: Record<string, { id: string; label: string }[]> = {
		rules: [
			{ id: 'overview', label: 'Overview' },
			{ id: 'quick-start', label: 'Quick start' },
			{ id: 'rule-config', label: 'Rule configuration' },
			{ id: 'pattern-matching', label: 'Pattern matching' },
			{ id: 'match-conditions', label: 'Match conditions' },
			{ id: 'actions', label: 'Actions' },
			{ id: 'precedence', label: 'Precedence' },
			{ id: 'validators', label: 'Validator types' },
			{ id: 'examples', label: 'Examples' },
			{ id: 'exceptions', label: 'Exceptions' }
		],
		backup: [
			{ id: 'overview', label: 'Overview' },
			{ id: 'quick-start', label: 'Quick start' },
			{ id: 'storage', label: 'Storage architecture' },
			{ id: 'cli-commands', label: 'CLI commands' },
			{ id: 'retention', label: 'Retention policies' },
			{ id: 'deduplication', label: 'Deduplication' },
			{ id: 'doctor', label: 'Doctor integration' }
		],
		plugins: [
			{ id: 'overview', label: 'Overview' },
			{ id: 'quick-start', label: 'Quick start' },
			{ id: 'protocol', label: 'Protocol reference' },
			{ id: 'predicates', label: 'Predicate matching' },
			{ id: 'python-example', label: 'Python example' },
			{ id: 'best-practices', label: 'Best practices' }
		],
		sessions: [
			{ id: 'overview', label: 'Overview' },
			{ id: 'the-problem', label: 'The problem' },
			{ id: 'configuration', label: 'Configuration' },
			{ id: 'lifecycle', label: 'Session lifecycle' },
			{ id: 'unpoisoning', label: 'Unpoisoning' },
			{ id: 'audit', label: 'Audit logging' },
			{ id: 'troubleshooting', label: 'Troubleshooting' }
		],
		exceptions: [
			{ id: 'overview', label: 'Overview' },
			{ id: 'quick-start', label: 'Quick start' },
			{ id: 'how-it-works', label: 'How it works' },
			{ id: 'token-format', label: 'Token format' },
			{ id: 'policies', label: 'Policies' },
			{ id: 'rate-limiting', label: 'Rate limiting' },
			{ id: 'audit', label: 'Audit logging' },
			{ id: 'debug', label: 'Debug commands' },
			{ id: 'session-integration', label: 'Session integration' },
			{ id: 'rules-integration', label: 'Rules integration' },
			{ id: 'examples', label: 'Examples' }
		]
	};

	const toc = $derived(tocBySlug[data.guide.slug] ?? []);
</script>

<svelte:head>
	<title>{data.guide.title} - klaudiush</title>
</svelte:head>

<div class="flex gap-10">
	<DocSidebar {toc} />

	<div class="min-w-0 flex-1 space-y-8">
		<div>
			<Button variant="ghost" href="/docs/" class="mb-4 gap-2 pl-2">
				<ArrowLeft class="h-4 w-4" />
				All docs
			</Button>
		</div>

		<div class="space-y-1">
			<h1 class="text-2xl font-bold tracking-tight">{data.guide.title}</h1>
			<p class="text-lg text-muted-foreground">{data.guide.subtitle}</p>
		</div>

		<!-- Mobile ToC -->
		<details class="rounded-lg border border-border p-3 lg:hidden">
			<summary class="cursor-pointer text-sm font-medium">On this page</summary>
			<ul class="mt-2 space-y-1">
				{#each toc as entry (entry.id)}
					<li>
						<a
							href="#{entry.id}"
							class="block py-1 text-sm text-muted-foreground hover:text-foreground"
						>
							{entry.label}
						</a>
					</li>
				{/each}
			</ul>
		</details>

		<div class="space-y-10">
			{#if data.guide.slug === 'rules'}
				<Rules codeSnippets={data.codeSnippets} />
			{:else if data.guide.slug === 'backup'}
				<Backup codeSnippets={data.codeSnippets} />
			{:else if data.guide.slug === 'plugins'}
				<Plugins codeSnippets={data.codeSnippets} />
			{:else if data.guide.slug === 'sessions'}
				<Sessions codeSnippets={data.codeSnippets} />
			{:else if data.guide.slug === 'exceptions'}
				<Exceptions codeSnippets={data.codeSnippets} />
			{/if}
		</div>
	</div>
</div>
