<script lang="ts">
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import Callout from '$lib/components/Callout.svelte';

	interface Props {
		codeSnippets: Record<string, string>;
	}

	let { codeSnippets }: Props = $props();
</script>

<section id="overview" class="space-y-3">
	<h2 class="text-xl font-semibold">Overview</h2>
	<p class="text-muted-foreground">
		klaudiush uses TOML configuration files. You can have a global config that applies to
		all projects and per-project configs that override specific settings. CLI flags and
		environment variables take precedence over config files. All validators have sensible
		defaults - a config file is optional.
	</p>
</section>

<section id="file-locations" class="space-y-4">
	<h2 class="text-xl font-semibold">File locations</h2>
	<CodeBlock html={codeSnippets.fileLocations} />
	<p class="text-muted-foreground">
		The global config lives in your home directory and applies to every project. Project
		configs sit in the repo root (either in a <code>.klaudiush/</code> directory or as a
		standalone file) and override global settings for that repo.
	</p>
	<p class="text-muted-foreground">
		You can also point to custom config paths with CLI flags:
	</p>
	<CodeBlock html={codeSnippets.cliOverrides} />
</section>

<section id="precedence" class="space-y-4">
	<h2 class="text-xl font-semibold">Precedence</h2>
	<p class="text-muted-foreground">
		Configuration loads from multiple sources, highest precedence first:
	</p>
	<ol class="list-decimal space-y-1 pl-6 text-sm text-muted-foreground">
		<li>CLI flags (<code>--disable</code>, <code>--config</code>)</li>
		<li>Environment variables (<code>KLAUDIUSH_*</code>)</li>
		<li>Project config (<code>.klaudiush/config.toml</code>)</li>
		<li>Global config (<code>~/.klaudiush/config.toml</code>)</li>
		<li>Built-in defaults</li>
	</ol>
	<p class="text-muted-foreground">
		Environment variable overrides use the <code>KLAUDIUSH_</code> prefix with hierarchical naming:
	</p>
	<CodeBlock html={codeSnippets.envOverrides} />
</section>

<section id="schema" class="space-y-4">
	<h2 class="text-xl font-semibold">Schema reference</h2>
	<p class="text-muted-foreground">
		A complete config file with all available options and their defaults. Every validator
		can be enabled/disabled individually with the <code>enabled</code> key.
	</p>
	<CodeBlock html={codeSnippets.fullConfig} />
	<Callout type="info" title="Config loading time">
		<p>Config loads from all sources in under 45 microseconds. There's no performance
		penalty for using multiple config files.</p>
	</Callout>
</section>

<section id="deep-merge" class="space-y-4">
	<h2 class="text-xl font-semibold">Deep merge</h2>
	<p class="text-muted-foreground">
		When project and global configs both define the same section, values are deep-merged
		rather than replaced. Project values win on conflict, but unset project keys preserve
		the global value.
	</p>
	<CodeBlock html={codeSnippets.deepMerge} />
</section>

<section id="full-example" class="space-y-3">
	<h2 class="text-xl font-semibold">Full example</h2>
	<p class="text-muted-foreground">
		See the <code>examples/config/</code> directory in the klaudiush repository for
		ready-to-use configs: minimal setup, full reference, project overrides, and
		language-specific configs (JavaScript, Rust).
	</p>
	<p class="text-muted-foreground">
		To inspect your currently loaded config, run:
	</p>
	<CodeBlock html={codeSnippets.cliOverrides} />
</section>

<style>
	code {
		background: oklch(0.96 0.005 67);
		border: 1px solid oklch(0.9 0.005 67);
		border-radius: 0.25rem;
		padding: 0.15em 0.35em;
		font-size: 0.85em;
		font-weight: 500;
		color: oklch(0.25 0.01 67);
	}
</style>
