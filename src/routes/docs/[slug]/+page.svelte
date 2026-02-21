<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import DocSidebar from '$lib/components/DocSidebar.svelte';
	import Collapsible from '$lib/components/Collapsible.svelte';
	import { ArrowLeft } from '@lucide/svelte';
	import GettingStarted from '$lib/docs/content/GettingStarted.svelte';
	import Installation from '$lib/docs/content/Installation.svelte';
	import Rules from '$lib/docs/content/Rules.svelte';
	import Backup from '$lib/docs/content/Backup.svelte';
	import Plugins from '$lib/docs/content/Plugins.svelte';
	import Exceptions from '$lib/docs/content/Exceptions.svelte';
	import Cli from '$lib/docs/content/Cli.svelte';
	import Configuration from '$lib/docs/content/Configuration.svelte';
	import EnvironmentVariables from '$lib/docs/content/EnvironmentVariables.svelte';
	import Troubleshooting from '$lib/docs/content/Troubleshooting.svelte';
	import Faq from '$lib/docs/content/Faq.svelte';
	import Security from '$lib/docs/content/Security.svelte';
	import Architecture from '$lib/docs/content/Architecture.svelte';
	import Migration from '$lib/docs/content/Migration.svelte';
	import { anchorHeadings } from '$lib/actions/anchor-headings';

	let { data } = $props();

	const tocBySlug: Record<string, { id: string; label: string }[]> = {
		'getting-started': [
			{ id: 'overview', label: 'Overview' },
			{ id: 'install', label: 'Install klaudiush' },
			{ id: 'first-validation', label: 'First validation' },
			{ id: 'whats-next', label: "What's next" }
		],
		installation: [
			{ id: 'overview', label: 'Overview' },
			{ id: 'homebrew', label: 'Homebrew' },
			{ id: 'install-script', label: 'Install script' },
			{ id: 'nix', label: 'Nix flake' },
			{ id: 'from-source', label: 'From source' },
			{ id: 'shell-completion', label: 'Shell completion' },
			{ id: 'verify', label: 'Verify installation' },
			{ id: 'updating', label: 'Updating' }
		],
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
		exceptions: [
			{ id: 'overview', label: 'Overview' },
			{ id: 'quick-start', label: 'Quick start' },
			{ id: 'how-it-works', label: 'How it works' },
			{ id: 'token-format', label: 'Token format' },
			{ id: 'policies', label: 'Policies' },
			{ id: 'rate-limiting', label: 'Rate limiting' },
			{ id: 'audit', label: 'Audit logging' },
			{ id: 'debug', label: 'Debug commands' },
			{ id: 'rules-integration', label: 'Rules integration' },
			{ id: 'examples', label: 'Examples' }
		],
		cli: [
			{ id: 'overview', label: 'Overview' },
			{ id: 'global-flags', label: 'Global flags' },
			{ id: 'init', label: 'init' },
			{ id: 'validate', label: 'validate' },
			{ id: 'backup', label: 'backup' },
			{ id: 'doctor', label: 'doctor' },
			{ id: 'audit', label: 'audit' },
			{ id: 'update', label: 'update' },
			{ id: 'version', label: 'version' },
			{ id: 'completion', label: 'completion' }
		],
		configuration: [
			{ id: 'overview', label: 'Overview' },
			{ id: 'file-locations', label: 'File locations' },
			{ id: 'precedence', label: 'Precedence' },
			{ id: 'schema', label: 'Schema reference' },
			{ id: 'json-schema', label: 'JSON schema' },
			{ id: 'deep-merge', label: 'Deep merge' },
			{ id: 'full-example', label: 'Full example' }
		],
		'environment-variables': [
			{ id: 'overview', label: 'Overview' },
			{ id: 'klaudiush-vars', label: 'KLAUDIUSH_ variables' },
			{ id: 'standard-vars', label: 'Standard variables' },
			{ id: 'precedence', label: 'Precedence' }
		],
		troubleshooting: [
			{ id: 'overview', label: 'Overview' },
			{ id: 'doctor', label: 'Doctor command' },
			{ id: 'common-issues', label: 'Common issues' },
			{ id: 'crash-dumps', label: 'Crash dumps' },
			{ id: 'debug-logging', label: 'Debug logging' }
		],
		faq: [
			{ id: 'general', label: 'General' },
			{ id: 'validators', label: 'Validators' },
			{ id: 'configuration', label: 'Configuration' },
			{ id: 'troubleshooting', label: 'Troubleshooting' }
		],
		security: [
			{ id: 'overview', label: 'Overview' },
			{ id: 'secret-detection', label: 'Secret detection' },
			{ id: 'plugin-sandboxing', label: 'Plugin sandboxing' },
			{ id: 'security-model', label: 'Security model' },
			{ id: 'reporting', label: 'Vulnerability reporting' }
		],
		architecture: [
			{ id: 'overview', label: 'Overview' },
			{ id: 'dispatcher', label: 'Dispatcher flow' },
			{ id: 'validators', label: 'Validator registry' },
			{ id: 'parallel-execution', label: 'Parallel execution' },
			{ id: 'parsers', label: 'Parser system' },
			{ id: 'config-loading', label: 'Config loading' }
		],
		migration: [
			{ id: 'overview', label: 'Overview' },
			{ id: 'v1-24', label: 'v1.24.0 - XDG migration' },
			{ id: 'v1-18', label: 'v1.18.0 - JSON stdout' },
			{ id: 'upgrade-steps', label: 'Upgrade steps' }
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
		<Collapsible class="lg:hidden">
			{#snippet summary()}
				<span class="text-sm font-medium">On this page</span>
			{/snippet}
			<ul class="space-y-1">
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
		</Collapsible>

		<div class="space-y-10" use:anchorHeadings>
			{#if data.guide.slug === 'getting-started'}
				<GettingStarted codeSnippets={data.codeSnippets} />
			{:else if data.guide.slug === 'installation'}
				<Installation codeSnippets={data.codeSnippets} />
			{:else if data.guide.slug === 'rules'}
				<Rules codeSnippets={data.codeSnippets} />
			{:else if data.guide.slug === 'backup'}
				<Backup codeSnippets={data.codeSnippets} />
			{:else if data.guide.slug === 'plugins'}
				<Plugins codeSnippets={data.codeSnippets} />
			{:else if data.guide.slug === 'exceptions'}
				<Exceptions codeSnippets={data.codeSnippets} />
			{:else if data.guide.slug === 'cli'}
				<Cli codeSnippets={data.codeSnippets} />
			{:else if data.guide.slug === 'configuration'}
				<Configuration codeSnippets={data.codeSnippets} />
			{:else if data.guide.slug === 'environment-variables'}
				<EnvironmentVariables />
			{:else if data.guide.slug === 'troubleshooting'}
				<Troubleshooting codeSnippets={data.codeSnippets} />
			{:else if data.guide.slug === 'faq'}
				<Faq codeSnippets={data.codeSnippets} />
			{:else if data.guide.slug === 'security'}
				<Security codeSnippets={data.codeSnippets} />
			{:else if data.guide.slug === 'architecture'}
				<Architecture codeSnippets={data.codeSnippets} />
			{:else if data.guide.slug === 'migration'}
				<Migration codeSnippets={data.codeSnippets} />
			{/if}
		</div>
	</div>
</div>
