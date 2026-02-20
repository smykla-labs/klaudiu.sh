<script lang="ts">
	import CodeBlock from '$lib/components/CodeBlock.svelte';

	interface Props {
		codeSnippets: Record<string, string>;
	}

	let { codeSnippets }: Props = $props();
</script>

<section id="overview" class="space-y-3">
	<h2 class="text-xl font-semibold">Overview</h2>
	<p class="text-muted-foreground">
		Every TOML config option has a corresponding environment variable. Variables use the
		<code>KLAUDIUSH_</code> prefix and follow the TOML structure with underscores replacing
		dots. Environment variables take precedence over config files but are overridden by
		CLI flags.
	</p>
</section>

<section id="klaudiush-vars" class="space-y-4">
	<h2 class="text-xl font-semibold">KLAUDIUSH_ variables</h2>
	<h3 class="text-lg font-medium">Git validators</h3>
	<CodeBlock html={codeSnippets.gitVars} />

	<h3 class="text-lg font-medium">File validators</h3>
	<CodeBlock html={codeSnippets.fileVars} />
</section>

<section id="standard-vars" class="space-y-4">
	<h2 class="text-xl font-semibold">Standard variables</h2>
	<p class="text-muted-foreground">
		klaudiush also respects these standard environment variables:
	</p>
	<CodeBlock html={codeSnippets.standardVars} />

	<div class="overflow-x-auto">
		<table class="w-full text-sm">
			<thead>
				<tr class="border-b border-border">
					<th class="py-2 pr-4 text-left font-medium">Variable</th>
					<th class="py-2 text-left font-medium">Description</th>
				</tr>
			</thead>
			<tbody class="text-muted-foreground">
				<tr class="border-b border-border/50"><td class="py-2 pr-4"><code>NO_COLOR</code></td><td class="py-2">Disable colored output (any non-empty value)</td></tr>
				<tr class="border-b border-border/50"><td class="py-2 pr-4"><code>KLAUDIUSH_USE_SDK_GIT</code></td><td class="py-2">Use go-git SDK instead of git CLI</td></tr>
				<tr class="border-b border-border/50"><td class="py-2 pr-4"><code>GH_TOKEN</code></td><td class="py-2">GitHub API token for workflow validator and self-update (avoids rate limits)</td></tr>
				<tr class="border-b border-border/50"><td class="py-2 pr-4"><code>GITHUB_TOKEN</code></td><td class="py-2">Alias for GH_TOKEN. Falls back to <code>gh auth token</code> if neither is set</td></tr>
				<tr><td class="py-2 pr-4"><code>KLACK</code></td><td class="py-2">Exception/session token (EXC:CODE:reason or SESS:CODE)</td></tr>
			</tbody>
		</table>
	</div>
</section>

<section id="precedence" class="space-y-4">
	<h2 class="text-xl font-semibold">Precedence</h2>
	<p class="text-muted-foreground">
		From highest to lowest precedence:
	</p>
	<ol class="list-decimal space-y-1 pl-6 text-sm text-muted-foreground">
		<li>CLI flags (<code>--disable=commit</code>)</li>
		<li>Environment variables (<code>KLAUDIUSH_VALIDATORS_GIT_COMMIT_ENABLED=false</code>)</li>
		<li>Project config (<code>.klaudiush/config.toml</code>)</li>
		<li>Global config (<code>~/.klaudiush/config.toml</code>)</li>
		<li>Built-in defaults</li>
	</ol>
	<h3 class="text-lg font-medium">Value types</h3>
	<CodeBlock html={codeSnippets.valueTypes} />
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
